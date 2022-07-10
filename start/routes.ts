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

    // Get vehicles from logged in user Route
    Route.group(() => {
      Route.get('/data', 'VehiclesController.user').middleware('auth').as('index')
    })
      .prefix('user')
      .as('user')

    // Get/Add/Remove favorites fom logged in user
    Route.group(() => {
      Route.get('/data', 'FavoritesController.index').middleware('auth').as('index')
      Route.post('/', 'FavoritesController.store').middleware('auth').as('store')
      Route.delete('/:id', 'FavoritesController.destroy').middleware('auth').as('destroy')
    })
      .prefix('favorites')
      .as('favorites')
  })
    .prefix('vehicles')
    .as('vehicles')
})
  .prefix('api')
  .as('api')
