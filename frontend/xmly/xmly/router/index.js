const express = require('express')
const router = express.Router()
const fs = require('node:fs')
const path = require('node:path')

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/db.json'), 'utf-8'))

// http://localhost:3000/api?tag=guesslike
// 其他可选的 tag 值：audiobook、ranking
router.get('/', (req, res) => {
  const tag = req.query.tag
  const queryData = data[tag]
  res.send({
    message: queryData ? '获取成功' : `tag 为 ${tag} 的数据不存在`,
    data: queryData || []
  })
})

module.exports = router

