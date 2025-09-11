import { PlatformConfigProvider } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { Config, ConfigProvider, Effect, Layer } from "effect"
import * as path from "path"

export const ConfigLive = PlatformConfigProvider
  .layerDotEnv(path.join(process.cwd(), ".env"))
  .pipe(Layer.provide(NodeContext.layer))

const OverrideProvider = Layer.succeed(
  ConfigProvider.ConfigProvider,
  ConfigProvider.fromMap(
    new Map([
      ["URL_POKEMON_API", "http://localhost:3000"]
    ])
  )
)

// Config pour les tests (Override a priorité sur .env)
export const ConfigTest = Layer.merge(OverrideProvider, ConfigLive)

export class ConfigService extends Effect.Service<ConfigService>()("ConfigService", {
  effect: Effect.gen(function*() {
    const pokemonUrlBase = yield* Config.string("URL_POKEMON_API")
    return {
      getPokemonUrl: () => Effect.succeed(pokemonUrlBase)
    }
  }),
  dependencies: []
}) {}
