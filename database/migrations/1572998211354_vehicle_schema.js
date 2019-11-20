'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VehicleSchema extends Schema {
  up () {
    this.create('vehicles', (table) => {
      table.string('id').primary()
      table.string('brand')
      table.string('model')
      table.integer('year')
      table.integer('mileage')
      table.float('price')
      table.enum('status', [
        'DISPONIVEL',
        'INDISPONIVEL',
        'INDISPONIVEL_ALUGADO',
        'INDISPONIVEL_MANUTENCAO',
        'VENDIDO',
      ])
      table.date('sold_at')
      table.timestamps()
    })
  }

  down () {
    this.drop('vehicles')
  }
}

module.exports = VehicleSchema
