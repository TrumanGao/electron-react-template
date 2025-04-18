# electron-template

## Environment

Environment variables and paths.

### win

    1.  计算机 —— 属性 —— 高级系统设置
    2.  [系统属性]对话框 —— [高级]标签页 —— 环境变量
    3.  [环境变量]对话框 —— 系统变量 —— Path
         --------------------------------
        | 编辑环境变量                     |
        | ------------------------------ |
        | C:\Program Files\[Python Path] |

### mac

`/Users/[username]/.zshrc`

```sh
export PATH="/opt/homebrew/bin:$PATH"

eval "$(pyenv init --path)"
eval "$(pyenv init -)"
export PATH
```

## Prerequisites

```sh
nvm list
nvm install 16.20.2
nvm use 16.20.2

pyenv versions
pyenv install 3.8.20
pyenv local 3.8.20
```

## Setup

```sh
# npm install
npm run setup:win32
# or
npm run setup:win64
# or
npm run setup:mac_intel
# or
npm run setup:mac_arm

# pipenv install
pipenv install
```

## Development

```sh
npm run dev:win
# or
npm run dev:mac
```

## Building

```sh
npm run patch

npm run build:win
# or
npm run build:mac
```

## Publishing

上传以下文件至资源服务器

    |-- win
        |-- electron-template-1.0.0.exe (Windows 客户端)
        |-- latest.yml                  (electron-builder 自动生成，用于检查更新)
        |-- latest-win.json             (由 ./script/post-build.js 基于 latest.yml 生成，用于前端读取版本信息)
    |-- mac
        |-- template-1.0.0.dmg          (MacOS 客户端)
        |-- latest-mac.yml              (electron-builder 自动生成，用于检查更新)
        |-- latest-mac.json             (由 ./script/post-build.js 基于 latest-mac.yml 生成，用于前端读取版本信息)

## References

- [electron](https://www.electronjs.org/docs/latest/)

- [@electron/rebuild](https://github.com/electron/rebuild)

- [electron-builder](https://www.electron.build/)

- [electron-updater](https://www.electron.build/auto-update)

- [electron-log](https://www.npmjs.com/package/electron-log)

## Compatibility

Compatibility statistics. via [gs.statcounter.com](https://gs.statcounter.com/)

- [Electron@22.3.27](https://releases.electronjs.org/release/v22.3.27)

  - Electron will be ending support for Windows 7/8/8.1 after version 22.x.y following Chromium's plan to end support. (https://releases.electronjs.org/release/v22.0.0)

- [Node.js@16.20.2](https://nodejs.org/download/release/v16.20.2/)

  - Last version of Node.js 16.x.y, compatible with Electron 22.x.y.

- [Python@3.8.20](https://www.python.org/downloads/release/python-3820/)

  - Python 3.8 is end of life, last release was 3.8.20. (https://www.python.org/downloads/release/python-3820/)
  - Python 3.9 is the first version of Python to default to the 64-bit installer on Windows. The installer now also actively disallows installation on Windows 7. Python 3.9 is incompatible with this unsupported version of Windows. (https://www.python.org/downloads/release/python-390/)
