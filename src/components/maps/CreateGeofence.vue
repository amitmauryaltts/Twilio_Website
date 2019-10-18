<template></template>
<script>
import EventBus  from '../../Utils/EventBus.js';
import config from "../../mapsConfig";
import utilities from '../../utilities';

export default {
    props: {
        google: Object,
        map: Object,
        geofence: Object,
        readonly: Boolean,
    },
    data: () => ({
        currentOverlay: null,
        selectedShape: null,
    }),
    mounted () {
        var drawingManager = this.getDrawingManager(this.readonly);
        drawingManager.setMap(this.map);
        this.initializeGeofenceListeners(drawingManager, this.readonly);
        if (this.geofence) {
            this.initializeGeofence(drawingManager, this.geofence, this.readonly);
        }
    },
    methods: {
        getDrawingManager (readonly) {
            return new this.google.maps.drawing.DrawingManager({
                drawingMode: readonly ? null : this.google.maps.drawing.OverlayType.POLYGON,
                drawingControl: !readonly,
                drawingControlOptions: {
                    position: this.google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        this.google.maps.drawing.OverlayType.CIRCLE,
                        this.google.maps.drawing.OverlayType.POLYGON,
                        this.google.maps.drawing.OverlayType.RECTANGLE
                    ]
                },
                circleOptions: config.CIRCLE_OPTIONS,
                polygonOptions: config.POLYGON_OPTIONS,
                rectangleOptions: config.RECTANGLE_OPTIONS,
            });
        },
        initializeGeofenceListeners (drawingManager, readonly) {
            if (readonly) {
                return;
            }

            function emitCircle (circle) {
                EventBus.$emit("geofenceData", {
                    type: 'circle',
                    radius: circle.radius,
                    center: {
                        lat: circle.center.lat(),
                        lng: circle.center.lng()
                    }
                });
            }
            function emitRectangle (rectangle) {
                EventBus.$emit("geofenceData", {
                    type: 'rectangle',
                    ne: {
                        lat: rectangle.bounds.getNorthEast().lat(),
                        lng: rectangle.bounds.getNorthEast().lng()
                    },
                    sw: {
                        lat: rectangle.bounds.getSouthWest().lat(),
                        lng: rectangle.bounds.getSouthWest().lng()
                    }
                });
            }
            function emitPolygon (polygon) {
                var polygonPoints = polygon.getPath().getLength();
                const paths = [];
                for (var i = 0; i < polygonPoints; i++) {
                    paths.push({
                        lat: polygon.getPath().getAt(i).lat(),
                        lng: polygon.getPath().getAt(i).lng()
                    });
                }
                EventBus.$emit("geofenceData", {
                    type: 'polygon',
                    paths
                });
            }

            //Add events for circle
            google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
                emitCircle(circle);
                google.maps.event.addListener(circle, 'radius_changed', function () {
                    emitCircle(circle);
                });
                google.maps.event.addListener(circle, 'center_changed', function () {
                    emitCircle(circle);
                });
            });
            //Add events for rectangle
            google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
                emitRectangle(rectangle);

                //Used 'debounce' concept as 'bounds_changed' event was triggered
                //for each pixel (a lot of time) if the rectangle was moved
                google.maps.event.addListener(rectangle, 'bounds_changed', utilities.debounce(() => {
                    emitRectangle(rectangle);
                }, 500));
            });
            //Add events for Polygon
            google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
                emitPolygon(polygon);
                google.maps.event.addListener(polygon.getPath(), 'insert_at', function() {
                    emitPolygon(polygon);
                });
                //Used 'debounce' concept as 'set_at' event was triggered
                //for each pixel (a lot of time) if the polygon was moved
                google.maps.event.addListener(polygon.getPath(), 'set_at', utilities.debounce(() => {
                    emitPolygon(polygon);
                }, 500));
            });

            google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                this.currentOverlay = event;
                if (event.type !== google.maps.drawing.OverlayType.MARKER) {
                    drawingManager.setDrawingMode(null);
                    //Write code to select the newly selected object.
                    var newShape = event.overlay;
                    newShape.type = event.type;

                    if (this.selectedShape) {
                        this.selectedShape.setEditable(false);
                        this.selectedShape = null;
                    }
                    this.selectedShape = newShape;
                    this.selectedShape.setEditable(true);
                }
            });

            google.maps.event.addListener(drawingManager, 'drawingmode_changed', function() {
                if (drawingManager.getDrawingMode() && this.currentOverlay) {
                    this.currentOverlay.overlay.setMap(null);
                    this.currentOverlay = null;
                    EventBus.$emit("geofenceData", null);
                }
            });
        },
        initializeGeofence (drawingManager, geofence, readonly) {
            //To programmatically draw (already created) geofences while editing
            if (geofence.type === 'circle') {
                var circleOptions = drawingManager.get('circleOptions');
                circleOptions.center = new this.google.maps.LatLng(geofence.center.lat, geofence.center.lng),
                circleOptions.radius = geofence.radius;
                if (readonly) {
                    circleOptions.clickable = false;
                    circleOptions.editable = false;
                }

                let newCircle = new this.google.maps.Circle(circleOptions);
                newCircle.setMap(this.map);
                if (!readonly) {
                    google.maps.event.trigger(drawingManager, 'overlaycomplete', {overlay: newCircle, type:this.google.maps.drawing.OverlayType.CIRCLE});
                    google.maps.event.trigger(drawingManager, 'circlecomplete', newCircle);
                }
            } else if (geofence.type === 'rectangle') {
                var rectangleOptions = drawingManager.get('rectangleOptions');
                rectangleOptions.bounds = new google.maps.LatLngBounds(
                                                new google.maps.LatLng(geofence.sw.lat, geofence.sw.lng),
                                                new google.maps.LatLng(geofence.ne.lat, geofence.ne.lng)
                                            );
                if (readonly) {
                    rectangleOptions.clickable = false;
                    rectangleOptions.draggable = false;
                    rectangleOptions.editable = false;
                }

                let newRectangle = new this.google.maps.Rectangle(rectangleOptions);
                newRectangle.setMap(this.map);
                if (!readonly) {
                    google.maps.event.trigger(drawingManager, 'overlaycomplete', {overlay: newRectangle, type:this.google.maps.drawing.OverlayType.RECTANGLE});
                    google.maps.event.trigger(drawingManager, 'rectanglecomplete', newRectangle);
                }
            } else if (geofence.type === 'polygon') {
                var polygonOptions = drawingManager.get('polygonOptions');
                polygonOptions.paths = geofence.paths;
                if (readonly) {
                    polygonOptions.clickable = false;
                    polygonOptions.draggable = false;
                    polygonOptions.editable = false;
                }

                let newPolygon = new this.google.maps.Polygon(polygonOptions);
                newPolygon.setMap(this.map);
                if (!readonly) {
                    google.maps.event.trigger(drawingManager, 'overlaycomplete', {overlay: newPolygon, type:this.google.maps.drawing.OverlayType.RECTANGLE});
                    google.maps.event.trigger(drawingManager, 'polygoncomplete', newPolygon);
                }
            }
        }
    }
};
</script>
