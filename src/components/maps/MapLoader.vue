<template>
    <div>
        <div id="map" style="width:100%"></div>
        <template v-if="!!this.google && !!this.map">
            <slot :google="google" :map="map" />
        </template>
    </div>
</template>

<script>
// This componenet loads the google map
import gpsService from "../../ApiFile/gpsService";
import GoogleMapsApiLoader from "google-maps-api-loader";
export default {
    props: {
        mapHeight: {
            default: "335px",
            type: String
        },
        places: Array,
        showlocation: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            google: null,
            map: null,
            apiKey: 'AIzaSyAB-BBxjfFHsraj1SUix_SdtPGoCTIOT9w',
            coordinates: null
        };
    },
    async mounted() {
        const googleMapApi = await GoogleMapsApiLoader({
            libraries: ["places", "drawing"],
            apiKey: this.apiKey
        });
        this.google = googleMapApi;
        const mapContainer = this.$el.querySelector("#map");
        mapContainer.style.height = this.mapHeight;
        this.map = new this.google.maps.Map(mapContainer);
        if (this.showlocation) {
            await gpsService
                .getLastlocation()
                .then(response => {
                    let request = {
                        placeId: response.data.data.previousLocation,
                        fields: [
                            "name",
                            "formatted_address",
                            "place_id",
                            "geometry"
                        ]
                    };
                    let service = new this.google.maps.places.PlacesService(
                        this.map
                    );
                    service.getDetails(request, (place, status) => {
                        if (
                            status ===
                            this.google.maps.places.PlacesServiceStatus.OK
                        ) {
                            this.coordinates = {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            };
                            this.initializeMap();
                        }
                    });
                })
                .catch(error => {});
        } else {
            this.initializeMap();
        }
    },
    methods: {
        initializeMap() {
            this.map.setOptions({
                center: this.coordinates? this.coordinates: { lat: 23.697809, lng: 120.960518 },
                zoom: 8,
                gestureHandling: "cooperative",
                zoomControl: true,
                zoomControlOptions: {
                    position: this.google.maps.ControlPosition.RIGHT_TOP
                },
                scaleControl: true,
                streetViewControl: true,
                streetViewControlOptions: {
                    position: this.google.maps.ControlPosition.RIGHT_TOP
                }
            });
        },
        getLocation() {
            let position;
            if (navigator.geolocation) {
                this.position = navigator.geolocation.position.coords;
            }
            return this.position;
        }
    }
};
</script>

<style scoped>
#map {
    height: 100vh;
    width: 100%;
}
</style>
