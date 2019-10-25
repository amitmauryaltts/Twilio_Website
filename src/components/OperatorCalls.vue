<template>
  <div class="driverInfo">
    <div class="popUp">
      <div class="modal fade" id="carInformationModal" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered modal-dialog-notes">
          <div class="modal-content">
                  <span class="close "> <label style="margin-top: 10px;font-size: 20px;margin-left: 13px;"></label>
                  </span>
            <span style="color:red;margin-left:13px;"></span>
            <div class="modal-body">
              <h5><b>Driver Information</b></h5>
              <ul>
                <li><b>Driver Name:</b> {{driverName}}</li>
                <li><b>Driver ID:</b> {{driverId}}</li>
              </ul>
              <h5><b>Car Information</b></h5>
              <ul>
                <li><b> Model Name :</b> {{carModelName}}</li>
                <li><b>License Plate Number :</b> {{carLicensePlateNumber}}</li>
              </ul>
              <h5><b>Job Description</b></h5>
              <ul>
                <li><b> Job Description:</b> {{job_description}}</li>
              </ul>
              <br>
              <button type="button" class="btn btn-primary btn-block" style="width:22%"
                      @click="closeCarDriverInformationPopup"
              >close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-deck call-logs">
      <div class="card">
        <div class="card-body">
          <h6>
            Alert/Event List
            <div class="call-log-btn-head"></div>
          </h6>
          <div class="card-text">
            <table class="table">
              <thead>
              <tr>
                <th>Driver Name</th>
                <th>License Plate Number</th>
                <th>Alert/Event Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(callLogs,key) in callLogsDataArray">
                <td>{{ callLogs.driver.firstName ||'' }} {{' ' +callLogs.driver.lastName ||'' }}</td>
                <td>
                  <button @click="showDriverInformation(callLogs)">{{callLogs.car.licensePlateNumber || '' }}</button>
                </td>
                <td>{{ callLogs.eventDescription[key] || '' }}</td>
                <td>Active</td>
                <td class="btn-cell">
                  <i class="fas fa-clipboard-list"></i>
                  <i style="font-size:16px;cursor: pointer" class="fa"
                     v-on:click="videoCall(callLogs.car.deviceId, callLogs.car.deviceIMEI, false)">&#xf03d;</i> &nbsp;
                  <i class="fas fa-phone-volume"
                     v-on:click="voiceCall('value', mqttFun, callLogs.car.deviceId, callLogs.car.deviceIMEI, false)"
                     style="cursor: pointer;font-size: 19px;"> </i>

                  <div class="popUp">
                    <div class="modal fade" id="answerCallModalForoperator" data-keyboard="false"
                         data-backdrop="static">
                      <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                          <div class="modal-body" style="text-align: center">
                            <img src="@/assets/phoneCalling.png" id="phoneCallImg">
                            <div id="licensePlate" style="clear:both">
                              <p>Connecting.......</p>
                              <div style="font-size: 26px;color: black">
                              </div>
                            </div>
                          </div>
                          <div style="padding: 10px">
                            <span v-if="videoCancel===true">
                               <button @click="videoCall(callLogs.car.deviceId, callLogs.car.deviceIMEI, true)"> Cancel
                             Video Call
                            </button>
                            </span>

                            <span v-if="audioCancel===true">
                               <button
                                 @click="voiceCall('value', mqttFun, callLogs.car.deviceId, callLogs.car.deviceIMEI, true)">
                              Cancel Audio Call
                            </button>
                            </span>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ApiIntegration from '../ApiFile/ApiIntegration';
  import MqttServices from '../ApiFile/MqttServices';
  import router from '../router';
  import FMSDeviceIdApi from '../ApiFile/FMSDeviceIdApi'
  import EventBus from '../Utils/EventBus';
  import SaveUpdateDvrDetails from '../ApiFile/SaveUpdateDvrDetails';
  import DriverInfoServices from '../ApiFile/DriverInfoService';

  const Twilio = require('twilio-client');
  const {connect, createLocalVideoTrack} = require('twilio-video');
  var mqtt = require('mqtt');
  var S3 = require('aws-sdk/clients/s3');
  var AWS = require('aws-sdk/global');
  var AWS = require('aws-sdk');
  var exists = require('fs-exists-sync');
  var globalConn;
  var getAcessToken;
  var istracksubscribe, trackSubscribed;
  var recordSid;
  var callSid;
  var x = {};
  var connection;
  var timeOut;

  export default {
    name: 'OperatorCalls',
    data() {
      return {
        showPopup: false,
        loading: true,
        errored: false,
        callLogsData: [],
        deviceIdArray: [],
        usersOnlineNum: 0,
        callLogsDataArray: [],
        compositionSid: '',
        accessToken: '',
        sendAudioVideoObj: {},
        imeiNumber: [],
        dynamicDeviceId: '',
        paramsForAudio: {},
        fmsToken: '',
        videoResponse: '',
        notesMessage: '',
        noDivert: false,
        driverName: '',
        driverId: '',
        carId: '',
        carModelName: '',
        carLicensePlateNumber: '',
        job_description: '',
        videoCancel : true,
        audioCancel : true
      }
    },
    props: ["noDivert"],
    computed: {
      usersWaitingCallNum: function () {
        return 0;
      },
      usersMissedCallNum: function () {
        return 0;
      },
      usersCompletedCallNum: function () {
        return 0;
      }
    },
    filters: {
      formatTime(value) {
        if (value) {
          return moment(String(value)).format('hh:mm:ss')
        }
      },
      formatDate(value) {
        if (value) {
          return moment(String(value)).format('YYYY/MM/DD')
        }
      },

    },
    mounted() {
      Twilio.Device.on('disconnect', function (conn) {
        conn.disconnect();
      });
    },
    created() {
      var storeThis = this;
      storeThis.$loading(true);
      storeThis.fmsToken = localStorage.getItem("fmsToken");
      EventBus.$on('notes', (payload) => {
        this.notesMessage = payload;
      });
      /* Api to get device id   */
      FMSDeviceIdApi.getDeviceId()
        .then((responseDeviceId) => {
          console.log(responseDeviceId.data.devices);
          this.callLogsDataArray = [];
          for (var i = 0; i < responseDeviceId.data.devices.length; i++) {
            storeThis.deviceIdArray = responseDeviceId.data.devices[i].deviceid;
            console.log(storeThis.deviceIdArray);
            /* Api to get driver information according to job description   */
            DriverInfoServices.driverInformationApi(storeThis.fmsToken, responseDeviceId.data.devices[i].deviceid)
              .then((res) => {
                console.log('driverInfo', res);
                x = res.data.data;
                x.eventDescription = ['Sharp Left Turn', 'Sharp Right Turn', 'Speed Limit Exceeded', 'Outside Geofence Area', 'Crossed Red Signal', 'Sharp U Turn', 'Sharp Left Turn', 'Sharp Right Turn', 'Speed Limit Exceeded', 'Outside Geofence Area', 'Crossed Red Signal', 'Sharp U Turn']; //own
                this.callLogsDataArray.push(x);
                console.log(this.callLogsDataArray);
                storeThis.$loading(false)
              }).catch((err) => {
              console.log(err);
              storeThis.$loading(false)
            })
          }
        }).catch((error) => {
        console.log('error', error);
        storeThis.$loading(false)
      });
    },

    methods: {
      /* code for video call  */
      voiceCall: function (value, callback, deviceId, imeiNo, cancelCall) {
        /* APi for Opeartor logs */
        ApiIntegration.logsDetails('audio Call')
          .then((response) => {
            console.log('response', response)
          }).catch((error) => {
          console.log('error', error)
        });
         this.audioCancel = true;
         this.videoCancel = false;
        $('#answerCallModalForoperator').modal('show');
        var conferenceNameCancelCall = localStorage.getItem('conferenceName');
        var imeiNoforCancelAudioCall = localStorage.getItem('imeiNoAudio');
        var localCallSid = localStorage.getItem('callSid');
        if (cancelCall === true) {
          $('#answerCallModalForoperator').modal('hide');
          connection.disconnect();
          clearTimeout(timeOut);
          MqttServices.voiceMqtt(conferenceNameCancelCall, imeiNoforCancelAudioCall, true)
            .then((responseMqtt) => {
              console.log('response', responseMqtt);
              // SaveUpdateDvrDetails.updateCalllogsFromDvrToOperator(localCallSid, '', '', '', 'cancel')
              //   .then((response) => {
              //     console.log('response', response.data);
              //   }).catch((err) => {
              //   console.log('err', err);
              // })
            }).catch((error) => {
            console.log('error', error);
            SaveUpdateDvrDetails.updateCalllogsFromDvrToOperator(localCallSid, '', '', '', 'cancel')
              .then((response) => {
                console.log('response', response.data);
              }).catch((err) => {
              console.log('err', err);
            })
          });
        } else {
          var vmm = this;
          vmm.noDrivert = true;
          this.date = new Date;
          this.timestamp = this.date.getTime();
          this.paramsForAudio = {
            to: deviceId,
            conferenceName: 'operator_' + this.timestamp
          };
          localStorage.setItem('conferenceName', this.paramsForAudio.conferenceName);
          localStorage.setItem('imeiNoAudio', imeiNo);
          Twilio.Device.connect(this.paramsForAudio);
          Twilio.Device.on("connect", function (conn) {
            connection = conn;
            console.log('connection', connection);
            console.log('connection', connection);
            globalConn = connection.mediaStream.callSid;
            localStorage.setItem('callSid', globalConn);
            // SaveUpdateDvrDetails.saveCallLogsFromDvrToOperator(globalConn, "Roger", imeiNo, connection.message.to, 'outgoing', "voice")
            //   .then((response) => {
            //     console.log('response', response);
            //   }).catch((error) => {
            //   console.log('error', error);
            // });
          });
          console.log('connection', connection);
          timeOut = setTimeout(() => {
            if (vmm.noDivert === undefined || vmm.noDivert === null) {
              /* Api to get save call logs  */
              SaveUpdateDvrDetails.saveCallLogsFromDvrToOperator(globalConn, "Roger", imeiNo, connection.message.to, 'outgoing', "voice")
                .then((response) => {
                  console.log('response', response);
                }).catch((error) => {
                console.log('error', error);
              });
              console.log(value);
              router.push({
                name: "DriverInfo",
                params: {
                  callSid: globalConn,
                  deviceId: connection.message.to,
                  passConnToDisconnectOutgoingCall: connection
                }
              });
            }
          }, 9000);
          callback(imeiNo, cancelCall);
        }
      },
      /* function to send mqtt msg to dvr  */
      mqttFun(imeiNo, cancelCall) {
        /* Api to generate voice call */
        MqttServices.voiceMqtt(this.paramsForAudio.conferenceName, imeiNo, cancelCall)
          .then((response) => {
            console.log('response', response);
          }).catch((error) => {
          console.log(error)
        });
      },
      videoCall(deviceID, imeiNo, callCancel) {
        this.audioCancel = false;
        this.videoCancel = true;
        ApiIntegration.logsDetails('video Call')
          .then((response) => {
            console.log('response', response)
          }).catch((error) => {
          console.log('error', error)
        });
        var vm = this;
        var imeiNoforCancelCall = localStorage.getItem('imeiNoVideo');
        var uniqueNameforCancelCall = localStorage.getItem('uniqueName');
        var localRoomSid = localStorage.getItem('roomSid');
        $('#answerCallModalForoperator').modal('show');
        if (callCancel === true) {
          localStorage.removeItem('participantIdentity');
          $('#answerCallModalForoperator').modal('hide');
          MqttServices.videoMqtt(uniqueNameforCancelCall, imeiNoforCancelCall, true)
            .then((responseMqtt) => {
              console.log('response', responseMqtt);
              // SaveUpdateDvrDetails.updateCalllogsFromDvrToOperator(localRoomSid, '', '', '', 'cancel')
              //   .then((response) => {
              //     console.log('response', response.data);
              //   }).catch((err) => {
              //   console.log('err', err);
              // })
            }).catch((error) => {
            console.log('error', error);
            SaveUpdateDvrDetails.updateCalllogsFromDvrToOperator(localRoomSid, '', '', '', 'cancel')
              .then((response) => {
                console.log('response', response.data);
              }).catch((err) => {
              console.log('err', err);
            })
          });
        } else {
          /* Api to create room for video call */
          ApiIntegration.createRoomApi()
            .then((response) => {
              console.log(response.data);
              localStorage.setItem('roomStatus', response.data.room.status)
              if (response.data.room.status === 'in-progress') {
                console.log('room created successfully');
                const uniqueName = response.data.room.uniqueName;
                localStorage.setItem('uniqueName', uniqueName);
                localStorage.setItem('imeiNoVideo', imeiNo);
                /* Api to send room details to mqtt for video call */
                MqttServices.videoMqtt(uniqueName, imeiNo, callCancel)
                  .then((responseMqtt) => {
                    console.log('response', responseMqtt);
                  }).catch((error) => {
                  console.log('error', error);
                });
                getAcessToken = localStorage.getItem('setAccessToken');
                console.log('getAcessToken', getAcessToken);
                connect(getAcessToken, {
                  name: uniqueName,
                  audio: true,
                  isRecording: true,
                  video: false
                }).then(room => {
                  console.log(`Successfully joined a Room: ${room}`);
                  localStorage.setItem('roomSid', room.sid);
                  SaveUpdateDvrDetails.saveCallLogsFromDvrToOperator(room.sid, "Roger", imeiNo, deviceID, 'outgoing', "video")
                    .then((response) => {
                      console.log('responseSaveCallLogsFromDvrToOperator', response)
                    }).catch((error) => {
                    console.log('error', error);
                  });
                  room.on('participantConnected', participant => {
                    console.log(`A remote Participant connected: ${participant}`);
                    localStorage.setItem('participantIdentity', participant.identity);
                    window.room = room;
                    /* Api for save video call logs */
                    // SaveUpdateDvrDetails.saveCallLogsFromDvrToOperator(room.sid, "Roger", imeiNo, deviceID, 'outgoing', "video")
                    //   .then((response) => {
                    //     console.log('responseSaveCallLogsFromDvrToOperator', response)
                    //   }).catch((error) => {
                    //   console.log('error', error);
                    // });
                    participant.tracks.forEach(publication => {
                      if (publication.isSubscribed) {
                        istracksubscribe = publication.track;
                        if (istracksubscribe.kind === 'video') {
                          router.push({
                            name: "DriverInfo",
                            params: {
                              fromOperatorToDashboard: true,
                              isTrackSubscribe: istracksubscribe,
                              deviceId: deviceID
                            }
                          })
                        }
                      }
                    });

                    participant.on('trackSubscribed', track => {
                      trackSubscribed = track;
                      if (trackSubscribed.kind === "audio") {
                        vm.sendAudioVideoObj.audioRecord = trackSubscribed;
                      }
                      vm.sendAudioVideoObj.videoRecord = trackSubscribed;
                      if (trackSubscribed.kind === 'video') {
                        router.push({
                          name: "DriverInfo",
                          params: {
                            fromOperatorToDashboard: true,
                            trackSubscribed: vm.sendAudioVideoObj,
                            deviceId: deviceID,
                            roomSid: room.sid,
                            participantSid: participant.sid,
                            roomName: uniqueName,
                            room: room,
                            imeiNo: imeiNo
                          }
                        })
                      }
                    });
                  });
                  room.on('participantDisconnected', participant => {
                    console.log(`Participant disconnected: ${participant.identity}`);
                    /* Api to get composition sid to save video call */
                    localStorage.removeItem('participantIdentity');
                    SaveUpdateDvrDetails.composeVideoRecordings(room.sid, participant.sid, vm.fmsToken)
                      .then((videoResponse) => {
                        console.log('videoResponse', videoResponse);
                        vm.compositionSid = videoResponse.data.composition.sid;
                        vm.videoResponse = videoResponse.data.composition.url;
                        /* Api to update call logs */
                        SaveUpdateDvrDetails.updateCalllogsFromDvrToOperator(room.sid, vm.notesMessage, vm.videoResponse, vm.compositionSid)
                          .then((response) => {
                            console.log('responseSaveUpdateDvrDetails', response)
                          }).catch((error) => {
                          console.log('error', error)
                        });
                        room.disconnect();
                      }).catch((error) => {
                      console.log('error', error);
                    })
                  });
                  room.on('disconnected', room => {
                    room.localParticipant.tracks.forEach(publication => {
                      const attachedElements = publication.track.detach();
                      attachedElements.forEach(element => element.remove());
                    });
                  });
                }, error => {
                  console.error(`Unable to connect to Room: ${error.message}`);
                });
              }
            }).catch((err) => {
            console.log('createErrorMsg', err.message)
          })
        }
      },
      closeCarDriverInformationPopup() {
        $('#carInformationModal').modal('hide')
      },
      showDriverInformation(carDriverInformation) {
        $('#carInformationModal').modal('show')
        this.driverName = carDriverInformation.driver.title + " " + carDriverInformation.driver.firstName + " " + carDriverInformation.driver.lastName
        this.driverId = carDriverInformation.driver.driverId;
        this.carId = carDriverInformation.driver.carId;
        this.carModelName = carDriverInformation.car.modelName
        this.carLicensePlateNumber = carDriverInformation.car.licensePlateNumber;
        this.job_description = carDriverInformation.car == "deviceId does not exists" ? 'No Job Description Found' : carDriverInformation.job.description;
      },
      // callLogsDataArraynew(data) {
      //   function compare(a, b) {
      //     if (a.displayname < b.displayname)
      //       return -1;
      //     if (a.displayname > b.displayname)
      //       return 1;
      //     return 0;
      //   }
      //   return this.arrays.sort(compare);
      // }
    },
  }
</script>

<style scoped>
  .driverInfo {
    padding-left: 20px;
  }

  #remote_part {
    background: #575858;
  }

  .bg-success {
    background-color: #4ad991 !important;
    border-color: #43ca86;
  }

  .bg-warning {
    background-color: #ffca83 !important;
    border-color: #f89b2d;
  }

  .bg-danger {
    background-color: #ff6366 !important;
    border-color: #d44447;
  }

  .bg-primary {
    background-color: #7697f7 !important;
    border-color: #5b78ca;
  }

  .call-status-logs {
    color: white;
    font-weight: bold;
  }

  .fa-icon {
    padding: 10px;
    font-size: 36px;
    width: 24%;
  }

  .call-status-logs .call-status {
    width: 48%;
  }

  .call-status-logs .call-num {
    width: 23%;
  }

  .call-status-logs .card-body {
    padding: 10px;
  }

  .call-status-logs .card-body span {
    font-size: 24px;
    font-weight: 400;
  }

  .call-log-btn-head {
    float: right;
  }

  .call-log-btn-head .fa-search {
    padding-left: 10px
  }

  .call-logs table .btn-cell {
    color: #7697f7;
  }

  .call-logs table .btn-cell .fa-clipboard-list {
    padding-right: 10px;
  }
</style>
