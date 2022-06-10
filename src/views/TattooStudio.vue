<template>
    <div class='tattoostudio'>
        <div class='sc-card text-white character-tattoos-block'>
            <tattoos ref='tattoosMenu' v-on:update-tattoos='updateTattoos($event)' />

            <div class='save-box'>
                <button :disabled='isSaving' class='btn btn-secondary' type='button' @click='closeHairSalon()'>
                    Abbrechen
                </button>

                <button :disabled='isSaving || !hasChanges' class='btn btn-primary m-2' type='button' @click='requestBuy()'>
                    Änderungen kaufen
                </button>
            </div>
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
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {TattoosInterface} from "@/scripts/interfaces/character/tattoos.interface";
import Tattoos from "@/components/CharCreator/Tattoos.vue";

@Options({
    components: {
        Tattoos,
    },
})
export default class HairSalon extends Vue {
    @Ref() private readonly tattoosMenu!: Tattoos;

    private isSaving = false;
    private hasChanges = false;

    public mounted(): void {
        alt.emit("tattoostudio:getcharacter");
        alt.on("tattoostudio:setcharacter", (character: CharacterInterface) => this.setCharacter(character));
    }

    public unmounted(): void {
        alt.off("tattoostudio:setcharacter");
    }

    private setCharacter(character: CharacterInterface): void {
        this.isSaving = false;

        this.tattoosMenu?.setCharacterTattoos(character.gender, character.tattoos);
    }

    private updateTattoos(tattoos: TattoosInterface): void {
        alt.emit("tattoostudio:updatechar", tattoos);
        this.hasChanges = true;
    }

    private rotateCharacter(dir: number): void {
        alt.emit("tattoostudio:rotatecharacter", dir);
    }

    private stopRotateCharacter(): void {
        alt.emit("tattoostudio:rotatestop");
    }

    private closeHairSalon(): void {
        this.isSaving = true;
        alt.emit("tattoostudio:close");
    }

    private requestBuy(): void {
        this.isSaving = true;
        alt.emit("tattoostudio:buy");
    }
}
</script>

<style lang='scss' scoped>
.tattoostudio {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}

.character-tattoos-block {
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
