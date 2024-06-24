import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

/**
 * A function that configures a react-virtualized plugin to fix a build error with react-virtualized.
 * see https://github.com/bvaughn/react-virtualized/issues/1722
 * @returns {Object} The configuration object for react-virtualized.
 */
function reactVirtualized() {
  return {
    name: "my:react-virtualized",
    configResolved() {
      const file = require
        .resolve("react-virtualized")
        .replace(
          path.join("dist", "commonjs", "index.js"),
          path.join("dist", "es", "WindowScroller", "utils", "onScroll.js")
        );
      const code = fs.readFileSync(file, "utf-8");
      const modified = code.replace(
        `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`,
        ""
      );
      fs.writeFileSync(file, modified);
    },
  };
}

export default defineConfig({
  build: {
    outDir: "build",
  },
  base: "/",
  plugins: [reactVirtualized(), react()],
  server: {
    open: true,
    port: 3000,
  },
});
