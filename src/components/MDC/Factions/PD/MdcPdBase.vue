<template>
    <div class='mdc-pd-base'>
        <mdc-pd-header-bar></mdc-pd-header-bar>
        <div class='float-start'>
            <div class='btn-group-vertical m-4'>
                <button class='w-100 m-2' type='button' @click='openPageId(0)'>
                    Home
                </button>
                <button class='w-100 m-2' type='button' @click='openPageId(1)'>
                    Suche
                </button>
                <button class='w-100 m-2' type='button' @click='openPageId(2)'>
                    APB
                </button>
                <button class='w-100 m-2' type='button' @click='openPageId(3)'>
                    Dateien
                </button>
            </div>
        </div>

        <mdc-pd-home ref='home' :hidden='pageId !== 0'></mdc-pd-home>
        <mdc-search ref='search' :hidden='pageId !== 1'></mdc-search>
        <mdc-apb ref='apb' :hidden='pageId !== 2'></mdc-apb>
        <mdc-files ref='files' :hidden='pageId !== 3' v-on:show-notification='onShowNotification'></mdc-files>

        <mdc-character-record ref='characterRecord' :hidden='pageId !== 1000'></mdc-character-record>
        <mdc-phone-record ref='phoneRecord' :hidden='pageId !== 1001'></mdc-phone-record>
        <mdc-vehicle-record ref='vehicleRecord' :hidden='pageId !== 1002'></mdc-vehicle-record>
        <mdc-bank-account-record ref='bankAccountRecord' :hidden='pageId !== 1003'></mdc-bank-account-record>
        <mdc-mail-account-record ref='mailAccountRecord' :hidden='pageId !== 1004'></mdc-mail-account-record>
        <mdc-weapon-record ref='weaponRecord' :hidden='pageId !== 1005'></mdc-weapon-record>
    </div>
</template>

<script lang='ts'>
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import MdcPdHeaderBar from "@/components/MDC/Factions/PD/MdcPdHeaderBar.vue";
import MdcPdHome from "@/components/MDC/Factions/PD/MdcPdHome.vue";
import {Ref} from "vue-property-decorator";
import MdcService from "@/scripts/services/mdc.service";
import MdcSearch from "@/components/MDC/General/MdcSearch.vue";
import MdcCharacterRecord from "@/components/MDC/Factions/PD/MdcCharacterRecord.vue";
import MdcPhoneRecord from "@/components/MDC/Factions/PD/MdcPhoneRecord.vue";
import MdcVehicleRecord from "@/components/MDC/Factions/PD/MdcVehicleRecord.vue";
import MdcBankAccountRecord from "@/components/MDC/Factions/PD/MdcBankAccountRecord.vue";
import MdcMailAccountRecord from "@/components/MDC/Factions/PD/MdcMailAccountRecord.vue";
import MdcWeaponRecord from "@/components/MDC/Factions/PD/MdcWeaponRecord.vue";
import MdcFiles from "@/components/MDC/General/MdcFiles.vue";
import MdcFile from "@/components/MDC/General/MdcFile.vue";
import MdcApb from "@/components/MDC/Factions/PD/MdcApb.vue";
import {FactionType} from "@/scripts/enums/faction.type";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {CriminalRecordInterface} from "@/scripts/interfaces/mdc/criminal-record.interface";
import {PoliceTicketInterface} from "@/scripts/interfaces/mdc/police-ticket.interface";
import {VehicleInterface} from "@/scripts/interfaces/vehicles/vehicle.interface";
import {HouseInterface} from "@/scripts/interfaces/house.interface";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {MdcNoteInterface} from "@/scripts/interfaces/mdc/mdc-note.interface";
import {ApbEntryInterface} from "@/scripts/interfaces/mdc/apb-entry.interface";
import {CallSignInterface} from "@/scripts/interfaces/mdc/call-sign.interface";
import {MdcSearchEntityInterface} from "@/scripts/interfaces/mdc/mdc-search-entity.interface";
import {MailAccountInterface} from "@/scripts/interfaces/mail/mail-account.interface";

@Options({
    components: {
        MdcApb,
        MdcFile,
        MdcFiles,
        MdcMailAccountRecord,
        MdcWeaponRecord,
        MdcBankAccountRecord,
        MdcVehicleRecord,
        MdcPhoneRecord,
        MdcCharacterRecord,
        MdcSearch,
        MdcPdHome,
        MdcPdHeaderBar,
    },
})
export default class MdcPdBase extends Vue {
    @Ref() private readonly home!: MdcPdHome;
    @Ref() private readonly search!: MdcSearch;
    @Ref() private readonly apb!: MdcApb;
    @Ref() private readonly characterRecord!: MdcCharacterRecord;
    @Ref() private readonly phoneRecord!: MdcPhoneRecord;
    @Ref() private readonly vehicleRecord!: MdcVehicleRecord;
    @Ref() private readonly bankAccountRecord!: MdcBankAccountRecord;
    @Ref() private readonly mailAccountRecord!: MdcMailAccountRecord;
    @Ref() private readonly weaponRecord!: MdcWeaponRecord;
    @Ref() private readonly files!: MdcFiles;

    private pageId: number = 0;
    private isOperator: boolean = false;

    public setup(): void {
        this.openPageId(0);

        MdcService.getInstance().onIsOperatorChanged.on((value: boolean) => this.onIsOperatorChanged(value));

        alt.on("policemdc:openapbscreen", (args: any[]) => this.onOpenApbScreen(args[0]));
        alt.on("policemdc:opencharacterrecord",
            (character: CharacterInterface, records: CriminalRecordInterface[], tickets: PoliceTicketInterface[], nodes: MdcNoteInterface[], vehicles: VehicleInterface[], houses: HouseInterface[], bankAccounts: BankAccountInterface[], phoneNumbers: string[]) => this.onOpenCharacterRecord(
                character, records, tickets, nodes, vehicles, houses, bankAccounts, phoneNumbers));
        alt.on("policemdc:openphonerecord",
            (args: any[]) => this.onOpenPhoneRecord(args[0], args[1], args[2], args[3]));
        alt.on("policemdc:openvehiclerecord",
            (args: any[]) => this.onOpenVehicleRecord(args[0], args[1], args[2], args[3], args[4], args[5]));
        alt.on("policemdc:openbankaccountrecord", (args: any[]) => this.onOpenBankAccountRecord(args[0], args[1]));
        alt.on("policemdc:openmailaccountrecord", (args: any[]) => this.onOpenMailAccountRecord(args[0], args[1]));
        alt.on("policemdc:openweaponrecord",
            (args: any[]) => this.onOpenWeaponRecord(args[0], args[1], args[2], args[3], args[4]));

        this.search.setup(FactionType.POLICE_DEPARTMENT);
        this.files.setup();
    }

    public close(): void {
        MdcService.getInstance().onIsOperatorChanged.off((value: boolean) => this.onIsOperatorChanged(value));

        alt.off("policemdc:openapbscreen");
        alt.off("policemdc:opencharacterrecord");
        alt.off("policemdc:openphonerecord");
        alt.off("policemdc:openvehiclerecord");
        alt.off("policemdc:openbankaccountrecord");
        alt.off("policemdc:openmailaccountrecord");
        alt.off("policemdc:openweaponrecord");

        this.files.terminate();
    }

    public updateCallSigns(callSigns: CallSignInterface[], hasCallSign: boolean): void {
        this.home.updateCallSigns(callSigns, hasCallSign);
    }

    public setEntities(entities: MdcSearchEntityInterface[]): void {
        this.search.setEntities(entities);
    }

    private onShowNotification(message: string): void {
        this.$emit("show-notification", message);
    }

    private onIsOperatorChanged(value: boolean): void {
        this.isOperator = value;
    }

    private onOpenApbScreen(bulletIns: ApbEntryInterface[]): void {
        this.apb.setup(FactionType.POLICE_DEPARTMENT, bulletIns);
    }

    private onOpenCharacterRecord(character: CharacterInterface, records: CriminalRecordInterface[], tickets: PoliceTicketInterface[], notes: MdcNoteInterface[], vehicles: VehicleInterface[], houses: HouseInterface[], bankAccounts: BankAccountInterface[], phoneNumbers: string[]): void {
        this.pageId = 1000;
        this.characterRecord.setup(character, records, tickets, notes, vehicles, houses, bankAccounts, phoneNumbers);
    }

    private onOpenPhoneRecord(phoneId: number, phoneNumber: string, ownerCharacterName: string, notes: MdcNoteInterface[]): void {
        this.pageId = 1001;
        this.phoneRecord.setup(phoneId, phoneNumber, ownerCharacterName, notes);
    }

    private onOpenVehicleRecord(vehicleId: number, displayName: string, displayClass: string, numberPlate: string, ownerName: string, notes: MdcNoteInterface[]): void {
        this.pageId = 1002;
        this.vehicleRecord.setup(vehicleId, displayName, displayClass, numberPlate, ownerName, notes);
    }

    private onOpenBankAccountRecord(bankAccount: BankAccountInterface, notes: MdcNoteInterface[]): void {
        this.pageId = 1003;
        this.bankAccountRecord.setup(bankAccount, notes);
    }

    private onOpenMailAccountRecord(mailAccount: MailAccountInterface, notes: MdcNoteInterface[]): void {
        this.pageId = 1004;
        this.mailAccountRecord.setup(mailAccount, notes);
    }

    private onOpenWeaponRecord(weaponId: number, serialNumber: string, ownerName: string, weaponName: string, notes: MdcNoteInterface[]): void {
        this.pageId = 1005;
        this.weaponRecord.setup(weaponId, serialNumber, ownerName, weaponName, notes);
    }

    private openPageId(id: number): void {
        this.pageId = id;

        switch (id) {
            case 3:
                this.files.onCloseFile();
                break;
        }

        alt.emitServer("policemdc:openpage", id);
    }
}
</script>

<style lang='scss' scoped>
.mdc-pd-base {
    background-color: #cecece;
    height: 100%;
}
</style>
