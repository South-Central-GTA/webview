<template>
    <div class='bank-history'>
        <div v-if='mobileVersion' class='phone-header'>
            <button class='icon-button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Umsätze</span>
            </button>
        </div>

        <div v-if='mobileVersion' class='m-4'>
            <input v-model='entrySearch' class='form-control w-100' placeholder='Umsätze durchsuchen...' type='text' @input='search()' />
        </div>
        <div v-else class='row'>
            <div class='col-10'>
                <input v-model='entrySearch' class='form-control m-4' placeholder='Umsätze durchsuchen...' type='text' @input='search()' />
            </div>

            <div class='col-2'>
                <button class='atm-close-button float-end' type='button' @click='back()'>
                    <font-awesome-icon class='center' icon='caret-left' />
                </button>
            </div>
        </div>

        <div class='history-block pb-5'>
            <button v-if='currentSelectionIndex !== 0' class='btn btn-secondary p-2' type='button' @click='getNewerEntries()'>
                Neuer ...
            </button>
            <div v-for='entry in history' v-bind:key='entry.id' class='row entry' v-bind:class="{ 'entry-atm': !mobileVersion }">
                <div class='col-12'>
                    <p class='text-start float-start'>
                        {{ entry.purposeOfUse }} </p>
                    <span class='money float-end' v-bind:class='{ positive: entry.income, negative: !entry.income }'>
            <span v-if='!entry.income'>-</span>{{ entry.amount }}$
          </span>
                </div>
                <div v-if='mobileVersion' class='col-12'>
                    <p class='text-start text-muted'>
                        {{ getDate(entry.sendetAtJson) }} | {{ getType(entry.type) }} </p>
                </div>
                <div v-if='!mobileVersion' class='col-8'>
                    <p class='text-start text-muted'>
                        {{ getDate(entry.sendetAtJson) }} </p>
                </div>
                <div v-if='!mobileVersion' class='col-4'>
                    <p class='text-end text-muted'>
                        {{ getType(entry.type) }} </p>
                </div>
            </div>
            <button v-if='
          this.STEPS * currentSelectionIndex + this.STEPS < allHistory.length
        ' class='btn btn-secondary p-2' type='button' @click='getOlderEntries()'>
                Ältere ...
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import {Vue} from "vue-class-component";
import {BankHistoryEntryInterface} from "@/scripts/interfaces/bank/bank-history-entry.interface";
import {BankHistoryType} from "@/scripts/enums/bank-history.type";

export default class BankHistory extends Vue {
    private STEPS: number = 100;

    private allHistory: BankHistoryEntryInterface[] = [];
    private history: BankHistoryEntryInterface[] = [];
    private cachedHistory: BankHistoryEntryInterface[] = [];

    private entrySearch: string = "";
    private mobileVersion: boolean = false;
    private currentSelectionIndex: number = 0;

    public setup(allHistory: BankHistoryEntryInterface[], mobileVersion: boolean): void {
        allHistory.sort((a: BankHistoryEntryInterface, b: BankHistoryEntryInterface) => {
            return this.getTime(b.sendetAtJson) - this.getTime(a.sendetAtJson);
        });

        this.allHistory = allHistory;

        this.mobileVersion = mobileVersion;

        this.getHistorySection(0);
    }

    private back(): void {
        this.$emit("back");
    }

    private getNewerEntries(): void {
        this.currentSelectionIndex--;
        this.getHistorySection(this.currentSelectionIndex);
    }

    private getOlderEntries(): void {
        this.currentSelectionIndex++;
        this.getHistorySection(this.currentSelectionIndex);
    }

    private getHistorySection(section: number): void {
        this.currentSelectionIndex = section;

        let start = this.STEPS * this.currentSelectionIndex;
        let end = start + this.STEPS;

        if (end > this.allHistory.length) {
            end = this.allHistory.length;
        }

        this.history = this.allHistory.slice(start, end);
        this.cachedHistory = this.history;

        this.entrySearch = "";
    }

    private getDate(jsonDate: string): string {
        const date = new Date(JSON.parse(jsonDate));
        if (this.mobileVersion) {
            return date.toLocaleDateString("de-DE", {
                hour: "numeric", minute: "numeric", month: "numeric", year: "numeric", day: "numeric",
            });
        } else {
            return date.toLocaleDateString("de-DE", {
                weekday: "long", hour: "numeric", minute: "numeric", month: "long", year: "numeric", day: "numeric",
            });
        }
    }

    private getType(type: BankHistoryType): string {
        switch (type) {
            case BankHistoryType.WITHDRAW:
                return "Auszahlung";
            case BankHistoryType.DEPOSIT:
                return "Einzahlung";
            case BankHistoryType.TRANSFER:
                return "Überweisung";
        }
    }

    private search(): void {
        if (this.entrySearch === "") {
            this.history = this.cachedHistory;
            return;
        }

        this.history = this.cachedHistory.filter(
            (h) => h.purposeOfUse.toLowerCase().includes(this.entrySearch.toLowerCase()));
    }

    private getTime(dateJson: string) {
        const date = new Date(JSON.parse(dateJson));
        return date !== null ? date.getTime() : 0;
    }
}
</script>

<style lang='scss' scoped>
.bank-history {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;

    background-image: url("../../../assets/images/patterns/checks.png");
    background-position: center center;
    background-size: 20vw;
}

.history-block {
    overflow-y: auto;
    overflow-x: hidden;
    height: 80%;

    &::-webkit-scrollbar {
        display: none;
    }
}

.entry {
    background-color: white;
    margin: 0.1vw;
}

.entry-atm {
    padding-right: 2vw;
    padding-left: 2vw;
}

.money {
    font-weight: 500;
    text-align: end;
}

.positive {
    color: green;
}

.negative {
    color: red;
}
</style>
