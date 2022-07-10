import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('auth/register', 'AuthController.register').as('register')
  Route.post('auth/login', 'AuthController.login').as('login')

  Route.group(() => {
    //Vehicle Routes
    Route.get('/', 'VehiclesController.index').as('index')
    Route.get('/:id', 'VehiclesController.show').as('show')
    Route.post('/', 'VehiclesController.store').middleware('auth').as('store')
    Route.patch('/:id', 'VehiclesController.update').middleware('auth').as('update')
    Route.delete('/:id', 'VehiclesController.destroy').middleware('auth').as('destroy')

    // Get vehicles from logged in user route
    Route.group(() => {
      Route.get('/data', 'VehiclesController.user').middleware('auth').as('index')
    })
      .prefix('user')
      .as('user')
  })
    .prefix('vehicles')
    .as('vehicles')
})
  .prefix('api')
  .as('api')
