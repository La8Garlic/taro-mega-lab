import type { UserConfigExport } from "@tarojs/cli"

export default {
  mini: {},
  h5: {},
  env: {
    BASE_URL: 'https://jsonplaceholder.typicode.com'
  }
} satisfies UserConfigExport<'webpack5'>
