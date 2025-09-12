import { PgClient } from "@effect/sql-pg"

import { Effect, identity, Redacted, String } from "effect"

import { ConfigService } from "./Config.js"

export class ClientPg extends Effect.Service<ClientPg>()("PgCleint", {
  effect: Effect.gen(function*() {
    const configService = yield* ConfigService

    const { database, dbName, env, password, port, username } = yield* configService.getSqlConfig()
    const url = `postgres://${username}:${password}@${database}:${port}/${dbName}`
    let ssl = false
    if (env === "production" || database.includes("azure.com")) {
      ssl = true
    }
    return PgClient.layer({
      url: Redacted.make(url),
      ssl,
      transformQueryNames: String.camelToSnake,
      transformResultNames: String.snakeToCamel,
      // - 114: JSON (return as string instead of parsed object)
      // - 1082: DATE
      // - 1114: TIMESTAMP WITHOUT TIME ZONE
      // - 1184: TIMESTAMP WITH TIME ZONE
      // - 3802: JSONB (return as string instead of parsed object)
      types: {
        1082: {
          to: 25,
          from: [1082],
          parse: identity,
          serialize: identity
        },
        1114: {
          to: 25,
          from: [1114],
          parse: identity,
          serialize: identity
        },
        1184: {
          to: 25,
          from: [1184],
          parse: identity,
          serialize: identity
        }
      }
    })
  }),
  dependencies: [ConfigService.Default]
}) {}
