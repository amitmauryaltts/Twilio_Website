<template></template>

<script>
import gpsService from "../../../services/gps.service";
import alert from '../Alert';
export default {
    props: {
        google: Object,
        map: Object,
        showBtn:Boolean,
    },
    data : ()=>({
        firstCall:true,
        placeID:null
    }),
    mounted() {
        let globalThis=this;
        var searchInput = document.getElementById("searchInput");
        var saveBtn=document.getElementById("saveCord");
        saveBtn.addEventListener('click', ()=>{
             gpsService.saveLastLocation({
                previousLocation:this.placeID
            })

            .then(response => {
               
            })
            .catch(error => {
            this.$refs.alert.open('GPS.ErrorFetchingDeviceList', 'error', error);
            });
                this.$emit('disable-btn',true);
           
        })
        var mapELem = document.getElementById("map");
        mapELem.style.border = "1px solid";
        var searchBox = new this.google.maps.places.SearchBox(searchInput);

        // Bias the SearchBox results towards current map's viewport.
        
        this.map.addListener("bounds_changed", function() {
            searchBox.setBounds(this.getBounds());
            globalThis.$emit('refreshSocketConn',globalThis._data.firstCall);
            globalThis._data.firstCall=false;
        });
        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener("places_changed", () => {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
            return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach((place)=> {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                this.placeID=place.place_id
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            globalThis.map.fitBounds(bounds);
            this.$emit('disable-btn',false);
           
        });
    }
};
</script>