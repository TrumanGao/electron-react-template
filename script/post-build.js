/**
 * 执行 electron-builder 打包后：
 * 基于 latest.yml 文件生成 latest.json 文件，写入 build 目录
 */
const path = require("path");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const { platform, ymlFile, jsonFile } = require("./config");

try {
  const doc = yaml.load(
    fs.readFileSync(
      path.join(__dirname, `../build-${platform}/${ymlFile}.yml`),
      "utf8"
    )
  );
  console.log("post-build.js - yaml.load success!");

  fs.writeFile(
    path.join(__dirname, `../build-${platform}/${jsonFile}.json`),
    JSON.stringify(doc, null, 2),
    "utf8",
    function (error) {
      if (error) {
        console.log(
          `post-build.js - fs.writeFile /build-${platform}/${jsonFile}.json error: `,
          error
        );
      } else {
        console.log(
          `post-build.js - fs.writeFile /build-${platform}/${jsonFile}.json success!`
        );
      }
    }
  );
} catch (error) {
  console.log("post-build.js - yaml.load error: ", error);
}
