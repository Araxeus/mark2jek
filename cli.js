#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const chalk = require('chalk');

const green = chalk.green;
const red = chalk.red;
const warning = chalk.keyword('orange');
const info = chalk.cyan;
const important = chalk.magenta;
const code = chalk.white.bgBlack;

const log = {
    out: console.log,
    info: (e) => log.out(info(e)),
    important: (e) => log.out(important(e)),
    error: (e) => log.out(red.bold("Error! " + e)),
    warning: (e) => log.out(warning("Warning! " + e)),
    success: (e) => log.out(green("Success! " + e))
}

const coloredValue = (value) =>
    value === true ? green("Enabled") : !value ? red("Disabled") : important(value);


exports.log = log;
exports.code = code;

const {
    lines,
    defaultConfig,
    getCollapsibleStyle,
    Prompt,
} = require("./utils");

let filePath;
let savePath;

let config;

parseArg();

async function parseArg() {
    if (process.argv.length < 3) sendError(3);

    await loadConfig();

    switch (process.argv[2].toLowerCase()) {
        case "--version":
            versionCheck(); break;
        case "interactive":
        case "setup":
            setup(); break;
        case "help":
        case "list":
            list(); break;
        case "flags":
            flags(); break;
        case "change":
        case "set":
            set(); break;
        default: run();
    }
}

async function versionCheck() {
    log.out(info("mark2jek") + important(`v${require('./package.json').version}`));
    process.exit(0);
}

async function setup() { //TODO
    log.out(lines(
        important("Launching Interactive Config Manager"),
        info("- leave empty to use current value"),
        ` - ${code("enable/true/yes/y")} to enable`,
        ` - ${code("disable/false/no/n")} to disable))`));

    log.info(`for more info on each command, use ${code("m2jek help")} or ${code("m2jek list")}\n`)

    const prompt = new Prompt(config);

    for (const [key, element] of Object.entries(defaultConfig)) {
        const savedValue = config[key].value;
        await prompt.question(
            ` ${important(key)} / ${important(element.alias)} (${coloredValue(savedValue)}):`,
            key);
        if (config[key].value !== savedValue)
            log.out(`Saved new value: ${coloredValue(config[key].value)}`)
    }
    await prompt.output();
    saveAndExit();
}

async function list() {
    function printCommand(names, description, ...examples) {
        let namesString = "";
        for (const commandName of names) {
            if (namesString.length > 0) namesString += " or ";
            namesString += important(commandName);
        }
        let examplesString = examples.length > 0 ?
            lines(
                ". Examples:",
                ...examples.map((e) => `${code(e.code)} ${e.info}`)
            ) : "";

        log.out(lines(namesString, info("> " + description + examplesString), ""));
    }

    log.out(warning("=== List Of Commands ===\n"));

    printCommand(["filePath"], "run program on *filePath* using saved config or specified flags",
        { code: "m2jek docs/readme.md", info: "will modify and overwrite docs/readme.md" },
        { code: "m2jek todo.txt --noRaw new=index.md", info: "run without raw flag, saves to index.md" },
    )

    printCommand(["setup", "interactive"], `description ${code("command")}`); //TODO

    printCommand(["new=filename.md", 'new="my long filename.md"'],
        "saves output to *filename*",
        { code: 'm2jek set --new="my web page.md"', info: 'always output to "my web page.md"' },
        { code: "m2jek docs/input.txt --new=mypage.md", info: "process input.txt and output to docs/mypage.md" }
    );

    printCommand(["--version"], "write current mark2jek version to console");

    printCommand(["list", "help"], "You are here now friend :)");

    printCommand(["flags"], "Display only the 'Flags' section of this list");

    printCommand(["set", "change"], `Change flags by keywords (in config)`,
        { code: "m2jek set --nocodeblock expand", info: `codeblock ${red('off')}, expand ${green('on')}` },
        { code: "m2jek change noNested", info: `nestedUrl ${red('off')}` }
    );

    flags();
}

async function flags() {
    log.out(warning("=== Flag Rules: ===\n"));
    log.info("> if flagname = raw then noRaw is the disable flag (ignore case, valid for aliases too)");
    log.info("> if not writing flagname in `set` mode -> flagname needs to start with `--`.");
    log.important("Examples:")
    log.out(`${code("m2jek input.md --noNested --pics")} ${info("to overwrite input.md with no nest check and transforming image links")}`);
    log.out(`${code("m2jek set noNested pics")} ${info("to always use those those settings")}\n`);

    log.out(warning("=== List Of Flags ===\n"));

    for (const [key, element] of Object.entries(config)) {
        log.out(` ${important(key)} or ${important(element.alias)}   (${coloredValue(element.value)})`)
        log.out(lines(" - " + info(element.description), ""));
    }

    process.exit(0);
}

async function set() {
    await parseFlags(true);
    saveAndExit();
}

async function parseFlags(isSet) {
    const delim = isSet ? "" : "--";
    const no = delim + "no";
    //parse all flags and set current config
    for (let i in process.argv) {
        if (i < 3 || !process.argv[i]) continue;
        if (process.argv[i].toLowerCase().startsWith("new=") || process.argv[i].toLowerCase().startsWith("--new=")) {
            config.outputName.value = extractNew(process.argv[i]);
            if (config.outputName.value === " ") config.outputName.value = "";
            log.info(`outputName / new= ${coloredValue(config.outputName.value)}`);
        } else {
            const arg = process.argv[i].toLowerCase();
            for (const [key, element] of Object.entries(defaultConfig)) {
                if (key === "outputName") continue;
                if ((delim + key.toLowerCase() === arg) || (element.alias && delim + element.alias.toLowerCase() === arg)) {
                    config[key].value = true;
                } else if ((no + key.toLowerCase() === arg) || (element.alias && no + element.alias.toLowerCase() === arg)) {
                    config[key].value = false;
                }
                log.info(`set ${code(key)} / ${code(config[key].alias)} to ${coloredValue(config[key].value)}`);
            }
        }
    }
}

function extractNew(arg) {
    return (arg.match(/new="([^"]+)"/i) || arg.match(/new=((?!")[^\s]+)/i) || [undefined, ""])[1];
}

async function run() {
    //process.argv -> [1]=location launched [2]=appended arg
    try {
        filePath = path.join(process.cwd(), process.argv[2]);
    } catch { sendError(1) }

    await parseFlags(false);

    savePath = config.outputName.value ?
        filePath.slice(0, filePath.lastIndexOf(path.sep) + 1) + config.outputName.value :
        filePath;

    fs.readFile(filePath, "utf8", function (er, data) {
        if (er) sendError(1);

        fs.writeFile(savePath, doRegex(data), (err) => {
            if (err) sendError(2);
            if (savePath !== filePath) {
                log.success(`Saved mark2jek output to ${savePath}`)
            } else {
                log.success(`Ran mark2jek on ${filePath}`)
            } process.exit(0);
        });
    })
}

function doRegex(data) {
    if (config.codeblock?.value) {
        data = data
            .replace(/\`\`\`([^\s]+)\s*?\n(.*?)\`\`\`/gs, "{% highlight $1 %}\n$2{% endhighlight %}");
    }
    if (config.nested?.value) {
        data = data
            .replace(/\[!\[.*\]\((https?:\/\/.*)\)]\((.+)\)/g, '<a href ="$2"><img src="$1"></a>');
    }
    if (config.pics?.value) {
        data = data
            .replace(/!\[.*\]\((https?:\/\/.*)\)/gi, '<img src="$1">');
    }
    if (config.raw?.value) {
        data = data
            .replace(/(https?:\/\/github.com\/[^\/]+\/[^\/]+\/blob\/.+\.(?:png|svg|jpg|jpeg|gif|webp|bmp)(?!\?raw=true))/gi, "$1?raw=true");
    }
    if (config.expand?.value) {
        data = getCollapsibleStyle() + data;
    }
    return data;
}

function sendError(errorCode) {
    switch (errorCode) {
        case 1:
            log.error("Could not load file at: " + (filePath || process.argv[2] || "UNDEFINED"));
            break;
        case 2:
            log.error("Could not save file to " + (savePath || config.outputName.value || "UNDEFINED"));
            break;
        case 3:
            log.error("Invalid arguments. run m2jek `list` or `help` to see all options");
            break;
    }
    process.exit(errorCode);
}

async function saveAndExit() {
    fs.writeFile(path.join(__dirname, 'config.json'), JSON.stringify(config, null, "\t"), (err) => {
        if (err) {
            log.warning('Could not save configuration data. details:');
            log.out(err.message);
        } else {
            log.success('Saved Configuration')
        }
        process.exit(0);
    });
}

async function loadConfig() {
    try {
        config = {
            ...defaultConfig,
            ...JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')))
        }
    }
    catch {
        log.warning('There has been an error parsing config.json, using default config');
        config = { ...defaultConfig };
    }
}
