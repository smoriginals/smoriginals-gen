import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/cli.ts", "src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    target: "es2020",
    splitting: false,
    banner: {
        js: "#!/usr/bin/env node"
    }
});
