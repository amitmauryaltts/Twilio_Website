/* 
    List of APIs to hit the server by using Axios
 */
import axios from 'axios';
import Config from '../config';

var identity = "Roger";

export default {
  /*
    Function to start the voice reocordings
   */
  startRecording(callSidForRecording) {
    return axios({
      method: 'GET',
      url: `${Config.base_url}call/voicecallrecord?callSid=${callSidForRecording}&action=start`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
    Function to pause the voice reocordings
   */
  onPause(recordSid, callSid) {
    return axios({
      method: 'GET',
      url: `${Config.base_url}call/voicecallrecord?callSid=${callSid}&action=pause&recordSid=${recordSid}`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
    Function to resume the voice reocordings
   */
  onResume(recordSid, callSid) {
    return axios({
      method: 'GET',
      url: `${Config.base_url}call/voicecallrecord?callSid=${callSid}&action=resume&recordSid=${recordSid}`,
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  }
};
