import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        index: "src/index.ts",
        "bin/smoriginals-gen": "src/bin/smoriginals-gen.ts"
    },
    format: ["esm", "cjs"],
    dts: true,
    splitting: false,
    clean: true,
    outDir: "dist",
    target: "es2020",

    // THIS IS CRITICAL FOR CLI
    banner: {
        js: "#!/usr/bin/env node"
    }
});
