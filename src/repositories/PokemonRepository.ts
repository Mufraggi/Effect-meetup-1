import { Model, SqlClient, SqlSchema /*, SqlClient */ } from "@effect/sql"
import { Effect, pipe, Schema } from "effect"
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
  PokemonId,
  SpecialAttack,
  SpecialDefense,
  Speed,
  SpriteUrl,
  Timestamp,
  TypeId,
  TypeImageUrl,
  TypeName,
  Weight
} from "../domain/PokemonType.js"
import { PokemonModel } from "../models/PokemonModel.js"
import { PgLive } from "../utils/PgClient.js"

export class PokemonRepository extends Effect.Service<PokemonRepository>()("PokemonRepository", {
  effect: Effect.gen(function*() {
    const sql = yield* SqlClient.SqlClient

    const repo = yield* Model.makeRepository(PokemonModel, {
      tableName: "pokemons",
      spanPrefix: "pokemon_repository",
      idColumn: "pokedexId"
    })
    const getPokemonByPokedexIdSchema = SqlSchema.findOne({
      Request: PokedexId,
      Result: Schema.Struct({
        id: PokemonId,
        pokedexId: PokedexId,
        generation: Generation,
        category: Category,
        nameFr: NameFr,
        nameEn: NameEn,
        nameJp: NameJp,
        spriteRegular: SpriteUrl,
        spriteShiny: SpriteUrl,
        statHp: HP,
        statAtk: Attack,
        statDef: Defense,
        statSpeAtk: SpecialAttack,
        statSpeDef: SpecialDefense,
        statVit: Speed,
        height: Height,
        weight: Weight,
        catchRate: CatchRate,
        createdAt: Timestamp,
        updatedAt: Timestamp,
        types: Schema.Array(Schema.Struct({ id: TypeId, name: TypeName, imageUrl: TypeImageUrl }))
      }),
      execute: (request) =>
        sql`
    SELECT
      p.id,
      p.pokedex_id,
      p.generation,
      p.category,
      p.name_fr,
      p.name_en,
      p.name_jp,
      p.sprite_regular,
      p.sprite_shiny,
      p.stat_hp,
      p.stat_atk,
      p.stat_def,
      p.stat_spe_atk,
      p.stat_spe_def,
      p.stat_vit,
      p.height,
      p.weight,
      p.catch_rate,
      p.created_at,
      p.updated_at,
      -- Agrégation des types en JSON
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', pt.id,
            'name', pt.name,
            'image_url', pt.image_url
          )
        ) FILTER (WHERE pt.id IS NOT NULL),
        '[]'::json
      ) AS types
    FROM pokemons p
    LEFT JOIN pokemon_type_relations ptr ON p.id = ptr.pokemon_id
    LEFT JOIN pokemon_types pt ON ptr.type_id = pt.id
    WHERE p.pokedex_id = ${request}
    GROUP BY
      p.id, p.pokedex_id, p.generation, p.category,
      p.name_fr, p.name_en, p.name_jp,
      p.sprite_regular, p.sprite_shiny,
      p.stat_hp, p.stat_atk, p.stat_def, p.stat_spe_atk, p.stat_spe_def, p.stat_vit,
      p.height, p.weight, p.catch_rate, p.created_at, p.updated_at;
  `
    })
    const getPokemonByPokedexId = (id: PokedexId) =>
      pipe(
        getPokemonByPokedexIdSchema(id),
        Effect.orDie,
        Effect.withSpan("PokemonTypes.listByTypeName")
      )
    return {
      insert: repo.insert,
      getPokemonByPokedexId,
      findById: repo.findById
    }
  }),
  dependencies: [PgLive]
}) {}
