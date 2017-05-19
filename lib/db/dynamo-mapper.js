import { marshalItem, unmarshalItem } from 'dynamodb-marshaler'

const itemToObject = (item) => {
  try {
    const obj = typeof item !== 'undefined' ? unmarshalItem(item) : {}

    return obj
  } catch (err) {
    logger.error({
      class: 'DynamoMapper',
      method: 'itemToObject',
      msg: err,
      item,
    })

    return {}
  }
}
const objectToItem = item => marshalItem(item)

export {
  objectToItem,
  itemToObject,
}
