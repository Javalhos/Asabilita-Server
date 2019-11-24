'use strict'

/** @type {typeof import('../../Models/Rental')} */
const Rental = use('App/Models/Rental')

class RentalController {
  async index () {

  }

  async show () {

  }

  async store ({  }) {

  }

  async reserve ({ request, response, auth }) {
    const rentalData = request.only([
      'vehicle_id',
      'details',
      'start',
      'end'
    ])

    const user = auth.user

    rentalData = {
      ...rentalData,
      creator_id: user.id,
      user_id: user.id,
      status: 'EM_RESERVA',
      reserved: true,
    }

    try {
      const rental = await Rental.create(rentalData)

      return response.send(rental)
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }
}

module.exports = RentalController
