const router = require("express").Router()
const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['title']
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:username', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username
      }
    })
    user.username = req.body.username
    user.save()
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})


router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: [''] } ,
      include: {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId']},
        through: {
          attributes: []
        },
        include: {
          model: User,
          as: 'users_marked'
        }
      }
    })

    if (user) {
      res.json(user)
    } else {
      return res.status(404)
    }
  } catch(error) {
    return res.status(400).json({ error })
  }
})

module.exports = router
