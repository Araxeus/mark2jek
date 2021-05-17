<h1 align="center">Welcome to mark2jek 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-(1.0.0)-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/Araxeus/mark2jek/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

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
yarn add mark2jek
```

## Usage

```sh
yarn mark2jek docs/page.md
```
or
```sh
yarn m2jek example.md
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