import { Schema } from "effect"

export const TypeId = Schema.UUID.pipe(
  Schema.brand("TypeId")
)
export type TypeId = Schema.Schema.Type<typeof TypeId>

export const PokemonId = Schema.UUID.pipe(
  Schema.brand("PokemonId")
)
export type PokemonId = Schema.Schema.Type<typeof PokemonId>

export const PokedexId = Schema.Number.pipe(
  Schema.int(),
  Schema.positive(),
  Schema.lessThanOrEqualTo(1025),
  Schema.brand("PokedexId")
)
export type PokedexId = Schema.Schema.Type<typeof PokedexId>

export const Generation = Schema.Number.pipe(
  Schema.int(),
  Schema.between(1, 9),
  Schema.brand("Generation")
)
export type Generation = Schema.Schema.Type<typeof Generation>

export const Category = Schema.String.pipe(
  Schema.maxLength(50),
  Schema.brand("Category")
)
export type Category = Schema.Schema.Type<typeof Category>

export const NameFr = Schema.String.pipe(
  Schema.maxLength(30),
  Schema.brand("NameFr")
)
export type NameFr = Schema.Schema.Type<typeof NameFr>

export const NameEn = Schema.String.pipe(
  Schema.maxLength(30),
  Schema.brand("NameEn")
)
export type NameEn = Schema.Schema.Type<typeof NameEn>

export const NameJp = Schema.String.pipe(
  Schema.maxLength(30),
  Schema.brand("NameJp")
)
export type NameJp = Schema.Schema.Type<typeof NameJp>

export const SpriteUrl = Schema.String.pipe(
  Schema.startsWith("https://"),
  Schema.endsWith(".png"),
  Schema.brand("SpriteUrl")
)
export type SpriteUrl = Schema.Schema.Type<typeof SpriteUrl>

export const TypeName = Schema.String.pipe(
  Schema.maxLength(20),
  Schema.brand("TypeName")
)
export type TypeName = Schema.Schema.Type<typeof TypeName>

export const TypeImageUrl = Schema.String.pipe(
  Schema.startsWith("https://"),
  Schema.brand("TypeImageUrl")
)
export type TypeImageUrl = Schema.Schema.Type<typeof TypeImageUrl>

export const HP = Schema.Number.pipe(
  Schema.int(),
  Schema.between(1, 255),
  Schema.brand("HP")
)
export type HP = Schema.Schema.Type<typeof HP>

export const Attack = Schema.Number.pipe(
  Schema.int(),
  Schema.between(1, 255),
  Schema.brand("Attack")
)
export type Attack = Schema.Schema.Type<typeof Attack>

export const Defense = Schema.Number.pipe(
  Schema.int(),
  Schema.between(1, 255),
  Schema.brand("Defense")
)
export type Defense = Schema.Schema.Type<typeof Defense>

export const SpecialAttack = Schema.Number.pipe(
  Schema.int(),
  Schema.between(1, 255),
  Schema.brand("SpecialAttack")
)
export type SpecialAttack = Schema.Schema.Type<typeof SpecialAttack>

export const SpecialDefense = Schema.Number.pipe(
  Schema.int(),
  Schema.between(1, 255),
  Schema.brand("SpecialDefense")
)
export type SpecialDefense = Schema.Schema.Type<typeof SpecialDefense>

export const Speed = Schema.Number.pipe(
  Schema.int(),
  Schema.between(1, 255),
  Schema.brand("Speed")
)
export type Speed = Schema.Schema.Type<typeof Speed>

export const Height = Schema.String.pipe(
  Schema.pattern(/^\d+,\d+ m$/),
  Schema.brand("Height")
)
export type Height = Schema.Schema.Type<typeof Height>

export const Weight = Schema.String.pipe(
  Schema.pattern(/^\d+,\d+ kg$/),
  Schema.brand("Weight")
)
export type Weight = Schema.Schema.Type<typeof Weight>

export const CatchRate = Schema.Number.pipe(
  Schema.int(),
  Schema.between(3, 255),
  Schema.brand("CatchRate")
)
export type CatchRate = Schema.Schema.Type<typeof CatchRate>

// Structures composées avec les types brandés
export const PokemonName = Schema.Struct({
  fr: NameFr,
  en: NameEn,
  jp: NameJp
})

export const PokemonSprites = Schema.Struct({
  regular: SpriteUrl,
  shiny: SpriteUrl
})

export const PokemonType = Schema.Struct({
  name: TypeName,
  image: TypeImageUrl
})

export const PokemonStats = Schema.Struct({
  hp: HP,
  atk: Attack,
  def: Defense,
  spe_atk: SpecialAttack,
  spe_def: SpecialDefense,
  vit: Speed
})

export const Timestamp = Schema.DateFromString

export const PokemonTypeId = Schema.UUID.pipe(Schema.brand("PokemonTypeId"))
export type PokemonTypeId = typeof PokemonTypeId.Type

export const PokemonTypeRelationId = Schema.UUID.pipe(Schema.brand("PokemonTypeId"))
export type PokemonTypeRelationId = typeof PokemonTypeRelationId.Type
