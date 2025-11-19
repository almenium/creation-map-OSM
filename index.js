/**
 * Visualisation d'une carte centrée sur un hôtel
 * + affichage des points d'intérêt (POI) autour, via Overpass API
 */

/**
 * Récupère l'ID d'hôtel dans l'URL (?id=2), avec un fallback.
 */
function getHotelIdFromUrl(defaultId = 1) {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('id');
    const parsed = parseInt(value, 10);

    return Number.isNaN(parsed) ? defaultId : parsed;
}

/**
 * Appelle l'API PHP pour récupérer les coordonnées de l'hôtel.
 * @param {number} hotelId
 * @returns {Promise<[number, number]>} [lat, lon]
 */
async function fetchHotelCoordinates(hotelId) {
    const response = await fetch(`index.php?id=${encodeURIComponent(hotelId)}`);

    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération de l'hôtel (HTTP ${response.status})`);
    }

    const data = await response.json();

    if (!data || typeof data.lat === 'undefined' || typeof data.lon === 'undefined') {
        throw new Error('Réponse JSON invalide : lat/lon manquants');
    }

    return [parseFloat(data.lat), parseFloat(data.lon)];
}

/**
 * Initialise la carte, le marqueur d'hôtel, et les POI.
 */
async function initialize() {
    const mapContainer = document.getElementById('map');

    try {
        const hotelId = getHotelIdFromUrl(2); // ID par défaut = 2
        const coordinate = await fetchHotelCoordinates(hotelId);

        // Création de la carte centrée sur l'hôtel
        const map = L.map('map', {
            center: coordinate,
            zoom: 15
        });

        // Icône personnalisée pour l'hôtel
        const hotelIcon = L.icon({
            iconUrl: 'marker_png/marker_hotel.png',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        // Fond de carte OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Marqueur pour l'hôtel
        L.marker(coordinate, { icon: hotelIcon })
            .bindPopup('Hôtel sélectionné')
            .addTo(map);

        // Liste des types de POI à afficher (Overpass filters)
        const poisList = [
            '[tourism=attraction]',
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
            '[natural=volcano]'
        ];

        // Construction du filtre Overpass avec bbox dynamique
        // Les {lat1} {lon1} {lat2} {lon2} seront remplacés par le plugin LayerJSON
        let poisFilter = '';
        for (const filter of poisList) {
            poisFilter += `node({lat1},{lon1},{lat2},{lon2})[name]${filter};out;`;
        }

        const overpassQuery = `[out:json];${poisFilter}`;
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

        // Affichage des POI via L.LayerJSON
        L.layerJSON({
            url: overpassUrl,
            propertyItems: 'elements',
            propertyTitle: 'tags.name',
            propertyLoc: ['lat', 'lon'],

            // Icône pour les POI
            buildIcon: function (data, title) {
                return new L.Icon({
                    iconUrl: 'marker_png/marker_POIS.png',
                    iconSize: new L.Point(25, 25),
                    iconAnchor: new L.Point(12, 24),
                    popupAnchor: new L.Point(0, -20)
                });
            },

            // Contenu de la popup des POI
            buildPopup: function (data, marker) {
                if (data.tags && data.tags.name) {
                    return data.tags.name;
                }
                return 'Point d\'intérêt';
            }
        }).addTo(map);
    } catch (error) {
        console.error(error);
        if (mapContainer) {
            mapContainer.innerHTML =
                '<div class="error">Une erreur est survenue lors du chargement de la carte. ' +
                'Merci de réessayer plus tard.</div>';
        }
    }
}

// Lancement une fois que la page est chargée
window.addEventListener('load', initialize);
