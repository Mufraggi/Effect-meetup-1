import { Effect, pipe, Schema } from "effect"
import { PokemonToModel } from "../domain/PokemonApiResponse.js"
import type { PokedexId } from "../domain/PokemonType.js"
import { TypeName } from "../domain/PokemonType.js"
import { PokemonRepository } from "../repositories/PokemonRepository.js"
import { PokemonTypeRelationRepository } from "../repositories/PokemonTypeRelationRepository.js"
import { PokemonTypesRepository } from "../repositories/PokemonTypesRepository.js"
import { PokemonHttpClient } from "./PokemonHttpClient.js"

export class PokemonService extends Effect.Service<PokemonService>()("PokemonService", {
  effect: Effect.gen(function*() {
    const pokeClient = yield* PokemonHttpClient
    const pokeRepository = yield* PokemonRepository
    const pokemonTypesRepository = yield* PokemonTypesRepository
    const pokemonTypeRelationRepository = yield* PokemonTypeRelationRepository

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
          console.log(types)
          console.log(pokemon.id)
          const insertTypesAssociation = types.map((x) =>
            pokemonTypeRelationRepository.insert({ pokemonId: pokemon.id, typeId: x.id })
          )
          return Effect.all(insertTypesAssociation)
        }),
        Effect.map(() => ({ id }))
      )
    return { syncPokemon }
  }),
  dependencies: [
    PokemonHttpClient.Default,
    PokemonRepository.Default,
    PokemonTypesRepository.Default,
    PokemonTypeRelationRepository.Default
  ]
}) {}
