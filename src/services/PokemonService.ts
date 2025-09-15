import type { HttpClientError } from "@effect/platform/HttpClientError"
import { Effect, pipe } from "effect"
import type { ParseError } from "effect/ParseResult"
import {
  Attack,
  CatchRate,
  Category,
  Defense,
  Generation,
  Height,
  HP,
  NameEn,
  NameFr,
  NameJp,
  PokedexId,
  SpecialAttack,
  SpecialDefense,
  Speed,
  SpriteUrl,
  TypeImageUrl,
  TypeName,
  Weight
} from "../domain/PokemonType.js"
import type { PokemonCreateModel } from "../models/PokemonModel.js"
import { PokemonRepository } from "../repositories/PokemonRepository.js"
import { PokemonHttpClient } from "./PokemonHttpClient.js"

export class PokemonService extends Effect.Service<PokemonService>()("PokemonService", {
  effect: Effect.gen(function*() {
    const pokeClient = yield* PokemonHttpClient
    const pokeRepository = yield* PokemonRepository

    const syncPokemon = (
      id: PokedexId
    ): Effect.Effect<{ pokedexId: PokedexId }, HttpClientError | ParseError, PokemonRepository | PokemonHttpClient> =>
      pipe(
        pokeClient.getPokemonById(id),
        Effect.map((raw) => ({
          pokedexId: PokedexId.make(raw.pokedex_id),
          generation: Generation.make(raw.generation),
          category: Category.make(raw.category),
          name: {
            fr: NameFr.make(raw.name.fr),
            en: NameEn.make(raw.name.en),
            jp: NameJp.make(raw.name.jp)
          },
          sprites: {
            regular: SpriteUrl.make(raw.sprites.regular),
            shiny: SpriteUrl.make(raw.sprites.shiny)
          },
          types: raw.types.map((t) => ({ name: TypeName.make(t.name), image: TypeImageUrl.make(t.image) })),
          stats: {
            hp: HP.make(raw.stats.hp),
            atk: Attack.make(raw.stats.atk),
            def: Defense.make(raw.stats.def),
            spe_atk: SpecialAttack.make(raw.stats.spe_atk),
            spe_def: SpecialDefense.make(raw.stats.spe_def),
            vit: Speed.make(raw.stats.vit)
          },
          height: Height.make(raw.height),
          weight: Weight.make(raw.weight),
          catchRate: CatchRate.make(raw.catch_rate)
        } satisfies PokemonCreateModel)),
        Effect.flatMap((pokemon) => pokeRepository.insert(pokemon)),
        Effect.map((res) => ({ pokedexId: res.pokedexId }))
      )
    return { syncPokemon }
  }),
  dependencies: [PokemonHttpClient.Default, PokemonRepository.Default]
}) {}
