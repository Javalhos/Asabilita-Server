'use strict'

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')

class AuthController {

  async signin ({ request, response, auth }) {
    const { email, password } = request.only(['email', 'password'])

    try {

      const tokens = await auth.attempt(email, password)

      return response.send({
        tokens
      })
    } catch (e) {
      console.error(e)
      return response.status(401).send('Unauthorized')
    }
  }

  async signup ({ request, response, auth }) {
    const userData = request.only([
      'id',
      'email',
      'password',
    ])

    const profileData = request.only([
      'id',
      'email',
      'firstname',
      'lastname',
      'telephone',
      'mobile',
      'address',
      'address2',
    ])

    const driverData = request.only([
      'id',
      'cnh'
    ])

    try {
      const user = await User.create(userData)
      
      if (!user)
        throw Error('User was not created!')

      await user.profile().create(profileData)

      if (driverData.cnh)
        await user.driver().findOrCreate(driverData)

      const tokens = await auth.generate(user)

      return response.send({
        user,
        tokens
      })
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }
}

module.exports = AuthController
