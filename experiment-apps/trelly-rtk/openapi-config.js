export default {
  schemaFile: "https://trelly.it-incubator.app/api-json", // ❌ не генерируется
  apiFile: "./src/app/baseApi.ts",
  apiImport: "baseApi",
  exportName: "generatedApi",
  hooks: true,
  tag: true,
  argSuffix: "Args", // ArtistsControllerCreateArtistArgs
  responseSuffix: "Response", // ArtistsControllerCreateArtistResponse
  // Импорт сущностей в один файл
  outputFile: "./src/generated/generatedApi.ts",
  // Импорт сущностей в разные файлы
  outputFiles: {
    "./src/generated/boardsController.ts": {
      filterEndpoints: [/boardsController/],
    },
    "./src/generated/boardsPublicController.ts": {
      filterEndpoints: [/boardsPublicController/],
    },
    "./src/generated/tasksPublicController.ts": {
      filterEndpoints: [/tasksPublicController/],
    },
    "./src/generated/tasksController.ts": {
      filterEndpoints: [/tasksController/],
    },
    "./src/generated/authController.ts": {
      filterEndpoints: [/authController/],
    },
  },
}
