const fs = require("fs");
const path = require("path");

let filePath;

run();

async function run() {
    //process.argv -> [1]=location launched [2]=appended arg
    try {
        filePath = path.join(process.cwd(), process.argv[2]);
    } catch { error() }

    console.log(`Reading File at ${filePath}`)
    fs.readFile(filePath, "utf8", function (err, data) {
        if (err) error();

        // code formatter
        // ```javascript -> {% highlight javascript %}
        data = data.replace(/\`\`\`(.*)/g, "{% highlight $1 %}");
        data = data.replace(/```/g, "{% endhighlight %}")

        //use html <a><img></a> instead of markdown [![randomName](imageUrl)](clickLink)
        data = data.replace(/\[!\[.*\]\((.*)\)]\((.*)\)/g, '<a href ="$2"><img src="$1"></a>')

        //use html <img> instead of markdown ![]()
        data = data.replace(/!\[.*\]\((.*)\)/g, '<img src="$1">')

        //use raw instead of blob
        //https://github.com/Araxeus/mark2jek/blob/pics/ok.png -> https://raw.githubusercontent.com/Araxeus/mark2jek/ok.png
        data = data.replace(/(?:https|http):\/\/github.com\/(.*)\/blob/g, "https://raw.githubusercontent.com/$1")

        fs.writeFile(filePath, data, () =>
            console.log(`Succesfully Ran mark2jek on ${filePath}`)
        );
    })
}

function error() {
    console.error("cant load file at: " + (filePath || process.argv[2] || "UNDEFINED"));
    process.exit(1);
}