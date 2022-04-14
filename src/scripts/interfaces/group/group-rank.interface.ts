import {GroupPermission} from "@/scripts/enums/group.permission";
import {BankingPermission} from "@/scripts/enums/banking.permission";

export interface GroupRankInterface {
    groupId: number;
    level: number;
    name: string;
    groupPermission: GroupPermission;
}