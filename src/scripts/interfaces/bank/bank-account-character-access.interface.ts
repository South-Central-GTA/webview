import {BankingPermission} from "@/scripts/enums/banking.permission";

export interface BankAccountCharacterAccessInterface {
    bankAccountId: number;
    permission: BankingPermission;
    name: string;
    characterId: number;
    owner: boolean;
}