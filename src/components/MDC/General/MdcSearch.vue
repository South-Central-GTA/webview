<template>
    <div class="mdc-search">
        <div class="content row m-4">
            <div class="col">
                <h5>Interne Suche:</h5>
                <input
                    class="w-100"
                    :placeholder="placeHolderText"
                    v-model="searchInput"
                    type="text"
                    :disabled="isLoading"
                />
                <button class="w-100 mt-2" @click="searchClicked" :disabled="isLoading">
                    Suchen
                </button>

                <div v-if="searchEntities.length !== 0" class="list-holder pt-5">
                    <div
                        class="pb-1"
                        v-for="(entity, index) in searchEntities"
                        v-bind:key="index"
                    >
                        <button class="w-100" @click="clickEntity(entity)">
                            {{ entity.name }}
                        </button>
                    </div>
                </div>
                <div v-else class="text-center pt-5">Keine Suchergebnisse!</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import {MdcSearchEntityInterface} from "@/scripts/interfaces/mdc/mdc-search-entity.interface";
import {FactionType} from "@/scripts/enums/faction.type";

@Options({
    components: {},
})
export default class MdcSearch extends Vue {
    private searchEntities: MdcSearchEntityInterface[] = [];

    private searchInput: string = "";
    private placeHolderText: string = "";
    private isLoading: boolean = false;
    private factionType: FactionType = FactionType.CITIZEN;

    public setup(factionType: FactionType): void {
        this.factionType = factionType;

        switch (factionType) {
            case FactionType.POLICE_DEPARTMENT:
                this.placeHolderText =
                    "Max Mustermann oder 55512345678 oder SA-123456789 oder 1ABC2345 oder maxmustermann@mail.sa";
                break;
            case FactionType.FIRE_DEPARTMENT:
                this.placeHolderText = "Max Mustermann";
                break;
        }
    }

    public setEntities(searchEntities: MdcSearchEntityInterface[]): void {
        this.searchEntities = searchEntities;
        this.isLoading = false;
    }

    private searchClicked(): void {
        if (this.isLoading || this.searchInput.length === 0) {
            return;
        }

        alt.emitServer("mdc:search", this.searchInput);

        this.isLoading = true;
    }

    private clickEntity(entity: MdcSearchEntityInterface): void {
        alt.emitServer(
            "mdc:openmdcsearchentity",
            entity.id !== -1 ? entity.id : entity.stringId,
            entity.type
        );
    }
}
</script>

<style scoped lang="scss">
.mdc-search {
    background-color: #cecece;
    height: 100%;
}

.list-holder {
    height: 30vw;
    overflow-x: hidden;
    overflow-y: auto;
}

::-webkit-scrollbar-thumb {
    background: rgb(122, 123, 124);
}
</style>
