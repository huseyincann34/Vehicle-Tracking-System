var map = L.map('map').setView([ 59.4903803, 17.749511], 15);
var harita=L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attribution: "Proje 1",
    maxZoom:20,
    subdomains:['mt0','mt1','mt2','mt3']

})

harita.addTo(map);


