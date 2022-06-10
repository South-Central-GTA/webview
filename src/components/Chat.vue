<template>
    <div :hidden='!chatVisible' class='chat-box' v-bind:style="{ height: chatBoxHeight + 'vw' }">
        <div ref='chatList' class='chat-list' v-bind:class='{
        overflow_visible: inputActive,
        overflow_hidden: !inputActive,
      }' v-bind:style="{ height: messagesListHeight + 'vw' }">
            <div v-for='(message, index) in messages' v-bind:key='index'>
                <div class='message-box' v-bind:style="{ 'background-color': message.backgroundColor }">
          <span class='chat-message' v-bind:class='{
              whisper: getIsWisper(message.chatType),
              scream: getIsScream(message.chatType),
              lowemote: getIsLowEmote(message.chatType),
              megaphone: getIsMegaPhone(message.chatType),
              achat: getIsAChat(message.chatType),
            }' v-bind:style='{ color: message.color }'>{{ getTimestamp(message.sendetAt) }} {{
                  message.beforeChat
               }}<span v-bind:style='{ color: message.nameColor }'>{{
                      message.sender
                                                                   }}</span>{{ message.afterName }}<span v-html='message.context'></span>{{ message.afterChat }}</span>
                </div>
            </div>
        </div>

        <div :hidden='!inputActive'>
            <input ref='chatInput' class='input-bar card' maxlength='256' spellcheck='false' type='text' v-on:blur='focusInput()' v-on:input='handleSuggestions()' v-on:keydown.enter='send()' v-on:keydown.up='historyUp()' v-on:keydown.down='historyDown()' />

            <div ref='suggestions' class='suggestions card'>
                <ul></ul>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import {Ref} from "vue-property-decorator";
import {Vue} from "vue-class-component";
import {MessageInterface} from "@/scripts/interfaces/message.interface";
import {CommandInterface} from "@/scripts/interfaces/command.interface";
import {ChatType} from "@/scripts/enums/chat.type";

export default class Chat extends Vue {
    private readonly MAX_MESSAGES_ON_CHAT: number = 12;
    private readonly MESSAGE_FONT_SIZE: number = 0.95;
    private readonly MESSAGE_FONT_SIZE_PUFFER: number = 0.19;

    @Ref() private readonly chatInput!: HTMLInputElement;
    @Ref() private readonly chatList!: HTMLElement;
    @Ref() private readonly suggestions!: HTMLElement;

    private messages: MessageInterface[] = [];
    private messagesListHeight = this.MAX_MESSAGES_ON_CHAT * (this.MESSAGE_FONT_SIZE + this.MESSAGE_FONT_SIZE_PUFFER);
    private chatBoxHeight = this.messagesListHeight;

    private chatVisible = true;
    private inputActive = false;
    private showTimestamp = false;
    private isTyping = false;
    private typingTimeout: number | undefined = undefined;

    private history: string[] = [];
    private historyIndex = 0;
    private cachedCommands: CommandInterface[] = [];

    public mounted(): void {
        alt.emit("chat:ready");

        alt.on("chat:pushmessage", (message: MessageInterface) => this.addToMessages(message));
        alt.on("chat:toggleinput", (state: boolean) => this.toggleChatInput(state));
        alt.on("chat:togglevisibility", (state: boolean) => this.toggleChatVisibility(state));
        alt.on("chat:toggletimestamp", (state: boolean) => this.toggleTimestamp(state));
        alt.on("chat:setcommands", (commands: CommandInterface[]) => this.setCommands(commands));
    }

    public unmounted(): void {
        alt.off("chat:pushmessage");
        alt.off("chat:toggleinput");
        alt.off("chat:togglevisibility");
        alt.off("chat:toggletimestamp");
        alt.off("chat:setcommands");
    }

    private stopTyping(): void {
        this.isTyping = false;
        alt.emitServer("chat:settyping", false);
    }

    private handleSuggestions(): void {
        if (!this.isTyping) {
            alt.emitServer("chat:settyping", true);
        }
        this.isTyping = true;

        if (this.typingTimeout !== undefined) {
            clearTimeout(this.typingTimeout);
        }
        this.typingTimeout = setTimeout(this.stopTyping, 4000);

        if (!this.suggestions) {
            return;
        }

        this.suggestions.children[0].innerHTML = "";
        this.suggestions.style.display = "none";

        // Check for length, for slash and if the second char in string is a space, if so just return.
        if (this.chatInput.value.length <= 1 || this.chatInput.value[0] !== "/" || this.chatInput.value[1] === " ") {
            return;
        }

        const message = this.chatInput.value.substring(1).split(" ");

        const addParam = function (cmd: CommandInterface, el: HTMLElement) {
            cmd.parameterDescription.forEach((desc: string) => {
                el.innerText += ` [${desc}] `;
            });

            return el;
        };

        let suggestions: CommandInterface[] = [];

        this.cachedCommands.forEach((command: CommandInterface) => {
            if (command.name.toLowerCase().includes(message[0].toLowerCase()) || command.aliases.find(
                (n) => n.toLowerCase().includes(message[0].toLowerCase()))) {
                suggestions.push(command);
            }
        });

        // sort most fitting command on top of suggestion list and just take 5 of the suggestions.
        suggestions = suggestions
            .sort((a) => {
                if (a.name.toLowerCase() == message[0].toLowerCase()) return -1;

                if (a.name.toLowerCase() != message[0].toLowerCase()) return 1;

                return 0;
            })
            .slice(0, 5);

        let cmdName = "";

        suggestions.forEach((cmd: CommandInterface) => {
            const child = document.createElement("li");

            if (cmd.name.toLowerCase().includes(message[0].toLowerCase())) {
                cmdName = cmd.name.toLowerCase();
            }

            const sugg = cmd.aliases.find((n) => n.toLowerCase().includes(message[0].toLowerCase()));
            if (sugg) {
                cmdName = sugg;
            }

            child.innerText = `/${cmdName} `;
            if (cmd.parameterDescription.length != 0) {
                addParam(cmd, child);
            }

            child.innerHTML += `<span>${cmd?.description}</span>`;

            this.suggestions.lastChild?.appendChild(child);
        });

        if (suggestions.length === 0) {
            this.suggestions.style.display = "none";
        } else {
            this.suggestions.style.display = "block";
        }
    }

    private addToMessages(message: MessageInterface): void {
        if (this.messages.length > 128) {
            this.messages.shift();
        }

        this.messages.push(message);

        setTimeout(() => {
            if (this.getScrolledUpMessagesAmount() <= 500) {
                this.scrollToBottom();
            }
        }, 20);
    }

    private toggleChatInput(state: boolean): void {
        this.inputActive = state;
        this.historyIndex = 0;
        this.handleSuggestions();

        setTimeout(() => {
            this.focusInput();
        }, 100);
    }

    private toggleChatVisibility(state: boolean): void {
        this.chatVisible = state;
    }

    private toggleTimestamp(state: boolean): void {
        this.showTimestamp = state;
    }

    private setCommands(commands: CommandInterface[]): void {
        this.cachedCommands = commands;
    }

    private focusInput(): void {
        this.chatInput?.focus();
    }

    private send(): void {
        if (this.chatInput.value === "") {
            return alt.emit("chat:sendmessage");
        }

        if (this.history.length > 128) {
            this.history.pop();
        }

        if (!/\S/.test(this.chatInput.value)) {
            // Didn't find something other than a space which means it's empty
            return;
        }

        this.history.unshift(this.chatInput.value);

        const isCommand = this.chatInput.value[0] === "/";
        alt.emit("chat:sendmessage", isCommand, this.chatInput.value.replace(/(<([^>]+)>)/gi, ""));
        this.chatInput.value = "";
    }

    private historyUp() {
        if (this.historyIndex >= this.history.length) {
            return;
        }

        this.chatInput.value = this.history[this.historyIndex];
        this.historyIndex++;

        setTimeout(() => {
            this.chatInput.setSelectionRange(this.chatInput.value.length + 1, this.chatInput.value.length + 1);
        }, 1);
    }

    private historyDown() {
        if (this.historyIndex <= 0) {
            return;
        }

        this.historyIndex--;
        this.chatInput.value = this.history[this.historyIndex];
    }

    private scrollToBottom() {
        if (!this.chatList) {
            return;
        }

        this.chatList.scrollTop = this.chatList?.scrollHeight;
    }

    private getScrolledUpMessagesAmount() {
        const amount = Math.round(this.chatList?.scrollHeight - this.chatList?.scrollTop);
        return amount > 0 ? amount : 0;
    }

    private getTimestamp(timeJson: string): string {
        if (!this.showTimestamp) {
            return "";
        }

        const date = new Date(JSON.parse(timeJson));
        return ("[" + date.toLocaleTimeString("de-DE", {
            hour: "numeric", minute: "numeric", second: "numeric",
        }) + "]");
    }

    private getIsWisper(chatType: ChatType): boolean {
        switch (chatType) {
            case ChatType.SPEAK:
            case ChatType.SCREAM:
            case ChatType.LOW_EMOTE:
            case ChatType.EMOTE:
            case ChatType.MY:
            case ChatType.DO:
            case ChatType.OOC:
            case ChatType.MEGAPHONE:
            case ChatType.PHONE_SPEAK:
            case ChatType.PHONE_SCREAM:
            case ChatType.ADMIN_CHAT:
            case ChatType.RADIO_SPEAK:
            case ChatType.RADIO_SCREAM:
            case ChatType.DEP_SPEAK:
            case ChatType.DEP_SCREAM:
                return false;
            case ChatType.WISPER:
            case ChatType.PHONE_WISPER:
            case ChatType.RADIO_WISPER:
            case ChatType.DEP_WISPER:
                return true;
        }
    }

    private getIsScream(chatType: ChatType): boolean {
        switch (chatType) {
            case ChatType.WISPER:
            case ChatType.PHONE_WISPER:
            case ChatType.RADIO_WISPER:
            case ChatType.DEP_WISPER:
            case ChatType.SPEAK:
            case ChatType.LOW_EMOTE:
            case ChatType.EMOTE:
            case ChatType.MY:
            case ChatType.DO:
            case ChatType.OOC:
            case ChatType.MEGAPHONE:
            case ChatType.PHONE_SPEAK:
            case ChatType.ADMIN_CHAT:
            case ChatType.RADIO_SPEAK:
            case ChatType.DEP_SPEAK:
                return false;
            case ChatType.SCREAM:
            case ChatType.PHONE_SCREAM:
            case ChatType.RADIO_SCREAM:
            case ChatType.DEP_SCREAM:
                return true;
        }
    }

    private getIsLowEmote(chatType: ChatType): boolean {
        return chatType === ChatType.LOW_EMOTE;
    }

    private getIsAChat(chatType: ChatType): boolean {
        return chatType === ChatType.ADMIN_CHAT;
    }

    private getIsMegaPhone(chatType: ChatType): boolean {
        return chatType === ChatType.MEGAPHONE;
    }
}
</script>

<style scoped>
.chat-box {
    margin: 0.8vw;
    width: 46vw;
    position: absolute;
    left: 0;
    top: 0;
}

.chat-list {
    flex-direction: column;
    height: 100%;
}

.chat-list::-webkit-scrollbar {
    display: none;
}

.message-box {
    line-height: 1.2vw;
}

.chat-message {
    font-weight: 600;
    font-size: 0.9vw;
    text-shadow: -0.05vw -0.05vw 0 rgb(0, 0, 0), 0.05vw -0.05vw 0 rgb(0, 0, 0),
    -0.05vw 0.05vw 0 rgb(0, 0, 0), 0.05vw 0.05vw 0 rgb(0, 0, 0);
}

.whisper {
    font-style: italic;
    opacity: 0.9;
}

.lowemote {
    font-style: italic;
    opacity: 0.9;
}

.scream {
    font-weight: 600;
}

.megaphone {
    font-weight: 700;
}

.achat {
    font-weight: 500;
}

.overflow_hidden {
    overflow: hidden;
}

.overflow_visible {
    overflow-y: scroll;
}

.input-bar {
    width: 100%;
    padding: 0.5vw 0.3vw;
    margin-top: 1vw;
    margin-bottom: 0.5vw;
    background-color: rgba(0, 0, 0, 0.25);
    color: white;
    outline: none;
    font-weight: 600;
    text-shadow: -0.05vw -0.05vw 0 rgb(0, 0, 0), 0.05vw -0.05vw 0 rgb(0, 0, 0),
    -0.05vw 0.05vw 0 rgb(0, 0, 0), 0.05vw 0.05vw 0 rgb(0, 0, 0);
}

.suggestions {
    background: rgba(0, 0, 0, 0.5);
    padding: 0.5vw 0.05vw 0.05vw;
    color: white;
    display: block;
}
</style>
