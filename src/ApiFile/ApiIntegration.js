/* List of APIs to hit the server by using Axios
 */
import axios from 'axios';
import Config from '../config';

var identity = "Roger";
var workSpaceId = 'WS850840d6c3b09f040e1eddde51b1633f';
var workerId = 'WK73a6c5e05304a7b1654cfe8dc43b9f72';
var activitySid = 'AC22a9112e394e806fba11993355c6e773';
var apiKey = 'c32a4ewUDD1NHwDFhOBbJ7CTsrbiOwKz85ttbNRi';
var startRecordOnParticipantConnect = true;

export default {
  /*
     Function to get the Access Token
  */
  getAccessTokenApi() {
    return axios({
      method: 'GET',
      url: `${Config.base_url}accesstoken?userType=operator&identity=${identity}`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
      Function to get the worker capability token
  */
  getApiForCapabilityToken() {
    return axios({
      method: 'POST',
      url: `${Config.base_url}taskrouter/workercapabilitytoken`,
      data: JSON.stringify({
        workspaceSid: workSpaceId,
        workerSid: workerId
      }),
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
      Function to create room
   */
  createRoomApi() {
    return axios({
      method: 'POST',
      url:`${Config.base_url_eight}call/createroom`,
      data:JSON.stringify({
        identity: "Roger",
        startRecordOnParticipantConnect: true
      }),
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
      Function  to update the worker
   */
  updateWorker() {
    return axios({
      method: 'PUT',
      url: `${Config.base_url}taskrouter/worker`,
      data: JSON.stringify({
        "workspaceSid": workSpaceId,
        "workerSid": workerId,
        "activitySid": activitySid
      }),
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
      Function to get the list of device Id by passing the IMEI Number
  */
  getDeviceIdFromImei(IMEINo,deviceAccessToken) {
    return axios({
      method: 'GET',
      url: `${Config.base_url_three}assets/device/iotinfo?model=CDR8010&uniqueid=${IMEINo}`,
      headers: {
        'Authorization': 'Bearer ' + deviceAccessToken,
        'Content-Type': Config.header.contentType,
        'x-api-key': apiKey
      }
    });
  },
  /*
     Function to get access token from auth device login
 */
  getAccessTokenFromAuthLogin(DVRimeiNo) {
    return axios({
      method: 'POST',
      url: `${Config.base_url_seven}auth/devices/login`,
      body:JSON.stringify({
      "model": "CDR8010",
      "unique_id": "357601090000310",
      "client_id": "askey.dvr.cdr8010"
      }),
      headers: {
        'Content-Type': Config.header.contentType,
        'x-api-key': 'cxcGsgoN0i2kolOo43lO49SRTXnYlvoX8jQt2sgf'
      }
    });
  }
};
