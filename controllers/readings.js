const router = require("express").Router()
const { ReadingList, User } = require('../models')
const { tokenExtractor } = require('../middlewares/tokenExtractor')
const { tokenValidator } = require('../middlewares/tokenValidator')

router.get('/', async (req, res) => {
  const readinglist = await ReadingList.findAll({
    attributes: ['userId', 'blogId']
  })
  res.json(readinglist)
})

router.put('/:id', tokenExtractor, tokenValidator, async (req, res, next) => {
  try {
    const read = req.body.read;
    const user = await User.findByPk(req.decodedToken.id)
    const reading = await ReadingList.findByPk(req.params.id)

    if (read && reading && user && reading.userId === user.id) {
      reading.bookRead = read
      reading.save()
      res.json(reading)
    } else {
      return res.status(401).json({
        error: 'reading list item not found or you are not the owner of the reading list item'
      })
    }
  } catch(error) {
    next(error)
  }
})

module.exports = router
