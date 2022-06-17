<template>
    <div class='group-ranks-settings-page'>
        <div :hidden='editRankPermissionsOpen'>
            <button class='icon-button text-white' @click='back()'>
                <font-awesome-icon class='mx-2' icon='chevron-left' />
                <span>Ränge</span>
            </button>

            <p>Hier kannst du die Ränge deiner Gruppe bearbeiten.</p>

            <div class='ranks-block'>
                <div v-for='(rank, index) in ranks' v-bind:key='rank.level'>
                    <div class='row g-2 pt-2'>
                        <div class='col-md-10'>
                            <label class='form-label'>Rang {{ rank.level }} Name:</label>
                            <input v-model='rank.name' class='form-control-dark' maxlength='46' placeholder='Rangname' type='text' @blur='changeName(rank)' />
                        </div>
                        <div v-if='isOwner' class='col-md-1'>
                            <button class='btn btn-dark delete-rank-button' type='button' @click='editPermission(rank)'>
                                <font-awesome-icon icon='cog' />
                            </button>
                        </div>
                        <div v-if='index + 1 === ranks.length && ranks.length !== 1' class='col-md-1'>
                            <button class='btn btn-danger delete-rank-button' type='button' @click='deleteRank(rank)'>
                                <font-awesome-icon icon='trash' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button class='btn btn-primary w-100 mt-3' type='button' @click='create()'>
                Neuen Rang hinzufügen
            </button>
        </div>

        <group-permission-settings-page ref='groupPermissionSettingsPage' :hidden='!editRankPermissionsOpen' v-on:back='closeEditRankWindow()' />
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import GroupPermissionSettingsPage from "./GroupPermissionSettingsPage.vue";
import groups from "@/scripts/services/group.service";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {GroupRankInterface} from "@/scripts/interfaces/group/group-rank.interface";

@Options({
    components: {
        GroupPermissionSettingsPage,
    },
})
export default class GroupRanksSettingsPage extends Vue {
    @Ref() private readonly groupPermissionSettingsPage!: GroupPermissionSettingsPage;

    private ranks: GroupRankInterface[] | undefined = [];
    private groupId = -1;
    private isOwner = false;

    private editRankPermissionsOpen = false;

    public setup(groupId: number, isOwner: boolean): void {
        const group = groups.getInstance().AllGroups?.find((g) => g.id === groupId);
        if (group === undefined) {
            return;
        }
        
        this.ranks = group.ranks.sort((a, b) => {
            return a.level - b.level;
        });

        this.isOwner = isOwner;
        this.groupId = groupId;
        this.$forceUpdate();
    }

    private back(): void {
        this.$emit("back");
    }

    private create(): void {
        alt.emitServer("groupmenu:createrank", this.groupId);
    }

    private changeName(rank: GroupRankInterface): void {
        if (rank.name === "") {
            return;
        }

        alt.emitServer("groupmenu:changerankname", rank.groupId, rank.level, rank.name);
    }

    private editPermission(rank: GroupRankInterface): void {
        this.editRankPermissionsOpen = true;
        this.groupPermissionSettingsPage.setup(rank);
    }

    private closeEditRankWindow(): void {
        this.editRankPermissionsOpen = false;
    }

    private deleteRank(rank: GroupRankInterface): void {
        alt.emitServer("groupmenu:deleterank", rank.groupId, rank.level);
    }
}
</script>

<style scoped>
.ranks-block {
    height: 20em;
    overflow-y: auto;
    overflow-x: hidden;
}

.delete-rank-button {
    margin-top: 2em;
}
</style>
