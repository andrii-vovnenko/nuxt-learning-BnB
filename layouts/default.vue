<template>
    <div class="app">
        <header class="app-header">
            <div class="app-logo">
                <img src="/images/logo.svg" />
            </div>
            <div class="app-search">
                <input type="text" ref="citySearch" @changed="changed" placeholder="Enter your address" />
                <input type="text" class="datepicker" placeholder="Check In"/> 
                <input type="text" class="datepicker" placeholder="Check Out"/>
                <button>
                    <img src="/images/icons/search.svg" />
                </button> 
            </div>
            <div class="app-user-menu">
                <img src="/images/icons/house.svg" />
                <div class="name">Host</div>
                <img class="avatar" src="/images/user.jpg"/>
            </div>
        </header>
        <nuxt/>
    </div>
</template>
<script>
    export default {
        methods: {
            changed(event) {
                const place = event.detail;

                if (!place) return;

                this.$router.push({
                    name: 'search',
                    query: {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        label: this.$refs.citySearch.value,
                    },
                });
            }
        },
        mounted() {
            this.$maps.makeAutoComplete(this.$refs.citySearch);
        }
    }
</script>