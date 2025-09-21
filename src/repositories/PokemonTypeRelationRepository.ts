import { Model /*, SqlClient */ } from "@effect/sql"
import { Effect } from "effect"

import { PokemonTypeRelationModel } from "../models/PokemonTypeRelationModel.js"
import { PgLive } from "../utils/PgClient.js"

export class PokemonTypeRelationRepository
  extends Effect.Service<PokemonTypeRelationRepository>()("PokemonTypeRelationRepository", {
    effect: Effect.gen(function*() {
      const repo = yield* Model.makeRepository(PokemonTypeRelationModel, {
        tableName: "pokemon_type_relations",
        spanPrefix: "pokemon_repository",
        idColumn: "pokemonId"
      })
      return {
        insert: repo.insert
      }
    }),
    dependencies: [PgLive]
  })
{}
