<template>
    <div ref='selectButton' class='char-card card'>
        <h5 class='character-name'>
            {{ character.name }} </h5>
        <div class='character-information-box'>
            <p class='sub-text'>
                Charakter zuletzt gespielt oder bearbeitet {{ getCorrectDate(character.lastUsageJson) }}. </p>
            <p class='sub-text'>
                Charakter erstellt am {{ getCorrectDate(character.createdAtJson) }}. </p>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {Prop, Ref} from "vue-property-decorator";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";

export default class CharCard extends Vue {
    @Prop() private readonly character!: CharacterInterface;
    @Ref() private readonly selectButton!: HTMLButtonElement;

    public mounted(): void {
        this.selectButton.addEventListener("click", () => this.selectCharacter());
    }

    public unmounted(): void {
        this.selectButton.removeEventListener("click", () => this.selectCharacter());
    }

    private selectCharacter(): void {
        this.$emit("select-character", this.character);
    }

    private getCorrectDate(dateString: string): string {
        const date = new Date(JSON.parse(dateString));
        return date.toLocaleDateString("de-DE", {
            hour: "numeric", minute: "numeric", month: "long", year: "numeric", day: "numeric",
        });
    }
}
</script>

<style lang='scss' scoped>
.char-card {
    margin: 0.5vw 0vw;

    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    &:active {
        background-color: rgba(0, 0, 0, 0.3);
    }
}

.character-name {
    padding-top: 0.25vw;
    padding-left: 0.5vw;
    margin: unset;
}

.btn-group {
    width: 90%;
    margin: auto;

    & button {
        margin: 0.5vw;
    }
}

.character-information-box {
    margin-top: 0.5vw;
    padding: 0.5vw;
}

.sub-text {
    font-size: 0.5vw;
    font-style: italic;
    margin: unset;
    color: var(--gray) !important;
}
</style>
