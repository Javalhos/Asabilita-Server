'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProfileSchema extends Schema {
  up () {
    this.create('profiles', (table) => {
      table.string('id')
      table.string('firstname')
      table.string('lastname')
      table.string('address')
      table.string('address2')
      table.string('email')
      table.string('telephone')
      table.string('mobile')
      table.timestamps()
    })
  }

  down () {
    this.drop('profiles')
  }
}

module.exports = ProfileSchema
