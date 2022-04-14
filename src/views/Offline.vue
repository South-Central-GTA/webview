<template>
    <div class="offline">
        <div class="sc-card center text-white">
            <div class="card-body">
                <h5 class="card-title">Willkommen auf South Central</h5>

                <p class="card-text">Hey <b>{{ $route.params.name }}</b>,
                    Huch, herrje, ohjemine- leider kann der Server deinen Discord nicht erkennen.</p>

                <img src="https://http.cat/404" width="100%" height="100%">

                <p class="card-text text-muted pt-3">
                    So können wir leider nicht weitermachen! Schließe dein GTA:V und sei dir sicher das du die Discord
                    Desktop App gestartet hast und auf unserem Discord Server verbunden bist.
                    Solltest du diesen noch nicht haben besuche uns einfach auf www.sc-rp.de!
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import LoadingCircle from '../components/LoadingCircle.vue';
import {Options, Vue} from "vue-class-component";

@Options({
    components: {
        LoadingCircle
    }
})
export default class Offline extends Vue {
}
</script>

<style scoped>
.offline {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.sc-card {
    width: 30vw;
}
</style>