module.exports = {
  apps : [{
    name: "Shop-Bot",
    script: "./index.js",
    cwd: '~/Shop-Bot/',
    ignore_watch: ['databases'],
    watch: true
  },
  {
    name: "Tall-Grass-Bot",
    script: "./index.js",
    cwd: '~/Tall-Grass-Bot/',
    watch: true
  }]
}