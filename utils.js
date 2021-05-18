#!/usr/bin/env node

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const { log, code } = require("./cli");

const lines = (...lineGroup) => {
    let output = "";
    for (const line of lineGroup) {
        if (output.length > 0) output += "\n";
        output += line;
    } return output;
}
exports.lines = lines;

exports.defaultConfig = {
    outputName: {
        alias: "new=", value: "",
        description: lines(
            "Special flag that specify the output filename (relative from input file directory)",
            `Used only as ${code("new=filename")} or ${code("--new=filename")}. can leave empty to disable (not in setup)`
        )
    },
    pics: {
        alias: "images", value: true,
        description: `Converts ${code("![](x)")} to ${code("<img src=x>")}`
    },
    nested: {
        alias: "nestedUrl", value: true,
        description: `Converts ${code("[![](x)](y)")} to ${code("<a href=y><img src=x></a>")}`
    },
    raw: {
        alias: "githubRaw", value: true,
        description: "Convert github images to raw version (if needed)"
    },
    expand: {
        alias: "collapsible", value: true,
        description: `Adds an icon to start collapsible content description (after ${code("<summary>")})`
    },
    codeblock: {
        alias: "liquid", value: true,
        description: lines(
            'Replace:', code(lines('```languageName', 'codeblock lines', '```‎')),
            "With:", code(lines("{% highlight languageName %}", "codeblock lines", "{% endhighlight %}"))
        )
    }
};

exports.getCollapsibleStyle = () => {
    try {
        return lines(
            '<style type="text/css" rel="stylesheet">',
            fs.readFileSync(path.join(__dirname, 'collapsible.css'), { encoding: 'utf8' }),
            '</style>',
            ""
        );
    }
    catch {
        log.warn('Could not load custom collapsible css');
        return "";
    }
}

exports.Prompt = class Prompt {
    constructor(config) {
        this.config = config;
        this.cmd = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /** asks a yes/no question and sets object.value accordingly */
    async question(questionText, key) {
        try {
            let answer = await this.asyncQuestion(questionText);
            this.parseAnswer(answer, key);        
        } catch (err) {
            log.warn(err.message || err)
        }
    }

    async asyncQuestion(text) {
        return new Promise((resolve, reject) => {
           try {
            this.cmd.question(text, (answer) => {
              resolve(answer);
            });
           } catch(e) {reject(e);}
        });
    }

    parseAnswer(answer, key) {
        if (!answer) return;
            if (key === "outputName") {
                answer = (answer.match(/(?!")(.*)(?<!")/) || [null, answer])[1];
                switch (answer.toLowerCase()) {
                    case "delete":
                    case "disable":
                    case "false":
                    case "no":
                    case "n":
                    case "x":
                    case " ":
                        this.config[key].value = ""; return;
                    case "enable":
                    case "true":
                    case "yes":
                    case "y":
                        return;
                    default:
                        this.config[key].value = answer; return;
                }
            } else {
                switch (answer.toLowerCase()) {
                    case "enable":
                    case "true":
                    case "yes":
                    case "y":
                        this.config[key].value = true; return;
                    case "disable":
                    case "false":
                    case "no":
                    case "n":
                    case "x":
                        this.config[key].value = false; return;
                    default: return;
                }
            }
    }
}