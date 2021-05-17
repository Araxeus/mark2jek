<h1 align="center">Welcome to mark2jek - markdown to jekyll converter</h1>

[![NPM Version](https://img.shields.io/npm/v/mark2jek)](https://www.npmjs.com/package/mark2jek) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Araxeus/mark2jek/blob/main/LICENSE) 
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/Araxeus/mark2jek)

> Replace markdown syntax with jekyll/html for compatibility

### 🏠 [Homepage](https://github.com/Araxeus/mark2jek/)

## Replaces:

* ` ```language` -> `{% highlight language %}`

* ` ``` ` -> `{% endhighlight %}`

* ` [![xx](imageURL)](linkURL) 
 ` -> `<a href ="linkURL"><img src="imageURL"></a>`

* ` ![](imageUrl)
 ` -> `<img src="imageUrl">`

* ` https://github.com/owner/repo/blob/branch/folders/file.png ` -> `https://raw.githubusercontent.com/owner/repo/branch/folders/file.png`

## Install

```sh
npm install -g mark2jek
```

## Usage

format: [`mark2jek`/`m2jek` `inputFile`(relative) `newName`(optional)]. for example:

```sh
mark2jek docs/page.md formatted.md
```
or
```sh
m2jek example.md
```

## Test Version tests

```sh
mark2jek --version
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
