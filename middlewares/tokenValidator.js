const { Session } = require('../models')

const tokenValidator = async (req, res, next) => {
  const token = req.decodedToken
  if (token) {
    try {
      const session = await Session.findByPk(token.sessionId)
      if (!session || token.id !== session.userId) {
        res.status(401).json({ error: 'session for token not found' })

      }
    } catch(error) {
      res.status(401).json({ error: 'token invalid' })
    }
  } else {
    res.status(401).json({ error: 'token not found' })
  }
  next()
}

module.exports = { tokenValidator }
