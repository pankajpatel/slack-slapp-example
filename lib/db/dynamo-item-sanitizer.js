const sanitizeItem = (obj) => {
  const sanitizeValue = (value) => {
    if (value === '') {
      return null
    }

    return value
  }
  // don't convert arrays to objects
  const sanitizedItem = Array.isArray(obj) ? [] : {}

  Object.keys(obj).forEach((property) => {
    // trigger recursive for objects
    if (obj[property] !== null && typeof obj[property] === 'object') {
      sanitizedItem[property] = sanitizeItem(obj[property])
    } else {
      sanitizedItem[property] = sanitizeValue(obj[property])
    }
  })

  return sanitizedItem
}

export default sanitizeItem
