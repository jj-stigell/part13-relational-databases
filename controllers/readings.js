const router = require("express").Router()
const { ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const readinglist = await ReadingList.findAll({
    attributes: ['userId', 'blogId']
  })
  res.json(readinglist)
})

module.exports = router
