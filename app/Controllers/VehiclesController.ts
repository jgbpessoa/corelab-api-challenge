import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateVehicleValidator from 'App/Validators/CreateVehicleValidator'
import UpdateVehicleValidator from 'App/Validators/UpdateVehicleValidator'
import { IntVehicle } from 'App/Types/Vehicle'
import Vehicle from 'App/Models/Vehicle'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import Database from '@ioc:Adonis/Lucid/Database'

export default class VehiclesController {
  // Create Vehicle
  public async store({ request, response, auth }: HttpContextContract) {
    const validatedData = await request.validate(CreateVehicleValidator)

    const vehicle: IntVehicle = await auth.user?.related('vehicles').create(validatedData)!

    await vehicle?.load('user')

    return response.created({ vehicle })
  }

  // Get the list of vehicles
  public async index({ request, response }: HttpContextContract) {
    // Pagination parameters
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)

    // Search terms
    const search = request.input('search')
    let searchTerms

    if (search) {
      searchTerms = search.trim().split(/\s+/)
    }

    // Filter parameters
    const maxPrice = request.input('max_price')
    const minPrice = request.input('min_price')
    const brand = request.input('brand')
    const color = request.input('color')
    const year = request.input('year')

    // If we pass a property we can get all unique values for it
    const property = request.input('property')
    if (property) {
      const allProperties = await Database.from('vehicles').select(property)
      let uniqueProperties = []

      allProperties.forEach((item) => {
        if (!uniqueProperties.includes(item[property] as never)) {
          uniqueProperties.push(item[property] as never)
        }
      })

      return response.ok({ data: uniqueProperties })
    }

    // Query vehicles according to filter and/or search
    const vehicles: IntVehicle[] = await Vehicle.query()
      .if(maxPrice, (query) => {
        query.where('price', '<=', maxPrice)
      })
      .if(minPrice, (query) => {
        query.where('price', '>=', minPrice)
      })
      .if(brand, (query) => {
        query.where('brand', '=', brand)
      })
      .if(color, (query) => {
        query.where('color', '=', color)
      })
      .if(year, (query) => {
        query.where('year', '=', year)
      })
      .if(searchTerms, (query) => {
        query.where((query) => {
          searchTerms.forEach((searchTerm) => {
            query
              .orWhereILike('name', `%${searchTerm}%`)
              .orWhereILike('plate', `%${searchTerm}%`)
              .orWhereILike('brand', `%${searchTerm}%`)
              .orWhereILike('description', `%${searchTerm}%`)
              .orWhereILike('year', `%${searchTerm}%`)
              .orWhereILike('price', `%${searchTerm}%`)
              .orWhereILike('color', `%${searchTerm}%`)
          })
        })
      })
      .preload('user')
      .paginate(page, perPage)

    return response.ok({ vehicles })
  }

  // Show specific Vehicle
  public async show({ params, response }: HttpContextContract) {
    const vehicle: IntVehicle = await Vehicle.query()
      .where('id', params.id)
      .preload('user')
      .firstOrFail()

    return response.ok({ data: vehicle })
  }

  // Show vehicles of a specific User
  public async user({ response, auth }: HttpContextContract) {
    if (auth.user?.id) {
      const vehicles: IntVehicle[] = await Vehicle.query().where('user_id', auth.user?.id)
      return response.ok({ data: vehicles })
    }
  }

  // Edit Vehicle info
  public async update({ params, request, response, auth }: HttpContextContract) {
    const vehicle: IntVehicle = await Vehicle.findOrFail(params.id)

    const validatedData = await request.validate(UpdateVehicleValidator)

    if (auth.user?.id !== vehicle.userId) {
      throw new UnauthorizedException('You can only edit your own vehicle listing')
    }

    vehicle.merge(validatedData)

    await vehicle.save()

    await vehicle.load('user')

    return response.ok({ data: vehicle })
  }

  // Delete Vehicle
  public async destroy({ params, response, auth }: HttpContextContract) {
    const vehicle: IntVehicle = await Vehicle.findOrFail(params.id)

    if (auth.user?.id !== vehicle.userId) {
      throw new UnauthorizedException('You can only delete your own vehicle listing')
    }

    await vehicle.delete()

    return response.noContent()
  }
}
