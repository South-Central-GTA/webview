<template>
    <div class='company-worker-edit'>
        <div class='phone-header'>
            <button type='button' class='icon-button' @click='save()'>
                <font-awesome-icon icon='chevron-left' />
                <span>Zurück & speichern</span>
            </button>
        </div>

        <div class='worker-stats'>
            <div class='phone-gov-button-group'>
                <h6 class='job-position-label'>{{ currentRankName }}</h6>
                <h6>{{ member.characterName }}</h6>
                <div class='row' style='padding-top: 0.5vw'>
                    <div class='col-4'>
                        <p style='padding-top: 0.3vw'>Gehalt:</p>
                    </div>
                    <div class='col' style='padding: 0 0.8vw 0 0.2vw'>
                        <div class='input-group'>
                            <span class='input-group-text'>$</span>
                            <input ref='salaryInput' class='form-control' :value='member.salary' :readonly='ownProfile && !owner' oninput='if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' type='number' @keypress='allowOnlyNumbers($event)' @focus='onFocus(true)' @blur='onFocus(false)' maxlength='5' />
                        </div>
                    </div>
                </div>
                <button type='button' class='btn' :disabled='ownProfile || !rankUpPossible || owner' @click='rankCharacterUp()'>
                    Befördern
                </button>
                <button type='button' class='btn' :disabled='ownProfile || !rankDownPossible || owner' @click='rankCharacterDown()'>
                    Degradieren
                </button>
                <button type='button' class='btn' :disabled='ownProfile || owner' @click='kickCharacter()'>
                    Kündigen
                </button>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import character from "@/scripts/services/character.service";
import alt from "@/scripts/services/alt.service";
import group from "@/scripts/services/group.service";
import {
    allowOnlyNumbers,
    isNumeric,
    onFocus,
} from "@/scripts/helpers/helpers";
import {Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {GroupMemberInterface} from "@/scripts/interfaces/group/group-member.interface";
import {GroupInterface} from "@/scripts/interfaces/group/group.interface";
import {CompanyInterface} from "@/scripts/interfaces/group/company.interface";

export default class CompanyWorkerEditPage extends Vue {
    @Ref() private readonly salaryInput!: HTMLInputElement;

    private member: GroupMemberInterface = {
        groupId: -1,
        characterId: -1,
        characterName: "",
        level: -1,
        salary: -1,
        bankAccountId: -1,
        owner: false,
    };

    private ownProfile = false;
    private rankUpPossible = false;
    private rankDownPossible = false;
    private owner = false;

    private currentRankName = "";
    private company?: GroupInterface;

    public mounted(): void {
        group
            .getInstance()
            .CompanyChanged.on((company?: CompanyInterface) =>
            this.updateCompany(company)
        );
    }

    public setup(member: GroupMemberInterface, company: GroupInterface): void {
        this.member = member;
        this.ownProfile =
            this.member.characterId === character.getInstance().getCharacterId;
        this.owner = member.owner;

        const rank = company.ranks.find((r) => r.level === member.level);
        if (rank !== undefined) {
            this.currentRankName = rank.name;
        }

        this.company = company;

        this.updateRankPossibilities();
        this.updateRankDisplay();
    }

    private updateCompany(company?: CompanyInterface): void {
        if (this.company === undefined) {
            return;
        }

        this.company = company;

        this.updateRankPossibilities();
        this.updateRankDisplay();

        const maxRank = company?.ranks.reduce((prev, current) =>
            prev.level > current.level ? prev : current
        );
        if (maxRank !== undefined && this.member.level > maxRank.level) {
            this.rankCharacterDown();
        }
    }

    public save(): void {
        let salary = 0;
        if (isNumeric(this.salaryInput.value)) {
            salary = Number.parseInt(this.salaryInput.value);
        }

        if (salary <= 0) {
            salary = 0;
        }

        this.member.salary = salary;

        alt.emitServer(
            "group:savemember",
            this.member.groupId,
            this.member.characterId,
            this.member.level,
            this.member.salary
        );

        this.$emit("back");
    }

    private rankCharacterUp(): void {
        this.member.level++;

        this.updateRankPossibilities();
        this.updateRankDisplay();
    }

    private rankCharacterDown(): void {
        this.member.level--;

        this.updateRankPossibilities();
        this.updateRankDisplay();
    }

    private kickCharacter(): void {
        alt.emitServer(
            "group:kickmember",
            this.member.groupId,
            this.member.characterId
        );
        this.$emit("back");
    }

    private updateRankPossibilities(): void {
        if (this.company === undefined) {
            return;
        }

        this.rankUpPossible =
            this.company.ranks.find((r) => r.level === this.member.level + 1) !==
            undefined;
        this.rankDownPossible =
            this.company.ranks.find((r) => r.level === this.member.level - 1) !==
            undefined;
    }

    private updateRankDisplay(): void {
        if (this.company === undefined) {
            return;
        }

        const rank = this.company.ranks.find((r) => r.level === this.member.level);
        if (rank !== undefined) {
            this.currentRankName = rank.name;
        }
    }

    private onFocus(state: boolean): void {
        onFocus(state);
    }

    private allowOnlyNumbers(state: KeyboardEvent): void {
        allowOnlyNumbers(state);
    }
}
</script>

<style scoped lang='scss'>
.company-worker-edit {
    overflow: hidden;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: whitesmoke;
    z-index: 200;
}

.worker-stats h6,
.worker-stats p {
    margin: unset;
}

.job-position-label {
    font-style: italic;
}

.phone-gov-button-group {
    top: 3.5vw;
}
</style>
