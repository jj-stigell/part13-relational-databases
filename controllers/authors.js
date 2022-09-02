const router = require("express").Router()
const { Blog } = require('../models')
const { fn, col } = require("sequelize");

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [fn('COUNT', col('likes')), 'articles'],
      [fn('SUM', col('likes')), 'likes']
    ]
  })
  res.json(authors)
})

module.exports = router
