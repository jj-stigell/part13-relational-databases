const router = require("express").Router()
const { Blog } = require('../models')
const { isInt } = require('../util/helper')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res, next) => {

  try {
    const newBlog = req.body;
    if (!newBlog.author || !newBlog.blogUrl || !newBlog.title) {
      throw new Error('Missing required values!')
    }
    const blog = Blog.build({ author: newBlog.author.toString(), blogUrl: newBlog.blogUrl.toString(), title: newBlog.title.toString() })
    blog.save()
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

router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
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
