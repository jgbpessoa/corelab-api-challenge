import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateVehicleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.maxLength(255)]),
    brand: schema.string(),
    description: schema.string(),
    plate: schema.string([rules.regex(/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/)]),
    year: schema.number([rules.range(2000, new Date().getFullYear() + 1)]),
    color: schema.string(),
    price: schema.number(),
  })

  public messages = {}
}
