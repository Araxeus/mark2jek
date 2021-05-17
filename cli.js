const fs = require("fs");
const path = require("path");

if (process.argv[2] === "--version") {
    console.log("mark2jek v"+require('./package.json').version)
    process.exit(0);
} 

let filePath;
let savePath;

run();

async function run() {
    //process.argv -> [1]=location launched [2]=appended arg
    try {
        filePath = path.join(process.cwd(), process.argv[2]);
    } catch { sendError() }

    savePath = process.argv.length < 4 ?
        filePath :
        filePath.slice(0, filePath.lastIndexOf(path.sep) + 1) + process.argv[3]

    console.log(`Reading File at ${filePath}`)
    fs.readFile(filePath, "utf8", function (error, data) {
        if (error) sendError(1);

        fs.writeFile(savePath, doRegex(data), (err) => {
            if (err) sendError(2);
            if (savePath !== filePath) {
                console.log(`Succesfully saved mark2jek output to ${savePath}`)
            } else {
                console.log(`Succesfully ran mark2jek on ${filePath}`)
            }
        });
    })
}

function doRegex(data) {
    return data
        .replace(/\`\`\`(.*)/g, "{% highlight $1 %}")
        .replace(/```/g, "{% endhighlight %}")
        .replace(/\[!\[.*\]\((.*)\)]\((.*)\)/g, '<a href ="$2"><img src="$1"></a>')
        .replace(/!\[.*\]\((.*)\)/g, '<img src="$1">')
        .replace(/(?:https|http):\/\/github.com\/(.*)\/blob/g, "https://raw.githubusercontent.com/$1")
}

function sendError(errorCode) {
    switch (errorCode) {
        case 1:
            console.error("cant load file at: " + (filePath || process.argv[2] || "UNDEFINED"));
            break;
        case 2:
            console.error("cant save file to " + (savePath || process.argv[3] || "UNDEFINED"));
            break;
    }
    process.exit(errorCode);
}
