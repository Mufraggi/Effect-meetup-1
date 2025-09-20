import { HttpApiBuilder, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Effect, Schema } from "effect"
import type { ApiType } from "../../Api.js"

export class HealthGroup extends HttpApiGroup.make("health")
  .add(HttpApiEndpoint.get("get", "/").addSuccess(Schema.Struct({ "status": Schema.Literal("ok") })))
  .prefix("/health")
{}

export function getHealthGroupLive(api: ApiType) {
  return HttpApiBuilder.group(api, "health", (handlers) =>
    Effect.gen(function*() {
      yield* Effect.logDebug("HealthGroupLive")

      return handlers.handle("get", () => Effect.succeed({ status: "ok" }))
    }))
}
