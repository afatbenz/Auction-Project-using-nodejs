const express   = require('express')
const app       = express()
const port      = 3100

console.log("Open ERP ....")

app.listen(port, () => {
  console.log(`cli-nodejs-api listening at http://localhost:${port}`)
});