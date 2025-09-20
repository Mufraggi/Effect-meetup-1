import { HttpApiEndpoint, HttpApiError, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"
import { PokemonApiError, PokemonApiParseError, PokemonApiTimeOutError } from "../../domain/PokemonClientError.js"
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
  ).prefix("/pokemon")
{}
