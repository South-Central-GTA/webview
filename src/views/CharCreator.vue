<template>
    <div class="charcreator">
        <notifications-holder ref="notificationsHolder" class="unselectable"/>

        <nav class="navbar navbar-expand-lg navbar-dark sc-dark">
            <a class="navbar-brand px-4"> South Central Roleplay </a>
            <ul class="navbar-nav">
                <li class="nav-item" style="padding-left: 1vw; font-size: 1.3vw">
                    <a class="nav-link" @click="closeCharCreation()" :disabled="isSaving">
                        <font-awesome-icon icon="chevron-left"/>
                    </a>
                </li>
                <li
                    class="nav-item"
                    v-if="isNewCharacter"
                    v-bind:class="{ active: tabIndex === 0 }"
                >
                    <a class="nav-link" @click="openMenu(0)">Eckdaten</a>
                </li>
                <li
                    class="nav-item"
                    v-if="isNewCharacter"
                    v-bind:class="{ active: tabIndex === 1 }"
                >
                    <a class="nav-link" @click="openMenu(1)">Geschlecht & Eltern</a>
                </li>
                <li
                    class="nav-item"
                    v-if="isNewCharacter"
                    v-bind:class="{ active: tabIndex === 2 }"
                >
                    <a class="nav-link" @click="openMenu(2)">Gesichtszüge</a>
                </li>
                <li class="nav-item" v-bind:class="{ active: tabIndex === 3 }">
                    <a class="nav-link" @click="openMenu(3)">Erscheinungsbild</a>
                </li>
                <li class="nav-item" v-bind:class="{ active: tabIndex === 4 }">
                    <a class="nav-link" @click="openMenu(4)">Kleidung</a>
                </li>
                <li class="nav-item" v-bind:class="{ active: tabIndex === 5 }">
                    <a class="nav-link" @click="openMenu(5)">Tattoos</a>
                </li>
                <li class="nav-item" v-bind:class="{ active: tabIndex === 6 }">
                    <a class="nav-link" @click="openMenu(6)">Fahrzeug</a>
                </li>
                <li class="nav-item" v-bind:class="{ active: tabIndex === 7 }">
                    <a class="nav-link" @click="openMenu(7)">Immobilie</a>
                </li>
                <li class="nav-item" v-bind:class="{ active: tabIndex === 8 }">
                    <a class="nav-link" @click="openMenu(8)">Spawnpunkt</a>
                </li>
            </ul>
        </nav>

        <div class="float-end">
            <account-card/>
            <div class="card shopping-basket sc-card">
                <div class="card-header text-white">Einkaufskorb</div>
                <ul class="list-group mb-3">
                    <div class="scrollable">
                        <li
                            class="list-group-item sc-card text-white d-flex justify-content-between lh-sm"
                            v-for="purchaseOrder in purchaseOrders"
                            v-bind:key="purchaseOrder.id"
                        >
                            <div class="float-start">
                                <h6 class="my-0">{{ purchaseOrder.name }}</h6>
                                <small class="text-white-50">{{
                                        purchaseOrder.description
                                    }}</small>
                            </div>
                            <div class="float-end">
                <span class="text-white-50"
                >{{ purchaseOrder.southCentralPoints }} SCP</span
                >
                                <button
                                    type="button"
                                    v-if="purchaseOrder.removeable"
                                    class="btn delete-button"
                                    @click="removePurchaseOrder(purchaseOrder)"
                                >
                                    <font-awesome-icon class="delete-icon" icon="trash"/>
                                </button>
                            </div>
                        </li>
                    </div>
                    <li class="list-group-item sc-card text-white">
            <span
            >Gesamte South Central Points (SCP)
              <strong>{{ characterCosts }}</strong></span
            >
                    </li>
                    <div class="p-2">
                        <button
                            type="button"
                            v-if="isNewCharacter"
                            class="btn btn-primary w-100"
                            @click="requestBuyCharacter()"
                            :disabled="isSaving"
                        >
                            Kaufen & Charakter erstellen
                            <font-awesome-icon icon="plus"/>
                        </button>
                    </div>
                </ul>
            </div>
        </div>

        <div
            class="sc-card charcreator-box text-white"
            :hidden="tabIndex === 6 || tabIndex === 7 || tabIndex === 8"
        >
            <character-formular
                :hidden="tabIndex !== 0"
                ref="formularMenu"
                v-on:update-form="updateForm($event)"
            />
            <gender
                :hidden="tabIndex !== 1"
                ref="genderMenu"
                v-on:set-gender="setGender($event)"
            />
            <parents
                :hidden="tabIndex !== 1"
                ref="parentsMenu"
                v-on:update-parents="updateParents($event)"
            />
            <face-features
                :hidden="tabIndex !== 2"
                ref="faceFeaturesMenu"
                v-on:update-face-features="updateFaceFeatures($event)"
            />
            <character-appearance
                :hidden="tabIndex !== 3"
                ref="characterAppearanceMenu"
                v-on:update-appearances="updateAppearances($event)"
            />
            <clothes-menu
                :hidden="tabIndex !== 4"
                ref="clothesMenu"
                v-on:update-clothes="updateClothes($event)"
            />
            <tattoos
                :hidden="tabIndex !== 5"
                ref="tattoosMenu"
                v-on:update-tattoos="updateTattoos($event)"
            />
        </div>

        <div :hidden="tabIndex !== 6">
            <vehicle-stats style="margin: 1vw"/>
            <vehicle-selector/>
        </div>
        <div :hidden="tabIndex !== 7">
            <house-selector/>
        </div>
        <div :hidden="tabIndex !== 8">
            <spawn-selector/>
        </div>

        <div v-if="tabIndex !== 6 && tabIndex !== 7 && tabIndex !== 8">
            <div class="camera-box" v-if="!cameraButtonsGotClicked">
                <button
                    type="button"
                    @click="changeCameraPos(0)"
                    class="reset-camera-button"
                    v-if="resetCameraButtonVisible"
                ></button>
                <button
                    type="button"
                    @click="changeCameraPos(1)"
                    class="head-button"
                ></button>
                <button
                    type="button"
                    @click="changeCameraPos(2)"
                    class="belly-button"
                ></button>
                <button
                    type="button"
                    @click="changeCameraPos(3)"
                    class="pants-button"
                ></button>
                <button
                    type="button"
                    @click="changeCameraPos(4)"
                    class="shoes-button"
                ></button>
            </div>

            <div class="rotate-box">
                <div class="row">
                    <div class="col-5">
                        <button
                            type="button"
                            @mousedown="rotateCharacter(-1)"
                            @mouseup="stopRotateCharacter()"
                            class="btn rotate-icon btn-secondary"
                        >
                            <font-awesome-icon icon="redo"/>
                        </button>
                    </div>
                    <div class="col-5">
                        <button
                            type="button"
                            @mousedown="rotateCharacter(1)"
                            @mouseup="stopRotateCharacter()"
                            class="btn rotate-icon btn-secondary"
                        >
                            <font-awesome-icon icon="undo"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
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

    private character!: CharacterInterface;
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

        alt.on(
            "charcreator:setcharacter",
            (
                character: CharacterInterface,
                maxDrawables: MaxDrawablesInterface,
                isNewCharacter: boolean
            ) => this.onSetCharacter(character, maxDrawables, isNewCharacter)
        );

        alt.on(
            "charcreator:setgender",
            (gender: number, maxDrawables: MaxDrawablesInterface) =>
                this.onSetGender(gender, maxDrawables)
        );

        alt.on("charcreator:resetissaving", () => {
            this.isSaving = false;
            this.$forceUpdate();
        });
        alt.on("charcreator:resetcamerabuttons", () => {
            this.cameraButtonsGotClicked = false;
            this.$forceUpdate();
        });

        alt.on(
            "charcreator:updatepurchaseorders",
            (purchaseOrders: CharacterCreatorPurchaseInterface[]) =>
                this.onUpdatePurchaseOrders(purchaseOrders)
        );
    }

    public unmounted(): void {
        alt.off("charcreator:setcharacter");
        alt.off("charcreator:setgender");
        alt.off("charcreator:resetissaving");
        alt.off("charcreator:resetcamerabuttons");
        alt.off("charcreator:updatepurchaseorders");
    }

    private onSetCharacter(
        character: CharacterInterface,
        maxDrawables: MaxDrawablesInterface,
        isNewCharacter: boolean
    ): void {
        this.isNewCharacter = isNewCharacter;

        // We have to reset the clothings here.
        character.clothes = {
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
        };

        this.character = character;
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
        this.characterAppearanceMenu?.setCharacterAppearances(
            character.appearances
        );
        this.clothesMenu?.setClothes(character.clothes);

        this.notificationsHolder.setPosition(NotificationPositionTypes.RIGHT);
    }

    private onSetGender(
        gender: number,
        maxDrawables: MaxDrawablesInterface
    ): void {
        this.characterAppearanceMenu?.setGender(gender);
        this.tattoosMenu?.setGender(gender);
        this.parentsMenu?.reset();
        this.clothesMenu?.setGender(maxDrawables, gender);
    }

    private onUpdatePurchaseOrders(
        purchaseOrders: CharacterCreatorPurchaseInterface[]
    ): void {
        this.purchaseOrders = purchaseOrders;

        this.characterCosts = this.purchaseOrders
            .map((po) => po.southCentralPoints)
            .reduce((a, b) => a + b, 0);
    }

    private removePurchaseOrder(
        purchaseOrder: CharacterCreatorPurchaseInterface
    ): void {
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

        if (
            this.tabIndex !== 0 &&
            this.tabIndex !== 1 &&
            this.tabIndex !== 2 &&
            this.tabIndex !== 3 &&
            this.tabIndex !== 4 &&
            this.tabIndex !== 5 &&
            index !== 6 &&
            index !== 7 &&
            index !== 6
        ) {
            alt.emitServer("charcreator:resetcamera");
        }

        this.tabIndex = index;
    }

    private requestBuyCharacter(): void {
        if (this.character.firstName === "") {
            this.formularMenu.firstNameValidation = "EMPTY";
        } else {
            if (this.character.firstName.length <= 1) {
                this.formularMenu.firstNameValidation = "TO_SHORT";
            } else if (!/^[a-zA-ZÀ-ž]+$/.test(this.character.firstName)) {
                this.formularMenu.firstNameValidation = "SPECIAL_CHARACTERS";
            } else {
                this.formularMenu.firstNameValidation = "OKAY";
            }
        }

        if (this.character.lastName === "") {
            this.formularMenu.lastNameValidation = "EMPTY";
        } else {
            if (this.character.lastName.length <= 1) {
                this.formularMenu.lastNameValidation = "TO_SHORT";
            } else if (!/^[a-zA-ZÀ-ž]+$/.test(this.character.lastName)) {
                this.formularMenu.lastNameValidation = "SPECIAL_CHARACTERS";
            } else {
                this.formularMenu.lastNameValidation = "OKAY";
            }
        }

        if (this.character.origin === "") {
            this.formularMenu.originValidation = "EMPTY";
        } else {
            if (!/^[a-zA-ZÀ-ž, ]*$/.test(this.character.origin)) {
                this.formularMenu.originValidation = "SPECIAL_CHARACTERS";
            } else {
                this.formularMenu.originValidation = "OKAY";
            }
        }

        if (this.character.physique === "") {
            this.formularMenu.physiqueValidation = "EMPTY";
        } else {
            if (!/^[a-zA-ZÀ-ž, ]*$/.test(this.character.physique)) {
                this.formularMenu.physiqueValidation = "SPECIAL_CHARACTERS";
            } else {
                this.formularMenu.physiqueValidation = "OKAY";
            }
        }

        if (this.character.bodySize === 0) {
            this.formularMenu.bodySizeValidation = "EMPTY";
        } else {
            if (this.character.bodySize < 110) {
                this.formularMenu.bodySizeValidation = "TO_SMALL";
            } else if (this.character.bodySize > 220) {
                this.formularMenu.bodySizeValidation = "TO_TALL";
            } else {
                this.formularMenu.bodySizeValidation = "OKAY";
            }
        }

        if (this.character.age === 0) {
            this.formularMenu.ageValidation = "EMPTY";
        } else {
            if (this.character.age < 16) {
                this.formularMenu.ageValidation = "TO_YOUNG";
            } else if (this.character.age > 100) {
                this.formularMenu.ageValidation = "TO_OLD";
            } else {
                this.formularMenu.ageValidation = "OKAY";
            }
        }

        this.formularMenu.storyValidation = "OKAY";

        if (this.character.story === "") {
            this.formularMenu.storyValidation = "EMPTY";
        } else {
            // TODO: Activate when server is going live.

            // if (countWords(this.character.story) < 150) {
            //     this.formularMenu.storyValidation = "TO_SHORT";
            // } else {
            //     this.formularMenu.storyValidation = "OKAY";
            // }
            this.formularMenu.storyValidation = "OKAY";
        }

        if (!this.clothesMenu.checkValidation()) {
            alt.emit(
                "notification:error",
                "Der Abschnitt Kleidung benötigt deine Aufmerksamkeit."
            );
            return;
        }

        if (
            this.formularMenu.firstNameValidation === "OKAY" &&
            this.formularMenu.lastNameValidation === "OKAY" &&
            this.formularMenu.originValidation === "OKAY" &&
            this.formularMenu.ageValidation === "OKAY" &&
            this.formularMenu.bodySizeValidation === "OKAY" &&
            this.formularMenu.physiqueValidation === "OKAY" &&
            this.formularMenu.storyValidation === "OKAY"
        ) {
            alt.emit("charcreator:requestbuycharacter", this.character);
            this.isSaving = true;
            return;
        }

        alt.emit(
            "notification:error",
            "Der Abschnitt Eckdaten benötigt deine Aufmerksamkeit."
        );
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
        this.character.firstName = form.profile.firstName;
        this.character.lastName = form.profile.lastName;
        this.character.origin = form.profile.origin;
        this.character.story = form.profile.story;
        this.character.age = form.profile.age;
        this.character.bodySize = form.profile.bodySize;
        this.character.physique = form.profile.physique;

        alt.emit("charcreator:setform", form);
    }

    private setGender(gender: number): void {
        if (this.character.gender === gender) return;

        this.character.gender = gender;
        alt.emit("charcreator:updatechar", this.character, true);
    }

    private updateParents(parents: ParentsInterface): void {
        this.character.mother = parents.mother;
        this.character.father = parents.father;
        this.character.similarity = parents.similarity;
        this.character.skinSimilarity = parents.skinSimilarity;

        alt.emit("charcreator:updatechar", this.character);
    }

    private updateFaceFeatures(features: FaceFeaturesInterface): void {
        this.character.faceFeatures = features;
        alt.emit("charcreator:updatechar", this.character);
    }

    private updateAppearances(appearances: AppearancesInterface): void {
        this.character.appearances = appearances;
        alt.emit("charcreator:updatechar", this.character);
    }

    private updateClothes(clothes: ClothesInterface): void {
        this.character.clothes = clothes;
        alt.emit("charcreator:updatechar", this.character);
    }

    private updateTattoos(tattoos: TattoosInterface): void {
        this.character.tattoos = tattoos;
        alt.emit("charcreator:updatechar", this.character);
    }
}
</script>

<style scoped lang="scss">
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
