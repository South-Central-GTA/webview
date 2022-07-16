import {ClothesInterface} from "@/scripts/interfaces/character/clothes.interface";
import alt from "@/scripts/services/alt.service";
import {TattoosInterface} from "@/scripts/interfaces/character/tattoos.interface";
import {AppearancesInterface} from "@/scripts/interfaces/character/appearances.interface";
import {FaceFeaturesInterface} from "@/scripts/interfaces/character/facefeatures.interface";
import {ParentsInterface} from "@/scripts/interfaces/character/parents.interface";
import {CharacterFormInterface} from "@/scripts/interfaces/character/character-form.interface";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {CharacterCreatorDataInterface} from "@/scripts/interfaces/character/character-creator-data.interface";

class CharacterCreationService {
    get getCharacterCreatorData() {
        return this.characterCreatorData;
    }

    private characterCreatorData!: CharacterCreatorDataInterface;

    public setup(character: CharacterInterface): void {
        this.characterCreatorData = {
            character: character,
            clothes: {
                accessories: undefined,
                backPack: undefined,
                bodyArmor: undefined,
                bracelets: undefined,
                ears: undefined,
                glasses: undefined,
                hat: undefined,
                mask: undefined,
                pants: undefined,
                shoes: undefined,
                top: undefined,
                torso: undefined,
                underShirt: undefined,
                watch: undefined,
            },
            startMoney: 0,
            hasPhone: false,
            isRegistered: false,
            hasDrivingLicense: false
        };
    }
    
    public updateForm(form: CharacterFormInterface): void {
        this.characterCreatorData.character.firstName = form.profile.firstName;
        this.characterCreatorData.character.lastName = form.profile.lastName;
        this.characterCreatorData.character.origin = form.profile.origin;
        this.characterCreatorData.character.story = form.profile.story;
        this.characterCreatorData.character.age = form.profile.age;
        this.characterCreatorData.character.bodySize = form.profile.bodySize;
        this.characterCreatorData.character.physique = form.profile.physique;
        this.characterCreatorData.startMoney = form.startMoney;
        this.characterCreatorData.hasPhone = form.hasPhone;
        this.characterCreatorData.isRegistered = form.isRegistered;
        this.characterCreatorData.hasDrivingLicense = form.hasDrivingLicense;
        
        alt.emit("charcreator:updatedata", this.characterCreatorData);
    }

    public updateGender(gender: number): void {
        if (this.characterCreatorData.character.gender === gender) {
            return;
        }
            
        this.characterCreatorData.character.gender = gender;

        alt.emit("charcreator:updatedata", this.characterCreatorData);
    }

    public updateParents(parents: ParentsInterface): void {
        this.characterCreatorData.character.mother = parents.mother;
        this.characterCreatorData.character.father = parents.father;
        this.characterCreatorData.character.similarity = parents.similarity;
        this.characterCreatorData.character.skinSimilarity = parents.skinSimilarity;

        alt.emit("charcreator:updatedata", this.characterCreatorData);
    }

    public updateFaceFeatures(features: FaceFeaturesInterface): void {
        this.characterCreatorData.character.faceFeatures = features;      
        
        alt.emit("charcreator:updatedata", this.characterCreatorData);
    }

    public updateAppearances(appearances: AppearancesInterface): void {
        this.characterCreatorData.character.appearances = appearances;
        
        alt.emit("charcreator:updatedata", this.characterCreatorData);
    }

    public updateClothes(clothes: ClothesInterface): void {
        this.characterCreatorData.clothes = clothes;
        
        alt.emit("charcreator:updatedata", this.characterCreatorData);
    }

    public updateTattoos(tattoos: TattoosInterface): void {
        this.characterCreatorData.character.tattoos = tattoos;
        
        alt.emit("charcreator:updatedata", this.characterCreatorData);
    }
}

// Export a singleton instance in the global namespace
export const characterCreationService = new CharacterCreationService();