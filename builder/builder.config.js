/**
 * https://www.electron.build/
 * ico/icns文件生成器 https://cloudconvert.com/image-converter
 */
const { Configuration } = require("electron-builder");
const { platform } = require("../script/config");
const productName = require("../package.json").name;

module.exports = () => {
  console.log("打包目标平台：", platform);

  /**
   * @type { Configuration }
   */
  const config = {
    productName,
    appId: "com.electron-template",
    directories: {
      output: `dist-${platform}`,
    },
    npmRebuild: false,
    files: ["dist", "node_modules"],
    extraResources: [
      "package-lock.json",
      "Pipfile.lock",
      {
        from: `public/${platform}`,
        to: "public",
      },
    ],
    // publish: [
    //   {
    //     provider: "generic",
    //     url: `/${productName}/packages/${platform}/`,
    //   },
    // ],
    win: {
      artifactName: "${productName}-${version}.${ext}",
      target: [
        {
          target: "nsis",
          arch: ["ia32"],
        },
      ],
      icon: "./builder/icon.ico",
    },
    mac: {
      artifactName: "${productName}-${version}.${ext}",
      target: [
        {
          target: "dmg",
          arch: ["x64", "arm64"],
        },
      ],
      icon: "./builder/icon.icns", // 经测试，尺寸200x200的icns文件最佳
    },
    nsis: {
      oneClick: false,
      perMachine: true,
      allowElevation: true,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true,
    },
  };
  console.log("打包配置：", config);

  return config;
};
