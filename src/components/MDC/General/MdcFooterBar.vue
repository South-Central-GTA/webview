<template>
    <div class='mdc-footer-bar'>
        <p>Angemeldet als {{ this.rankName }} {{ this.characterName }}.</p>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";

@Options({
    components: {},
})
export default class MdcFooterBar extends Vue {
    private rankName: string = "";
    private characterName: string = "";

    public setup(characterName: string, rankName: string): void {
        this.characterName = characterName;
        this.rankName = rankName;
    }
}
</script>

<style lang='scss' scoped>
.mdc-footer-bar {
    position: absolute;
    bottom: 0;
    width: 100%;
    color: white;
    background-color: rgba(0, 0, 0, 1);
}

p {
    margin: 0.25vw;
}
</style>
