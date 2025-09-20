import { FetchHttpClient, HttpApiBuilder, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeFileSystem, NodeHttpServer } from "@effect/platform-node"

import { Layer } from "effect"
import { createServer } from "http"

import { Api } from "./Api.js"
import { getHealthGroupLive } from "./http/health/HttpApiGroup.js"
import { HttpApiGroupAuthLive } from "./http/pokemon/PokemonApiImplementation.js"
import { PokemonHttpClient } from "./services/PokemonHttpClient.js"
import { ConfigLive, ConfigService } from "./utils/Config.js"

const api = Api

export const ConfigServiceLive = ConfigService.Default.pipe(
  Layer.provide(ConfigLive)
)
const ApiLive = Layer.provide(HttpApiBuilder.api(Api), [
  getHealthGroupLive(api),
  HttpApiGroupAuthLive(api),
  ConfigServiceLive,
  NodeFileSystem.layer,
  FetchHttpClient.layer,
  ConfigService.Default, // si tu as besoin de ta config
  PokemonHttpClient.Default
])

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(ApiLive),
  Layer.provide(
    HttpApiBuilder.middlewareCors({
      allowedOrigins: ["http://localhost:3000"],
      allowedMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
    })
  ),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 8080 }))
)
