<template>
    <div class='mdc-bank-account-record'>
        <div class='content h-100 row m-4'>
            <div class='col-4'>
                <h3>{{ bankDetails }}</h3>
                <h4>Informationen:</h4>
                <p v-if='accesses.length === 0'>
                    <b>Zugriff:</b> Keine Suchergebnisse! </p>
                <p v-if='accesses.length !== 0'><b>Zugriff:</b></p>
                <ul v-if='accesses.length !== 0' class='list-holder'>
                    <li v-for='access in accesses' v-bind:key='access.name'>
                        {{ access.name }} Besitzer: {{ access.owner ? "Ja" : "Nein" }}
                    </li>
                </ul>
            </div>
            <div class='col-6'>
                <h4>Notizen:</h4>

                <div v-if='notes.length !== 0' class='big-list-holder'>
                    <p v-for='note in notes' v-bind:key='note.id'>
                        <button v-if='isOperator' type='button' @click='deleteNote(note.id)'>
                            X
                        </button>
                        {{ note.note }}<br /><span class='date-text'>{{ note.creatorCharacterName }} -
              {{ getDate(note.createdAtJson) }}</span>
                    </p>
                </div>

                <div class='position-absolute mb-5 bottom-0'>
                    <input v-model='noteInput' class='w-100' type='text' />

                    <button class='float-end mt-1' type='button' @click='createNote()'>
                        Notiz erstellen
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import MdcService from "@/scripts/services/mdc.service";
import {MdcNoteInterface} from "@/scripts/interfaces/mdc/mdc-note.interface";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {BankAccountCharacterAccessInterface} from "@/scripts/interfaces/bank/bank-account-character-access.interface";
import {BankAccountGroupAccessInterface} from "@/scripts/interfaces/bank/bank-account-group-access.interface";
import {MdcSearchType} from "@/scripts/enums/mdc-search.type";

interface AccessInterface {
    name: string;
    owner: boolean;
}

@Options({
    components: {},
})
export default class MdcBankAccountRecord extends Vue {
    private isOperator: boolean = false;

    private bankAccountId: number = 0;
    private bankDetails: string = "";
    private notes: MdcNoteInterface[] = [];

    private accesses: AccessInterface[] = [];

    private noteInput: string = "";

    public mounted(): void {
        MdcService.getInstance().onIsOperatorChanged.on((value: boolean) => this.onIsOperatorChanged(value));
    }

    public unmounted(): void {
        MdcService.getInstance().onIsOperatorChanged.off((value: boolean) => this.onIsOperatorChanged(value));
    }

    public setup(bankAccount: BankAccountInterface, notes: MdcNoteInterface[]): void {
        this.bankAccountId = bankAccount.id;
        this.bankDetails = bankAccount.bankDetails;
        this.notes = notes;

        this.accesses = [];

        bankAccount.characterAccesses.forEach((access: BankAccountCharacterAccessInterface) => {
            this.accesses.push({
                name: access.name, owner: access.owner,
            });
        });

        bankAccount.groupAccesses.forEach((access: BankAccountGroupAccessInterface) => {
            this.accesses.push({
                name: access.name, owner: access.owner,
            });
        });
    }

    private onIsOperatorChanged(value: boolean): void {
        this.isOperator = value;
    }

    private createNote(): void {
        if (this.noteInput.length === 0) {
            return;
        }

        alt.emitServer("policemdc:createnote", this.bankAccountId, MdcSearchType.BANK_ACCOUNT, this.noteInput);

        this.noteInput = "";
    }

    private deleteNote(id: number): void {
        alt.emitServer("policemdc:deletenote", id);
    }

    private getDate(dateJson: string): string {
        if (dateJson.length === 0) {
            return "";
        }

        const date = new Date(JSON.parse(dateJson));
        return date.toLocaleDateString("de-DE", {
            hour: "numeric", minute: "numeric", year: "numeric", month: "numeric", day: "numeric",
        });
    }
}
</script>

<style lang='scss' scoped>
.mdc-bank-account-record {
    background-color: #cecece;
    height: 100%;
}

.list-holder {
    height: 5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.big-list-holder {
    height: 25vw;
    overflow-x: hidden;
    overflow-y: auto;

    button {
        pointer-events: all !important;
    }
}

::-webkit-scrollbar-thumb {
    background: rgb(122, 123, 124);
}

.date-text {
    color: gray;
    text-align: right;
    font-style: italic;
    font-size: 0.6vw;
}
</style>
