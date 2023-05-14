<template>
    <div class="app-container">
        <PropertyGallery :images="home.images" />
        <PropertyDetails :home="home" />
        <PropertyDescription :home="home" />
        <PropertyMap :home="home" />
        <PropertyReviews :reviews="reviews" />
        <PropertyHost :user="user" />
    </div>
</template>
<script>
import PropertyDescription from '../../components/PropertyDescription.vue';
import PropertyDetails from '../../components/PropertyDetails.vue';
import PropertyGallery from '../../components/PropertyGallery.vue';
import PropertyHost from '../../components/PropertyHost.vue';
import PropertyMap from '../../components/PropertyMap.vue';
import PropertyReviews from '../../components/PropertyReviews.vue';
import ShortText from '../../components/ShortText.vue';

export default {
    head() {
        return {
            title: this.home.title
        };
    },
    async asyncData({ params, $dataApi, error }) {
        const [homeData, reviewsData, userData] = await Promise.all([
            $dataApi.getHome(params.id),
            $dataApi.getReviewsByHomeId(params.id),
            $dataApi.getUserByHomeId(params.id)
        ]);
        const badRes = [homeData, reviewsData, userData].find(res => !res.ok);

        if (badRes) {
            return error({
                statusCode: badRes.status,
                message: badRes.statusText
            });
        }

        return {
            home: homeData.json,
            reviews: reviewsData.json.hits,
            user: userData.json.hits[0],
        };
    },
    components: {
        ShortText,
        PropertyGallery,
        PropertyDetails,
        PropertyDescription,
        PropertyMap,
        PropertyReviews,
        PropertyHost
    }
}
</script>