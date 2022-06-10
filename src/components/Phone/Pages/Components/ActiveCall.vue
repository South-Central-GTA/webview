<template>
    <div class='active-call'>
        <h1 class='call-with'>{{ displayedName }}</h1>
        <h1 class='call-time'>{{ callTime }}</h1>
        <div class='actions-block'>
            <div class='rows'>
                <button class='btn hangup-button' type='button' @click='hangupClicked'>
                    <font-awesome-icon class='center' icon='phone' />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

export default class ActiveCall extends Vue {
    @Ref() private readonly hangupButton!: HTMLButtonElement;

    private displayedName = "";
    private callTime = "Verbindungsaufbau...";
    private seconds = 0;
    private int: number | undefined;
    private hanguped = false;

    public mounted(): void {
        alt.on("phone:setupcall", (displayedName: string) => this.setup(displayedName, false));
        alt.on("phone:connectcall", () => this.connectCall());
        alt.on("phone:numberisbusy", () => this.busy());
        alt.on("phone:connectionfailed", () => this.failed());
        alt.on("phone:callgotdenied", () => this.callGotDenied());
    }

    public unmounted(): void {
        alt.off("phone:setupcall");
        alt.off("phone:connectcall");
        alt.off("phone:numberisbusy");
        alt.off("phone:connectionfailed");
        alt.off("phone:callgotdenied");

        clearInterval(this.int);
    }

    public setup(displayedName: string, connected = false): void {
        this.displayedName = displayedName.toString();

        this.callTime = "Verbindungsaufbau...";
        this.hanguped = false;

        if (connected) {
            this.connectCall();
        }
    }

    public hangupCall(): void {
        if (this.hanguped) {
            return;
        }

        if (this.int) {
            clearInterval(this.int);
            this.int = undefined;
        }

        this.callTime = "Aufgelegt!";
        this.seconds = 0;
        this.hanguped = true;

        setTimeout(() => {
            this.$emit("close");
        }, 1000);
    }

    private connectCall(): void {
        if (this.int) {
            clearInterval(this.int);
            this.int = undefined;
        }

        this.int = setInterval(() => {
            this.seconds++;

            const mind = this.seconds % (60 * 60);
            const minutes = Math.floor(mind / 60);

            const secd = mind % 60;
            const seconds = Math.ceil(secd);

            const correctMinutes = minutes <= 9 ? "0" + minutes : minutes.toString();
            const correctSeconds = seconds <= 9 ? "0" + seconds : seconds.toString();

            this.callTime = correctMinutes + ":" + correctSeconds;
        }, 1000);

        this.$emit("connect-call");
    }

    private busy(): void {
        this.callTime = "Besetzt!";
    }

    private failed(): void {
        this.callTime = "Keine Verbindung!";
    }

    private callGotDenied(): void {
        this.callTime = "Weggedrückt!";
        this.hanguped = true;

        setTimeout(() => {
            this.$emit("hangup", false);
        }, 1000);
    }

    private hangupClicked(): void {
        this.hangupCall();

        this.$emit("hangup");
    }
}
</script>

<style lang='scss' scoped>
.active-call {
    position: absolute;
    top: 0;
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
    color: black;
    font-size: 20px;
    margin: 4px;
}

.rows button:hover {
    background-color: rgb(190, 190, 190);
}

.hangup-button {
    position: relative;
    background-color: rgb(201, 91, 91) !important;
    color: white !important;
}

.hangup-button:hover {
    background-color: rgb(177, 78, 78) !important;
}
</style>
