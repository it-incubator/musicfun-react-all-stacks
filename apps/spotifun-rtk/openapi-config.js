export default {
  schemaFile: "https://spotifun.it-incubator.app/api-json",
  apiFile: "./src/app/api/base-api.ts",
  apiImport: "baseApi",
  exportName: "generatedApi",
  hooks: true,
  tag: true,
  argSuffix: "Args",
  responseSuffix: "Response",
  outputFiles: {
    "./src/generated/playlistsController.ts": {
      filterEndpoints: [/playlistsController/],
    },
    "./src/generated/playlistsPublicController.ts": {
      filterEndpoints: [/playlistsPublicController/],
    },
    "./src/generated/tracksController.ts": {
      filterEndpoints: [/tracksController/],
    },
    "./src/generated/tracksPublicController.ts": {
      filterEndpoints: [/tracksPublicController/],
    },
    "./src/generated/artistsController.ts": {
      filterEndpoints: [/artistsController/],
    },
    "./src/generated/authController.ts": {
      filterEndpoints: [/authController/],
    },
    "./src/generated/tagsController.ts": {
      filterEndpoints: [/tagsController/],
    },
  },
}
