import { Model } from "@effect/sql"
import { Schema } from "effect"
import {
  CatchRate,
  Category,
  Generation,
  Height,
  PokedexId,
  PokemonId,
  PokemonName,
  PokemonSprites,
  PokemonStats,
  PokemonType,
  Timestamp,
  Weight
} from "../domain/PokemonType.js"

export class PokemonModel extends Model.Class<PokemonModel>("PokemonModel")({
  id: Model.Generated(PokemonId),
  pokedexId: PokedexId,
  generation: Generation,
  category: Category,
  name: PokemonName,
  sprites: PokemonSprites,
  types: Schema.Array(PokemonType),
  stats: PokemonStats,
  height: Height,
  weight: Weight,
  catchRate: CatchRate,
  createdAt: Model.Generated(Timestamp),
  updatedAt: Model.Generated(Timestamp)
}) {}

export class PokemonCreateModel extends Model.Class<PokemonCreateModel>("PokemonCreateModel")({
  pokedexId: PokedexId,
  generation: Generation,
  category: Category,
  name: PokemonName,
  sprites: PokemonSprites,
  types: Schema.Array(PokemonType),
  stats: PokemonStats,
  height: Height,
  weight: Weight,
  catchRate: CatchRate
}) {}
