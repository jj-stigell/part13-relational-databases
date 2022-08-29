const router = require("express").Router()
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const newBlog = req.body;
  const blog = Blog.build({ author: newBlog.author, blogUrl: newBlog.blogUrl, title: newBlog.title })
  blog.save()
  res.json(blog)
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

module.exports = router
