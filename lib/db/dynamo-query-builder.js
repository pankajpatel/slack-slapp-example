import { clone } from 'lodash'
import { objectToItem } from './dynamo-mapper'
import sanitizeObject from './dynamo-item-sanitizer'

class DynamoQueryBuilder {

  constructor(tableName) {
    this.tableName = tableName
    this.reset()
    return this
  }

  reset() {
    this.queryObject = {}
  }

  withKey(key) {
    this.queryObject.Key = objectToItem(key)

    return this
  }

  withMultiKeys(keys) {
    const idKeysMap = keys.map(key => objectToItem(key))
    this.queryObject.RequestItems = {}
    this.queryObject.RequestItems[this.tableName] = { Keys: idKeysMap }

    return this
  }

  withItem(item) {
    this.queryObject.Item = objectToItem(sanitizeObject(item))

    return this
  }

  withIndex(index) {
    this.queryObject.IndexName = index

    return this
  }
  static createConditionExpression(propertyName, comparisonOperator) {
    return `${propertyName} ${comparisonOperator} :${propertyName}`
  }

  withCondition(propertyName, propertyValue, comparisonOperator = '=', logicalOperator = 'AND') {
    const conditionExpression = DynamoQueryBuilder
      .createConditionExpression(propertyName, comparisonOperator)

    if (typeof this.queryObject.KeyConditionExpression === 'undefined') {
      this.queryObject.KeyConditionExpression = conditionExpression
    } else {
      this.queryObject.KeyConditionExpression = [
        this.queryObject.KeyConditionExpression,
        logicalOperator,
        conditionExpression,
      ].join(' ')
    }

    this._assignExpressionAttributeValue(propertyName, propertyValue)

    return this
  }

  withFilter(propertyName, propertyValue, modifier = '', comparisonOperator = '=', logicalOperator = 'AND') {
    this.queryObject.FilterExpression = [
      modifier,
      `attribute_exists(${propertyName})`,
    ].join(' ').trim()

    if (propertyValue) {
      this.queryObject.FilterExpression = [
        this.queryObject.FilterExpression,
        logicalOperator,
        DynamoQueryBuilder.createConditionExpression(propertyName, comparisonOperator),
      ].join(' ')

      this._assignExpressionAttributeValue(propertyName, propertyValue)
    }

    return this
  }

  build() {
    const shouldHaveTableName =
      !Object.keys(this.queryObject).includes('RequestItems')

    if (shouldHaveTableName) {
      this.queryObject.TableName = this.tableName
    }

    const queryObject = clone(this.queryObject)
    this.reset()

    return queryObject
  }

  _assignExpressionAttributeValue(propertyName, propertyValue) {
    if (typeof this.queryObject.ExpressionAttributeValues === 'undefined') {
      this.queryObject.ExpressionAttributeValues = {}
    }
    const typeOfValue = (typeof propertyValue)
    let valueType

    switch (typeOfValue) {
      case 'boolean':
        valueType = 'BOOL'
        break
      default:
        valueType = typeOfValue.charAt(0).toUpperCase()
        break
    }

    this.queryObject.ExpressionAttributeValues[`:${propertyName}`] = {}
    this.queryObject.ExpressionAttributeValues[`:${propertyName}`][valueType] = propertyValue.toString()
  }
}

export default DynamoQueryBuilder
