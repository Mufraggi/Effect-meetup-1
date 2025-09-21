import { Schema } from "effect"
import {
  Attack,
  CatchRate,
  Category,
  Defense,
  Generation,
  Height,
  HP,
  NameEn,
  NameFr,
  NameJp,
  PokedexId,
  PokemonId,
  SpecialAttack,
  SpecialDefense,
  Speed,
  SpriteUrl,
  Timestamp,
  TypeId,
  TypeImageUrl,
  TypeName,
  Weight
} from "./PokemonType.js"

export const PokemonOutput = Schema.Struct({
  id: PokemonId,
  pokedexId: PokedexId,
  generation: Generation,
  category: Category,
  nameFr: NameFr,
  nameEn: NameEn,
  nameJp: NameJp,
  spriteRegular: SpriteUrl,
  spriteShiny: SpriteUrl,
  statHp: HP,
  statAtk: Attack,
  statDef: Defense,
  statSpeAtk: SpecialAttack,
  statSpeDef: SpecialDefense,
  statVit: Speed,
  height: Height,
  weight: Weight,
  catchRate: CatchRate,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  types: Schema.Array(Schema.Struct({ id: TypeId, name: TypeName, imageUrl: TypeImageUrl }))
})
export type PokemonOutput = Schema.Schema.Type<typeof PokemonOutput>
