<template>
    <div class='mdc-fd-header-bar'>
        <div class='content row'>
            <div class='col-10'>
                <p class=''>Los Santos Fire Department</p>
            </div>
            <div class='col-1'>
                <img class='logo' src='@/assets/images/lsfd.png' />
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";

@Options({
    components: {},
})
export default class MdcFdHeaderBar extends Vue {
    public setup(): void {
    }
}
</script>

<style lang='scss' scoped>
.mdc-fd-header-bar {
    color: white;
    background-color: rgb(95, 0, 0);
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
