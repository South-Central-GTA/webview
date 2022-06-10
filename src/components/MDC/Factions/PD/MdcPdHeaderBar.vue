<template>
    <div class='mdc-pd-header-bar'>
        <div class='content row'>
            <div class='col-10'>
                <p class=''>Los Santos Police Department</p>
            </div>
            <div class='col-1'>
                <img class='logo' src='@/assets/images/lspd.png' />
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";

@Options({
    components: {},
})
export default class MdcPdHeaderBar extends Vue {
    public setup(): void {
    }
}
</script>

<style lang='scss' scoped>
.mdc-pd-header-bar {
    color: white;
    background-color: rgb(0, 48, 95);
}

.content {
    padding: 0.5vw;

    p {
        font-size: 1.25vw;
        font-weight: 700;
        text-transform: uppercase;
    }
}

.logo {
    width: 50%;
}
</style>
