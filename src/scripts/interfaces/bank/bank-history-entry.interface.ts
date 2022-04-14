import {BankHistoryType} from "@/scripts/enums/bank-history.type";

export interface BankHistoryEntryInterface {
    id: number;
    type: BankHistoryType;
    income: boolean;
    amount: number;
    purposeOfUse: string;
    sendetAtJson: string;
}