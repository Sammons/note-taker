module.exports = {
  "scripts": {
    "mount:src": "mount src --to /note-taker",
    "mount:public": "mount public --to /"
  },
  "plugins": [
    "@snowpack/plugin-babel",
    "@snowpack/plugin-parcel"
  ],
  installOptions: {
    treeshake: false,
    installTypes: true,
    sourceMap: true
  },
  buildOptions: {
    minify: false,
    watch: true
  },
  "devOptions": {secure: true},
  "install": [
    "prismjs/themes/prism.css"
  ]
}