<template>
    <div class='team-menu-item-catalog'>
        <h2>Item Katalog</h2>
        <input v-model='itemSearch' class='form-control-dark mb-2' placeholder='Suche nach Namen (Bsp. Schlüssel)' type='text' @input='search()' />

        <div class='table-holder'>
            <table class='table table-striped table-hover'>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Bild</th>
                    <th>Name</th>
                    <th>Beschreibung</th>
                    <th>Seltenheit</th>
                    <th>Stapelbar</th>
                    <th>Verkaufbar</th>
                    <th>Kaufpreis</th>
                    <th>Verkaufpreis</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for='catalogItem in catalogItems' v-bind:key='catalogItem.id' class='entry'>
                    <td>{{ catalogItem.id }}</td>
                    <td><img :src='getImage(catalogItem.image)' class='showcase-image' v-bind:alt='catalogItem' /></td>
                    <td>{{ catalogItem.name }}</td>
                    <td>{{ catalogItem.description }}</td>
                    <td>{{ catalogItem.rarity }}</td>
                    <td>{{ catalogItem.stackable === false ? "Nein" : "Ja" }}</td>
                    <td>{{ catalogItem.sellable === false ? "Nein" : "Ja" }}</td>
                    <td>${{ catalogItem.price }}</td>
                    <td>${{ catalogItem.sellPrice }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang='ts'>
import alt from '@/scripts/services/alt.service';
import {Vue} from "vue-class-component";
import {CatalogItemInterface} from "@/scripts/interfaces/inventory/catalog-item.interface";

export default class TeamMenuItemCatalog extends Vue {
    private catalogItems: CatalogItemInterface[] = [];
    private cachedCatalogItems: CatalogItemInterface[] = [];
    private itemSearch = "";

    public open(): void {
        alt.emitServerWithResponse<CatalogItemInterface[]>("itemcatalog:open")
            .then((catalogItems: CatalogItemInterface[]) => {
                catalogItems.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                this.catalogItems = catalogItems;
                this.cachedCatalogItems = this.catalogItems;
            });
    }

    private getImage(image: string): string {
        if (!image) return "";

        const images = require.context('../../../assets/images/item_icons/', false, /\.png$/);
        return images("./" + image + ".png");
    }

    private search(): void {
        if (this.itemSearch === "") {
            this.catalogItems = this.cachedCatalogItems;
            return;
        }

        this.catalogItems = this.cachedCatalogItems;
        this.catalogItems = this.catalogItems.filter(i => i.name.toLowerCase().includes(this.itemSearch.toLowerCase()));
    }
}
</script>

<style scoped>
.table-holder {
    height: 26.5vw;
    overflow-x: hidden;
    overflow-y: auto;
}

.table,
.entry {
    color: white !important;
}

.showcase-image {
    width: 2vw;
    height: 2vw;
}
</style>