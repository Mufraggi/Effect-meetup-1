import { Model } from "@effect/sql"
import { TypeId, TypeImageUrl, TypeName } from "../domain/PokemonType.js"

export class PokemonTypeModel extends Model.Class<PokemonTypeModel>("PokemonTypeModel")({
  id: Model.Generated(TypeId),
  name: TypeName,
  imageUrl: TypeImageUrl
}) {}
