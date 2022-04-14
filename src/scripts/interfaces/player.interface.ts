export interface PlayerInterface {
    id: number;
    accountId: number;
    accountName: string;
	characterId: number;
    characterName: string;
	discordId: string;
	dutyLeaseCompanyHouseId: number;
	loginTrys: number;
	adminFreezed: boolean;
	isSpawned: boolean;
	isLoggedIn: boolean;
	isAduty: boolean;
	isDuty: boolean;
	isInventoryOpen: boolean;
	isPhoneOpen: boolean;
	isInFreeCam: boolean;
	isInBigEars: boolean;
}