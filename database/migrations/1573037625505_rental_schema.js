'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RentalSchema extends Schema {
  up () {
    this.create('rentals', (table) => {
      table.increments()
      table.string('user_id')
      table.string('creator_id')
      table.string('vehicle_id')
      table.enum('status', [
        'EM_VIGOR',
        'FINALIZADO',
        'EM_RESERVA',
        'RESERVA_CANCELADA',
      ])
      table.boolean('reserved')
      table.text('details')
      table.datetime('start')
      table.datetime('end')
      table.timestamps()
    })
  }

  down () {
    this.drop('rentals')
  }
}

module.exports = RentalSchema
