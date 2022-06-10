import {GroupInterface} from "@/scripts/interfaces/group/group.interface";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {VehicleInterface} from "@/scripts/interfaces/vehicles/vehicle.interface";

export interface GroupCatalogRequestDetailsInterface {
    group: GroupInterface;
    bankAccount: BankAccountInterface;
    vehicleDatas: VehicleInterface[]
}