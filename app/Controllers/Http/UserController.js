'use strict'

/** @type {typeof import('../../Models/User')} */
const User = use('App/Models/User')

class UserController {
  async index ({ request, response, auth }) {
    let user

    let { p: page, l: limit } = request.get()

    try {
      user = auth.getUser()
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
    
    // if (user.can()) {
      if (!page || isNaN(page) || page < 1)
        page = 1
      if (limit)
        limit = Math.min(200, Math.max(10, limit))

      const users = await User.query().paginate(page, limit)

      return response.send(users)
    // } else {
    //   throw Error('The user can not retrieve all users due to its permissions')
    // }
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
    let user

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
      user = auth.getUser()
    } catch (e) {
      console.error(e)
    }

    try {
      // if (user.can()) {
        const user = await User.create(userData)
        if (!user)
          return response.status(500).send({ message: 'Internal Server Error' })
        
        await user.profile().create(profileData)
        if (driverData.cnh)
          await user.driver().create(driverData)

        return response.send(user)
      // } else {
      //   throw Error('The user does not have permission to create another user')
      // }
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }  
  }

  async update ({ request, response, params, auth }) {
    let user

    const data = request.only([
      'id',
      'email'
    ])

    try {
      user = auth.getUser()
    } catch (e) {
      console.error(e)
    }
    
    try {
      // if (user.can()) {
        /** @type {import('../../Models/User')} */
        const user = await User.query()
          .where('id', params.id)
          .fetch()

        user.merge(data)

        await user.save()
      // } else {
      //   throw Error('The user does not have permission to update another user')
      // }
    } catch (e) {
      console.error(e)
      return response.status(500).send({ message: 'Internal Server Error' })
    }
  }

  async destroy ({ response, params, auth }) {
    let user

    try {
      user = auth.getUser()
    } catch (e) {
      console.error(e)
    }

    try {
      // if (user.can()) {
        const user = await User.find(params.id)

        if (!user)
          return response.status(404).send({ success: false, message: 'Resource Not Found' })

        await user.delete()
        await user.profile().delete()
        await user.driver().delete()
        return response.send({ success: true, message: 'Resource Successfully Deleted' })
      // } else {
      //   throw Error('The user does not have access to delete another user')
      // }
    } catch (e) {
      return response.status(500).send({ success: false, message: 'Internal Server Error' })
    }
  }
}

module.exports = UserController
