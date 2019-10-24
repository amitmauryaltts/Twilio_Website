/* 
    List of APIs to hit the server by using Axios
 */
import axios from 'axios';
import Config from '../config';
export default {
  /*
      Function  to get the deriver information
  */
  driverInformationApi(accessToken,imeiNo) {
    return axios({
      method: 'GET',
      url: `${Config.base_url_five}car/details?deviceId=${imeiNo}`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
    Function to get telematics data
  */
  getTelematicsData() {
    return axios({
      method: 'GET',
      url: `${Config.base_url_nine}telematic/device/status?deviceid=936442486AA0E0FCDB88A3FCD7DBEA00F0608E86`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType,
        'x-api-key' : 'cxcGsgoN0i2kolOo43lO49SRTXnYlvoX8jQt2sgf' 
      }
    });
  }
};
