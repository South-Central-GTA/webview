import {AdminPermission} from "@/scripts/enums/admin.permission";

export interface AccountInterface {
    id: number;
    discordId: string;
    currentName: string;
    nameHistoryJson: string
    southCentralPoints: number;
    avatarUrl: string;
    lastUsage: string;
    createdAt: string;
}