<template>
    <div class="phone-permission-bank-account">
        <div class="phone-header">
            <button class="icon-button" @click="back()">
                <font-awesome-icon icon="chevron-left"/>
                <span>Berechtigungen</span>
            </button>
        </div>

        <phone-add-permission-bank-account ref="phoneAddPermissionBankAccount" :hidden="currentTab !== 1"
                                           v-on:back="resetTab()"/>
        <phone-manage-permission-bank-account ref="phoneManagePermissionBankAccount" :hidden="currentTab !== 2"
                                              v-on:back="resetTab()"/>

        <img class="phone-bank-logo" src="@/assets/images/phone/maze-bank-logo.png">

        <div class="character-access-block">
            <div v-for="characterAccess in characterAccesses" v-bind:key="characterAccess.name">
                <button type="button" class="btn character-access-btn"
                        @click="openCharacterAccessSettings(characterAccess)"
                        :disabled="characterAccess.characterId === characterId"> {{ characterAccess.name }}
                </button>
            </div>

            <div class="no-character-access-block" v-if="characterAccesses.length === 0">
                <h2>Keine Zugriffsrechte vergeben...</h2>
            </div>
        </div>

        <div class="phone-bank-button-group">
            <button type="button" class="btn" @click="openTab(1)">Person hinzufügen</button>
        </div>
    </div>
</template>

<script lang="ts">
import character from "@/scripts/services/character.service";
import PhoneAddPermissionBankAccount from './PhoneAddPermissionBankAccount.vue';
import PhoneManagePermissionBankAccount from "./PhoneManagePermissionBankAccount.vue";
import {BankAccountCharacterAccessInterface} from "@/scripts/interfaces/bank/bank-account-character-access.interface";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";

@Options({
    components: {
        PhoneManagePermissionBankAccount,
        PhoneAddPermissionBankAccount
    }
})
export default class PhonePermissionBankAccount extends Vue {
    @Ref() private readonly phoneAddPermissionBankAccount!: PhoneAddPermissionBankAccount;
    @Ref() private readonly phoneManagePermissionBankAccount!: PhoneManagePermissionBankAccount;

    private characterAccesses: BankAccountCharacterAccessInterface[] = [];
    private bankAccountId = 0;
    private currentTab = 0;
    private characterId?: number | undefined;

    public setup(bankAccountId: number, characterAccesses: BankAccountCharacterAccessInterface[]): void {
        this.bankAccountId = bankAccountId;
        this.characterAccesses = characterAccesses.filter(ca => !ca.owner);

        this.characterId = character.getInstance().getCharacterId;

        this.phoneAddPermissionBankAccount.setup(this.bankAccountId);
    }

    private openCharacterAccessSettings(characterAccess: BankAccountCharacterAccessInterface): void {
        this.phoneManagePermissionBankAccount.setup(this.bankAccountId, characterAccess);
        this.openTab(2);
    }

    private back(): void {
        this.resetTab();
        this.$emit("back");
    }

    public resetTab(): void {
        this.openTab(0);
    }

    private openTab(id: number): void {
        this.currentTab = id;
    }
}
</script>

<style scoped lang="scss">
.phone-permission-bank-account {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: rgb(231, 231, 231);
    z-index: 100;
}

.character-access-block {
    overflow: auto;
    margin: auto;
    text-align: center;
    width: 100%;
    height: 19vh;
}

.no-character-access-block h2 {
    position: absolute;      
    text-align: center;
    top: 50%;
    color: rgba(59, 59, 59, 0.7);
    font-size: 0.9vw;
}

.character-access-btn {
    background-color: rgb(233, 33, 42);
    color: white !important;
    width: 90%;
    margin-top: 0.5vw;

    &:hover {
        background-color: rgb(192, 27, 35);
    }

    &:disabled {
        background-color: rgba(56, 53, 53, 0.282);
    }
}
</style>