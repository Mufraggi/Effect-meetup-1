import { HttpApiSchema } from "@effect/platform"
import { Schema } from "effect"
import { PokedexId } from "./PokemonType.js"

export class PokemonNotFound extends Schema.TaggedError<PokemonNotFound>()(
  "PokemonNotFound",
  { id: PokedexId },
  HttpApiSchema.annotations({ status: 404 })
) {}
export class PokemonParseError extends Schema.TaggedError<PokemonParseError>()(
  "PokemonParseError",
  { id: PokedexId },
  HttpApiSchema.annotations({ status: 500 })
) {}
