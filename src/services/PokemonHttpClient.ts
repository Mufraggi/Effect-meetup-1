import { FetchHttpClient, HttpClient } from "@effect/platform"
import { Effect, Match, pipe, Schedule, Schema } from "effect"
import { PokemonSchema } from "../domain/PokemonApiResponse.js"
import { PokemonApiError, PokemonApiParseError, PokemonApiTimeOutError } from "../domain/PokemonClientError.js"
import type { PokedexId } from "../domain/PokemonType.js"
import { ConfigService } from "../utils/Config.js"

export class PokemonHttpClient extends Effect.Service<PokemonHttpClient>()("PokemonHttpClient", {
  effect: Effect.gen(function*() {
    const httpClient = yield* HttpClient.HttpClient
    const config = yield* ConfigService
    const baseUrl = yield* config.getPokemonUrl()

    const getPokemonById = (
      id: PokedexId
    ) =>
      pipe(
        httpClient.get(`${baseUrl}api/v1/pokemon/${id.toString()}`).pipe(
          Effect.andThen((response) => response.json),
          Effect.timeout("1 second"),
          Effect.retry({
            schedule: Schedule.exponential(1000),
            times: 3
          }),
          Effect.withSpan("getPokemonById", { attributes: { id } })
        ),
        Effect.tap((x) => console.log(x)),
        Effect.flatMap((jsonData) => Schema.decodeUnknown(PokemonSchema)(jsonData)),
        Effect.mapError((_e) =>
          Match.type<typeof _e>().pipe(
            Match.tag("TimeoutException", () => new PokemonApiTimeOutError({ id })),
            Match.tag("RequestError", "ResponseError", () => new PokemonApiError({ id })),
            Match.tag("ParseError", (e) => {
              console.log(e)
              return new PokemonApiParseError({ id })
            }),
            Match.exhaustive
          )(_e)
        )
      )
    return { getPokemonById }
  }),
  dependencies: [FetchHttpClient.layer, ConfigService.Default]
}) {}
