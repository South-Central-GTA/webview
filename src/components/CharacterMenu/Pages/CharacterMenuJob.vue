<template>
    <div class='character-menu-job'>
        <h2>Definierte Berufe</h2>

        <p class='card-text'>
            Charaktere arbeiten bei uns auf dem Server auf definierter Basis wodurch du dich auf das Wesentliche fokusieren kannst, Rollenspiel! Währenddessen du OOC arbeitest bzw. in der Schule bist oder auch nur Zuhause chillst, würde dein Charakter ja auch arbeiten, oder eben nicht. </p>

        <div :hidden='!isUnemployed'>
            <h5>In welchem Bereich arbeitet dein Charakter?</h5>

            <hr />
            <div class='jobs'>
                <select ref='select' :size='jobs.length'>
                    <option v-for='(job, i) in jobs' v-bind:key='job.id' :selected='0 == i'>
                        {{ job.name }}
                    </option>
                </select>
            </div>
            <hr />

            <p class='card-text'>
                Wähle das Bankkonto aus auf welchem das Gehalt von deinem definierten Beruf überwiesen werden soll: </p>

            <select-bank-account v-on:setup='setBankAccount($event)' v-on:change-bank-account='setBankAccount($event)' />

            <div class='bottom-0 position-absolute pb-5'>
                <p class='card-text text-muted'>
                    Solltest du mehr Rollenspiel wollen, können wir dir nur empfehlen eine unserer spielerbasierten Unternehmen aufzusuchen und dort IC einen Job dir zu besorgen. Sie bezahlen besser und du hast die beste Spielerfahrung. </p>

                <button :disabled='!hasBankAccount' class='btn btn-primary' type='button' @click='chooseJob()'>
                    Berufsfeld auswählen
                </button>
            </div>
        </div>

        <div :hidden='isUnemployed'>
            <div v-if='jobId !== 1'>
                <h5>Du arbeitest aktuell im Berufsfeld:</h5>
                <p class='card-text'>{{ jobName }}</p>
                <hr />
                <p class='card-text pt-2'>
                    Was genau dein Charakter beruflich in diesem Berufsfeld macht ist dir überlassen, definiere es für deinen Charakter realistisch passend. </p>
            </div>
            <div v-else>
                <p class='card-text'>{{ jobName }}</p>
                <hr />
            </div>

            <div class='align-bottom'>
                <p class='card-text'>
                    Wähle das Bankkonto aus auf welchem das Gehalt von deinem definierten Beruf überwiesen werden soll: </p>

                <select-bank-account v-on:setup='setBankAccount($event)' v-on:change-bank-account='changeBankAccount($event)' />

                <button class='btn btn-secondary mt-3' type='button' @click='quitJob()'>
                    Berufsfeld wechseln
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import SelectBankAccount from "@/components/General/Banking/SelectBankAccount.vue";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {DefinedJobDataInterface} from "@/scripts/interfaces/definedjob/defined-job-data.interface";

@Options({
    components: {
        SelectBankAccount,
    },
})
export default class CharacterMenuJob extends Vue {
    @Ref() private readonly select!: HTMLSelectElement;

    private active = false;
    private jobs: DefinedJobDataInterface[] = [];

    private isUnemployed = true;
    private hasBankAccount = false;
    private jobName = "";
    private jobId = 0;

    private selectedBankAccount?: BankAccountInterface;

    public mounted(): void {
        alt.on("jobmenu:setup",
            (jobs: DefinedJobDataInterface[], playerDefinedJob: DefinedJobDataInterface) => this.setup(jobs,
                playerDefinedJob));
        alt.on("jobmenu:sendplayerjob", (args: any[]) => this.setJob(args[0]));
    }

    public unmounted(): void {
        alt.off("jobmenu:setup");
        alt.off("jobmenu:sendplayerjob");
    }

    private setup(jobs: DefinedJobDataInterface[], playerDefinedJob: DefinedJobDataInterface): void {
        this.jobs = jobs;

        this.setJob(playerDefinedJob);
        this.active = true;
    }

    private setJob(playerDefinedJob: DefinedJobDataInterface): void {
        this.isUnemployed = playerDefinedJob === undefined || playerDefinedJob === null;

        if (!this.isUnemployed) {
            this.jobName = playerDefinedJob.name;
            this.jobId = playerDefinedJob.id;
        }
    }

    private chooseJob(): void {
        alt.emitServer("definedjob:select", this.jobs[this.select.options.selectedIndex].id,
            this.selectedBankAccount?.id);
    }

    private quitJob(): void {
        alt.emitServer("definedjob:quit");
    }

    private setBankAccount(bankAccount: BankAccountInterface): void {
        this.selectedBankAccount = bankAccount;
        this.hasBankAccount = true;
    }

    private changeBankAccount(bankAccount: BankAccountInterface): void {
        if (this.active) {
            this.setBankAccount(bankAccount);
            alt.emitServer("definedjob:changebankaccount", bankAccount.id);
        }
    }
}
</script>

<style scoped>
.jobs {
    overflow-y: auto;
    height: 8vw;
}

.jobs select {
    border: unset;
    width: 100%;
    font-size: 0.8vw;
    overflow-y: hidden;
    color: white;
    background-color: rgba(0, 0, 0, 0);
    outline: none;
}

.jobs select option {
    padding: 0.1vw 0;
}
</style>
