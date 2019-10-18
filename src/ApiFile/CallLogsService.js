/* 
    List of APIs to hit the server by using Axios
 */
import axios from 'axios';
import Config from '../config';

var workSpaceId = "WS850840d6c3b09f040e1eddde51b1633f";
var operatorName = "Roger";

export default {
  /*
      Function to get the list of call logs data if Operator or Admin logged in
   */
  getCallLogs(userType, fmsToken) {
    /*
      Condition to get the list of call logs data if Operator logged in
   */
    if (userType == 'operator') {
      return axios({
        method: 'POST',
        url: `${Config.base_url}call/listcalllogs`,
        data: {
          callLog: {
            userType: "operator",
            to: operatorName,
            from: operatorName,
            workspaceSid: workSpaceId,
            date: null,
            durations: []
          }
        },
        headers: {
          'Authorization': Config.header.authorization,
          'Content-Type': Config.header.contentType,
          "Connection": "keep-alive"
        }
      });
    } else {
      /*
          Condition to get the list of call logs data if Admin logged in
      */
      return axios({
        method: 'POST',
        url: `${Config.base_url}call/listcalllogs`,
        data: {
          callLog: {
            userType: "admin",
            workspaceSid: workSpaceId,
            date: "",
            durations: []
          }
        },
        headers: {
          'Authorization': Config.header.authorization,
          'Content-Type': Config.header.contentType
        }
      });
    }
  },
  /*
    Function to get filter call logs data if Operator or Admin Logged in
  */
  filterCallLogs(dateObj, durations, userType, fmsToken) {
    /*
        Condition to get filter call logs data of Operator
    */
    if (userType == 'operator') {
      return axios({
        method: 'POST',
        url: `${Config.base_url}call/listcalllogs`,
        data: {
          callLog: {
            userType: "operator",
            operatorName: operatorName,
            to: "",
            from: "",
            workspaceSid: workSpaceId,
            date: dateObj,
            durations: durations
          }
        },
        headers: {
          'Authorization': Config.header.authorization,
          'Content-Type': Config.header.contentType
        }
      });
    } else {
      /*
       Condition to get filter call logs data of Admin
     */
      return axios({
        method: 'POST',
        url: `${Config.base_url}call/listcalllogs`,
        data: {
          callLog: {
            userType: "admin",
            to: null,
            from: null,
            workspaceSid: workSpaceId,
            date: dateObj,
            durations: durations
          }
        },
        headers: {
          'Authorization': Config.header.authorization,
          'Content-Type': Config.header.contentType
        }
      });
    }
  },
  /*
     Function  to play video recordings
   */
  playVideoRecordings(recordingSid) {

    return axios({
      method: 'GET',
      url: `${Config.base_url}call/getvideorecordingbyid?compositionSid=${recordingSid}`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  }
};
