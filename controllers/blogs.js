const router = require("express").Router()
const { Blog, User } = require('../models')
const { isInt } = require('../util/helper')
const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['username']
    }
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const newBlog = req.body;
    if (!newBlog.author || !newBlog.blogUrl || !newBlog.title) {
      throw new Error('Missing required values!')
    }
    const blog = await Blog.create({ 
      author: newBlog.author.toString(),
      blogUrl: newBlog.blogUrl.toString(),
      title: newBlog.title.toString(),
      userId: user.id
    })
    res.json(blog)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
    try {
      const user = await User.findByPk(req.decodedToken.id)
      const blog = await Blog.findByPk(req.params.id)
      if (blog && user && blog.userId === user.id) {
        blog.destroy()
        res.status(204).end()
      } else {
        return res.status(401).json({
          error: 'blog not found or you are not the owner of the blog'
        })
      }
    } catch(error) {
      next(error)
    }
})

router.put('/:id', async (req, res, next) => {

  try {
    isInt(req.body.likes)
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      blog.likes = req.body.likes;
      blog.save()
      res.json(blog)
    } else {
      res.status(404).end()
    }
  } catch(error) {
    next(error)
  }
})

module.exports = router
