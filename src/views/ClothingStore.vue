<template>
    <div class="clothing-store">
        <notifications-holder ref="notificationsHolder" class="unselectable"/>
    
        <div class="sc-card text-white character-clothes-block">
            <clothes-menu ref="clothesMenu" v-on:update-clothes="updateClothes($event)"/>

            <div class="save-box">
                <button type="button" class="btn btn-secondary" @click="closeHairSalon()" :disabled="isSaving">
                    Abbrechen
                </button>

                <button type="button" class="btn btn-primary m-2" @click="requestBuy()"
                        :disabled="isSaving || !hasChanges">
                    Kleidung in den Warenkorb packen
                </button>
            </div>
        </div>

        <div class="rotate-box">
            <div class="row">
                <div class="col-5">
                    <button type="button" @mousedown="rotateCharacter(-1)" @mouseup="stopRotateCharacter()"
                            class="btn rotate-icon btn-secondary">
                        <font-awesome-icon icon="redo"/>
                    </button>
                </div>
                <div class="col-5">
                    <button type="button" @mousedown="rotateCharacter(1)" @mouseup="stopRotateCharacter()"
                            class="btn rotate-icon btn-secondary">
                        <font-awesome-icon icon="undo"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import alt from "@/scripts/services/alt.service";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {MaxDrawablesInterface} from "@/scripts/interfaces/character/max-drawables.interface";
import ClothesMenu from "@/components/CharCreator/ClothesMenu.vue";
import {ClothesInterface} from "@/scripts/interfaces/character/clothes.interface";
import {GenderType} from "@/scripts/enums/gender.type";
import NotificationsHolder from "@/components/Notification/NotificationsHolder.vue";
import {NotificationPositionTypes} from "@/scripts/interfaces/notification.interface";

@Options({
    components: {
        NotificationsHolder,
        ClothesMenu
    }
})
export default class ClothingStore extends Vue {
    @Ref() private readonly notificationsHolder!: NotificationsHolder;
    @Ref() private readonly clothesMenu!: ClothesMenu;

    private isSaving = false;
    private hasChanges = false;

    public mounted(): void {
        alt.emit("clothingstore:getcharacter");
        alt.on("clothingstore:setcharacter", (maxDrawables: MaxDrawablesInterface, gender: GenderType) => this.onSetCharacter(maxDrawables, gender));
    }

    private onSetCharacter(maxDrawables: MaxDrawablesInterface, gender: GenderType): void {
        this.isSaving = false;

        this.clothesMenu?.setGender(maxDrawables, gender);
    
        this.notificationsHolder.setPosition(NotificationPositionTypes.RIGHT);
    }

    private updateClothes(clothes: ClothesInterface): void {
        alt.emit("clothingstore:updatechar", clothes);
        this.hasChanges = true;
    }

    private rotateCharacter(dir: number): void {
        alt.emit("clothingstore:rotatecharacter", dir);
    }

    private stopRotateCharacter(): void {
        alt.emit("clothingstore:rotatestop");
    }

    private closeHairSalon(): void {
        this.isSaving = true;
        alt.emit("clothingstore:close");
    }

    private requestBuy(): void {
        this.isSaving = true;
        
        if (!this.clothesMenu?.checkValidation()) {
            alt.emit("notification:error", "Du musst jedem Kleidungsstück einen Namen geben.");
            this.isSaving = false;
            return;
        }
        
        alt.emit("clothingstore:requestbuy");
    }
}
</script>

<style scoped lang="scss">
.clothing-store {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}

.character-clothes-block {
    height: 95%;
    width: 35%;
    margin: 1vw;
}

.save-box {
    padding: 1vw;
}

.rotate-box {
    position: absolute;
    transform: translate(50%, 1%);
    bottom: 1%;
    right: 50%;
    z-index: 100;
}
</style>