import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {ClothesInterface} from "@/scripts/interfaces/character/clothes.interface";

export interface CharacterCreatorDataInterface {
    character: CharacterInterface;
    clothes: ClothesInterface;
    startMoney: number;
    hasPhone: boolean;
    isRegistered: boolean;
    hasDrivingLicense: boolean;
}