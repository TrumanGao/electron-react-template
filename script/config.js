const process = require("process");

/**
 * 平台标识，用于区分不同平台下的文件，且是 eletron-builder 的参数
 * @type { 'win' | 'mac' }
 */
let platform;
/**
 * electron builder 生成的 yml 文件，在不同平台下有不同的文件名
 * @type { 'latest' | 'latest-mac' }
 */
let ymlFile;
/**
 * 基于 latest.yml 文件生成 latest.json 文件，统一文件名，用于查找版本信息
 * @type { 'latest-win' | 'latest-mac' }
 */
let jsonFile;
switch (process.platform) {
  case "win32":
    platform = "win";
    ymlFile = "latest";
    jsonFile = "latest-win";
    break;
  case "darwin":
    platform = "mac";
    ymlFile = "latest-mac";
    jsonFile = "latest-mac";
    break;
  default:
    throw new Error(`不支持【${process.platform}】`);
}

module.exports = {
  platform,
  ymlFile,
  jsonFile,
};
