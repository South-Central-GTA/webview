<template>
    <div :hidden='!isVisible' class='set-torso-menu' v-bind:class='{ enable: isVisible, disable: !isVisible }'>
        <div class='modal-dialog'>
            <div class='modal-content sc-dark text-white'>
                <div class='modal-header'>
                    <h5 class='modal-title'>Torso aktualisieren</h5>
                    <button class='text-white icon-button float-end' type='button' @click='close()'>
                        <font-awesome-icon class='center' icon='times' />
                    </button>
                </div>

                <div class='modal-body'>
                    <clothing-menu ref='torsoMenu' title='Torso' v-on:update-clothing='updateTorso($event)' />
                </div>

                <div class='modal-footer justify-content-evenly row'>
                    <button class='btn btn-primary col-5' type='button' @click='onTorsoUpdateButtonClicked()'>
                        Torso aktualisieren
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Options, Vue} from "vue-class-component";
import ClothingMenu from "@/components/CharCreator/Menus/ClothingMenu.vue";
import {Ref} from "vue-property-decorator";
import {GenderType} from "@/scripts/enums/gender.type";
import {ClothingInterface} from "@/scripts/interfaces/character/clothing.interface";

@Options({
    components: {
        ClothingMenu,
    },
})
export default class SetTorsoMenu extends Vue {
    @Ref() private readonly torsoMenu!: ClothingMenu;

    private isVisible = false;
    private drawableId = 0;
    private textureId = 0;

    public mounted(): void {
        alt.on("settorsomenu:show", (maxDrawables: number, gender: GenderType) => this.show(maxDrawables, gender));
        alt.on("settorsomenu:setmaxtextures", (maxTextures: number) => this.setMaxTextures(maxTextures));
    }

    public unmounted(): void {
        alt.off("settorsomenu:show");
        alt.off("settorsomenu:setmaxtextures");
    }

    private show(maxDrawables: number, gender: GenderType): void {
        this.torsoMenu?.setup(maxDrawables, gender);

        this.isVisible = true;
    }

    private setMaxTextures(maxTextures: number): void {
        this.torsoMenu?.setMaxTextures(maxTextures);
    }

    private updateTorso(clothing: ClothingInterface): void {
        if (!clothing) {
            return;
        }

        this.drawableId = clothing.drawableId;
        this.textureId = clothing.textureId;

        alt.emit("settorsomenu:updatetorso", this.drawableId, this.textureId);
    }

    private onTorsoUpdateButtonClicked(): void {
        this.isVisible = false;
        alt.emit("settorsomenu:savetorso", this.drawableId, this.textureId);
    }

    private close(): void {
        this.isVisible = false;
        alt.emit("settorsomenu:close");
    }
}
</script>

<style scoped>
.modal-dialog {
    margin-right: 10%;
    margin-top: 20%;
    z-index: 999999;
    pointer-events: all;
    overflow: hidden;
}
</style>
