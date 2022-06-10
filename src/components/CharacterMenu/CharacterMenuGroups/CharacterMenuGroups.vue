<template>
    <div class='character-menu-groups'>
        <h2>Gruppen</h2>

        <div :hidden='groupSelected'>
            <div class='groups-block'>
                <div v-for='group in groups' v-bind:key='group.id'>
                    <button class='group-button btn btn-primary w-100' type='button' @click='selectGroup(group)'>
                        {{ group.name }} #{{ group.id }}
                    </button>
                </div>
                <div v-if='groups.length === 0'>
                    Dein Charakter ist in keiner Gruppe.
                </div>
            </div>
        </div>
        <div :hidden='!groupSelected'>
            <leave-group-page ref='leaveGroupPage' :hidden='pageIndex !== 0' v-on:back='resetPage()' v-on:leave='leaveGroup()' />

            <group-ranks-settings-page ref='groupRanksSettingsPage' :hidden='pageIndex !== 1' v-on:back='resetPage()' />

            <close-group-page ref='closeGroupPage' :hidden='pageIndex !== 2' v-on:back='resetPage()' v-on:delete='deleteGroup()' />

            <div :hidden='pageIndex !== -1'>
                <button class='icon-button text-white' @click='back()'>
                    <font-awesome-icon class='mx-2' icon='chevron-left' />
                    <span class=''>{{ groupName }}</span>
                </button>

                <div class='pt-1'>
                    <div class='section-box mt-2'>
                        <h6>Online Spieler</h6>
                        <p>{{ groupOnlinePlayersNames.join(", ") }}</p>
                    </div>

                    <div v-if='isOwner' class='section-box mt-2'>
                        <h6>Verwaltungs Optionen</h6>
                        <button class='btn btn-secondary w-100' type='button' @click='openPage(1)'>
                            Ränge verwalten
                        </button>
                    </div>

                    <div v-if='isOwner' class='section-box mt-2'>
                        <div class='row mb-2'>
                            <div class='col-4'>
                                <h6>Gruppen Inventare Verwaltung</h6>
                            </div>
                            <div class='col-8'>
                                <input id='search-bar' v-model='groupMemberSearch' class='form-control-dark w-100' placeholder='Suche nach bestimmten Charakter' type='text' @input='search()' />
                            </div>
                        </div>

                        <div class='row'>
                            <div v-for='member in groupMembers' v-bind:key='member.characterId' class='col-3'>
                                <button class='btn btn-secondary w-100 mb-1' type='button' @click='openMemberInventory(member.characterId)'>
                                    {{ member.characterName }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div :hidden='!hasVehicleDealer' class='section-box mt-2'>
                        <vehicle-dealer-menu ref='vehicleDealerMenu' />
                    </div>

                    <div v-if='!isOwner' class='red-section-box text-danger mt-4'>
                        <h6>Gefährlicher Bereich</h6>
                        <button class='btn btn-danger w-100' type='button' @click='openPage(0)'>
                            Gruppe verlassen
                        </button>
                    </div>
                    <div v-else class='red-section-box text-danger mt-4'>
                        <h6>Gefährlicher Bereich</h6>
                        <button class='btn btn-danger w-100' type='button' @click='openPage(2)'>
                            Gruppe löschen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import group from "@/scripts/services/group.service";
import character from "@/scripts/services/character.service";
import LeaveGroupPage from "./Pages/LeaveGroupPage.vue";
import GroupRanksSettingsPage from "./Pages/GroupRanksSettingsPage.vue";
import CloseGroupPage from "./Pages/CloseGroupPage.vue";
import VehicleDealerMenu from "./Pages/VehicleDealerMenu.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {GroupInterface} from "@/scripts/interfaces/group/group.interface";
import {GroupMemberInterface} from "@/scripts/interfaces/group/group-member.interface";
import {PlayerInterface} from "@/scripts/interfaces/player.interface";
import {CompanyInterface} from "@/scripts/interfaces/group/company.interface";
import {LicenseType} from "@/scripts/enums/license.type";

@Options({
    components: {
        LeaveGroupPage, VehicleDealerMenu, GroupRanksSettingsPage, CloseGroupPage,
    },
})
export default class CharacterMenuGroups extends Vue {
    @Ref() private readonly leaveGroupPage!: LeaveGroupPage;
    @Ref() private readonly closeGroupPage!: CloseGroupPage;
    @Ref() private readonly groupRanksSettingsPage!: GroupRanksSettingsPage;
    @Ref() private readonly vehicleDealerMenu!: VehicleDealerMenu;

    private groups: GroupInterface[] = [];

    private groupSelected = false;
    private groupName = "";
    private groupId: number | undefined = undefined;
    private groupMembers: GroupMemberInterface[] = [];
    private groupOnlinePlayersNames: string[] = [];

    private cachedGroupMembers: GroupMemberInterface[] = [];
    private groupMemberSearch = "";

    private hasVehicleDealer = false;
    private isOwner = false;
    private pageIndex = -1;

    public mounted(): void {
        group
            .getInstance()
            .AllGroupsChanged.on((groups: GroupInterface[] | undefined) => this.setup(groups));
        alt.on("groupmenu:senddetails", (args: any[]) => this.onSendDetails(args[0], args[1]));
    }

    public unmounted(): void {
        alt.off("groupmenu:senddetails");
    }

    public open(): void {
        if (this.groupId) {
            alt.emitServer("groupmenu:setup", this.groupId);
        } else {
            alt.emitServer("groupmenu:requestmenu");
        }
    }

    private setup(groups: GroupInterface[] | undefined): void {
        if (groups === undefined) {
            return;
        }

        this.groups = groups;

        const group = groups.find((g) => g.id === this.groupId);
        if (group === undefined) {
            return;
        }

        this.selectGroup(group);

        if (this.pageIndex === 1) {
            this.groupRanksSettingsPage.setup(group.id, this.isOwner);
        }
    }

    private onSendDetails(atBase: boolean, groupOnlinePlayers: PlayerInterface[]): void {
        this.vehicleDealerMenu?.setCloseToBase(atBase);
        this.groupOnlinePlayersNames = groupOnlinePlayers.map((p) => p.characterName);
    }

    private selectGroup(group: GroupInterface): void {
        this.groupSelected = true;
        this.groupName = group.name;
        this.groupId = group.id;
        this.groupMembers = group.members.filter((m) => m.characterId !== character.getInstance().getCharacterId);
        this.cachedGroupMembers = this.groupMembers;

        const company = group as CompanyInterface;
        if (company !== undefined) {
            this.hasVehicleDealer = (company.licenses & LicenseType.VEHICLE_DEALERSHIP) === LicenseType.VEHICLE_DEALERSHIP;
        }

        const member = group.members.find((m) => m.characterId === character.getInstance().getCharacterId);
        if (member) {
            this.isOwner = member.owner;

            if (!this.isOwner) {
                this.pageIndex = -1;
            }
        }

        this.leaveGroupPage?.setup(group.name);
        this.closeGroupPage?.setup(group.name);

        if (this.hasVehicleDealer) {
            this.vehicleDealerMenu?.setup(group.id);
        }

        alt.emitServer("groupmenu:requestdetails", this.groupId);
    }

    private openPage(index: number): void {
        if (index === 1 && this.groupId !== undefined) {
            this.groupRanksSettingsPage.setup(this.groupId, this.isOwner);
        }

        this.pageIndex = index;
    }

    private resetPage(): void {
        this.pageIndex = -1;
    }

    private leaveGroup(): void {
        alt.emitServer("groupmenu:leavegroup", this.groupId);
        this.back();
    }

    private deleteGroup(): void {
        alt.emitServer("groupmenu:deletegroup", this.groupId);
        this.back();
    }

    private back(): void {
        this.groupSelected = false;
        this.groupId = undefined;
        this.resetPage();
    }

    private openMemberInventory(characterId: number): void {
        this.$emit("close");
        alt.emitServer("group:openothersgroupinventory", this.groupId, characterId);
    }

    private search(): void {
        if (this.groupMemberSearch === "") {
            this.groupMembers = this.cachedGroupMembers;
            return;
        }

        this.groupMembers = this.cachedGroupMembers.filter((gm) => gm.characterName
            .toLowerCase()
            .includes(this.groupMemberSearch.toLowerCase()));
    }
}
</script>

<style scoped>
.groups-block {
    display: grid;
    grid-template-columns: repeat(2, 50%);
}

.group-button {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

#search-bar {
    font-size: 0.5vw;
    background-color: rgba(0, 0, 0, 0.5);
}

#search-bar::placeholder {
    font-size: 0.5vw;
    color: whitesmoke;
}

.section-box {
    border: rgba(0, 0, 0, 0.4) dashed 1px;
    padding: 0.3vw;
}

.red-section-box {
    border: rgba(255, 0, 0, 0.4) dashed 1px;
    padding: 0.3vw;
}
</style>
