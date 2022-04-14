import {GenderType} from "@/scripts/enums/gender.type";
import {FaceFeaturesInterface} from "./facefeatures.interface";
import {DefinedJobInterface} from "../definedjob/defined-job.interface";
import {AppearancesInterface} from "./appearances.interface";
import {TattoosInterface} from "@/scripts/interfaces/character/tattoos.interface";
import {InventoryInterface} from "@/scripts/interfaces/inventory/inventory.interface";
import {ClothesInterface} from "@/scripts/interfaces/character/clothes.interface";
import {PersonalLicenseInterface} from "@/scripts/interfaces/character/personal-license.interface";

export interface CharacterInterface {
    id: number;
    accountId: number;
    currentAccountName: string;

    firstName: string;
    lastName: string;
    name: string;

    gender: GenderType;
    age: number;

    onlineSince: string;
    lastUsage: string;
    createdAt: string;

    mother: number;
    father: number;
    origin: string;
    story: string;
    bodySize: number;
    physique: string;

    similarity: number;
    skinSimilarity: number;
    characterState: number;

    torso: number;
    torsoTexture: number;

    faceFeatures: FaceFeaturesInterface;
    appearances: AppearancesInterface;
    inventory: InventoryInterface;
    definedJob: DefinedJobInterface;
    licenses: PersonalLicenseInterface[];

    clothes: ClothesInterface; //only clientside
    tattoos: TattoosInterface;
    
}