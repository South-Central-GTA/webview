import {VehicleModInterface} from "@/scripts/interfaces/vehicles/vehicle-mod.interface";

export interface VehicleModKitInterface {
    Id: number;
    Name: string;
    Type: string;
    Mods: VehicleModInterface[];
    VehicleModels: string[];
}