import { Model } from "@effect/sql"
import { Schema } from "effect"

const PokemonId = Schema.UUID.pipe(Schema.brand("PokemonId"))
type PokemonId = Schema.Schema.Type<typeof PokemonId>

const PokemonName = Schema.Struct({
  fr: Schema.String,
  en: Schema.String,
  jp: Schema.String
})

const PokemonSprites = Schema.Struct({
  regular: Schema.String,
  shiny: Schema.String
})

const PokemonType = Schema.Struct({
  name: Schema.String,
  image: Schema.String
})

const PokemonStats = Schema.Struct({
  hp: Schema.Number,
  atk: Schema.Number,
  def: Schema.Number,
  spe_atk: Schema.Number,
  spe_def: Schema.Number,
  vit: Schema.Number
})

const Timestamp = Schema.DateFromSelf

export class PokemonModel extends Model.Class<PokemonModel>("PokemonModel")({
  id: Model.Generated(PokemonId),
  pokedexId: Schema.Number,
  generation: Schema.Number,
  category: Schema.String,
  name: PokemonName,
  sprites: PokemonSprites,
  types: Schema.Array(PokemonType),
  stats: PokemonStats,
  height: Schema.String,
  weight: Schema.String,
  catchRate: Schema.Number,
  createdAt: Model.Generated(Timestamp),
  updatedAt: Model.Generated(Timestamp)
}) {}
