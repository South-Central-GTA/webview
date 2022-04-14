<template>
    <div class="account-card">
        <div class="transparent-card text-white">
            <div class="d-flex">
                <div class="p-2 flex-grow-1">
                    <h3>{{ name }}</h3>
                    <h6>South Central Points: <span class="badge bg-dark" style="color: white;">{{
                            characterPoints
                        }}</span></h6>

                    <div class="justify-content-end">
                        <a class="settings-button text-white text-decoration-none" @click="toggleSettingsMenu()">
                            Einstellungen
                            <font-awesome-icon v-if="!isSettingsVisible" icon="chevron-down"/>
                            <font-awesome-icon v-else icon="chevron-up"/>
                        </a>
                    </div>
                </div>

                <div>
                    <img :src="avatarUrl" class="avatar">
                </div>
            </div>
        </div>

        <div class="transparent-card text-white mt-2" v-if="isSettingsVisible">
            <div class="btn-group-vertical m-1">
                <button type="button" @click="isPasswordChangeDialogVisible = true;" class="btn mt-1 btn-secondary">
                    Passwort ändern
                </button>
            </div>
        </div>

        <dialog-change-password v-on:close="closePasswordDialog($event)" :hidden="!isPasswordChangeDialogVisible"/>
    </div>
</template>

<script lang="ts">
import account from '@/scripts/services/account.service';
import {AccountInterface} from '@/scripts/interfaces/account.interface';
import {Options, Vue} from "vue-class-component";
import DialogChangePassword from "@/components/DialogChangePassword.vue";

@Options({
    components: {
        DialogChangePassword
    }
})
export default class AccountCard extends Vue {
    private name = "Username";
    private avatarUrl = "Username";
    private characterPoints = 0;

    private isSettingsVisible = false;
    private isPasswordChangeDialogVisible = false;

    public mounted(): void {
        this.update(account.getInstance().Account);

        account.getInstance().AccountChanged.on((account: AccountInterface) => this.update(account));
    }

    public unmounted(): void {
        account.getInstance().AccountChanged.off((account: AccountInterface) => this.update(account));
    }

    private update(account: AccountInterface | undefined): void {
        if (account === undefined) {
            return;
        }

        this.name = account.currentName;
        this.avatarUrl = account.avatarUrl;
        this.characterPoints = account.southCentralPoints;
    }

    private toggleSettingsMenu(): void {
        this.isSettingsVisible = !this.isSettingsVisible;
    }

    private closePasswordDialog(): void {
        this.isPasswordChangeDialogVisible = false;
    }
}
</script>

<style scoped lang="scss">
.account-card {
    margin: 1vw;
    text-align: right;
}

.settings-button {
    &:hover {
        cursor: pointer;
    }
}

.avatar {
    width: 7vw;
    height: 7vw;
    border-radius: 1vw;
    padding: 0.5vw;
}

.btn button {
    padding: 0.8vw;
}
</style>