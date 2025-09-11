import { PlatformConfigProvider } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { Config, Effect, Layer } from "effect"
import * as path from "path"

export const ConfigLive = PlatformConfigProvider
  .layerDotEnv(path.join(process.cwd(), ".env"))
  .pipe(Layer.provide(NodeContext.layer))

export class ConfigService extends Effect.Service<ConfigService>()("ConfigService", {
  effect: Effect.gen(function*() {
    const pokemonUrlBase = yield* Config.string("URL_POKEMON_API")
    return {
      getPokemonUrl: () => Effect.succeed(pokemonUrlBase)
    }
  }),
  dependencies: []
}) {}
