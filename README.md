<h1 align="center">🏠 <a href="https://github.com/Araxeus/mark2jek">mark2jek<a> - markdown to jekyll converter</h1>

<p align="center">
<a href ="https://www.npmjs.com/package/mark2jek.svg"><img src="https://img.shields.io/npm/v/mark2jek"></a> 
<a href ="https://github.com/Araxeus/mark2jek/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg"></a> 
<a href ="https://github.com/Araxeus/mark2jek"><img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg"></a>
</p>

> Replace markdown syntax with jekyll/html for compatibility

## Install

```sh
npm install -g mark2jek
```

## Basic Usage

format: [`mark2jek`/`m2jek` `inputFile`(relative) `--new newName`(optional)]. for example:

```sh
mark2jek index.md --noCodeblock//overwrites it
```
or
```sh
m2jek docs/readme.md --new index //output will be docs/index.md
```

## List Of Commands

#### version check
```sh
mark2jek --version
```

### Flags
You can specify flags when executing a task.(**case insensitive**)
each flag can have a few variant names, but you can always prepend `no` to disable the flag
(these method always overwrite the flags set in the config)
for example:
`--codeblock` `--noCodeblock`

#### Full list:

* `--new FILENAME` - creates new file with FILENAME

* `--images` - convert `![](x)` to `<img src=x>`

* `--nestedUrl` `--nested` - convert `[![](x)](y)` to `<a href=y><img src=x></a>`

* `--raw` `--githubRaw` - convert github images to raw version

* `--collapsible` `--expand` - adds an icon for collapsible content

*  `--codeblock` - replace:
    ```
     ```languageName
     codeblock lines
     ```‎
   ```
   with:
   ```liquid
    {% highlight languageName %}
    codeblock lines
    {% endhighlight %}
   ```

### Config
you can save settings as permanent flags in the config
> all the following commands are to be used when not specifying a file to work on

#### interactive config changer
```sh
m2jek setup OR help
```

#### show flags list (config options)
```sh
m2jek flags OR list
```

#### individually set flags
```sh
m2jek set noCodeblock nested noCollapsible [flags without --]
```

## Author

👤 **Araxeus**

* Github: [@Araxeus](https://github.com/Araxeus)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Araxeus/mark2jek/issues). 

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2021 [Araxeus](https://github.com/Araxeus).<br />
This project is [MIT](https://github.com/Araxeus/mark2jek/blob/main/LICENSE) licensed.

***
> Doesn't work if markdown have code blocks without language specified
