import {GroupInterface} from "@/scripts/interfaces/group/group.interface";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {VehicleInterface} from "@/scripts/interfaces/vehicles/vehicle.interface";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {HouseInterface} from "@/scripts/interfaces/house.interface";

export interface CharacterCatalogRequestDetailsInterface {
    character: CharacterInterface;
    vehicles: VehicleInterface[];
    houses: HouseInterface[];
    groups: GroupInterface[];
    bankAccounts: BankAccountInterface[];
}