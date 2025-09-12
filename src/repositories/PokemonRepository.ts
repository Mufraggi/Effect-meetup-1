import { SqlClient } from "@effect/sql"
import { Effect } from "effect"
import { ClientPg } from "../utils/PgClient.js"

export class PokemonRepository extends Effect.Service<PokemonRepository>()("PokemonRepository", {
  effect: Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    return {}
  }),
  dependencies: [ClientPg.Default]
}) {}
