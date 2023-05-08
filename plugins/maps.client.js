export default function(ctx, inject) {
    let mapLoaded = false;
    let mapWaiting = null;

    inject('maps', { showMap });
    addScript();


    function initMap() {
        mapLoaded = true;
        if (mapWaiting) {
            renderMap(mapWaiting);
            mapWaiting = null;
;        }
    };
    function addScript() {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${'AIzaSyBzjSB9FNvJ-srApWj6QiaBjgC2nwF1FKQ'}&libraries=places&callback=initMap`;
        script.async = true;
        window.initMap = initMap;
        document.head.appendChild(script);
    };

    function showMap(canvas, lat, lng) {
        if (mapLoaded) renderMap(canvas, lat, lng);
        else mapWaiting = { canvas, lat, lng };
    }

    function renderMap(canvas, lat, lng) {
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