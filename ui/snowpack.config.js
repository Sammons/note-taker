require('source-map-support').install()

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
  "devOptions": {
    "secure": true
  },
  "install": [
  //   "react",
  //   "react-dom",
  //   "mobx",
  //   "mobx-react",
  //   // "@material-ui/core",
  //   // "@material-ui/icons",
  //   // "@material-ui/pickers",
  //   // "@material-ui/lab",
  //   "@date-io/luxon",
  //   "marked",
  //   "prismjs",
    "prismjs/themes/prism.css"
  ]
}