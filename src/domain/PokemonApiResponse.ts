import { Schema } from "effect"
import { PokemonCreateModel } from "../models/PokemonModel.js"
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
} from "./PokemonType.js"

export type PokemonSchema = typeof PokemonSchema.Type
export const PokemonSchema = Schema.Struct({
  pokedex_id: Schema.Number,
  generation: Schema.Number,
  category: Schema.String,
  name: Schema.Struct({
    fr: Schema.String,

    en: Schema.String,
    jp: Schema.String
  }),
  sprites: Schema.Struct({
    regular: Schema.String,
    shiny: Schema.String,
    gmax: Schema.NullOr(
      Schema.Struct({
        regular: Schema.String,
        shiny: Schema.String
      })
    )
  }),
  types: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      image: Schema.String
    })
  ),
  talents: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      tc: Schema.Boolean
    })
  ),
  stats: Schema.Struct({
    hp: Schema.Number,
    atk: Schema.Number,
    def: Schema.Number,
    spe_atk: Schema.Number,
    spe_def: Schema.Number,
    vit: Schema.Number
  }),
  resistances: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      multiplier: Schema.Number
    })
  ),
  evolution: Schema.Struct({
    pre: Schema.NullOr(Schema.Unknown), // null ou autre objet inconnu
    next: Schema.NullOr(
      Schema.Array(
        Schema.Struct({
          pokedex_id: Schema.Number,
          name: Schema.String,
          condition: Schema.String
        })
      )
    ),
    mega: Schema.NullOr(Schema.Unknown)
  }),
  height: Schema.String,
  weight: Schema.String,
  egg_groups: Schema.Array(Schema.String),
  sexe: Schema.NullOr(
    Schema.Struct({
      male: Schema.Number,
      female: Schema.Number
    })
  ),
  catch_rate: Schema.Number,
  level_100: Schema.Number,
  formes: Schema.NullOr(Schema.Unknown)
})

export const PokemonToModel = Schema.transform(
  PokemonSchema,
  PokemonCreateModel,
  {
    strict: true,
    decode: (api) => ({
      pokedexId: PokedexId.make(api.pokedex_id),
      generation: Generation.make(api.generation),
      category: Category.make(api.category),
      nameFr: NameFr.make(api.name.fr),
      nameEn: NameEn.make(api.name.en),
      nameJp: NameJp.make(api.name.jp),
      spriteRegular: SpriteUrl.make(api.sprites.regular),
      spriteShiny: SpriteUrl.make(api.sprites.shiny),
      statHp: HP.make(api.stats.hp),
      statAtk: Attack.make(api.stats.atk),
      statDef: Defense.make(api.stats.def),
      statSpeAtk: SpecialAttack.make(api.stats.spe_atk),
      statSpeDef: SpecialDefense.make(api.stats.spe_def),
      statVit: Speed.make(api.stats.vit),
      height: Height.make(api.height),
      weight: Weight.make(api.weight),
      catchRate: CatchRate.make(api.catch_rate)
    }),
    encode: (model) => ({
      pokedex_id: model.pokedexId,
      generation: model.generation,
      category: model.category,
      name: { fr: model.nameFr, en: model.nameEn, jp: model.nameJp },
      sprites: { regular: model.spriteRegular, shiny: model.spriteShiny, gmax: null },
      stats: {
        hp: model.statHp,
        atk: model.statAtk,
        def: model.statDef,
        spe_atk: model.statSpeAtk,
        spe_def: model.statSpeDef,
        vit: model.statVit
      },
      height: model.height,
      weight: model.weight,
      catch_rate: model.catchRate,
      types: [],
      talents: [],

      resistances: [],
      evolution: { pre: null, next: null, mega: null },

      egg_groups: [],
      sexe: null,
      level_100: 100,
      formes: null
    })
  }
)
