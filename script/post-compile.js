/**
 * 执行 tsc 编译后：
 * 将 tsc 无法处理的静态资源文件复制到 dist 目录
 */
const path = require("path");
const fs = require("fs-extra");

Promise.all(
  [
    {
      src: path.join(__dirname, "../src/assets"),
      dest: path.join(__dirname, "../dist/assets"),
    },
  ].map(async ({ src, dest }) => {
    try {
      await fs.remove(dest);
      await fs.copy(src, dest);
      console.log(
        `post-compile.js - fs.copy 【${src}】 to 【${dest}】 success!`
      );
    } catch (error) {
      console.log(
        `post-compile.js - fs.copy 【${src}】 to 【${dest}】 error: `,
        error
      );
    }
  })
);
