<template>
    <div class='mdc-header-bar'>
        <button class='icon-button float-end p-3' type='button' @click='closeButtonClicked()'>
            <font-awesome-icon class='center text-white' icon='times' />
        </button>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";

@Options({
    components: {},
})
export default class MdcHeaderBar extends Vue {
    public setup(): void {
    }

    private closeButtonClicked(): void {
        alt.emit("mdc:close");
    }
}
</script>

<style lang='scss' scoped>
.mdc-header-bar {
    flex-shrink: 0;
}

p {
    margin: 0.5vw;
}

.icon-button {
    background-color: #e04141 !important;
}
</style>
