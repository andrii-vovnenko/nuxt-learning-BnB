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
    </div>
</template>
<script>
    import homes from '../../data/homes.json'
    export default {
        head() {
            return {
                title: this.home.title,
            }
        },
        data() {
            const currentHomeId = this.$route.params.id;
            return {
                home: homes.find(home => home.objectID === currentHomeId),
            }
        },
        created() {
            const currentHomeId = this.$route.params.id;
            const home = homes.find(home => home.objectID === currentHomeId);
            this.home = home;
        }
    }
</script>