import axios from 'axios';

const RESOURCE_NAME = 'device';
const RESOURCE_SERVICE='details';

export default {
    getDeviceDetails(deviceID){
        if (!deviceID) {
            deviceID = '';
        }
        return axios({
            method: 'get',
            url: `${process.env.VUE_APP_FMS_HOST_NAME}${RESOURCE_NAME}/${RESOURCE_SERVICE}?id=${deviceID}`
        });
    },

    getAllDevices(){
        return axios({
            method: 'get',
            url: `${process.env.VUE_APP_FMS_HOST_NAME}${RESOURCE_NAME}/telematics`
        });
    },
    getLastlocation(){
        return axios({
            method: 'get',
            url: `${process.env.VUE_APP_FMS_HOST_NAME}geofence/location/`
        });
    },
    saveLastLocation(data){
        return axios({
            method: 'put',
            data:data,
            url: `${process.env.VUE_APP_FMS_HOST_NAME}geofence/location/`
        });
    }
}
