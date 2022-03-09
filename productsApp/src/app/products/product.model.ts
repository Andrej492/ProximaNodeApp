export interface Product{
  id: string,
  name: string,
  price: number,
  available: boolean,
  dateCreated?: Date,
  dateUpdated?: Date,
  edited?: boolean
}
