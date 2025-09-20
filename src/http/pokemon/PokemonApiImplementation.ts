import { HttpApiBuilder } from "@effect/platform"
import { Effect, Layer } from "effect"
import type { ApiType } from "../../Api.js"
import { PokemonService } from "../../services/PokemonService.js"

export const HttpApiGroupAuthLive = (api: ApiType) =>
  HttpApiBuilder.group(api, "@Group/Pokemon", (handlers) => {
    return Effect.gen(function*() {
      const service = yield* PokemonService

      return handlers
        .handle("sync", ({ payload }) => service.syncPokemon(payload.id))
    })
  }).pipe(Layer.provide([PokemonService.Default]))
