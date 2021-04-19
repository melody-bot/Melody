module.exports = async (client) => {
const AutoPoster = require('topgg-autoposter')
const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwOTI4Mzk3MjUxMzI2Nzc1MiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjE4MzA2OTQyfQ.ZlY-mB3KV5P3huX2sPew6IlGDXcBJId3_J6bODa9aQg', client)

ap.on('posted', () => {
  console.log('Posted stats to Top.gg!')
})
}