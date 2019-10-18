module.exports = {
    LANGUAGE: 'en',

    AUTOCOMPLETE_MAX_RECORDS: 10,

    /*
        Details related to Pagination in Listing pages
        RPP -> Rows Per Page
        PPT -> Pages Per Tab
        Ex: 3 Pages Per Tab will come as:

            [<] [1] [2] [3] [>]
                    AND
            [<] [4] [5] [6] [>]
    */
    CAR_LIST_RPP: 100,
    CAR_LIST_PPT: 5,
    DRIVER_LIST_RPP: 100,
    DRIVER_LIST_PPT: 5,
    JOB_LIST_RPP: 100,
    JOB_LIST_PPT: 5,
    MESSAGE_LIST_RPP: 100,
    MESSAGE_LIST_PPT: 5,

    CIRCLE_OPTIONS: {
        clickable: true,
        editable: true,
        fillColor: '#5677D4',
        fillOpacity: 0.2,
        strokeWeight: 3,
        zIndex: 1,
    },
    POLYGON_OPTIONS: {
        clickable: true,
        draggable: true,
        editable: true,
        fillColor: '#5677D4',
        fillOpacity: 0.2,
    },
    RECTANGLE_OPTIONS: {
        clickable: true,
        draggable: true,
        editable: true,
        fillColor: '#5677D4',
        fillOpacity: 0.2,
    },
};
