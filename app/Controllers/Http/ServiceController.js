'use strict'

/** @type {typeof import('../../Models/Service') } */
const Service = use('App/Models/Service')

class ServiceController {
  async index ({ request, response, auth }) {
    let { p: page, l: limit } = request.get()

    if (!page || isNaN(page) || page < 1)
      page = 1
    if (limit)
      limit = Math.min(200, Math.max(10, limit))

    let user
    try {
      user = await auth.getUser()
    } catch (e) {
      console.error(e)
    }
    
    try {
      if (user) {
        // if (user.can())
        const allServices = Service.all()

        return response.send(await allServices.paginate(page, limit))
      }
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async show ({ response, params, auth }) {
    let user

    try {
      user = await auth.getUser()
    } catch (e) {
      console.error(e)
    }

    try {
      if (user) {
        // if (user.can())
        const service = Service.query()
        .where('id', params.id)
        .first()

        return response.send(service)
      }
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async store ({ request, response, auth }) {
    let user

    const serviceData = request.only([
      'name',
      'description',
      'price'
    ])

    try {
      user = await auth.getUser()
    } catch (e) {
      console.error(e)
    }

    try {
      // if (user.can())
      const service = await Service.create(serviceData)

      if (!service)
        throw Error('Failed to create Service')

      return response.send(service)
    } catch (e) {
      console.log(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async update ({ request, response, params }) {
    let user

    const serviceData = request.only([
      'name',
      'description',
      'price'
    ])

    try {
      // if (user.can()) {
        const service = await Service.query()
          .where('id', params.id)
          .fetch()

        if (!service)
          throw Error('Service not found')

        service.merge(serviceData)
        await service.save()

        return response.status(200).send({ message: 'Service updated' })
      // } else {
      //   throw Error('The user does not have permission to create a service')
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
        const service = await Service.find(params.id)

        if (!service)
          return response.status(404).send({ success: false, message: 'Service Not Found' })

        await service.delete()

        return response.status(200).send({ message: 'Service deleted' })
      // } else {
      //   throw Error('The user does not have permission to delete a service')
      // }
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }
}

module.exports = ServiceController
