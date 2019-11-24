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
      user = await auth.getUser()
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

  async store ({ request, response, auth }) {
    let user

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
      user = await auth.getUser()
    } catch (e) {
      console.error(e)
    }

    try {
      // if (user.can())
        const vehicle = await Vehicle.create(vehicleData)
      // else
      //   throw Error('The user does not have permission to create a vehicle')

      if (!vehicle)
        throw Error('Failed to create Vehicle')
      
      return response.send(vehicle)
    } catch (e) {
      console.log(e, e.message)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async update ({ request, response, params }) {
    let user
    
    const vehicleData = request.only([
      'brand',
      'model',
      'year',
      'mileage',
      'price',
      'status'
    ])

    try {
      user = await auth.getUser()
    } catch (e) {
      console.error(e)
    }

    try {
      // if (user.can()) {
        const vehicle = await Vehicle.query()
          .where('id', params.id)
          .fetch()

        if (!vehicle)
          throw Error('Vehicle not found')

        vehicle.merge(vehicleData)
        await vehicle.save()

        return response.status(200).send({ message: 'Vehicle updated' })
      // } else {
      //   throw Error('The user does not have permission to create a vehicle')
      // }
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async destroy ({ response, params, auth }) {
    let user

    try {
      user = await auth.getUser()
    } catch (e) {
      console.error(e)
    }

    try {
      // if (user.can()) {
        const vehicle = await Vehicle.find(params.id)

        if (!vehicle)
          return response.status(404).send({ success: false, message: 'Vehicle Not Found' })

        await vehicle.delete()

        return response.status(200).send({ message: 'Vehicle deleted' })
      // } else {
      //   throw Error('The user does not have permission to delete a vehicle')
      // }
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }
}

module.exports = VehicleController
