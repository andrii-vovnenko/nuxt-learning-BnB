<template>
    <div class="app-search-results-page">
        <div class="app-search-results">
            <div class="app-search-results-listing">
                <h2 class="app-title">Stays in {{ label }}</h2>
                <nuxt-link v-for="home in homes" :key="home.objectID" :to="`/home/${home.objectID}`">
                <HomeRow
                    :home="home"
                    @mouseover.native="highlightMarker(home.objectID, true)"
                    @mouseout.native="highlightMarker(home.objectID, false)"
                    class="app-house"
                />
            </nuxt-link>
            </div>
            <div class="app-search-results-map">
                <div class="app-map" ref="map"></div>
            </div>
        </div>
     </div>
</template>
<script>
import HomeRow from '../components/HomeRow.vue';

    export default {
        head() {
            return {
                title: `Homes around ${this.label}`,
            }
        },
        // watchQuery: ["lat"],
    async beforeRouteUpdate(to, from, next) {
        const data = await this.$dataApi.getHomesByLocations(to.query.lat, to.query.lng);
        this.homes = data.json.hits;
        this.label = to.query.label;
        this.lat = to.query.lat;
        this.lng = to.query.lng;
        this.updateMap();
        next();
    },
    async asyncData({ query: { lat, lng, label }, $dataApi }) {
        const data = await $dataApi.getHomesByLocations(lat, lng);
        return {
            label,
            lat,
            lng,
            homes: data.json.hits,

        };
    },
    components: { HomeRow, HomeRow },
    mounted() {
        this.updateMap();
    },
    methods: {
        updateMap() {
            this.$maps.showMap(this.$refs.map, this.lat, this.lng, this.getHomeMarkers());
        },
        getHomeMarkers() {
            if (!this.homes.length) return null;
            return this.homes.map(({ _geoloc, pricePerNight, objectID: id  }) => ({
                ..._geoloc,
                pricePerNight,
                id,
            }));
        },
        highlightMarker(homeId, isHighLighted) {
            document.getElementsByClassName(`home-${homeId}`)[0]?.classList?.toggle('marker-highlight', isHighLighted);
        }
    },
}
</script>
<style>
    .marker {
        background-color: #fff;
        border: 1px solid lightgray;
        font-weight: bold;
        border-radius: 20px;
        padding: 5px 8px;
    }

    .marker-highlight {
        color: #fff !important;
        background-color: #000;
        border-color: #000;
    }
</style>