import {nodeResolve} from "@rollup/plugin-node-resolve"

export default {
  input: "./src/index.js",
  external: [
    '@codemirror/language',
    '@codemirror/highlight',
    '@codemirror/autocomplete',
    'lezer',
    'lezer-tree'
  ],

  output: [{
    format: "cjs",
    file: "./dist/index.cjs"
  }, {
    format: "es",
    file: "./dist/index.es.js"
  }],
  // external(id) { return !/^[\.\/]/.test(id) },
  plugins: [
    nodeResolve(),
  ]
}
