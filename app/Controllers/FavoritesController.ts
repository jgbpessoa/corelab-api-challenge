import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vehicle from 'App/Models/Vehicle'

export default class FavoritesController {
  public async store({ request, response, auth }: HttpContextContract) {
    const id = request.input('id')
    const vehicle = await Vehicle.query().where('id', id).preload('user').firstOrFail()
    await auth.user?.related('favorites').attach([vehicle.id])
    return response.created({ message: 'Vehicle listing set as favorite', data: vehicle })
  }

  public async index({ response, auth }: HttpContextContract) {
    const favorites = await auth.user?.related('favorites').query()

    return response.ok({ data: favorites })
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const vehicle = await Vehicle.findOrFail(params.id)

    await auth.user?.related('favorites').detach([vehicle.id])

    return response.noContent()
  }
}
