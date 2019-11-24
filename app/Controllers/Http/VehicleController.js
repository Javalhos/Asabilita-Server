'use strict'

/** @type {typeof import('../../Models/Vehicle')} */
const Vehicle = use('App/Models/Vehicle')

class VehicleController {
  async index ({ request, response, auth }) {
    let { p: page, l: limit } = request.get()

    if (!page || isNaN(page) || page < 1)
      page = 1
    if (limit)
      limit = Math.min(200, Math.max(10, limit))

    let user = null
    try {
      user = await auth.getUser()
    } catch (e) {
      console.error(e)
      user = null
    }

    try {      
      const vqb = Vehicle.query()
      if (user) {
        // if (!user.can())
        vqb.where('status', 'DISPONIVEL')
      } else {
        vqb.where('status', 'DISPONIVEL')
      }
      const vehicles = await vqb.paginate(page, limit)

      return response.send(vehicles)
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async show ({ params, response, auth }) {
    let user

    try {
      user = await auth.getUser
    } catch (e) {
      console.error(e)
    }

    try {

      const vqb = Vehicle.query()

      if (user) {
        // if (!user.can())
        vqb.where('status', 'DISPONIVEL')
      } else {
        vqb.where('status', 'DISPONIVEL')
      }
      const vehicle = await vqb.where('id', params.id)
        .first()

      return response.send(vehicle)
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async store ({ request, response }) {
    const vehicleData = request.only([
      'id',
      'brand',
      'model',
      'year',
      'mileage',
      'price',
      'status',
    ])

    try {
      const vehicle = await Vehicle.create(vehicleData)

      if (!vehicle)
        throw Error('Failed to create Vehicle')
      
      return response.send(vehicle)
    } catch (e) {
      console.log(e, e.message)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async update ({ request, response, params }) {
    
  }
}

module.exports = VehicleController
