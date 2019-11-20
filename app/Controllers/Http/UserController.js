'use strict'

/** @type {typeof import('../../Models/Profile')} */
const Profile = use('App/Models/Profile')

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')

class UserController {
  async index ({ request, response }) {
    let { p: page, l: limit } = request.get()

    if (!page || isNaN(page) || page < 1)
      page = 1
    if (limit)
      limit = Math.min(200, Math.max(10, limit))

    const users = await User.query().paginate(page, limit)

    return response.send(users)
  }

  async show ({ response, params }) {
    const user = await User.query()
      .with('profile')
      .with('driver')
      .where('id', params.id)
      .first()
    
    if (!user)
      return response.status(404).send({ message: 'User not found' })

    return response.send(user)
  }

  async store ({ request, response, auth }) {
    const userData = request.only([
      'id',
      'email',
      'password',
    ])
    const profileData = request.only([
      'id',
      'firstname',
      'lastname',
      'mobile',
      'telephone',
      'address',
      'address2',
    ])
    const driverData = request.only([
      'id',
      'cnh',
    ])

    try {
      const user = await User.create(userData)
      if (!user)
        return response.status(500).send({ message: 'Internal Server Error' })
      
      await user.profile().create(profileData)
      await user.driver().create(driverData)

      return response.send(user)
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }  
  }

  async update ({ request, response, params }) {
    const data = request.only([
      'id',
      'email'
    ])
    
    try {
      /** @type {import('../../Models/User')} */
      const user = await User.query()
        .where('id', params.id)
        .fetch()

      user.merge(data)

      await user.save()
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async destroy ({ response, params }) {
    try {
      const user = await User.find(params.id)

      if (!user)
        return response.status(404).send({ success: false, message: 'Resource Not Found' })

      await user.delete()
      return response.send({ success: true, message: 'Resource Successfully Deleted' })
    } catch (e) {
      return response.status(500).send({ success: false, message: 'Internal Server Error' })
    }
  }
}

module.exports = UserController
