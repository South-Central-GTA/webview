import {MailAccountCharacterAccessInterface} from "./mail-account-character-access.interface";
import {MailAccountGroupAccessInterface} from "./mail-account-group-access.interface";
import {MailInterface} from "@/scripts/interfaces/mail/mail.interface";

export interface MailAccountInterface {
    type: number;
    mailAddress: string;
    mails: MailInterface[];
    characterAccesses: MailAccountCharacterAccessInterface[];
    groupAccesses: MailAccountGroupAccessInterface[]
}