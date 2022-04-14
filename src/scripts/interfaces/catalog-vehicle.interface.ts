import {VehicleInterface} from "@/scripts/interfaces/vehicle.interface";

export interface CatalogVehicleInterface extends VehicleInterface {
    classId: string;
    maxTank: number;
    fuelType: number;
    price: number;
    southCentralPoints: number;
    dlcName: string;
    amountOfOrderableVehicles: number;
}