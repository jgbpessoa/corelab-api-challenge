import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('auth/register', 'AuthController.register').as('register')
  Route.post('auth/login', 'AuthController.login').as('login')
})
  .prefix('api')
  .as('api')
