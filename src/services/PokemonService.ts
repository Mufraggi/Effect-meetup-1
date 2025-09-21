import { SqlClient } from "@effect/sql"
import { Effect, Option, pipe, Schema } from "effect"
import { PokemonToModel } from "../domain/PokemonApiResponse.js"
import { PokemonNotFound, PokemonParseError } from "../domain/PokemonError.js"
import type { PokedexId } from "../domain/PokemonType.js"
import { TypeName } from "../domain/PokemonType.js"
import { PokemonRepository } from "../repositories/PokemonRepository.js"
import { PokemonTypeRelationRepository } from "../repositories/PokemonTypeRelationRepository.js"
import { PokemonTypesRepository } from "../repositories/PokemonTypesRepository.js"
import { PgLive } from "../utils/PgClient.js"
import { PokemonHttpClient } from "./PokemonHttpClient.js"

export class PokemonService extends Effect.Service<PokemonService>()("PokemonService", {
  effect: Effect.gen(function*() {
    const pokeClient = yield* PokemonHttpClient
    const pokeRepository = yield* PokemonRepository
    const pokemonTypesRepository = yield* PokemonTypesRepository
    const pokemonTypeRelationRepository = yield* PokemonTypeRelationRepository
    const sql = yield* SqlClient.SqlClient

    const syncPokemon = (
      id: PokedexId
    ) =>
      pipe(
        pokeClient.getPokemonById(id),
        Effect.flatMap((apiResponse) => {
          const types = apiResponse.types.map((x) => TypeName.make(x.name))
          const pokemonInsert = Schema.decode(PokemonToModel)(apiResponse).pipe(Effect.flatMap(pokeRepository.insert))

          return Effect.all([
            pokemonInsert,
            pokemonTypesRepository.listByTypeName(types)
          ])
        }),
        Effect.flatMap(([pokemon, types]) => {
          const insertTypesAssociation = types.map((x) =>
            pokemonTypeRelationRepository.insert({ pokemonId: pokemon.id, typeId: x.id })
          )
          return Effect.all(insertTypesAssociation)
        }),
        Effect.map(() => ({ id })),
        sql.withTransaction,
        Effect.catchTag("SqlError", (err) => Effect.die(err)),
        Effect.catchTag("ParseError", () => new PokemonParseError({ id }))
      )
    const getByPokedexId = (id: PokedexId) =>
      pipe(
        pokeRepository.getPokemonByPokedexId(id),
        Effect.flatMap(Option.match({
          onNone: () => Effect.fail(new PokemonNotFound({ id })),
          onSome: (p) => Effect.succeed(p)
        }))
      )
    return { syncPokemon, getByPokedexId }
  }),
  dependencies: [
    PokemonHttpClient.Default,
    PokemonRepository.Default,
    PokemonTypesRepository.Default,
    PokemonTypeRelationRepository.Default,
    PgLive
  ]
}) {}
