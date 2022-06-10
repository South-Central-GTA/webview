<template>
    <div class='team-menu-user-record'>
        <h2>User Akte</h2>
        <div>
            <h5>Automatische Einträge:</h5>
            <ul class='user-records-block list-group'>
                <li v-for='userRecord in automaticUserRecords' v-bind:key='userRecord.id' class='pb-1'>
                    <div class='border'>
                        [{{ getDate(userRecord.createdAtJson) }}]<br />{{
                            userRecord.text
                        }}<br /><span style='font-style: italic'>Ausführendes Teammitglied {{ userRecord.staffAccountName }}</span>
                    </div>
                </li>
            </ul>
        </div>
        <div>
            <h5>Team Einträge:</h5>
            <ul class='user-records-block list-group'>
                <li v-for='userRecord in staffUserRecords' v-bind:key='userRecord.id' class='pb-1'>
                    <div class='border'>
                        [{{ getDate(userRecord.createdAtJson) }}]<br />{{
                            userRecord.text
                        }}<br /><span style='font-style: italic'>Ausführendes Teammitglied {{ userRecord.staffAccountName }}</span>
                    </div>
                </li>
            </ul>
        </div>

        <textarea v-model='manuelUserEntry' class='form-control-dark' maxlength='2048' rows='2' style='resize: none' @blur='onFocus(false)' @focus='onFocus(true)'></textarea>

        <div class='pt-2'>
            <button :disabled='manuelUserEntry.trim().length < 5' class='btn btn-primary float-end' type='button' @click='saveEntry()'>
                Eintrag speichern
            </button>
        </div>

        <div class='alert alert-warning mt-5'>
            Einträge können nicht bearbeitet oder gelöscht werden.
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import {onFocus} from "@/scripts/helpers/helpers";
import {UserRecordInterface} from "@/scripts/interfaces/team-menu/user-record.interface";

export default class TeamMenuUserRecord extends Vue {
    private automaticUserRecords: UserRecordInterface[] = [];
    private staffUserRecords: UserRecordInterface[] = [];
    private manuelUserEntry: string = "";
    private accountId: number = 0;

    public open(): void {

    }

    public setup(accountId: number, userRecords: UserRecordInterface[]) {
        this.accountId = accountId;
        this.automaticUserRecords = userRecords.filter((ur) => ur.userRecordType == 0);
        this.staffUserRecords = userRecords.filter((ur) => ur.userRecordType == 1);
    }

    private saveEntry(): void {
        alt.emitServer("userrecord:saveentry", this.accountId, this.manuelUserEntry);
        this.manuelUserEntry = "";
    }

    private getDate(jsonDate: string): string {
        const date = new Date(JSON.parse(jsonDate));
        return date.toLocaleDateString("de-DE", {
            weekday: "short", hour: "numeric", minute: "numeric", month: "long", day: "numeric",
        });
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }
}
</script>

<style scoped>
.user-records-block {
    overflow: auto;
    margin: auto;
    width: 100%;
    height: 15.4vh;
}

.user-record {
    background-color: rgb(233, 33, 42);
    padding: 0.8vw;
    margin: 0.3vw 0.9vw;
}
</style>
