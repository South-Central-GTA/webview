<template>
    <div class="internet-app programm">
        <div class="programm">
            <div class="topbar-internet">
                <div class="row p-2" v-if="pageId !== 0">
                    <div class="col-md-1">
                        <button
                            type="button"
                            class="btn w-100 btn-secondary"
                            @click="reset()"
                        >
                            Home
                        </button>
                    </div>
                    <div class="col-md-11">
                        <input
                            type="text"
                            class="form-control"
                            v-model="internetAddress"
                            readonly
                            disabled
                        />
                    </div>
                </div>
                <div class="row p-2" v-else>
                    <div class="col-md-12">
                        <input
                            type="text"
                            class="form-control"
                            v-model="internetAddress"
                            readonly
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div class="app-group" v-if="pageId === 0">
                <div class="row">
                    <button class="app vehicle-dealership" @click="openPageId(1)">
                        <font-awesome-icon class="center" icon="car"/>
                    </button>
                    <button class="app clear"></button>
                    <button class="app clear"></button>
                    <button class="app clear"></button>
                    <button class="app clear"></button>
                    <button class="app clear"></button>
                    <button class="app clear"></button>
                    <button class="app clear"></button>
                    <button class="app clear"></button>
                </div>
            </div>

            <vehicle-import-page ref="vehicleImportPage" :hidden="pageId !== 1"/>
        </div>
    </div>
</template>

<script lang="ts">
import alt from "@/scripts/services/alt.service";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import VehicleImportPage from "@/components/Phone/Pages/InternetPages/VehicleImportPage.vue";

@Options({
    components: {
        VehicleImportPage,
    },
})
export default class InternetApp extends Vue {
    @Ref() private readonly vehicleImportPage!: VehicleImportPage;

    private internetAddress = "";
    private pageId = -1;

    public open(): void {
        this.openPageId(0);
    }

    public reset(): void {
        this.vehicleImportPage.resetPage();

        this.openPageId(0);
    }

    private openPageId(id: number): void {
        if (this.pageId === id) {
            return;
        }

        switch (id) {
            case 0: {
                this.setDomain("eyefind.info");
                break;
            }
            case 1: {
                alt.emitServer("vehicledealer:requestpage");
                this.setDomain("southernsanandreassuperautos.com");
                break;
            }
        }

        this.pageId = id;
    }

    private setDomain(name: string): void {
        this.internetAddress = "www." + name;
    }
}
</script>

<style scoped lang="scss">
.internet-app {
    width: 100%;
    height: 100%;
    background-color: rgb(223, 230, 233);
}

.topbar-internet {
    padding: 2% 1% 0.5% 0.5%;
    width: 100%;
    background-color: rgb(178, 190, 195);
}

.app-group {
    padding: 0 0.6vw;

    & .row {
        padding: 1vw;
    }
}

.app {
    position: relative;
    width: 2.6vw;
    height: 2.6vw;
    float: left;
    margin: auto;

    outline: none;
    border: none;
    background: #c4c4c4;
    border-radius: 0.2vw;
    font-size: 1.5vw;
    color: white !important;
}

.vehicle-dealership {
    background-color: #ea2027;

    &:hover {
        background-color: #cb1c22 !important;
    }
}

.clear {
    opacity: 0;
}
</style>
