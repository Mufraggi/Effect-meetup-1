import { HttpApi, OpenApi } from "@effect/platform"

import { HealthGroup } from "./http/health/HttpApiGroup.js"
import { HttpApiGroupPokemon } from "./http/pokemon/PokemonApiContract.js"

export class Api extends HttpApi.make("api")
  .add(HealthGroup)
  .add(HttpApiGroupPokemon)
  .annotate(OpenApi.Title, "Groups API")
{
}

export type ApiType = typeof Api
