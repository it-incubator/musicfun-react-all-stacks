export default {
  // ❌ не генерируется
  schemaFile: "https://trelly.it-incubator.app/api-json",
  // ✅ спотифан генерируется
  // schemaFile: "https://spotifun.it-incubator.app/api-json",
  apiFile: "./src/app/baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./src/generated/generatedApi.ts",
  exportName: "generatedApi",
  hooks: true,
}
