<template>
    <div ref='cef' id='app' class='unselectable'>
        <router-view class='unselectable' />
        <dialog-holder class='unselectable' />
    </div>
</template>

<script lang='ts'>
import alt from "@/scripts/services/alt.service";
import DialogHolder from "@/components/DialogHolder.vue";
import {Options, Vue} from "vue-class-component";
import {Ref} from "vue-property-decorator";
import {allowOnlyNumbers} from '@/scripts/helpers/helpers';

@Options({
    components: {
        DialogHolder,
    }
})
export default class App extends Vue {
    @Ref() private readonly cef!: HTMLElement;

    public mounted(): void {
        alt.emit("gui:ready");

        alt.on("gui:routeto", (route: string, data: string) => this.routing(route, data));
        alt.on("screen:enable", () => this.enableScreen());
        alt.on("screen:disable", () => this.disableScreen());
    }

    private routing(route: string, data: string): void {
        if (this.$route.fullPath.toString().toLowerCase() === route.toLowerCase()) {
            return;
        }

        try {
            if (data && data.length !== 0) {
                this.$router.push({path: "/" + route + "/" + data});
            } else {
                this.$router.push({path: "/" + route});
            }
        } catch (error) {
            console.log("route error: " + error);
        }
    }

    private disableScreen(): void {
        this.cef.className = "fade-out";
    }

    private enableScreen(): void {
        this.cef.className = "fade-in";
    }
}
</script>