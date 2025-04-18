declare type PlatformType = "mac" | "win";

/**
 * 客户端 json 文件
 * @file 'latest-win.json'
 * @file 'latest-mac.json'
 * @example
 * {
 *   "version": "6.0.0",
 *   "files": [
 *     {
 *       "url": "ElectronTemplate-6.0.0.dmg",
 *       "sha512": "MYa7BzWoTSGXi6urOVptziMBpEvdaLclpNNn+jFeISIuCStMW2dK124vy+VsTOW/hgEeyi0RE6rX2bQDYlUGIg==",
 *       "size": 372425384
 *     }
 *   ],
 *   "path": "ElectronTemplate-6.0.0.dmg",
 *   "sha512": "MYa7BzWoTSGXi6urOVptziMBpEvdaLclpNNn+jFeISIuCStMW2dK124vy+VsTOW/hgEeyi0RE6rX2bQDYlUGIg==",
 *   "releaseDate": "2024-01-30T06:21:53.167Z"
 * }
 */
declare interface PackageJSON {
  version: string;
  files: [
    {
      url: string;
      sha512: string;
      size: number;
    },
  ];
  path: string;
  sha512: string;
  releaseDate: string;
}

/**
 * 环境变量 json 文件
 */
declare interface EnvJSON {
  /**
   * 仅开发环境有值 process.env.MODE
   */
  MODE?: "DEVELOPMENT";
}
