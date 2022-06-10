import alt from "@/scripts/services/alt.service";
import LiteEvent from "@/scripts/systems/lite-event";
import {GroupInterface} from "@/scripts/interfaces/group/group.interface";
import {CompanyInterface} from "@/scripts/interfaces/group/company.interface";
import {FactionInterface} from "@/scripts/interfaces/group/faction.interface";

export default class GroupService {
    private static instance: GroupService;
    private readonly onAllGroupsChanged = new LiteEvent<GroupInterface[] | undefined>();
    private readonly onGroupsChanged = new LiteEvent<GroupInterface[] | undefined>();
    private readonly onCompanyChanged = new LiteEvent<CompanyInterface | undefined>();
    private readonly onFactionChanged = new LiteEvent<FactionInterface | undefined>();
    private allGroups?: GroupInterface[];
    private groups?: GroupInterface[];
    private companyGroup?: CompanyInterface = undefined;
    private factionGroup?: FactionInterface = undefined;

    private constructor() {
        // do something construct...
    }

    get AllGroupsChanged() {
        return this.onAllGroupsChanged.expose();
    }

    get GroupsChanged() {
        return this.onGroupsChanged.expose();
    }

    get CompanyChanged() {
        return this.onCompanyChanged.expose();
    }

    get FactionChanged() {
        return this.onFactionChanged.expose();
    }

    get AllGroups() {
        return this.allGroups;
    }

    get Groups() {
        return this.groups;
    }

    get Company() {
        return this.companyGroup;
    }

    get Faction() {
        return this.factionGroup;
    }

    static getInstance() {
        if (!GroupService.instance) {
            GroupService.instance = new GroupService();
            // ... any one time initialization goes here ...
        }
        return GroupService.instance;
    }

    public listenToEvents(): void {
        alt.on("group:setup",
                (allGroups: GroupInterface[], groups: GroupInterface[], companyGroup?: CompanyInterface, factionGroup?: FactionInterface) => this.setup(
                        allGroups, groups, companyGroup, factionGroup));
        alt.on("group:reset", () => this.reset());
    }

    private setup(allGroups: GroupInterface[], groups: GroupInterface[], companyGroup?: CompanyInterface, factionGroup?: FactionInterface): void {
        this.allGroups = allGroups;

        this.groups = groups;
        this.companyGroup = companyGroup;
        this.factionGroup = factionGroup;

        this.onAllGroupsChanged.trigger(this.allGroups);
        this.onGroupsChanged.trigger(this.groups);
        this.onCompanyChanged.trigger(this.companyGroup);
        this.onFactionChanged.trigger(this.factionGroup);
    }

    private reset(): void {
        this.groups = undefined;
        this.onGroupsChanged.trigger(this.groups);
    }
}
