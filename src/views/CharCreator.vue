<template>
    <div class='charcreator'>
        <notifications-holder ref='notificationsHolder' class='unselectable' />

        <nav class='navbar navbar-expand-lg navbar-dark sc-dark'>
            <a class='navbar-brand px-4'> South Central Roleplay </a>
            <ul class='navbar-nav'>
                <li class='nav-item' style='padding-left: 1vw; font-size: 1.3vw'>
                    <a :disabled='isSaving' class='nav-link' @click='closeCharCreation()'>
                        <font-awesome-icon icon='chevron-left' />
                    </a>
                </li>
                <li v-if='isNewCharacter' class='nav-item' v-bind:class='{ active: tabIndex === 0 }'>
                    <a class='nav-link' @click='openMenu(0)'>Eckdaten</a>
                </li>
                <li v-if='isNewCharacter' class='nav-item' v-bind:class='{ active: tabIndex === 1 }'>
                    <a class='nav-link' @click='openMenu(1)'>Geschlecht & Eltern</a>
                </li>
                <li v-if='isNewCharacter' class='nav-item' v-bind:class='{ active: tabIndex === 2 }'>
                    <a class='nav-link' @click='openMenu(2)'>Gesichtszüge</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 3 }'>
                    <a class='nav-link' @click='openMenu(3)'>Erscheinungsbild</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 4 }'>
                    <a class='nav-link' @click='openMenu(4)'>Kleidung</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 5 }'>
                    <a class='nav-link' @click='openMenu(5)'>Tattoos</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 6 }'>
                    <a class='nav-link' @click='openMenu(6)'>Fahrzeug</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 7 }'>
                    <a class='nav-link' @click='openMenu(7)'>Immobilie</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 8 }'>
                    <a class='nav-link' @click='openMenu(8)'>Spawnpunkt</a>
                </li>
            </ul>
        </nav>

        <div class='float-end'>
            <account-card />
            <div class='card shopping-basket sc-card'>
                <div class='card-header text-white'>Einkaufskorb</div>
                <ul class='list-group mb-3'>
                    <div class='scrollable'>
                        <li v-for='purchaseOrder in purchaseOrders' v-bind:key='purchaseOrder.id' class='list-group-item sc-card text-white d-flex justify-content-between lh-sm'>
                            <div class='float-start'>
                                <h6 class='my-0'>{{ purchaseOrder.name }}</h6>
                                <small class='text-white-50'>{{
                                        purchaseOrder.description
                                                             }}</small>
                            </div>
                            <div class='float-end'>
                                <span class='text-white-50'>{{ purchaseOrder.southCentralPoints }} SCP</span>
                                <button v-if='purchaseOrder.removeable' class='btn delete-button' type='button' @click='removePurchaseOrder(purchaseOrder)'>
                                    <font-awesome-icon class='delete-icon' icon='trash' />
                                </button>
                            </div>
                        </li>
                    </div>
                    <li class='list-group-item sc-card text-white'>
            <span>Gesamte South Central Points (SCP)
              <strong>{{ characterCosts }}</strong></span>
                    </li>
                    <div class='p-2'>
                        <button v-if='isNewCharacter' :disabled='isSaving' class='btn btn-primary w-100' type='button' @click='requestBuyCharacter()'>
                            Kaufen & Charakter erstellen
                            <font-awesome-icon icon='plus' />
                        </button>
                    </div>
                </ul>
            </div>
        </div>

        <div :hidden='tabIndex === 6 || tabIndex === 7 || tabIndex === 8' class='sc-card charcreator-box text-white'>
            <character-formular ref='formularMenu' :hidden='tabIndex !== 0' v-on:update-form='updateForm($event)' />
            <gender ref='genderMenu' :hidden='tabIndex !== 1' v-on:set-gender='setGender($event)' />
            <parents ref='parentsMenu' :hidden='tabIndex !== 1' v-on:update-parents='updateParents($event)' />
            <face-features ref='faceFeaturesMenu' :hidden='tabIndex !== 2' v-on:update-face-features='updateFaceFeatures($event)' />
            <character-appearance ref='characterAppearanceMenu' :hidden='tabIndex !== 3' v-on:update-appearances='updateAppearances($event)' />
            <clothes-menu ref='clothesMenu' :hidden='tabIndex !== 4' v-on:update-clothes='updateClothes($event)' />
            <tattoos ref='tattoosMenu' :hidden='tabIndex !== 5' v-on:update-tattoos='updateTattoos($event)' />
        </div>

        <div :hidden='tabIndex !== 6'>
            <vehicle-stats style='margin: 1vw' />
            <vehicle-selector />
        </div>
        <div :hidden='tabIndex !== 7'>
            <house-selector />
        </div>
        <div :hidden='tabIndex !== 8'>
            <spawn-selector />
        </div>

        <div v-if='tabIndex !== 6 && tabIndex !== 7 && tabIndex !== 8'>
            <div v-if='!cameraButtonsGotClicked' class='camera-box'>
                <button v-if='resetCameraButtonVisible' class='reset-camera-button' type='button' @click='changeCameraPos(0)'></button>
                <button class='head-button' type='button' @click='changeCameraPos(1)'></button>
                <button class='belly-button' type='button' @click='changeCameraPos(2)'></button>
                <button class='pants-button' type='button' @click='changeCameraPos(3)'></button>
                <button class='shoes-button' type='button' @click='changeCameraPos(4)'></button>
            </div>

            <div class='rotate-box'>
                <div class='row'>
                    <div class='col-5'>
                        <button class='btn rotate-icon btn-secondary' type='button' @mousedown='rotateCharacter(-1)' @mouseup='stopRotateCharacter()'>
                            <font-awesome-icon icon='redo' />
                        </button>
                    </div>
                    <div class='col-5'>
                        <button class='btn rotate-icon btn-secondary' type='button' @mousedown='rotateCharacter(1)' @mouseup='stopRotateCharacter()'>
                            <font-awesome-icon icon='undo' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import AccountCard from "@/components/AccountCard.vue";
import CharacterFormular from "@/components/CharCreator/CharacterFormular.vue";
import Gender from "@/components/CharCreator/Gender.vue";
import Parents from "@/components/CharCreator/Parents.vue";
import FaceFeatures from "@/components/CharCreator/FaceFeatures.vue";
import CharacterAppearance from "@/components/CharCreator/CharacterAppearance.vue";
import VehicleStats from "@/components/Vehicle/VehicleStats.vue";
import VehicleSelector from "@/components/CharCreator/Vehicle/VehicleSelector.vue";
import HouseSelector from "@/components/CharCreator/HouseSelector.vue";
import SpawnSelector from "@/components/CharCreator/SpawnSelector.vue";
import NotificationsHolder from "@/components/Notification/NotificationsHolder.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import Tattoos from "@/components/CharCreator/Tattoos.vue";
import ClothesMenu from "@/components/CharCreator/ClothesMenu.vue";
import {MaxDrawablesInterface} from "@/scripts/interfaces/character/max-drawables.interface";
import {CharacterFormInterface} from "@/scripts/interfaces/character/character-form.interface";
import {ParentsInterface} from "@/scripts/interfaces/character/parents.interface";
import {FaceFeaturesInterface} from "@/scripts/interfaces/character/facefeatures.interface";
import {AppearancesInterface} from "@/scripts/interfaces/character/appearances.interface";
import {ClothesInterface} from "@/scripts/interfaces/character/clothes.interface";
import {TattoosInterface} from "@/scripts/interfaces/character/tattoos.interface";
import {NotificationPositionTypes} from "@/scripts/enums/notification-position.types";
import {CharacterCreatorPurchaseType} from "@/scripts/enums/character-creator-purchase.type";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {CharacterCreatorPurchaseInterface} from "@/scripts/interfaces/character/character-creator-purchase.interface";
import { characterCreationService } from '@/scripts/services/character-creation.service';

@Options({
    components: {
        ClothesMenu,
        NotificationsHolder,
        AccountCard,
        CharacterFormular,
        Gender,
        Parents,
        FaceFeatures,
        CharacterAppearance,
        VehicleStats,
        VehicleSelector,
        HouseSelector,
        SpawnSelector,
        Tattoos,
    },
})
export default class CharCreator extends Vue {
    @Ref() private readonly notificationsHolder!: NotificationsHolder;
    @Ref() private readonly formularMenu!: CharacterFormular;
    @Ref() private readonly genderMenu!: Gender;
    @Ref() private readonly parentsMenu!: Parents;
    @Ref() private readonly faceFeaturesMenu!: FaceFeatures;
    @Ref() private readonly characterAppearanceMenu!: CharacterAppearance;
    @Ref() private readonly clothesMenu!: ClothesMenu;
    @Ref() private readonly tattoosMenu!: Tattoos;

    private purchaseOrders: CharacterCreatorPurchaseInterface[] = [];
    private characterCosts = 0;

    private blockAllNavButtons = false;
    private isNewCharacter = true;
    private isSaving = false;
    private tabIndex = 0;
    private resetCameraButtonVisible = false;
    private cameraButtonsGotClicked = false;

    public mounted(): void {
        alt.emit("charcreator:getcharacter");

        alt.on("charcreator:setcharacter",
            (character: CharacterInterface, maxDrawables: MaxDrawablesInterface, isNewCharacter: boolean) => this.onSetCharacter(
                character, maxDrawables, isNewCharacter));

        alt.on("charcreator:setgender",
            (gender: number, maxDrawables: MaxDrawablesInterface) => this.onSetGender(gender, maxDrawables));

        alt.on("charcreator:resetissaving", () => {
            this.isSaving = false;
            this.$forceUpdate();
        });
        alt.on("charcreator:resetcamerabuttons", () => {
            this.cameraButtonsGotClicked = false;
            this.$forceUpdate();
        });

        alt.on("charcreator:updatepurchaseorders",
            (purchaseOrders: CharacterCreatorPurchaseInterface[]) => this.onUpdatePurchaseOrders(purchaseOrders));
    }

    public unmounted(): void {
        alt.off("charcreator:setcharacter");
        alt.off("charcreator:setgender");
        alt.off("charcreator:resetissaving");
        alt.off("charcreator:resetcamerabuttons");
        alt.off("charcreator:updatepurchaseorders");
    }

    private onSetCharacter(character: CharacterInterface, maxDrawables: MaxDrawablesInterface, isNewCharacter: boolean): void {
        this.isNewCharacter = isNewCharacter;

        characterCreationService.setup(character);
        this.onSetGender(character.gender, maxDrawables);

        this.formularMenu?.setup({
            firstName: character.firstName,
            lastName: character.lastName,
            origin: character.origin,
            story: character.story,
            age: character.age,
            bodySize: character.bodySize,
            physique: character.physique,
        });

        this.genderMenu?.setup(character.gender);

        this.parentsMenu?.setParents({
            mother: character.mother,
            father: character.father,
            similarity: character.similarity,
            skinSimilarity: character.skinSimilarity,
        });

        this.faceFeaturesMenu?.setFaceFeatures(character.faceFeatures);
        this.characterAppearanceMenu?.setCharacterAppearances(character.appearances);

        this.notificationsHolder.setPosition(NotificationPositionTypes.RIGHT);
    }

    private onSetGender(gender: number, maxDrawables: MaxDrawablesInterface): void {
        this.characterAppearanceMenu?.setGender(gender);
        this.tattoosMenu?.setGender(gender);
        this.parentsMenu?.reset();
        this.clothesMenu?.setGender(maxDrawables, gender);
    }

    private onUpdatePurchaseOrders(purchaseOrders: CharacterCreatorPurchaseInterface[]): void {
        this.purchaseOrders = purchaseOrders;

        this.characterCosts = this.purchaseOrders
            .map((po) => po.southCentralPoints)
            .reduce((a, b) => a + b, 0);
    }

    private removePurchaseOrder(purchaseOrder: CharacterCreatorPurchaseInterface): void {
        alt.emit("charcreator:removepurchaseorder", purchaseOrder);

        if (purchaseOrder.type === CharacterCreatorPurchaseType.MONEY) {
            this.formularMenu.resetMoney();
        }
    }

    private openMenu(index: number): void {
        if (this.tabIndex === index || this.blockAllNavButtons) {
            return;
        }

        this.blockAllNavButtons = true;
        setTimeout(() => {
            this.blockAllNavButtons = false;
        }, 750);

        if (index === 5) {
            alt.emit("charcreator:setnude");
        }
        if (this.tabIndex === 5 && index !== 5) {
            alt.emit("charcreator:loadclothes");
        }

        if (index === 6) {
            alt.emitServer("charcreatorvehicle:open");
        }
        if (index !== 6) {
            alt.emit("vehicleselector:close");
        }

        if (index === 7) {
            alt.emitServer("charcreatorhouse:open");
        }
        if (index !== 7) {
            alt.emit("houseselector:close");
        }

        if (index === 8) {
            alt.emitServer("charcreatorspawn:open");
        }
        if (index !== 8) {
            alt.emit("spawnselector:close");
        }

        if (this.tabIndex !== 0 && this.tabIndex !== 1 && this.tabIndex !== 2 && this.tabIndex !== 3 && this.tabIndex !== 4 && this.tabIndex !== 5 && index !== 6 && index !== 7 && index !== 6) {
            alt.emitServer("charcreator:resetcamera");
        }

        this.tabIndex = index;
    }

    private requestBuyCharacter(): void {
        if (characterCreationService.getCharacterCreatorData.character.firstName === "") {
            this.formularMenu.firstNameValidation = "EMPTY";
        } else {
            if (characterCreationService.getCharacterCreatorData.character.firstName.length <= 1) {
                this.formularMenu.firstNameValidation = "TO_SHORT";
            } else if (!/^[a-zA-ZÀ-ž]+$/.test(characterCreationService.getCharacterCreatorData.character.firstName)) {
                this.formularMenu.firstNameValidation = "SPECIAL_CHARACTERS";
            } else {
                this.formularMenu.firstNameValidation = "OKAY";
            }
        }

        if (characterCreationService.getCharacterCreatorData.character.lastName === "") {
            this.formularMenu.lastNameValidation = "EMPTY";
        } else {
            if (characterCreationService.getCharacterCreatorData.character.lastName.length <= 1) {
                this.formularMenu.lastNameValidation = "TO_SHORT";
            } else if (!/^[a-zA-ZÀ-ž]+$/.test(characterCreationService.getCharacterCreatorData.character.lastName)) {
                this.formularMenu.lastNameValidation = "SPECIAL_CHARACTERS";
            } else {
                this.formularMenu.lastNameValidation = "OKAY";
            }
        }

        if (characterCreationService.getCharacterCreatorData.character.origin === "") {
            this.formularMenu.originValidation = "EMPTY";
        } else {
            if (!/^[a-zA-ZÀ-ž, ]*$/.test(characterCreationService.getCharacterCreatorData.character.origin)) {
                this.formularMenu.originValidation = "SPECIAL_CHARACTERS";
            } else {
                this.formularMenu.originValidation = "OKAY";
            }
        }

        if (characterCreationService.getCharacterCreatorData.character.physique === "") {
            this.formularMenu.physiqueValidation = "EMPTY";
        } else {
            if (!/^[a-zA-ZÀ-ž, ]*$/.test(characterCreationService.getCharacterCreatorData.character.physique)) {
                this.formularMenu.physiqueValidation = "SPECIAL_CHARACTERS";
            } else {
                this.formularMenu.physiqueValidation = "OKAY";
            }
        }

        if (characterCreationService.getCharacterCreatorData.character.bodySize === 0) {
            this.formularMenu.bodySizeValidation = "EMPTY";
        } else {
            if (characterCreationService.getCharacterCreatorData.character.bodySize < 110) {
                this.formularMenu.bodySizeValidation = "TO_SMALL";
            } else if (characterCreationService.getCharacterCreatorData.character.bodySize > 220) {
                this.formularMenu.bodySizeValidation = "TO_TALL";
            } else {
                this.formularMenu.bodySizeValidation = "OKAY";
            }
        }

        if (characterCreationService.getCharacterCreatorData.character.age === 0) {
            this.formularMenu.ageValidation = "EMPTY";
        } else {
            if (characterCreationService.getCharacterCreatorData.character.age < 16) {
                this.formularMenu.ageValidation = "TO_YOUNG";
            } else if (characterCreationService.getCharacterCreatorData.character.age > 100) {
                this.formularMenu.ageValidation = "TO_OLD";
            } else {
                this.formularMenu.ageValidation = "OKAY";
            }
        }

        this.formularMenu.storyValidation = "OKAY";

        if (characterCreationService.getCharacterCreatorData.character.story === "") {
            this.formularMenu.storyValidation = "EMPTY";
        } else {
            // TODO: Activate when server is going live.

            // if (countWords(characterCreationService.getCharacterCreatorData.character.story) < 150) {
            //     this.formularMenu.storyValidation = "TO_SHORT";
            // } else {
            //     this.formularMenu.storyValidation = "OKAY";
            // }
            this.formularMenu.storyValidation = "OKAY";
        }

        if (!this.clothesMenu.checkValidation()) {
            alt.emit("notification:error", "Der Abschnitt Kleidung benötigt deine Aufmerksamkeit.");
            return;
        }

        if (this.formularMenu.firstNameValidation === "OKAY" && this.formularMenu.lastNameValidation === "OKAY" && this.formularMenu.originValidation === "OKAY" && this.formularMenu.ageValidation === "OKAY" && this.formularMenu.bodySizeValidation === "OKAY" && this.formularMenu.physiqueValidation === "OKAY" && this.formularMenu.storyValidation === "OKAY") {
            alt.emit("charcreator:requestbuycharacter");
            this.isSaving = true;
            return;
        }

        alt.emit("notification:error", "Der Abschnitt Eckdaten benötigt deine Aufmerksamkeit.");
    }

    private changeCameraPos(posIndex: number): void {
        alt.emit("charcreator:setcamerapos", posIndex);

        this.cameraButtonsGotClicked = true;
        if (posIndex !== 0) {
            this.resetCameraButtonVisible = true;
        } else {
            this.resetCameraButtonVisible = false;
        }
    }

    private rotateCharacter(dir: number): void {
        alt.emit("charcreator:rotatecharacter", dir);
    }

    private stopRotateCharacter(): void {
        alt.emit("charcreator:rotatestop");
    }

    private closeCharCreation(): void {
        alt.emit("charcreator:requestclose");
    }

    private updateForm(form: CharacterFormInterface): void {
        characterCreationService.updateForm(form);
    }

    private setGender(gender: number): void {
        characterCreationService.updateGender(gender);
    }

    private updateParents(parents: ParentsInterface): void {
        characterCreationService.updateParents(parents);
    }

    private updateFaceFeatures(features: FaceFeaturesInterface): void {
        characterCreationService.updateFaceFeatures(features);
    }

    private updateAppearances(appearances: AppearancesInterface): void {
        characterCreationService.updateAppearances(appearances);
    }

    private updateClothes(clothes: ClothesInterface): void {
        characterCreationService.updateClothes(clothes);
    }

    private updateTattoos(tattoos: TattoosInterface): void {
        characterCreationService.updateTattoos(tattoos);
    }
}
</script>

<style lang='scss' scoped>
.charcreator {
    height: 100%;
}

.navbar-brand {
    padding: 0;
}

.navbar-nav .nav-link {
    padding-top: 0;
    padding-bottom: 0;
    height: 50px;
    line-height: 50px;
    color: white;

    &:hover {
        cursor: pointer;
    }
}

.charcreator-box {
    height: 90%;
    width: 40%;
    margin: 1vw;
}

.active {
    font-weight: 500;
}

.shopping-basket {
    margin: 1vw;
    z-index: 100;
    width: 20vw;

    & .delete-button {
        margin-left: 0.5vw;
        color: #fff;
    }
}

.scrollable {
    overflow-y: auto;
    height: 25vw;
}

.scrollable::-webkit-scrollbar {
    display: none;
}

.reset-camera-button {
    top: 0 !important;
    right: 0 !important;
    height: 100%;
    width: 60vw !important;
    transform: translate(0%, 0%) !important;
    z-index: 99;
}

.head-button {
    top: 19%;
    height: 7vw;
}

.belly-button {
    top: 40%;
    height: 15vw;
}

.pants-button {
    top: 69%;
    height: 15vw;
}

.shoes-button {
    top: 89%;
    height: 7vw;
}

.camera-box button {
    width: 26vw;
    right: 10%;
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 0.6vw;
    margin: 0.1vw;
    outline: none;
    border: unset;
    background-color: transparent;
}

.rotate-box {
    position: absolute;
    transform: translate(-50%, 0%);
    bottom: 0;
    right: 0;
    margin: 1vw 30vw;
    z-index: 100;
}
</style>
