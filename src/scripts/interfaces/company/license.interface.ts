import {LicensesType} from "@/scripts/enums/license.type";

export interface LicenseInterface {
    license: LicensesType;
    name: string;
    price: number;
}