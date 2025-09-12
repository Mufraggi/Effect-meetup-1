import { FetchHttpClient } from "@effect/platform"
import { Effect, Layer } from "effect"
import { PokemonHttpClient } from "./services/PokemonHttpClient.js"

// Avec NodeRuntime, si tu veux une entrée “main” plus clean :
import { NodeFileSystem, NodeRuntime } from "@effect/platform-node"
import { ConfigLive, ConfigService } from "./utils/Config.js"

export const ConfigServiceLive = ConfigService.Default.pipe(
  Layer.provide(ConfigLive)
)
const FullLayer = Layer.mergeAll(
  ConfigServiceLive,
  NodeFileSystem.layer,
  FetchHttpClient.layer,
  ConfigService.Default, // si tu as besoin de ta config
  PokemonHttpClient.Default
)

const program = Effect.gen(function*() {
  const client = yield* PokemonHttpClient
  const pikachu = yield* client.getPokemonById(6)

  console.log("⚡", pikachu.name, pikachu.height)
})

NodeRuntime.runMain(program.pipe(Effect.provide(FullLayer)))
