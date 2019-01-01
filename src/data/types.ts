export type MinecraftTypeId = number | [number, number]

export const Types: Record<string, MinecraftTypeId> = {

}

export type Plants = {
  'Pumpkin Lantern': MinecraftTypeId
}

let x: Plants

x["Pumpkin Lantern"]