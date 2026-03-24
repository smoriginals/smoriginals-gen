import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/cli.ts"],
        format: ["esm"],
        clean: true,
        target: "es2020",
        splitting: false,
        banner: {
            js: "#!/usr/bin/env node"
        }
    },
    {
        entry: ["src/index.ts"],
        format: ["esm"],
        dts: true,
        target: "es2020",
        splitting: false,
    }
]);
