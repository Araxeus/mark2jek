#!/usr/bin/env nodejs

import fs from "fs";
import path from "path";

import {
    __dirname,
    lines,
    getCollapsibleStyle,
    Prompt,
    green, red, warning, info, important, code, log, coloredValue, err
} from "./utils.js";

import Config from "./config.js"

parseArg();

async function parseArg() {
    if (process.argv.length < 3) err(3);

    Config.load();

    switch (process.argv[2].toLowerCase()) {
        case "--version":
            versionCheck(); break;
        case "config":
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
    log.out(info("mark2jek") + important(`v${require("./package.json").version}`));
    process.exit(0);
}


async function run() {
    try {
        Config.filePath = path.join(process.cwd(), process.argv[2]);
    } catch { err(1) }

    await parseFlags(false);

    Config.savePath = Config.flags.outputName.value ?
        Config.filePath.slice(0, Config.filePath.lastIndexOf(path.sep) + 1) + Config.flags.outputName.value :
        Config.filePath;

    fs.readFile(Config.filePath, "utf8", function (er, data) {
        if (er) err(1);

        fs.writeFile(Config.savePath, doRegex(data), (err) => {
            if (err) err(2);
            if (Config.savePath !== Config.filePath) {
                log.success(`Saved mark2jek output to ${Config.savePath}`)
            } else {
                log.success(`Ran mark2jek on ${Config.filePath}`)
            } process.exit(0);
        });
    })
}

async function parseFlags(isSet) {
    const delim = isSet ? "" : "--";
    const no = delim + "no";
    //parse all flags and set current config
    for (let i in process.argv) {
        if (i < 3 || !process.argv[i]) continue;
        if (process.argv[i].toLowerCase().startsWith("new=") || process.argv[i].toLowerCase().startsWith("--new=")) {
            Config.flags.outputName.value = extractNew(process.argv[i]);
            if (Config.flags.outputName.value === " ") Config.flags.outputName.value = "";
            log.info(`outputName / new= ${coloredValue(Config.flags.outputName.value)}`);
        } else {
            const arg = process.argv[i].toLowerCase();
            for (const [key, element] of Object.entries(Config.default)) {
                if (key === "outputName") continue;
                if ((delim + key.toLowerCase() === arg) || (element.alias && delim + element.alias.toLowerCase() === arg)) {
                    Config.flags[key].value = true;
                } else if ((no + key.toLowerCase() === arg) || (element.alias && no + element.alias.toLowerCase() === arg)) {
                    Config.flags[key].value = false;
                }
                log.info(`set ${code(key)} / ${code(Config.flags[key].alias)} to ${coloredValue(Config.flags[key].value)}`);
            }
        }
    }

    function extractNew(arg) {
        return (arg.match(/new="([^"]+)"/i) || arg.match(/new=((?!")[^\s]+)/i) || [undefined, ""])[1];
    }
}

function doRegex(data) {
    if (Config.flags.codeblock?.value) {
        data = data
            .replace(/\`\`\`([^\s]+)\s*?\n(.*?)\`\`\`/gs, "{% highlight $1 %}\n$2{% endhighlight %}");
    }
    if (Config.flags.nested?.value) {
        data = data
            .replace(/\[!\[.*\]\((https?:\/\/.*)\)]\((.+)\)/g, '<a href ="$2"><img src="$1"></a>');
    }
    if (Config.flags.pics?.value) {
        data = data
            .replace(/!\[.*\]\((https?:\/\/.*)\)/gi, '<img src="$1">');
    }
    if (Config.flags.raw?.value) {
        data = data
            .replace(/(https?:\/\/github.com\/[^\/]+\/[^\/]+\/blob\/.+\.(?:png|svg|jpg|jpeg|gif|webp|bmp)(?!\?raw=true))/gi, "$1?raw=true");
    }
    if (Config.flags.expand?.value) {
        data = getCollapsibleStyle() + data;
    }
    return data;
}

async function set() {
    await parseFlags(true);
    Config.save();
    process.exit(0);
}

async function setup() {
    log.out(lines(
        important("Launching Interactive Config Manager"),
        info("- leave empty to use current value"),
        ` - ${code("enable/true/yes/y")} to enable`,
        ` - ${code("disable/false/no/n/x")} to disable))`));

    log.info(`for more info on each command, use ${code("m2jek help")} or ${code("m2jek list")}\n`)

    const prompt = new Prompt(Config.flags);
    let changed = false;

    for (const [key, element] of Object.entries(Config.default)) {
        const savedValue = Config.flags[key].value;
        await prompt.question(
            ` ${important(key)} / ${important(element.alias)} (${coloredValue(savedValue)}):`,
            key);
        if (Config.flags[key].value !== savedValue) {
            log.info(`Saved new value: ${coloredValue(Config.flags[key].value)}`)
            changed ||= true;
        }
    }

    if (changed) Config.save();

    process.exit(0);
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

    printCommand(["setup", "config"], "Launch an Interactive Config Changer");

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

    for (const [key, element] of Object.entries(Config.default)) {
        log.out(` ${important(key)} or ${important(element.alias)}   (${coloredValue(element.value)})`)
        log.out(lines(" - " + info(element.description), ""));
    }

    process.exit(0);
}
