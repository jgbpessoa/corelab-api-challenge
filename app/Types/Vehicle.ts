import { DateTime } from 'luxon'

export interface IntVehicle {
  id: number
  userId: number
  name: string
  brand: string
  description: string
  plate: string
  year: number
  color: string
  price: number
  createdAt: DateTime
  [otherProperties: string]: any
}
