import { SqlClient, SqlSchema /*, SqlClient */ } from "@effect/sql"
import { Effect, pipe, Schema } from "effect"

import { TypeName } from "../domain/PokemonType.js"
import { PokemonTypeModel } from "../models/PokemonTypesModel.js"
import { PgLive } from "../utils/PgClient.js"

export class PokemonTypesRepository extends Effect.Service<PokemonTypesRepository>()("PokemonTypesRepository", {
  effect: Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const listByTypeNameSchema = SqlSchema.findAll({
      Request: Schema.Struct({ names: Schema.Array(TypeName) }),
      Result: PokemonTypeModel,
      execute({ names }) {
        return sql`SELECT * FROM pokemon_types pt WHERE pt.name IN ${sql.in(names)}`
      }
    })
    const listByTypeName = (names: ReadonlyArray<TypeName>) =>
      pipe(
        listByTypeNameSchema({ names }),
        Effect.orDie,
        Effect.withSpan("PokemonTypes.listByTypeName")
      )
    return {
      listByTypeName
    }
  }),
  dependencies: [PgLive]
}) {}
