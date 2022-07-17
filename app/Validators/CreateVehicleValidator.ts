import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateVehicleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.maxLength(25)]),
    brand: schema.string({}, [rules.maxLength(25)]),
    description: schema.string({}, [rules.maxLength(255)]),
    plate: schema.string([rules.regex(/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/)]),
    year: schema.number([rules.range(2000, new Date().getFullYear() + 1)]),
    color: schema.string(),
    price: schema.number(),
  })

  public messages = {
    'name.maxLength': 'Title must have less than 25 characters',
    'brand.maxLength': 'Title must have less than 25 characters',
    'description.maxLength': 'Title must have less than 255 characters',
    'plate.regex': 'Plate is not following Brazilian Legislation',
    'year.range': `Year must be between 2000 and ${new Date().getFullYear() + 1}`,
  }
}
