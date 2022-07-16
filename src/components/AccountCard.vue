<template>
    <div class='account-card'>
        <div class='transparent-card text-white'>
            <div class='d-flex'>
                <div class='p-2 flex-grow-1'>
                    <h3>{{ name }}</h3>
                    <h6>
                        South Central Points: <span class='badge bg-dark' style='color: white'>{{
                            characterPoints
                                                                                               }}</span>
                    </h6>
                </div>

                <div>
                    <img :src='avatarUrl' class='avatar' />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import account from "@/scripts/services/account.service";
import {Options, Vue} from "vue-class-component";
import {AccountInterface} from "@/scripts/interfaces/account.interface";

@Options({
    components: {},
})
export default class AccountCard extends Vue {
    private name = "Username";
    private avatarUrl = "Username";
    private characterPoints = 0;

    public mounted(): void {
        this.update(account.getInstance().account);

        account
            .getInstance()
            .accountChanged.on((account: AccountInterface) => this.update(account));
    }

    public unmounted(): void {
        account
            .getInstance()
            .accountChanged.off((account: AccountInterface) => this.update(account));
    }

    private update(account: AccountInterface | undefined): void {
        if (account === undefined) {
            return;
        }

        this.name = account.currentName;
        this.avatarUrl = account.avatarUrl;
        this.characterPoints = account.southCentralPoints;
    }
}
</script>

<style lang='scss' scoped>
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
