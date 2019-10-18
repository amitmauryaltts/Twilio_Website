/* 
    List of APIs to hit the server by using Axios
 */
import axios from 'axios';
import Config from '../config';

var workSpaceId = "WS850840d6c3b09f040e1eddde51b1633f";
var operatorName = "Roger";

export default {
  /*
    Function to get the list of call logs data under operator
    dashboard page
   */
  CallLogsDashboard(fmsToken) {
    return axios({
      method:'POST',
      url: `${Config.base_url}call/listcalllogs`,
      data:JSON.stringify({
        "callLog": {
          "userType": "operator",
          "to": operatorName,
          "from": "1564396575000",
          "workspaceSid": workSpaceId,
          "date": null,
          "durations": []
        }
      }),
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  }
};
