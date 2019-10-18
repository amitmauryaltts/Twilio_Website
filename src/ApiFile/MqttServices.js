/* 
    List of APIs to hit the server by using Axios
 */
import axios from 'axios';
import Config from "../config";

export default {
  /*
      Funtion to save the voice recordings using MQTT message
  */
  voiceMqtt(conferenceName, deviceId, callCancel) {
    return axios({
      method: 'POST',
      url: `${Config.base_url_eight}mqtt/publishmessage`,
      data: JSON.stringify({
        "clientId": "operator-pub1",
        "topic": `${deviceId}/askey_ecall`,
        "messagePayload":
          {
            "callType": "audio_call",
            "isCancelCall": callCancel,
            "companyName": "Askey Computers, Taiwan",
            "roomName": conferenceName
          }
      }),
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
      Function to save the video recordings using MQTT message
  */
  videoMqtt(Uniquename, deviceId, callCancel) {
    return axios({
      method: 'POST',
      url: `${Config.base_url_eight}mqtt/publishmessage`,
      data: JSON.stringify({
        "clientId": "operator-pub1",
        "topic": `${deviceId}/askey_ecall`,
        "messagePayload":
          {
            "callType": "video_call",
            "isCancelCall": callCancel,
            "companyName": "Askey Computers, Taiwan",
            "roomName": Uniquename,
          }
      }),
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  },
  /*
      Function  to switch the camera for front and back side
  */
  switchCameraMqtt(ImeiNo, roomId, Uniquename, cameratype) {
    return axios({
      method: 'POST',
      url: `${Config.base_url_eight}mqtt/publishmessage`,
      data: JSON.stringify({
        "clientId": "operator-pub1",
        "topic": `${ImeiNo}/askey_ecall`,
        "messagePayload":
          {
            "callType": "video_call",
            "isCancelCall": false,
            "companyName": "Askey Computers, Taiwan", // optional
            "roomName": Uniquename,
            "room_id": roomId,
            "camera_type": cameratype
          }
      }),
      headers: {
        'Authorization': Config.header.authorization,
        'Content-Type': Config.header.contentType
      }
    });
  }
};
