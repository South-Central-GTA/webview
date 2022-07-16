import {VehicleModType} from "@/scripts/enums/vehicle-mod.type";

export interface VehicleServicePurchaseInterface {
    type: VehicleModType;
    value: number;
    name: string;
    description: string;
    moneyCosts: number;
    productCosts: number;
}