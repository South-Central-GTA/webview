<template>
    <div class='company-worker-overview'>
        <div class='phone-header'>
            <button class='icon-button' type='button' @click='back()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Mitarbeiter</span>
            </button>
        </div>

        <company-worker-edit ref='workerEdit' :hidden='!isEditingWindowOpen' v-on:back='closeEditWorker()' />

        <div v-if='members.length !== 0' class='workers-block'>
            <button v-for='member in members' v-bind:key='member.characterName' :disabled='member.owner && !isOwner' class='workers-card' @click='openEditWorker(member)'>
                <h1>
                    {{
                        member.characterName
                    }}<span class='salary-text'>$ {{ member.salary }}</span>
                </h1>
            </button>
        </div>

        <div class='company-stats'>
            <hr />
            <h2>{{ members.length }} Mitarbeiter</h2>
            <hr />
        </div>
    </div>
</template>

<script lang='ts'>
import CompanyWorkerEdit from "./CompanyWorkerEditPage.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import character from "@/scripts/services/character.service";
import {GroupMemberInterface} from "@/scripts/interfaces/group/group-member.interface";
import {GroupInterface} from "@/scripts/interfaces/group/group.interface";

@Options({
    components: {
        CompanyWorkerEdit,
    },
})
export default class CompanyWorkerOverviewPage extends Vue {
    @Ref() private readonly workerEdit!: CompanyWorkerEdit;
    private members: GroupMemberInterface[] = [];
    private company!: GroupInterface;
    private isEditingWindowOpen = false;
    private isOwner = false;

    get getIsEditingWindowOpen() {
        return this.isEditingWindowOpen;
    }

    public setup(company: GroupInterface): void {
        this.company = company;
        this.members = company.members;

        const member = this.company.members.find((w) => w.characterId == character.getInstance().getCharacterId);
        if (member !== undefined) {
            this.isOwner = member.owner;
        }
    }

    public closeWindow(): void {
        this.workerEdit.save();
    }

    private openEditWorker(worker: GroupMemberInterface): void {
        this.workerEdit.setup(worker, this.company);
        this.isEditingWindowOpen = true;
    }

    private closeEditWorker(): void {
        this.isEditingWindowOpen = false;
    }

    private back(): void {
        this.$emit("back");
    }
}
</script>

<style lang='scss' scoped>
.company-worker-overview {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: whitesmoke;
    z-index: 200;
}

.logo {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -20%);
    height: 15%;
}

.input-text {
    height: 1.5vw;
    color: black;
    text-align: center;
    margin-bottom: 0.5vw;
}

.bankdetails-text {
    margin-top: 2.9vw;
}

.input-text::placeholder {
    color: black;
    font-style: italic;
}

.company-stats {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 100%;
    transform: translate(-50%, 0%);
}

.company-stats h1 {
    margin: unset;
    width: 100%;
    font-size: 1.3vw;
}

.company-stats h2 {
    margin: unset;
    width: 100%;
    font-size: 0.9vw;
}

.workers-block {
    margin-top: 3.5vw;
    height: 8vw;
    overflow: auto;
}

.workers-card {
    padding: 0.2vw;
    margin: 0.2vw;
    background-color: rgb(204, 204, 204);
    text-align: left;
    width: 80%;
    border: none;
}

.workers-card h1 {
    font-size: 0.6vw;
    margin: 0.2vw 0vw;
    padding-left: 0.5vw;
    pointer-events: none;
}

.salary-text {
    float: right;
    padding-right: 0.5vw;
    text-align: right;
}
</style>
