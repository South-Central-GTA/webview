<template>
    <div class='clothing-menu mb-5'>
        <h5>{{ title }}</h5>
        <div class='row'>
            <div class='col-12'>
                <input v-model.number='drawableId' :max='maxDrawables' class='form-range-dark' min='-1' type='range' @input='updateClothing()' />
                <div style='margin: unset'>
                    <p class='float-end'>
                        {{
                            this.clothing.drawableId === -1
                                ? "Nichts"
                                : this.clothing.drawableId
                        }} </p>
                </div>
            </div>
            <div v-if='this.clothing.drawableId !== -1' class='col-12'>
                Variationen
                <input v-model.number='textureId' :disabled='maxTextures < 1' :max='maxTextures' class='form-range-dark' min='0' type='range' @input='updateClothing()' />
                <div style='margin: unset'>
                    <p class='float-end'>{{ textureId }}</p>
                </div>
            </div>
            <div v-if="this.clothing.drawableId !== -1 && this.title !== 'Torso'" class='col-12'>
                <input v-model='itemName' class='form-control-dark' maxlength='32' placeholder='Item Name' type='text' v-bind:class="{
            'is-invalid': clothValidation !== 'OKAY',
            'is-valid': clothValidation === 'OKAY',
          }" @input='updateClothing()' />

                <div v-if="clothValidation === 'EMPTY'" class='invalid-feedback'>
                    Bitte definiere einen Namen für dieses Kleidungsitem.
                </div>

                <div v-if="clothValidation === 'TO_SHORT'" class='invalid-feedback'>
                    Der Name ist zu kurz.
                </div>

                <div v-if="clothValidation === 'SPECIAL_CHARACTERS'" class='invalid-feedback'>
                    Diese Art von Sonderzeichen ist nicht erlaubt.
                </div>

                <div v-if="clothValidation === 'INVALID'" class='invalid-feedback'>
                    xxx
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {ClothingInterface} from "@/scripts/interfaces/character/clothing.interface";
import {GenderType} from "@/scripts/enums/gender.type";

export default class ClothingMenu extends Vue {
    public clothValidation = "OKAY";
    @Prop() private readonly title!: string;
    private maxDrawables = -1;
    private maxTextures = 0;

    private drawableId = -1;
    private textureId = 0;
    private itemName = "";
    private genderType = GenderType.MALE;

    private clothing: ClothingInterface = {
        genderType: GenderType.MALE, drawableId: -1, textureId: 0, title: "",
    };

    public setup(maxDrawables: number, gender: GenderType): void {
        this.maxDrawables = maxDrawables;

        if (this.maxDrawables === 0) {
            this.$el.remove();
        }

        this.genderType = gender;

        this.updateClothing();
    }

    public setMaxTextures(maxTextures: number): void {
        this.maxTextures = maxTextures;
    }

    public isValid(): boolean {
        return this.clothValidation === "OKAY";
    }

    private updateClothing() {
        const newCloth = this.getCloth();

        if (this.clothing.drawableId !== newCloth.drawableId) {
            this.textureId = 0;
        }

        this.clothing = newCloth;

        if (this.clothing.drawableId !== -1) {
            this.validate();
            this.$emit("update-clothing", this.clothing);
        } else {
            this.clear();
        }
    }

    private validate(): void {
        if (this.title === "Torso") {
            return;
        }

        if (this.itemName.length === 0) {
            this.clothValidation = "EMPTY";
        } else if (this.itemName.length <= 5) {
            this.clothValidation = "TO_SHORT";
        } else if (!/^[1-9a-zA-ZÀ-ž, ]*$/.test(this.itemName)) {
            this.clothValidation = "SPECIAL_CHARACTERS";
        } else {
            this.clothValidation = "OKAY";
        }
    }

    private clear(): void {
        this.clothing = {
            genderType: this.genderType, drawableId: -1, textureId: 0, title: "",
        };

        this.clothValidation = "OKAY";

        this.$emit("update-clothing", null);
    }

    private getCloth(): ClothingInterface {
        return {
            genderType: this.genderType, drawableId: this.drawableId, textureId: this.textureId, title: this.itemName,
        };
    }
}
</script>
