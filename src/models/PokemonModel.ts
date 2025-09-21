import { Model } from "@effect/sql"
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

export class PokemonModel extends Model.Class<PokemonModel>("PokemonModel")({
  id: Model.Generated(PokemonId),
  pokedexId: PokedexId,
  generation: Generation,
  category: Category,

  // Noms séparés (correspondant aux colonnes de la DB)
  nameFr: NameFr,
  nameEn: NameEn,
  nameJp: NameJp,

  // Sprites séparés (correspondant aux colonnes de la DB)
  spriteRegular: SpriteUrl,
  spriteShiny: SpriteUrl,

  // Stats séparées (correspondant aux colonnes de la DB)
  statHp: HP,
  statAtk: Attack,
  statDef: Defense,
  statSpeAtk: SpecialAttack,
  statSpeDef: SpecialDefense,
  statVit: Speed,

  height: Height,
  weight: Weight,
  catchRate: CatchRate,
  createdAt: Model.Generated(Timestamp),
  updatedAt: Model.Generated(Timestamp)
}) {}

// Model pour créer un Pokemon (sans les champs générés)
export class PokemonCreateModel extends Model.Class<PokemonCreateModel>("PokemonCreateModel")({
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
  catchRate: CatchRate
}) {}

// Model pour la table pokemon_types
export class PokemonTypeModel extends Model.Class<PokemonTypeModel>("PokemonTypeModel")({
  id: Model.Generated(TypeId),
  name: TypeName,
  imageUrl: TypeImageUrl
}) {}

// Model pour créer un type Pokemon
export class PokemonTypeCreateModel extends Model.Class<PokemonTypeCreateModel>("PokemonTypeCreateModel")({
  name: TypeName,
  imageUrl: TypeImageUrl
}) {}
