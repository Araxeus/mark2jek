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

#### convert file:
format: [`mark2jek`/`m2jek` `inputFile`(relative) `new=newName`(optional)]. for example:

```sh
mark2jek index.md                  //overwrites input file
m2jek docs/readme.md new=page   //output will be docs/page.md
```

#### interactive config changer:

```sh
m2jek setup / config
```

## List Of Commands

#### version check
```sh
mark2jek --version
```

### Flags
You can specify flags when executing a task.(**case insensitive**)
each flag can have a few variant names, but you can always prepend `no` to disable the flag (except `new=` where you have)
(these method always overwrite the flags set in the config)
for example:
`mark2jek index.md --raw` `mark2jek index.md --noRaw`

#### Full list:

* `--new=FILENAME` or `new=FILENAME` - creates new file with FILENAME
  to disable:
   * with `set` just input nothing like `m2jek set new=`
   * in `setup` input `delete/disable/false/no/n/x` or just space

* `--pics` or `--images`- convert `![](x)` to `<img src=x>`

* `--nestedUrl` or `--nested` - convert `[![](x)](y)` to `<a href=y><img src=x></a>`

* `--githubRaw` or `--raw` - convert github images to raw version

* `--collapsible` or `--expand` - adds an icon for collapsible content

*  `--codeblock` or `--liquid` - replace:
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
m2jek setup / config
```

#### show all commands (including flags)
```sh
m2jek list / help
```

#### show flags
```
m2jek flags
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
