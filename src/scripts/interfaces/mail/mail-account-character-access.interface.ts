import {MailingPermission} from "@/scripts/enums/mailing.permission";

export interface MailAccountCharacterAccessInterface {
    bankAccountId: number;
    permission: MailingPermission;
    name: string;
    characterId: number;
    owner: boolean;
}