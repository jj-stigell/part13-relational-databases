const router = require('express').Router()
const { User , Session } = require('../models')
const { tokenExtractor } = require('../middlewares/tokenExtractor')
const { tokenValidator } = require('../middlewares/tokenValidator')

router.delete('/', tokenExtractor, tokenValidator, async (req, res, next) => {
  try {
    const token = req.decodedToken
    if (token) {
      const session = await Session.findByPk(token.sessionId)
      if (session && token.id === session.userId) {
        const result = await Session.destroy({
          where: {
            id: session.dataValues.id
          }
        });

        const user = await User.findOne({
          where: {
            id: token.id
          }
        })

        user.disabled = true
        user.save()
        return res.status(200).json({ success: 'session ended' })
      }
      return res.status(401).json({ error: 'session not active anymore' })
    }
  } catch(error) {
    next(error)
  }
})

module.exports = router
