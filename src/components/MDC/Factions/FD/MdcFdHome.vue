<template>
    <div class='mdc-pd-home'>
        <div class='content row'>
            <div class='col-6'>
                <div class='m-4'>
                    <div v-if='hasCallSign' class='row p-2'>
                        <div class='col-12'>
                            <button class='w-100' type='button' @click='removeCallSign'>
                                Callsign austragen
                            </button>
                        </div>
                    </div>
                    <div v-else class='row p-2'>
                        <div class='col-8'>
                            <input v-model='callSign' class='w-100' maxlength='12' placeholder='25E32' type='text' />
                        </div>
                        <div class='col-4'>
                            <button class='w-100' type='button' @click='addCallSign'>
                                Callsign eintragen
                            </button>
                        </div>
                    </div>
                    <div class='table-holder'>
                        <table class='table table-striped table-hover'>
                            <thead>
                            <tr>
                                <th v-if='isOperator' scope='col'></th>
                                <th scope='col'>Callsign</th>
                                <th scope='col'>Mitarbeiter</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='sign in callSigns' v-bind:key='sign.id'>
                                <td v-if='isOperator'>
                                    <button type='button' @click='deleteCallSign(sign.callSign)'>
                                        X
                                    </button>
                                </td>
                                <th scope='row'>{{ sign.callSign }}</th>
                                <td>{{ sign.names }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class='col-6'>
                <div class='m-4'>
                    <h2>911 NOTRUFE</h2>
                    <div class='table-holder'>
                        <table class='table table-striped table-hover'>
                            <thead>
                            <tr>
                                <th v-if='isOperator' scope='col'></th>
                                <th scope='col'>Uhrzeit</th>
                                <th scope='col'>Nummer</th>
                                <th scope='col'>Beschreibung</th>
                                <th scope='col'>Ort</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='call in emergencyCalls' v-bind:key='call.id'>
                                <td v-if='isOperator'>
                                    <button type='button' @click='deleteEmergencyCall(call.id)'>
                                        X
                                    </button>
                                </td>
                                <td>{{ getDate(call.createdAtJson) }}</td>
                                <td>{{ call.phoneNumber }}</td>
                                <td>{{ call.situation }}</td>
                                <td>{{ call.location }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import MdcService from "@/scripts/services/mdc.service";
import {EmergencyCallInterface} from "@/scripts/interfaces/mdc/emergency-call.interface";
import {CallSignInterface} from "@/scripts/interfaces/mdc/call-sign.interface";

@Options({
    components: {},
})
export default class MdcFdHome extends Vue {
    private hasCallSign: boolean = false;
    private isOperator: boolean = false;
    private callSign: string = "";

    private emergencyCalls: EmergencyCallInterface[] = [];
    private callSigns: CallSignInterface[] = [];

    public mounted(): void {
        alt.on("firemdc:openhomescreen", (args: any[]) => this.onOpen(args[0], args[1], args[2]));
        alt.on("firepolicemdc:updateemergencycalls", (args: any[]) => this.onUpdateEmergencyCalls(args[0]));

        MdcService.getInstance().onIsOperatorChanged.on((value: boolean) => this.onIsOperatorChanged(value));
    }

    public unmounted(): void {
        alt.off("firemdc:openhomescreen");
        alt.off("firepolicemdc:updateemergencycalls");

        MdcService.getInstance().onIsOperatorChanged.off((value: boolean) => this.onIsOperatorChanged(value));
    }

    public updateCallSigns(callSigns: CallSignInterface[], hasCallSign: boolean): void {
        this.callSigns = callSigns;
        this.hasCallSign = hasCallSign;
    }

    private onOpen(emergencyCalls: EmergencyCallInterface[], callSigns: CallSignInterface[], hasCallSign: boolean): void {
        this.emergencyCalls = emergencyCalls;
        this.callSigns = callSigns;
        this.hasCallSign = hasCallSign;
    }

    private onUpdateEmergencyCalls(emergencyCalls: EmergencyCallInterface[]): void {
        this.emergencyCalls = emergencyCalls;
    }

    private onIsOperatorChanged(value: boolean): void {
        this.isOperator = value;
    }

    private addCallSign(): void {
        if (this.callSign === "") {
            return;
        }

        alt.emitServer("firemdc:addcallsign", this.callSign);
        this.callSign = "";
    }

    private removeCallSign(): void {
        alt.emitServer("firemdc:removecallsign");
    }

    private deleteEmergencyCall(id: number): void {
        alt.emitServer("firemdc:deleteemergencycall", id);
    }

    private deleteCallSign(callSign: string): void {
        alt.emitServer("firemdc:deletecallsign", callSign);
    }

    private getDate(jsonDate: string): string {
        const date = new Date(JSON.parse(jsonDate));
        return date.toLocaleDateString("de-DE", {
            weekday: "short", hour: "numeric", minute: "numeric", month: "numeric", year: "numeric", day: "numeric",
        });
    }
}
</script>

<style lang='scss' scoped>
.mdc-fd-home {
    background-color: #cecece;
    height: 100%;
}

.table-holder {
    height: 30vw;
    overflow-x: hidden;
    overflow-y: auto;
}

::-webkit-scrollbar-thumb {
    background: rgb(122, 123, 124);
}
</style>
