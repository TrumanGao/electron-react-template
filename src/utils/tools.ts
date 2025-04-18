import fs from "fs-extra";
import axios, { type AxiosRequestConfig } from "axios";
import { PLATFORM, OSS_URL } from "../constants/config";
import { log } from "../plugins";

/**
 * 获取OSS客户端json文件，用于读取版本号等信息
 */
export async function getPackageJSON(option: {
  platform: typeof PLATFORM;
}): Promise<PackageJSON> {
  try {
    const packageJSON = await getFileByAxios(
      `${OSS_URL}/packages/${option.platform}/latest-${option.platform}.json`
    );
    log.info(
      `从 oss 获取 ${option.platform} 客户端json文件成功: `,
      packageJSON
    );

    return packageJSON;
  } catch (error) {
    log.error(
      `从 oss 获取 ${option.platform} 客户端json文件失败: `,
      error?.message
    );
    return null;
  }
}

export async function getFileByAxios(
  url: string,
  config: AxiosRequestConfig<any> = {
    timeout: 20000,
  }
) {
  try {
    const fileResult = await axios.get(url, config);
    log.info(
      "getFileByAxios 读取文件成功: ",
      url,
      fileResult.status,
      fileResult.data
    );
    return fileResult.data;
  } catch (error) {
    log.error("getFileByAxios 读取文件失败: ", url, error?.message);
    return null;
  }
}

/**
 * 读取文件，返回json或字符串
 */
export async function getFileByFsExtra(
  file: string,
  encoding: string = "utf-8"
) {
  try {
    const fileData = await fs.readFile(file, encoding);
    log.info("getFileByAxios 读取文件成功: ", file);
    if (file.endsWith(".json")) {
      return JSON.parse(fileData);
    } else {
      return fileData;
    }
  } catch (error) {
    log.error("getFileByFsExtra 读取文件失败: ", file, error?.message);
    return null;
  }
}
