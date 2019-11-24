'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  // Auth
  Route.post('signin', 'AuthController.signin')
  Route.post('signup', 'AuthController.signup')

  Route.resource('vehicle', 'VehicleController').only(['index', 'show'])
  Route.resource('user', 'UserController').only(['index', 'show', 'store', 'update', 'destroy'])
  Route.post('reserve', 'RentalController.reserve').middleware('auth')
}).prefix('api/v1')
