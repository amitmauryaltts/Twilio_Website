/* 
    List of APIs to hit the server by using Axios
 */
import axios from 'axios';
import Config from '../config';

export default {
  /*
      Function to the list of Car, Job and driver information
   */
  deviceIDApi(accessToken, deviceId) {
    return axios({
      method: 'GET',
      url: `${Config.base_url_three}car/details?deviceId=${deviceId}`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
      Function to get the list of devices
  */
  getDeviceId() {
    return axios({
      method: 'GET',
      url: `${Config.base_url_three}assets/devices`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType,
        "x-api-key": "cxcGsgoN0i2kolOo43lO49SRTXnYlvoX8jQt2sgf",
      }
    });
  }
};
