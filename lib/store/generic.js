import uuid from 'node-uuid'
import { clone } from 'lodash'

export default class GenericStore {
  constructor(db, keyName) {
    this.keyName = keyName
    this.db = db
  }

  _createKeyFromId(id) {
    const key = {}
    key[this.keyName] = id

    return key
  }

  _hasKeySet(item) {
    return typeof item[this.keyName] !== 'undefined'
  }

  static _buildCondition(obj) {
    return Object.keys(obj)
      .map(property => ({
        propertyName: property,
        propertyValue: obj[property],
      }),
    ).shift()
  }

  async get(id) {
    return await this.db.get(this._createKeyFromId(id))
  }

  async multiGet(ids) {
    return await this.db.multiGet(ids.map(id => this._createKeyFromId(id)))
  }

  async remove(id) {
    return await this.db.delete(this._createKeyFromId(id))
  }

  async create(item) {
    const newItem = clone(item)
    if (!this._hasKeySet(item)) {
      newItem[this.keyName] = uuid.v4()
    }
    return await this.save(newItem)
  }

  async save(item) {
    return await this.db.put(item)
  }
}
