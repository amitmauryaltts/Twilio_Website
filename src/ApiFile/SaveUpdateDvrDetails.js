/* 
    List of APIs to hit the server by using Axios
 */

import axios from 'axios';
import Config from '../config';

/* 
    Funtion to get the current timestamp to pass as json data while saving call logs
*/
function getData() {
  this.date = new Date;
  this.timestamp = this.date.getTime();
};

export default {
  /*
      Function to save the call logs 
   */
  saveCallLogsFromDvrToOperator(callSid, fromCall, toCall, deviceId, catgeary, type) {
    var gettimestamp = new getData();
    return axios({
      method: 'POST',
      url: `${Config.base_url}call/calllogs`,
      data: JSON.stringify({
        "callLog": {
          "id": callSid,
          "category": catgeary,
          "eventdescription": "left tire has been broken over the bridge",
          "status": "ongoing",
          "type": type,
          "date": gettimestamp.timestamp,
          "deviceid": deviceId,
          "duration": 0,
          "from": fromCall,
          "operatorname": "Roger",
          "to": toCall,
          "workspacesid": "WS850840d6c3b09f040e1eddde51b1633f"
        }
      }),
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
    Function to update the call logs with recordings and notes after disconnecting calls 
  */
  updateCalllogsFromDvrToOperator(callSid, message, recordingUrl, recordingSid, status) {
    return axios({
      method: 'PUT',
      url: `${Config.base_url}call/calllogs`,
      data: JSON.stringify({
        "callLog": {
          "id": callSid,
          "status": status,
          "duration": 0,
          "recordingUrl": recordingUrl,
          "notes": message,
          "recordingSid": recordingSid
        }
      }),
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
    Function  to compose the video recordings
  */
  composeVideoRecordings(roomSid, participantSid, acessToken) {
    return axios({
      method: 'POST',
      url: `${Config.base_url_eight}call/composevideorecordings`,
      data: JSON.stringify({
        "roomSid": roomSid,
        "participantSid": participantSid
      }),
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  }
};
