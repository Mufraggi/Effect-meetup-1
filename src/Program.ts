import { Layer } from "effect"

// Avec NodeRuntime, si tu veux une entrée “main” plus clean :
import { NodeRuntime } from "@effect/platform-node"
import { HttpLive } from "./Http.js"

HttpLive.pipe(Layer.launch, NodeRuntime.runMain)
