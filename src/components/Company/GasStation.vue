<template>
    <div class='gas-station'>
        <div :hidden='!isRefuelMenuOpen' v-bind:class='{ enable: isRefuelMenuOpen, disable: !isRefuelMenuOpen }'>
            <div class='background'></div>
            <div class='modal-dialog'>
                <div class='modal-content sc-card text-white'>
                    <div class='modal-header'>
                        <h5 class='modal-title'>Tankstelle</h5>
                        <button class='btn-close-white icon-button float-end' type='button' @click='cancel()'>
                            <font-awesome-icon class='center' icon='times' />
                        </button>
                    </div>

                    <div class='modal-body'>
                        <p>
                            Der Treibstoff den du aktuell tanken möchtest kostet dich
                            <b>${{ fuelPrice }}</b> pro Liter, bezahlen kannst du es an der Zapfseule. </p>

                        <label class='form-label'>Treibstoff in Litern</label>
                        <input v-model='fuelAmount' class='form-control' maxlength='6' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' placeholder='Treibstoff in Liter' type='number' @blur='onFocus(false)' @focus='onFocus(true)' @keypress='allowOnlyNumbers($event)' />

                        <p class='text-muted pt-3'>
                            Du könntest maximal {{ maxAmount }} Liter auftanken. </p>
                    </div>

                    <div class='modal-footer justify-content-evenly row'>
                        <button class='btn btn-primary col-5' type='button' @click='refuel()'>
                            Auftanken
                        </button>
                        <button class='btn btn-secondary col-5' type='button' @click='cancel()'>
                            Abbrechen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {allowOnlyNumbers, onFocus} from "@/scripts/helpers/helpers";

export default class GasStation extends Vue {
    private isRefuelMenuOpen = false;
    private fuelAmount: number = 0;
    private maxAmount: number = 0;
    private fuelPrice: number = 0;

    public mounted(): void {
        alt.on("gasstation:openrefuelmenu",
            (maxPossibleFuel: number, fuelPrice: number) => this.showRefuelMenu(maxPossibleFuel, fuelPrice));
    }

    public unmounted(): void {
        alt.off("gasstation:openrefuelmenu");
    }

    private showRefuelMenu(maxPossibleFuel: number, fuelPrice: number): void {
        this.isRefuelMenuOpen = true;
        this.fuelAmount = Number(maxPossibleFuel.toFixed(2));
        this.maxAmount = Number(maxPossibleFuel.toFixed(2));
        this.fuelPrice = fuelPrice;
    }

    private refuel(): void {
        alt.emitServer("gasstation:requestrefuel", this.fuelAmount);
        this.cancel();
    }

    private cancel(): void {
        alt.emit("gasstation:close");
        this.isRefuelMenuOpen = false;
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        allowOnlyNumbers(state);
    }
}
</script>

<style scoped>
.gas-station {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
}

.background {
    pointer-events: all;
}

.modal-dialog {
    margin-top: 20%;
    z-index: 999999;
    pointer-events: all;
    overflow: hidden;
}
</style>
