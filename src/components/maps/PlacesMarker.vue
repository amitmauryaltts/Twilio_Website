<template>
    <div>
    </div>
</template>

<script>
import MarkerClusterer from "@google/markerclusterer";
import gpsService from "../../../services/gps.service";
import InfoWindowComponent from "./InfoWindow";
import Vue from "vue";

export default {
    name:"PlacesMarker",
    props: {
        google: Object,
        map: Object,
        places: Array,
        infoWindowDisplay: {
            default: false,
            type: Boolean
        }
    },
    
    data: function() {
        return {
            infoWindowButton: ""
        };
    },
    mounted() {
        var new_infowindow = new google.maps.InfoWindow({
            content:null
        });

        let openInfoWindow = function(map, marker, response) {
            var InfoWindow = Vue.extend(InfoWindowComponent);
            var instance = new InfoWindow({
                propsData: {
                    content: response
                }
            });
            instance.$mount();
            new_infowindow.open(map, marker);
            new_infowindow.setContent(instance.$el);

        };

        var markers = [];
        console.log(this.places)
        this.places.forEach((place, i) => {
            let position = new this.google.maps.LatLng(place.lat, place.lng);
            markers[i] = new this.google.maps.Marker({
                position,
                title: place.deviceid ? place.deviceid : null
            });

            // To add the marker to the map, call setMap();
            markers[i].setMap(this.map);
            if(this.infoWindowDisplay){
                 this.google.maps.event.addListener(markers[i], "click", function(
                res
            ) {
                gpsService
                    .getDeviceDetails(markers[i].title)
                    .then(response => {
                        console.log(response.data.data[markers[i].title])
                        openInfoWindow(this.map, markers[i], response.data.data[markers[i].title]);
                    })
                    .catch(err => {});
            });
            }
           
            // }
        });
        var markerCluster = new MarkerClusterer(this.map, markers, {
            imagePath:
                "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
        });
    }
};
</script>
