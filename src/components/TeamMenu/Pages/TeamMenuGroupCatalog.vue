<template>
    <div class="team-menu-group-catalog">
        <div v-if="!isPopupOpen">
            <h2>Gruppen</h2>
            <input @input="search()" v-model="groupSearch" type="text" class="form-control-dark mb-2"
                   placeholder="Suche nach Namen (Bsp. Fire Department)"/>
            <div class="table-holder">
                <table class="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Typ</th>
                        <th>Character Besitzer ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="group in groups" v-bind:key="group.id" class="entry" @click="requestDetails(group)">
                        <td>{{ group.id }}</td>
                        <td>{{ group.name }}</td>
                        <td>{{ getStatusLabel(group.status) }}</td>
                        <td>{{ getGroupTypeLabel(group.groupType) }}</td>
                        <td>{{ getOwner(group.members) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else class="details">
            <button class="icon-button text-white" @click="closeDetails()">
                <font-awesome-icon class="mx-2" icon="chevron-left"/>
                <span>{{ this.openGroup.name }}</span>
            </button>
            
            <h6>Ränge</h6>
            <div class="detail-table-holder">
                <table class="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>Level</th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="rank in this.openGroup.ranks" v-bind:key="rank.level" class="entry">
                        <td>{{ rank.level }}</td>
                        <td>{{ rank.name }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <h6>Mitglieder</h6>
            <div class="detail-table-holder">
                <table class="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>Charakter ID</th>
                        <th>Name</th>
                        <th>Level</th>
                        <th>Gehalt</th>
                        <th>BankAccount ID</th>
                        <th>Besitzer</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="member in this.openGroup.members" v-bind:key="member.characterId" class="entry">
                        <td>{{ member.characterId }}</td>
                        <td>{{ member.characterName }}</td>
                        <td>{{ member.level }}</td>
                        <td>{{ member.salary }}</td>
                        <td>{{ member.bankAccountId }}</td>
                        <td>{{ member.owner ? "Ja" : "Nein" }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <h6>Fahrzeuge</h6>
            <div class="detail-table-holder">
                <table class="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>Fahrzeug ID</th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="vehicle in this.vehicles" v-bind:key="vehicle.id" class="entry">
                        <td>{{ vehicle.id }}</td>
                        <td>{{ vehicle.displayName }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <h6>Immobilien</h6>
            <div class="detail-table-holder">
                <table class="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>Haus ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="house in this.openGroup.houses" v-bind:key="house.id" class="entry">
                        <td>{{ house.id }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import alt from '@/scripts/services/alt.service';
import {GroupInterface} from "@/scripts/interfaces/group/group.interface";
import {GroupMemberInterface} from "@/scripts/interfaces/group/group-member.interface";
import {Vue} from "vue-class-component";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {VehicleInterface} from "@/scripts/interfaces/vehicle.interface";

export default class TeamMenuVehicleCatalog extends Vue {
    private groups: GroupInterface[] = []
    private chacheGroups: GroupInterface[] = []
    private groupSearch = "";
    
    private isPopupOpen = false;
    private openGroup!: GroupInterface;
    private bankAccount!: BankAccountInterface;
    private vehicles: VehicleInterface[] = [];
    
    public mounted(): void {
        alt.on("groupcatalog:setup", (args: any) => this.setup(args[0]));
        alt.on("groupcatalog:opendetails", (args: any) => this.openDetails(args[0], args[1], args[2]));
    }
    
    public unmounted(): void {
        alt.off("groupcatalog:setup");
        alt.off("groupcatalog:opendetails");
    }

    private setup(groups: GroupInterface[]): void {
        this.groups = groups;
        this.chacheGroups = this.groups;
        this.isPopupOpen = false;
    }

    private requestDetails(group: GroupInterface): void {
        alt.emitServer("groupcatalog:requestdetails", group.id);
    }
    
    private openDetails(group: GroupInterface, bankAccount: BankAccountInterface, vehicles: VehicleInterface[]): void {
        this.openGroup = group;
        this.bankAccount = bankAccount;
        this.vehicles = vehicles;
        this.isPopupOpen = true;
    }
    
    private closeDetails(): void {
        this.isPopupOpen = false;
    }
    
    private search(): void {
        if (this.groupSearch === "") {
            this.groups = this.chacheGroups;
            return;
        }

        this.groups = this.chacheGroups;
        this.groups = this.groups.filter(g => g.name.toLowerCase().includes(this.groupSearch.toLowerCase()));
    }

    private getGroupTypeLabel(type: number): string {
        switch (type) {
            case 0:
                return "Gruppe";
            case 1:
                return "Fraktion";
            case 2:
                return "Unternehmen";
        }

        return "";
    }

    private getOwner(members: GroupMemberInterface[]): string {
        const member = members.find(m => m.owner);
        if (member) {
            return member.characterName;
        }

        return "Kein Besitzer";
    }

    private getStatusLabel(type: number): string {
        switch (type) {
            case 0:
                return "Angefragt";
            case 1:
                return "Erstellt";
            case 2:
                return "Eingefroren";
        }

        return "";
    }
}
</script>

<style scoped>
.table-holder {
    height: 26.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.detail-table-holder {
    height: 7vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.details {
    height: 30.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.table,
.entry {
    color: white !important;
}
</style>