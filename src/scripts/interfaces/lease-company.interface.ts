import {HouseInterface} from "@/scripts/interfaces/house.interface";

export interface LeaseCompanyInterface extends HouseInterface {
    typeName: string;
    streetName: string;
}