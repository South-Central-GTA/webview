<template>
    <div class='spawn-selector'>
        <div v-if='selectedSpawn' class='selected-box sc-card text-white'>
            <h4>Ausgewählter Spawn</h4>
            <h6>{{ selectedSpawn.name }}</h6>
            <button class='btn btn-secondary' type='button' @click='show()'>
                Anschauen
            </button>
        </div>

        <div class='select-box sc-card text-white bottom-center'>
            <div class='menu'>
                <div class='left'>
                    <button class='btn btn-secondary' type='button' @click='change(-1)'>
                        <font-awesome-icon icon='caret-left' />
                    </button>
                </div>

                <div class='w-100'>
                    <h5 class='text-center' style='height: 2vw'>
                        {{ currentSpawn.name }} </h5>
                    <button :disabled='selectedSpawn.name === currentSpawn.name' class='btn btn-primary' type='button' @click='select()'>
                        Auswählen
                    </button>
                </div>

                <div class='right'>
                    <button class='btn btn-secondary' type='button' @click='change(1)'>
                        <font-awesome-icon icon='caret-right' />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {SpawnInterface} from "@/scripts/interfaces/spawn.interface";

export default class SpawnSelector extends Vue {
    private buttonDisabled = false;
    private selectButtonDisabled = false;

    private currentSpawn: SpawnInterface = {
        id: 0, name: "", x: 0, y: 0, z: 0
    };

    private selectedSpawn: SpawnInterface = {
        id: 0, name: "", x: 0, y: 0, z: 0
    };

    public mounted(): void {
        alt.on("spawnselector:setinfo", (spawn: SpawnInterface) => this.setInfo(spawn));
        alt.on("spawnselector:defaultselect", (spawn: SpawnInterface) => this.defaultSelect(spawn));
    }

    public unmounted(): void {
        alt.off("spawnselector:setinfo");
        alt.off("spawnselector:defaultselect");
    }

    private setInfo(spawn: SpawnInterface): void {
        this.currentSpawn = spawn;

        this.buttonDisabled = false;

        if (this.selectedSpawn !== undefined && this.currentSpawn.id === this.selectedSpawn.id) {
            this.selectButtonDisabled = true;
        }
    }

    private change(direction: number): void {
        this.buttonDisabled = true;

        alt.emit("spawnselector:change", direction);

        this.selectButtonDisabled = false;
    }

    private defaultSelect(spawn: SpawnInterface): void {
        this.selectedSpawn = spawn;

        this.selectButtonDisabled = false;
        if (this.currentSpawn !== undefined && this.currentSpawn.id === this.selectedSpawn.id) {
            this.selectButtonDisabled = true;
        }
    }

    private select(): void {
        if (this.currentSpawn === undefined) {
            return;
        }

        alt.emit("spawnselector:select", this.currentSpawn.id);

        this.selectedSpawn = this.currentSpawn;
        this.selectButtonDisabled = true;
    }

    private show(): void {
        alt.emit("spawnselector:show");
    }
}
</script>

<style scoped>
.selected-box {
    width: 20vw;
    margin: 1vw;
    padding: 1vw;
    border-radius: 0.3vw;
}

.select-box {
    padding: 0.5vw;
    margin-bottom: 1vw;
    width: 20vw;
}

.btn {
    width: 100%;
}

.menu {
    display: flex;
    justify-content: center;
    position: relative;
}

.left {
    position: absolute;
    left: 0%;
}

.right {
    position: absolute;
    right: 0%;
}
</style>
