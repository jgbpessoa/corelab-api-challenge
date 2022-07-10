import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/RegisterValidator'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    const validatedData = await request.validate(RegisterValidator)

    const user = await User.create(validatedData)

    const token = await await auth.login(user)

    return response.ok({ message: 'User successfully registered', data: { token, user } })
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.all()

    try {
      const token = await auth.attempt(email, password)
      const user = auth.user?.$attributes

      return response.ok({ message: 'User successfully logged in', data: { token, user } })
    } catch (error) {
      return response.badRequest({ message: "We couldn't verify your credentials" })
    }
  }
}
