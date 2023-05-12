export default function(ctx, inject) {
    let isLoaded = false;
    let waiting = [];

    const googleApiParams = `key=${'AIzaSyBzjSB9FNvJ-srApWj6QiaBjgC2nwF1FKQ'}&libraries=places&callback=initMap`;
    const goggleApiHost = 'https://maps.googleapis.com/maps/api/js';

    inject('maps', { showMap, makeAutoComplete });
    addScript();

    function initGooglemaps() {
        isLoaded = true;
        waiting.forEach(item => {
            if(typeof item.fn === 'function') {
                item.fn(...item.arguments);
            }
        });

        waiting = [];
    };

    function makeAutoComplete(input) {
        if (!isLoaded) {
            waiting.push({ fn: makeAutoComplete, arguments });
            
            return;  
        }

        const options = {
            types: ['(cities)'],
        };
        const autoComplete = new google.maps.places.Autocomplete(input, options);
        autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace();
            input.dispatchEvent(new CustomEvent('changed', { detail: place }));
        });
    }

    function addScript() {
        const script = document.createElement('script');
        script.src = `${goggleApiHost}?${googleApiParams}`;
        script.async = true;
        window.initMap = initGooglemaps;
        document.head.appendChild(script);
    };

    function showMap(canvas, lat, lng, markers = []) {
        if (!isLoaded) {
            waiting.push({ fn: showMap, arguments });
            
            return
        }

        const mapOptions = {
            zoom: 18,
            center: new window.google.maps.LatLng(lat, lng),
            disableDefaultUI: true,
            zoomControl: true,
            styles:[{
                featureType: 'poi.business',
                elementType: 'labels.icon',
                stylers:[{ visibility: 'off' }]
            }]
        };

        const map = new window.google.maps.Map(canvas, mapOptions);
        
        if (!markers.length) {
            const position = new window.google.maps.LatLng(lat, lng);
            const marker = new window.google.maps.Marker({ position, clickable: false });
            marker.setMap(map);
            return;
        }

        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach(({
            lat, lng, pricePerNight, id,
        }) => {
            const position = new window.google.maps.LatLng(lat, lng);
            const marker = new window.google.maps.Marker({
                position,
                label: {
                    text: `$${pricePerNight}`,
                    className: `marker home-${id}`,
                },
                icon: 'https://maps.gstatic.com/mapfiles/transparent.png',
                clickable: false, 
            });
            marker.setMap(map);
            bounds.extend(position);
        });

        map.fitBounds(bounds);
    }
}