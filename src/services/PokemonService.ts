import { Effect, pipe } from "effect"
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
    ) =>
      pipe(
        pokeClient.getPokemonById(id),
        Effect.map((raw) => {
          console.log(raw.types)
          const pokemon = {
            pokedexId: PokedexId.make(raw.pokedex_id),
            generation: Generation.make(raw.generation),
            category: Category.make(raw.category),
            nameEn: NameEn.make(raw.name.en),
            nameFr: NameFr.make(raw.name.fr),
            nameJp: NameJp.make(raw.name.jp),
            spriteRegular: SpriteUrl.make(raw.sprites.regular),
            spriteShiny: SpriteUrl.make(raw.sprites.shiny),
            statHp: HP.make(raw.stats.hp),
            statAtk: Attack.make(raw.stats.atk),
            statDef: Defense.make(raw.stats.def),
            statSpeAtk: SpecialAttack.make(raw.stats.spe_atk),
            statSpeDef: SpecialDefense.make(raw.stats.spe_def),
            statVit: Speed.make(raw.stats.vit),
            height: Height.make(raw.height),
            weight: Weight.make(raw.weight),
            catchRate: CatchRate.make(raw.catch_rate)
          } satisfies PokemonCreateModel
          return pokemon
        }),
        Effect.flatMap((pokemon) => pokeRepository.insert(pokemon)),
        Effect.map((res) => ({ id: res.pokedexId }))
      )
    return { syncPokemon }
  }),
  dependencies: [PokemonHttpClient.Default, PokemonRepository.Default]
}) {}
