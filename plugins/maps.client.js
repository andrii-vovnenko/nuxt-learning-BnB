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

    function showMap(canvas, lat, lng) {
        if (!isLoaded) {
            waiting.push({ fn: showMap, arguments });
            
            return
        }

        const mapOptions = {
            zoom: 18,
            center: new window.google.maps.LatLng(lat, lng),
            disableDefaultUI: true,
            zoomControl: true,
        };

        const map = new window.google.maps.Map(canvas, mapOptions);
        const position = new window.google.maps.LatLng(lat, lng);
        const marker = new window.google.maps.Marker({ position });
        marker.setMap(map);
    }
}