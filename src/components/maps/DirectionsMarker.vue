<template></template>
<script>
export default {
    props: {
        google: Object,
        map: Object,
        routeDetails: Object
    },
    mounted () {
        var directionsDisplay = new this.google.maps.DirectionsRenderer();
        var directionsService = new this.google.maps.DirectionsService();
        directionsDisplay.setMap(this.map);

        directionsService.route(this.routeDetails, function(response, status) {
            if (status === "OK") {
                directionsDisplay.setDirections(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        });
    }
};
</script>
