<template>
    <div class='charselector'>
        <notifications-holder ref='notificationsHolder' class='unselectable' />

        <nav class='navbar navbar-expand-lg navbar-dark sc-dark'>
            <a class='navbar-brand px-4'> South Central Roleplay </a>
            <ul class='navbar-nav'>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 0 }'>
                    <a class='nav-link' @click='openMenu(0)'>Charaktere</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 1 }'>
                    <a class='nav-link disabled' @click='openMenu(1)'>Regelwerke</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 2 }'>
                    <a class='nav-link disabled' @click='openMenu(2)'>Community</a>
                </li>
                <li class='nav-item' v-bind:class='{ active: tabIndex === 3 }'>
                    <a class='nav-link disabled' @click='openMenu(3)'>Premium</a>
                </li>
            </ul>
        </nav>

        <div class='row'>
            <div class='col-sm'>
                <div class='card character-list transparent-card text-white'>
                    <h3>Deine Charaktere</h3>
                    <div class='character-block' v-if='characters.length !== 0'>
                        <div v-for='character in characters' v-bind:key='character.id' class='character-card'>
                            <char-card @click.right='openCharacterContextMenu($event, character)' v-bind:character='character' v-on:select-character='selectCharacter($event)' v-bind:class='{
                  selected: character.id === currentCharacterId,
                  unselected: character.id !== currentCharacterId,
                }' />
                        </div>
                    </div>

                    <div class='create-character-button'>
                        <button type='button' class='btn btn-secondary' @click='createCharacter()'>
              <span>Neuen Charakter erstellen
                <font-awesome-icon icon='sign-in-alt' /></span>
                        </button>
                    </div>
                </div>
            </div>
            <div class='col-sm'>
                <div class='float-end'>
                    <AccountCard></AccountCard>
                </div>
            </div>
        </div>

        <div class='bottom-center'>
            <button type='button' class='btn btn-primary play-button' :disabled='currentCharacterId === -1 || characterSpawned' @click='play()'>
                <span>Spielen <font-awesome-icon icon='play' /></span>
            </button>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import CharCard from "@/components/CharCard.vue";
import AccountCard from "@/components/AccountCard.vue";
import NotificationsHolder from "@/components/Notification/NotificationsHolder.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {CharacterInterface} from "@/scripts/interfaces/character/character.interface";
import {NotificationPositionTypes} from "@/scripts/enums/notification-position.types";

@Options({
    components: {
        NotificationsHolder,
        CharCard,
        AccountCard,
    },
})
export default class CharSelector extends Vue {
    @Ref() private readonly notificationsHolder!: NotificationsHolder;

    private characters: CharacterInterface[] = [];
    private currentCharacterId = -1;
    private tabIndex = 0;
    private characterSpawned = false;

    public mounted(): void {
        alt.emit("charselector:ready");

        alt.on(
            "charselector:setup",
            (characters: CharacterInterface[], lastCharacterId: number) =>
                this.setup(characters, lastCharacterId)
        );
    }

    public unmounted(): void {
        alt.off("charselector:setup");
    }

    private setup(
        characters: CharacterInterface[],
        lastCharacterId: number
    ): void {
        this.characters = characters;
        this.currentCharacterId = lastCharacterId;
        this.notificationsHolder?.setPosition(NotificationPositionTypes.RIGHT);
    }

    private openCharacterContextMenu(
        mouseEvent: MouseEvent,
        character: CharacterInterface
    ): void {
        mouseEvent.preventDefault();
        this.$contextmenu({
            x: mouseEvent.pageX,
            y: mouseEvent.pageY,
            items: [
                {
                    label: character.name + " löschen",
                    onClick: () => {
                        this.deleteCharacter(character);
                    },
                },
            ],
        });
    }

    private openMenu(index: number): void {
        if (this.tabIndex === index) {
            return;
        }

        this.tabIndex = index;
        switch (index) {
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    private deleteCharacter(character: CharacterInterface): void {
        alt.emitServer("charselector:requestdelete", character.id);
    }

    private selectCharacter(character: CharacterInterface): void {
        this.currentCharacterId = character.id;
        alt.emit("charselector:select", this.currentCharacterId);
    }

    private play(): void {
        if (this.currentCharacterId === -1 || this.characterSpawned) {
            return;
        }

        this.characterSpawned = true;

        alt.emit("charselector:play", this.currentCharacterId);
    }

    private createCharacter(): void {
        alt.emit("charselector:newchar");
    }
}
</script>

<style scoped lang='scss'>
.navbar-brand {
    padding: 0;
}

.navbar-nav .nav-link {
    padding-top: 0;
    padding-bottom: 0;
    line-height: 50px;
    color: white;

    &:hover {
        cursor: pointer;
    }
}

.active {
    font-weight: 500;
}

.settings-dropdown {
    position: absolute;
    color: white;
    background-color: rgba(0, 0, 0);
    display: block;
    width: 10vw;
    top: 100%;
}

.character-list {
    width: 20vw;
    margin: 1vw;
}

.character-list h3 {
    margin: 0.4vw;
}

.character-block {
    overflow-x: hidden;
    overflow-y: auto;
    height: 20vw;
    width: 100%;
}

.character-block::-webkit-scrollbar {
    display: none;
}

.character-card {
    width: 95%;
    display: block;
    margin-left: auto;
    margin-right: auto;

    &:hover {
        cursor: pointer;
    }
}

.create-character-button {
    padding: 0.8vw;
}

.create-character-button button {
    width: 100%;
}

.play-button {
    font-size: 1.1vw;
    width: 22vw;
    height: 3vw;
    position: absolute;
    left: 50%;
    bottom: 10%;
    transform: translate(-50%, -10%);
}

.selected {
    background-color: rgba(0, 0, 0, 0.3) !important;
}

.selected:hover {
    background-color: rgba(0, 0, 0, 0.4) !important;
}

.unselected {
    background-color: rgba(0, 0, 0, 0.1) !important;
}

.unselected:hover {
    background-color: rgba(0, 0, 0, 0.2) !important;
}
</style>
