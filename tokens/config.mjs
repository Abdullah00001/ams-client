import StyleDictionary from "style-dictionary";
import { fileURLToPath } from "node:url";

export const config = {
  source: ["tokens/src/**/*.json"],
  platforms: {
    css: {
      prefix: "ams",
      transformGroup: "css",
      buildPath: "src/styles/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: {
            outputReferences: true,
            formatting: {
              commentStyle: "none",
            },
          },
        },
      ],
    },
  },
};

export async function buildTokens() {
  const sd = new StyleDictionary(config);
  await sd.hasInitialized;
  await sd.buildAllPlatforms();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    await buildTokens();
    console.log("✔ Tokens built successfully: src/styles/tokens.css");
  } catch (error) {
    console.error("✖ Token build failed:", error);
    process.exit(1);
  }
}
