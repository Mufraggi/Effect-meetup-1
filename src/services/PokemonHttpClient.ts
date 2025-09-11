import { FetchHttpClient, HttpClient } from "@effect/platform"
import { Effect, pipe, Schema } from "effect"
import { PokemonSchema } from "../domain/PokemonApiResponse.js"
import { ConfigService } from "../utils/Config.js"

export class PokemonHttpClient extends Effect.Service<PokemonHttpClient>()("PokemonHttpClient", {
  effect: Effect.gen(function*() {
    const httpClient = yield* HttpClient.HttpClient
    const config = yield* ConfigService
    const getPokemonById = (id: number) =>
      pipe(
        config.getPokemonUrl(),
        Effect.tap((x) => console.log(x)),
        Effect.flatMap((baseUrl) => httpClient.get(`${baseUrl}api/v1/pokemon/${id.toString()}`)),
        Effect.tap((x) => console.log(x)),
        Effect.flatMap((response) =>
          pipe(
            response.json,
            Effect.flatMap((jsonData) => Schema.decodeUnknown(PokemonSchema)(jsonData))
          )
        )
      )
    return { getPokemonById }
  }),
  dependencies: [FetchHttpClient.layer, ConfigService.Default]
}) {}
