import * as path from "path";
import { app } from "electron";

/**
 * 是否开发环境
 */
export const IS_DEV = process.env?.MODE === "DEVELOPMENT";

/**
 * 操作系统平台
 */
export let PLATFORM: PlatformType;
switch (process.platform) {
  case "darwin":
    PLATFORM = "mac";
    break;
  case "win32":
    PLATFORM = "win";
    break;
  default:
    throw new Error(`不支持【${process.platform}】`);
}

/**
 * builder.config.js - productName
 * @example 代码仓库 / 资源服务器
 * @example 控制面板程序名称
 * @warn 在无法使用中文的地方，会自动使用 PRODUCT_NAME
 */
export let PRODUCT_NAME: "electron-template";

/**
 * 产品标题
 * @exapmle 窗口 title
 */
export let PRODUCT_TITLE: "electron-template";

/**
 * 资源服务器地址
 * @example `[OSS_BASEURL]/[PRODUCT_NAME]`
 */
export let OSS_URL: string = `/electron-template`;

/**
 * 用户数据路径，有操作系统权限的路径
 * @example
 * win: "C:\Users\trumangao\AppData\Roaming\[PRODUCT_NAME]"
 * mac: "/Users/trumangao/Library/Application Support/[PRODUCT_NAME]"
 */
export const USER_DATA_PATH = app.getPath("userData");

/**
 * 应用程序根路径
 */
export const APP_ROOT_PATH = IS_DEV
  ? path.join(__dirname, `../../`)
  : path.join(app.getAppPath(), "../");

/**
 * public 路径
 */
export const PUBLIC_PATH = IS_DEV
  ? path.join(APP_ROOT_PATH, "public", PLATFORM)
  : path.join(APP_ROOT_PATH, "public");

/**
 * package-lock.json 文件路径
 */
export const PACKAGE_LOCK_PATH = path.join(APP_ROOT_PATH, "package-lock.json");

/**
 * ASSETS_PATH 文件路径
 */
export const ASSETS_PATH = path.join(__dirname, `../assets`);
