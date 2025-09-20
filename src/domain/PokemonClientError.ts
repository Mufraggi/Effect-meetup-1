import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { PokedexId } from "./PokemonType.js"

export class PokemonApiTimeOutError extends Schema.TaggedError<PokemonApiTimeOutError>()(
  "PokemonApiTimeOutError",
  { id: PokedexId },
  HttpApiSchema.annotations({ status: 500 })
) {}

export class PokemonApiError extends Schema.TaggedError<PokemonApiError>()(
  "PokemonApiError",
  { id: PokedexId },
  HttpApiSchema.annotations({ status: 500 })
) {}

export class PokemonApiParseError extends Schema.TaggedError<PokemonApiParseError>()(
  "PokemonApiParseError",
  { id: PokedexId },
  HttpApiSchema.annotations({ status: 500 })
) {}
