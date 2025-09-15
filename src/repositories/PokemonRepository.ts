import { Model /*, SqlClient */ } from "@effect/sql"
import { Effect } from "effect"
import { PokemonModel } from "../models/PokemonModel.js"
import { ClientPg } from "../utils/PgClient.js"

export class PokemonRepository extends Effect.Service<PokemonRepository>()("PokemonRepository", {
  effect: Effect.gen(function*() {
    // const sql = yield* SqlClient.SqlClient
    const repo = yield* Model.makeRepository(PokemonModel, {
      tableName: "pokemon",
      spanPrefix: "pokemon_repository",
      idColumn: "pokedexId"
    })
    return {
      insert: repo.insert,
      findById: repo.findById
    }
  }),
  dependencies: [ClientPg.Default]
}) {}
