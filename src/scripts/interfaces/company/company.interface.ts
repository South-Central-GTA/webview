import {LicensesType} from "@/scripts/enums/license.type";
import {GroupInterface} from "../group/group.interface";

export interface CompanyInterface extends GroupInterface {
    licenses: LicensesType;
    products: number;
    deliveryVisibilityStatus: number;
}