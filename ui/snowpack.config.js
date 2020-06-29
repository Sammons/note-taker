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
    treeshake: true,
    installTypes: true,
    sourceMap: true
  },
  "devOptions": {},
  "install": [
    "prismjs/themes/prism.css"
  ]
}