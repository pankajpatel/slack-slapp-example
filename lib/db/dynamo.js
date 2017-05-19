import AWS from 'aws-sdk'
import { clone } from 'lodash'
import DynamoQueryBuilder from './dynamo-query-builder'
import { itemToObject } from './dynamo-mapper'
import { Agent as HttpsAgent } from 'https'

const httpAgent = new HttpsAgent({
  keepAlive: true,
  maxSockets: 1024,
  keepAliveMsecs: 5000,
})

const dynamoDB = new AWS.DynamoDB({
  region: 'eu-central-1',
  httpOptions: {
    agent: httpAgent,
  },
})

class DynamoDB {
  constructor(tableName, dynamoDB = dynamoDB) {
    this.tableName = tableName
    this.dynamoDB = dynamoDB
    this.queryBuilder = new DynamoQueryBuilder(tableName)
  }

  async get(key) {
    try {
      const query = this.queryBuilder.withKey(key).build()
      const resp = await this.dynamoDB.getItem(query)

      return itemToObject(resp.Item)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async getAll(index) {
    try {
      const resp = await this.dynamoDB.scan({
        TableName: this.tableName,
        IndexName: index,
      })

      return resp.Items.map(item => itemToObject(item))
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async multiGet(keys) {
    try {
      const query = this.queryBuilder.withMultiKeys(keys).build()
      const resp = await this.dynamoDB.batchGetItem(query)

      return resp.Responses[this.tableName].map(item => itemToObject(item))
    } catch (err) {
      console.log(err)
      return []
    }
  }

  async query(index, conditions = [], filter = null) {
    this.queryBuilder
      .withIndex(index)
    conditions.forEach(condition => this.queryBuilder.withCondition(
      condition.propertyName,
      condition.propertyValue,
      condition.comparisonOperator,
      condition.logicalOperator),
    )
    if (filter !== null && typeof filter === 'object') {
      this.queryBuilder.withFilter(
        filter.propertyName,
        filter.propertyValue ? filter.propertyValue : null,
        filter.modifier ? filter.modifier : '',
        filter.comparisonOperator ? filter.comparisonOperator : '=',
        filter.logicalOperator ? filter.logicalOperator : 'AND',
      )
    }

    const query = this.queryBuilder.build()
    try {
      const resp = await this.dynamoDB.query(query)
      return resp.Items.map(itemToObject)
    } catch (err) {
      console.log(err)
      return []
    }
  }

  async put(item) {
    try {
      const query = this.queryBuilder.withItem(item).build()
      await this.dynamoDB.putItem(query)
      return item
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async delete(key) {
    try {
      const query = this.queryBuilder.withKey(key).build()
      return await this.dynamoDB.deleteItem(query)
    } catch (err) {
      console.log(err)
      return null
    }
  }
}

export default DynamoDB
