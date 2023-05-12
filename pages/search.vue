<template>
    <div>
        Results for {{ label }} <br />
        <div style="height: 800px; width: 800px; float: right;" ref="map"></div>
        <div v-if="homes.length">
            <nuxt-link v-for="home in homes" :key="home.objectID" :to="`/home/${home.objectID}`">
                <home-row
                    :home="home"
                    @mouseover.native="highlightMarker(home.objectID, true)"
                    @mouseout.native="highlightMarker(home.objectID, false)"
                />
            </nuxt-link>
        </div>
        <div v-else>
            No results found
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
    components: { HomeRow },
    mounted() {
        this.updateMap();
    },
    methods: {
        updateMap() {
            this.$maps.showMap(this.$refs.map, this.lat, this.lng, this.getHomeMarkers());
        },
        getHomeMarkers() {
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