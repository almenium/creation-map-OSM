
/* Fonction pour la création d'une map avec marqueur de l'hotel + POIs 
    Function to create a map with hotels ans POIs makers*/
function initialize() {

/* fonction récupération en JSON de la latitude et longitude 
get coordinates in JSON*/    
var coordinate = function () {
    var temp = null;
    $.ajax({
        async: false,
        type: "GET",
        global: false,
        dataType: 'json',
        url: "index.php",
        data: { id : 2},
        success: function (data) {
            temp = data;
        }
    });
    return temp;
}();

/* Coordonnées de la map (centre de la map + zoom)
    center map coordinates */
    var map = L.map('map', {
    center: coordinate,
    zoom: 15
});

/* Icone pour l'hotel 
    hotel icon */
var hotelIcon = L.icon({
    iconUrl: 'marker_png/marker_hotel.png',
    iconSize:[30,30],
    iconAnchor: [5,20]
});

/* Layer d'open street map + ajout a la variable map qui détient les coordonnées du centre de cette map + zoom 
    adding osm layer*/
var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'}).addTo(map);    
 
/* Marker de l'hotel (centre de la carte)
    placing hotel marker to map */ 
L.marker(coordinate,{icon: hotelIcon}).addTo(map);

/* liste des filtres des POIs 
    List of POIs to filter on the map*/
var poisList=
['[tourism=attraction]',
'[tourism=zoo]',
'[tourism=artwork]',
'[tourism=museum]',
'[tourism=viewpoint]',
'[tourism=information][information=office]',
'[amenity=dive_center]',
'[amenity=casino]',
'[building=cathedral]',
'[building=temple]',
'[historic=castle]',
'[historic=church]',
'[historic=monument]',
'[craft=winery]',
'[leisure=beach_resort]',
'[leisure=fishing]',
'[leisure=nature_reserve]',
'[leisure=golf_course]',
'[leisure=pitch][sport=tennis][surface=clay]',
'[leisure=swimming_area]',
'[natural=volcano]'];

var poisFilter ='';

var i;
for(i=0; i<poisList.length; i++) {
    poisFilter += 'node({lat1},{lon1},{lat2},{lon2})[name]'+poisList[i]+';out;'
};

/* affichage des POIs sur la map 
    adding POIs to map*/
L.layerJSON({
    url: 'http://overpass-api.de/api/interpreter?data=[out:json];'+poisFilter,
    propertyItems: 'elements',
    propertyTitle: 'tags.name',
    propertyLoc: ['lat','lon'],

    /* Création de l'icone pour le type de POI recherché 
        create icon for POIs*/
   buildIcon: function(data, title) {
    return new L.Icon({
        iconUrl:'marker_png/marker_POIS.png',
        iconSize: new L.Point(25, 25),
        iconAnchor: new L.Point(5, 20),
        popupAnchor: new L.Point(0, -37)
        });
   },
   /* Création d'un pop up avec nom du POIs
        Popup that show POIs name */
    buildPopup: function(data, marker) {
        return data.tags.name;
    }
}).addTo(map); 
}


