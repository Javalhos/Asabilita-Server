'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RentalVehicleSchema extends Schema {
  up () {
    this.create('rental_vehicles', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('rental_vehicles')
  }
}

module.exports = RentalVehicleSchema
