import { List, Record, Set } from 'immutable'

export const PlantType: Record.Factory<PlantType> = Record({ name: '', plantType: 0, seedType: 0, readyToFarm: 0 })
export interface PlantType {
  name: string,
  plantType: number,
  seedType: number,
  readyToFarm: number
}

export class Plants {
  private constructor() { }

  static all = List<PlantType>([
    new PlantType({
      name: 'Wheat',
      plantType: 59,
      seedType: 295,
      readyToFarm: 7
    }),
    new PlantType({
      name: 'Carrot',
      plantType: 141,
      seedType: 391,
      readyToFarm: 7
    }),
    new PlantType({
      name: 'Potato',
      plantType: 142,
      seedType: 392,
      readyToFarm: 7
    }),
    new PlantType({
      name: 'Beetroot',
      plantType: 207,
      seedType: 435,
      readyToFarm: 3
    })
  ])

  static allTypes = Set(Plants.all.map(_ => _.plantType))
  static allSeeds = Set(Plants.all.map(_ => _.seedType))
}