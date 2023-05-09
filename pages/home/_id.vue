<template>
    <div>
        <div style="display: flex;">
            <img v-for="image in home.images"
                :key="image"
                alt="some description"
                :src="image"
                style="width: 200px;height: 150px;"
            />
        </div>
        {{ home.title }}<br/>
        ${{ home.pricePerNight }} / nights<br/>
        <img src="/images/marker.svg" width="20" height="20" />{{ home.location.address }} {{ home.location.city }} {{ home.location.state }} {{ home.location.country }} <br/>
        <img src="/images/star.svg" width="20" height="20" />{{ home.reviewCount }}<br/>
        {{ home.guests }} guest, {{ home.bedrooms }} rooms, {{ home.beds }} beds, {{  home.bathrooms }} bath <br/>
        <div style="height: 800px; width: 800px;" ref="map"></div>
        <div
            v-for="review in reviews" :key="review.objectID"
        >
            <img :src="review.reviewer.image" /><br/>
            {{  review.reviewer.name }} <br />
            {{  formatDate(review.date) }} <br />
            <short-text :text="review.comment" :target="150" /><br />
        </div>
        <div>
            <img :src="user.image" /><br/>
            {{ user.name }}<br/>
            {{ formatDate(user.joined) }}<br/>
            {{ user.reviewCount }}<br/>
            {{ user.description }}<br/>
        </div>
    </div>
</template>
<script>
import ShortText from '../../components/ShortText.vue';

    export default {
    head() {
        return {
            title: this.home.title
        };
    },
    async asyncData({ params, $dataApi, error }) {
        const homeData = await $dataApi.getHome(params.id);
        if (!homeData.ok)
            return error({
                statusCode: homeData.status,
                message: homeData.statusText
            });

        const reviewsData = await $dataApi.getReviewsByHomeId(params.id);
        if (!reviewsData.ok)
            return error({
                statusCode: reviewsData.status,
                message: reviewsData.statusText
            });

        const userData = await $dataApi.getUserByHomeId(params.id);
        if (!userData.ok)
            return error({
                statusCode: userData.status,
                message: userData.statusText
            });
        return {
            home: homeData.json,
            reviews: reviewsData.json.hits,
            user: userData.json.hits[0],
        };
    },
    mounted() {
        this.$maps.showMap(this.$refs.map, this.home._geoloc.lat, this.home._geoloc.lng);
    },
    methods: {
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
            });
        }
    },
    components: { ShortText }
}
</script>