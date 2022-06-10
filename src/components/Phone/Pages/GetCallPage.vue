<template>
    <div class='get-call-page'>
        <h1 class='call-with'>{{ displayedName }}</h1>
        <div class='actions-block'>
            <div class='rows'>
                <button class='btn hangup-button' type='button' @click='deny()'>
                    <font-awesome-icon class='center' icon='phone-slash' />
                </button>
                <button class='btn accept-button' type='button' @click='accept()'>
                    <font-awesome-icon class='center' icon='phone' />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {isNumeric} from "@/scripts/helpers/helpers";
import {Vue} from "vue-class-component";

export default class GetCallPage extends Vue {
    private displayedName = "Max Mustermann";

    public setup(displayedName: string): void {
        if (isNumeric(displayedName)) {
            displayedName = this.getCorrectFormat(Number.parseInt(displayedName).toString());
        }

        this.displayedName = displayedName;
    }

    private deny(): void {
        alt.emit("phone:denycall");
        this.$emit("deny");
    }

    private accept(): void {
        alt.emit("phone:acceptcall");
    }

    private getCorrectFormat(numberString: string): string {
        return (numberString.substring(0, 3) + " - " + numberString.substring(3, numberString.length));
    }
}
</script>

<style lang='scss' scoped>
.get-call-page {
    width: 100%;
    height: 100%;

    background-color: rgb(125, 125, 125);
    z-index: 1;
}

.call-with {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -20%);

    width: 100%;
    font-size: 20px;
    text-align: center;
    color: white;
    margin: unset;
}

.call-time {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -20%);

    width: 100%;
    font-size: 14px;
    text-align: center;
    font-weight: 400;
    color: white;
    margin: unset;
}

.actions-block {
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translate(-50%, -75%);
    width: 100%;
    text-align: center;
}

.rows button {
    width: 42px;
    height: 42px;
    border-radius: 100%;
    background-color: rgb(209, 209, 209);
    font-size: 20px;
    margin: 15px;
}

.rows button:hover {
    background-color: rgb(190, 190, 190);
}

.hangup-button {
    position: relative;
    background-color: rgb(201, 91, 91) !important;
    color: white !important;

    &:hover {
        background-color: rgb(177, 78, 78) !important;
    }
}

.accept-button {
    position: relative;
    background-color: rgb(87, 168, 94) !important;
    color: white !important;

    &:hover {
        background-color: rgb(72, 141, 78) !important;
    }
}
</style>
