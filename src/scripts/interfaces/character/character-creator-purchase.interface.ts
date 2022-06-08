import {CharacterCreatorPurchaseType} from "@/scripts/enums/character-creator-purchase.type";
import {CatalogVehicleInterface} from "@/scripts/interfaces/vehicles/catalog-vehicle.interface";

export interface CharacterCreatorPurchaseInterface {
    id: number;
    type: CharacterCreatorPurchaseType;
    name: string;
    description: string;
    southCentralPoints: number;
    removeable: boolean;
    orderedVehicle: CatalogVehicleInterface;
}