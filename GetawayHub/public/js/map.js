let mapToken=Maptoken;
mapboxgl.accessToken = mapToken;
console.log(mapToken);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center:coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});
console.log(coordinates);
const marker = new mapboxgl.Marker()
.setLngLat(coordinates)
.setPopup( new mapboxgl.Popup({offset:3})
.setHTML("<p>Exact location will be provided after booking</p>"))
.addTo(map);