<template>
    <div class="hairsalon">
        <div class="sc-card text-white character-appearance-block">
            <character-appearance ref="characterAppearanceMenu" v-on:update-appearances="updateAppearances($event)"/>

            <div class="save-box">
                <button type="button" class="btn btn-secondary" @click="closeHairSalon()" :disabled="isSaving">
                    Abbrechen
                </button>

                <button type="button" class="btn btn-primary m-2" @click="requestBuy()"
                        :disabled="isSaving || !hasChanges">
                    Änderungen kaufen
                </button>
            </div>
        </div>

        <div class="rotate-box">
            <div class="row">
                <div class="col-5">
                    <button @mousedown="rotateCharacter(-1)" @mouseup="stopRotateCharacter()" type="button"
                            class="btn rotate-icon btn-secondary">
                        <font-awesome-icon icon="redo"/>
                    </button>
                </div>
                <div class="col-5">
                    <button @mousedown="rotateCharacter(1)" @mouseup="stopRotateCharacter()" type="button"
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
import CharacterAppearance from "@/components/CharCreator/CharacterAppearance.vue";
import {AppearancesInterface} from "@/scripts/interfaces/character/appearances.interface";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

@Options({
    components: {
        CharacterAppearance
    }
})
export default class HairSalon extends Vue {
    @Ref() private readonly characterAppearanceMenu!: CharacterAppearance;

    private isSaving = false;
    private hasChanges = false;

    public mounted(): void {
        alt.emit("hairsalon:getcharacter");
        alt.on("hairsalon:setcharacter", (character: CharacterInterface) => this.setCharacter(character));
    }

    public unmounted(): void {
        alt.off("hairsalon:setcharacter");
    }

    private setCharacter(character: CharacterInterface): void {
        this.isSaving = false;

        this.characterAppearanceMenu?.setGender(character.gender);
        this.characterAppearanceMenu?.setCharacterAppearances(character.appearances);
    }

    private updateAppearances(appearances: AppearancesInterface): void {
        alt.emit("hairsalon:updatechar", appearances);
        this.hasChanges = true;
    }

    private rotateCharacter(dir: number): void {
        alt.emit("hairsalon:rotatecharacter", dir);
    }

    private stopRotateCharacter(): void {
        alt.emit("hairsalon:rotatestop");
    }

    private closeHairSalon(): void {
        this.isSaving = true;
        alt.emit("hairsalon:close");
    }

    private requestBuy(): void {
        this.isSaving = true;
        alt.emit("hairsalon:buy");
    }
}
</script>

<style scoped lang="scss">
.hairsalon {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}

.character-appearance-block {
    height: 90%;
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