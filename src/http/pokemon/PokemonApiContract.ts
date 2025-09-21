import { HttpApiEndpoint, HttpApiError, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"
import { PokemonApiError, PokemonApiParseError, PokemonApiTimeOutError } from "../../domain/PokemonClientError.js"
import { PokemonNotFound, PokemonParseError } from "../../domain/PokemonError.js"
import { PokemonOutput } from "../../domain/PokemonOutput.js"
import { PokedexId } from "../../domain/PokemonType.js"

export class HttpApiGroupPokemon extends HttpApiGroup.make("@Group/Pokemon")
  .add(
    HttpApiEndpoint.post("sync", "/")
      .setPayload(Schema.Struct({ id: PokedexId }))
      .addSuccess(Schema.Struct({ id: PokedexId }))
      .addError(HttpApiError.InternalServerError)
      .addError(PokemonApiParseError)
      .addError(PokemonApiError)
      .addError(PokemonApiTimeOutError)
      .addError(PokemonParseError)
  ).add(
    HttpApiEndpoint.get("getByPokedexId", "/:id")
      .setPath(Schema.Struct({ id: Schema.compose(Schema.NumberFromString, PokedexId) }))
      .addSuccess(PokemonOutput)
      .addError(HttpApiError.InternalServerError)
      .addError(PokemonNotFound)
  )
  .prefix("/pokemon")
{}
