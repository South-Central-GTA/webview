import {CharacterCreatorPurchaseType} from "@/scripts/enums/character-creator-purchase.type";
import {VehicleInterface} from "../vehicle.interface";

export interface CharacterCreatorPurchaseInterface {
    id: number;
    type: CharacterCreatorPurchaseType;
    name: string;
    description: string;
    southCentralPoints: number;
    removeable: boolean;
    orderedVehicle: VehicleInterface;
}