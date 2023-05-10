<template>
    <div>
        {{ lat }} | {{ lng }} | {{ label }} <br />
        <div v-if="homes.length">
            <home-row v-for="home in homes" :key="home.objectID" :home="home" />
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
        watchQuery: ["lat"],
    // async beforeRouteUpdate(to, from, next) {
    //     const data = await this.$dataApi.getHomesByLocations(to.query.lat, to.query.lng);
    //     this.homes = data.json.hits;
    //     this.label = to.query.label;
    //     this.lat = to.query.lat;
    //     this.lng = to.query.lng;
    //     next();
    // },
        async asyncData({ query: { lat, lng, label }, $dataApi }) {
            const data = await $dataApi.getHomesByLocations(lat, lng);
            return {
                label,
                lat,
                lng,
                homes: data.json.hits,
            };
        },
    components: { HomeRow }
}
</script>