/* 
    List of APIs to hit the server by using Axios
 */
import axios from 'axios';
import Config from '../config';

export default {
  /*
      Function to get the list of all worker status
  */
  getWorkersStatus(user) {
    return axios({
      method: 'POST',
      url: `${Config.base_url}taskrouter/listallworkers`,
      data: {
        workspaceSid: 'WS850840d6c3b09f040e1eddde51b1633f',
        activityNames: []
      },
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
    Function to get the filter worker status
   */
  filterWorkerStatus(jsonData) {
    return axios({
      method: 'POST',
      url: `${Config.base_url}taskrouter/listallworkers`,
      data: {
        workspaceSid: 'WS850840d6c3b09f040e1eddde51b1633f',
        activityNames: jsonData
      },
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
     Function to  the list of online operators
  */
  getOnlineTableData(fmsToken) {
    return axios({
      method: 'POST',
      url: `${Config.base_url}call/listcalllogs`,
      data: {
        callLog: {
          userType: "admin",
          workspaceSid: "WS850840d6c3b09f040e1eddde51b1633f",
          date: "",
          durations: [],
          status: "ongoing"
        }
      },
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
    Funtion to get the list of waiting operators
  */
  getWaitingTableData(jsonData) {
    return axios({
      method: 'POST',
      url: `${Config.base_url}taskrouter/listalltasks`,
      data: {
        workspaceSid: 'WS850840d6c3b09f040e1eddde51b1633f',
        assignmentStatuses: jsonData
      },
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
    Function to get the list of license plat number
  */
  getLicensePlatNumber(deviceId, fmsToken) {
    return axios({
      method: 'GET',
      url: `${Config.base_url_five}car/details?deviceId=9A3C29F76E13D27A068B4FE33B1DD81C307D81DD`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*  Function to
      Get the list of online operators
      Get the list of wating operators
  */
  getOnlineWaitingTaskCount() {
    return axios({
      method: 'GET',
      url: `${Config.base_url}taskrouter/realtimestatistics?workspaceSid=WS850840d6c3b09f040e1eddde51b1633f`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  }
};
