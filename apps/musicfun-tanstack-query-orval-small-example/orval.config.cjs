module.exports = {
  musicfun: {
    input: { target: 'https://musicfun.it-incubator.app/api-json' },
    output: {
      target: './src/shared/api/orval/musicfun.ts',
      mode: 'tags-split',
      client: 'react-query',
      // baseUrl: {
      //   getBaseUrlFromSpecification: true,
      //   variables: {
      //     environment: 'api.dev',
      //   },
      // },
      override: {
        mutator: {
          path: './src/shared/api/orval/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
}
