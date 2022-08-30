const isInt = (value) => {
  if (!Number.isInteger(value)) {
    throw new Error('Parameter is not a integer!')
  }
}

module.exports = { isInt }
