import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'vehicles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.string('name').notNullable()
      table.string('brand').notNullable()
      table.text('description').notNullable()
      table.string('plate').notNullable()
      table.integer('year').notNullable()
      table.string('color').notNullable()
      table.integer('price').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
