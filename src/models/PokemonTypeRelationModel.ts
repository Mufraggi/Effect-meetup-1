import { Model } from "@effect/sql"
import { PokemonId, TypeId } from "../domain/PokemonType.js"

export class PokemonTypeRelationModel extends Model.Class<PokemonTypeRelationModel>("PokemonTypeRelationModel")({
  pokemonId: PokemonId,
  typeId: TypeId
}) {}
