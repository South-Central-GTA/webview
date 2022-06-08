import alt from "@/scripts/services/alt.service";
import LiteEvent from "@/scripts/systems/lite-event";

export default class CharacterService {
    private static instance: CharacterService;

    private constructor() {
        // do something construct...
    }

    static getInstance() {
        if (!CharacterService.instance) {
            CharacterService.instance = new CharacterService();
            // ... any one time initialization goes here ...
        }
        return CharacterService.instance;
    }

    get Changed() {
        return this.onCharacterChanged.expose();
    }

    get getCharacterId(): number {
        return this.characterId ? this.characterId : -1;
    }

    private readonly onCharacterChanged = new LiteEvent<number>();
    private characterId?: number;

    public listenToEvents(): void {
        alt.on("character:sync", (characterId: number) => this.setup(characterId));
    }

    private setup(characterId: number): void {
        this.characterId = characterId;

        if (this.characterId !== undefined) {
            this.onCharacterChanged.trigger(this.characterId);
        }
    }
}
