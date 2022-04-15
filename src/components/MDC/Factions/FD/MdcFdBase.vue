<template>
    <div class="mdc-fd-base">
        <mdc-fd-header-bar></mdc-fd-header-bar>
        <div class="float-start">
            <div class="btn-group-vertical m-4">
                <button type="button" class="w-100 m-2" @click="openPageId(0)">Home</button>
                <button type="button" class="w-100 m-2" @click="openPageId(1)">Suche</button>
                <button type="button" class="w-100 m-2" @click="openPageId(2)">Akten</button>
            </div>
        </div>
        
        <mdc-fd-home ref="home" :hidden="pageId !== 0"></mdc-fd-home>
        <mdc-search ref="search" :hidden="pageId !== 1"></mdc-search>
        <mdc-files ref="files" v-on:show-notification="onShowNotification" :hidden="pageId !== 2"></mdc-files>
        
        <mdc-patient-record ref="patientRecord" :hidden="pageId !== 1000"></mdc-patient-record>
    </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import alt from "@/scripts/services/alt.service";
import {Ref} from "vue-property-decorator";
import MdcService from "@/scripts/services/mdc.service";
import MdcFdHome from "@/components/MDC/Factions/FD/MdcFdHome.vue";
import MdcFdHeaderBar from "@/components/MDC/Factions/FD/MdcFdHeaderBar.vue";
import MdcSearch from "@/components/MDC/General/MdcSearch.vue";
import {FactionType} from "@/scripts/enums/faction.type";
import {CallSignInterface} from "@/scripts/interfaces/mdc/call-sign.interface";
import {MdcSearchEntityInterface} from "@/scripts/interfaces/mdc-search-entity.interface";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {CriminalRecordInterface} from "@/scripts/interfaces/mdc/criminal-record.interface";
import {MdcNoteInterface} from "@/scripts/interfaces/mdc/mdc-note.interface";
import {VehicleInterface} from "@/scripts/interfaces/vehicle.interface";
import {HouseInterface} from "@/scripts/interfaces/house.interface";
import {BankAccountInterface} from "@/scripts/interfaces/bank/bank-account.interface";
import {MdcMedicalEntryInterface} from "@/scripts/interfaces/mdc/mdc-medical-entry.interface";
import {MdcAllergyInterface} from "@/scripts/interfaces/mdc/mdc-allergy.interface";
import MdcPatientRecord from "@/components/MDC/Factions/FD/MdcPatientRecord.vue";
import MdcFiles from "@/components/MDC/General/MdcFiles.vue";
import {FileInterface} from "@/scripts/interfaces/file.interface";
import MdcFile from "@/components/MDC/General/MdcFile.vue";

@Options({
    components: {
        MdcFile,
        MdcFiles,
        MdcPatientRecord,
        MdcSearch,
        MdcFdHome,
        MdcFdHeaderBar
    }
})
export default class MdcFdBase extends Vue {
    @Ref() private readonly home!: MdcFdHome;
    @Ref() private readonly search!: MdcSearch;
    @Ref() private readonly patientRecord!: MdcPatientRecord;

    private pageId: number = 0;
    private isOperator: boolean = false;

    public setup(): void {
        this.openPageId(0);
        
        MdcService.getInstance().onIsOperatorChanged.on((value: boolean) => this.onIsOperatorChanged(value));

        alt.on("firemdc:openpatientrecord", (character: CharacterInterface, houses: HouseInterface[], phoneNumbers: string[], medicalHistory: MdcMedicalEntryInterface[], allergies: MdcAllergyInterface[]) => this.onOpenPatientRecord(character, houses, phoneNumbers, medicalHistory, allergies));

        this.search.setup(FactionType.FIRE_DEPARTMENT);
    }
    
    public close(): void {
        MdcService.getInstance().onIsOperatorChanged.off((value: boolean) => this.onIsOperatorChanged(value));
        
        alt.off("firemdc:openpatientrecord");
    }

    private onShowNotification(message: string): void {
        this.$emit("show-notification", message);
    }
    
    private onIsOperatorChanged(value: boolean): void {
        this.isOperator = value;
    }

    private onOpenPatientRecord(character: CharacterInterface, houses: HouseInterface[], phoneNumbers: string[], medicalHistory: MdcMedicalEntryInterface[], allergies: MdcAllergyInterface[]): void {
        this.pageId = 1000;
        this.patientRecord.setup(character, houses, phoneNumbers, medicalHistory, allergies);
    }

    public updateFiles(files: FileInterface[]): void {
    }

    public updateCallSigns(callSigns: CallSignInterface[], hasCallSign: boolean): void {
        this.home.updateCallSigns(callSigns, hasCallSign);
    }
    
    public setEntities(entities: MdcSearchEntityInterface[]): void {
        this.search.setEntities(entities);
    }
    
    private openPageId(id: number): void {
        this.pageId = id;
        alt.emitServer("firemdc:openpage", id);
    }
}
</script>

<style scoped lang="scss"> 
.mdc-fd-base {
    background-color: #cecece;
    height: 100%;
}
</style>