export class Item {
  constructor(readonly rawItem: any) { }

  
}

export class ItemFactory {
  static of(rawItem: any): Item {
    return new Item(rawItem)
  }
}