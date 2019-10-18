<template>
  <div class="driverInfo">
    <div class="row" id="driverInfo">
      <div class="col-sm-9 col-md-9 col-lg-9">
        <div class="card-deck">
          <div class="card" style="flex: unset;width: 280px;margin-right: 0; height: 220px;">
            <div class="card-body">
              <h6>Car Information</h6>
              <div class="card-text">
                <div style="padding-top: 6px;">
                  <p class="card-text-title"><strong>License Plate Number:</strong>  {{ vehicleData.car.licensePlateNumber  || ''}}</p>

                </div>
              </div>
              <div class="card-text">
                <div style="padding-top: 6px;">
                  <p class="card-text-title"><strong>Car Type:</strong> {{ vehicleData.car.modelName }}</p>

                </div>
              </div>
              <div class="card-text">
                <div style="padding-top: 6px;">
                  <p class="card-text-title"><strong>DVR Model: </strong>
                    <i class="fas fa-circle fa-color-green" v-bind:class="vehicleStatusColorClassObject"></i> {{
                    vehicleDetails.vehicleStatus }}
                  </p>

                </div>
              </div>
              <div class="card-text">
                <!-- <div><img class="rounded-circle profile-img" style="" v-bind:alt="vehicleData.driver.firstname"
                          v-bind:src="vehicleData.driver.driver_image"></div> -->
              </div>
               <h6 style="padding-top: 13px;">Driver Information</h6>
              <div class="card-text">
                <div>
                  <p class="card-text-title" style="padding-top: 6px;"><strong>Driver Name:</strong> {{ vehicleData.driver.firstName }} {{' ' +vehicleData.driver.lastName }}</p>

                </div>
              </div>
              <div class="card-text">
                <div style="padding-top: 6px;">
                  <p class="card-text-title"><strong>Driver ID:</strong> {{vehicleData.driver.id }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="card" style="height:220px;width:50%;">
            <div class="card-body">
              <div class="card-text">
                <div>
                  <h6>Notes</h6> 
                  <textarea v-model="message" class="notes-body" style="height: 144px;width:100%">
                  </textarea><br/>
                   <div style="padding-top: 5px 0px">
                    <div v-show="SaveNotesDisabled">
                      <button @click="saveNotes(callSid)" disabled>Save Notes</button>
                    </div>
                    <div v-show="!SaveNotesDisabled">
                      <div v-if="callSid===undefined || callSid===''">
                        <button @click="saveNotes(callSidThisPage,message)">Save Notes</button>
                      </div>
                      <div v-else>
                        <button @click="saveNotes(callSid,message)">Save Notes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card" style="width: 50%;flex: unset;height:220px;">
            <div class="card-body">
              <!-- <h6>Video </h6> -->
              
              <div class="card-text video-card">
<!--                <video  controls style="margin-top: 1px;height: 172px;padding-left: 4px;padding-top: -10px;width: 392px;">-->
<!--                    <source src="mov_bbb.mp4" type="video/mp4">-->
<!--                    <source src="mov_bbb.ogg" type="video/ogg">-->
<!--                    Your browser does not support HTML5 video.-->
<!--                </video>-->
             <div class="video-area d-flex align-items-center justify-content-center"
                     v-if="fromOperatorToDashboard===true">
                <div id="remote_video" style="margin-top: 1px;height: 172px;padding-left: 4px;padding-top: -10px;width: 100%;"></div>
                </div>
                <div class="call-btns" >
                           <span v-if="fromOperatorToDashboard===true">
                           <span v-if="cameraSwitch">
                           <img src="../assets/camera_back_icon.png" style="width: 38px;"
                                @click="switchCamera(imeiNo,roomSid,roomName,'front')"/>
                           </span>
                           <span v-if="!cameraSwitch">
                           <img src="../assets/camera_front_icon.png" style="width: 38px;"
                                @click="switchCamera(imeiNo,roomSid,roomName,'rear')"/>
                           </span>
                           </span>
                  <span v-if="fromOperatorToDashboard===true">
                           </span>
                  <label v-else>
                          <i v-if="audioMute" class="fas fa-volume-mute" style="font-size: 20px;padding-top: 11px;" @click="muteOperator"></i>
                          <!-- <i class="fas fa-phone" @click="disconnectCall(callSidThisPage)" style="font-size: 12px;padding-left: 6px;padding-top: 7px;padding-right: 6px;padding-bottom: 4px;"> </i> -->
                           <i v-else class="fas fa-volume-up" style="font-size: 20px;padding-top: 11px;"  @click="unmuteOperator"></i>
                           </label>
                  <span v-if="fromOperatorToDashboard===true">
                           <i class="fas fa-phone" @click="disconnectVideoCall" style="font-size: 12px;padding-left: 6px;padding-top: 7px;padding-right: 6px;padding-bottom: 4px;"></i>
                           </span>
                  <span v-else>
                           <span v-if="callSid===undefined || callSid===''">
                           <i class="fas fa-phone" @click="disconnectCall(callSidThisPage)" style="font-size: 12px;padding-left: 6px;padding-top: 7px;padding-right: 6px;padding-bottom: 4px;"> </i>
                           </span>
                           <span v-else>
                           <i class="fas fa-phone" @click="disconnectCall(callSid)" style="font-size: 12px;padding-left: 6px;padding-top: 7px;padding-right: 6px;padding-bottom: 4px;"></i>
                           </span>
                           </span>
                </div>
                <div v-if="callSid===undefined || callSid===''">
                  <StartRecording :callSidforRecording=callSidThisPage></StartRecording>
                </div>
                <div v-else>
                  <StartRecording :callSidforRecording=callSid></StartRecording>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="card">
            <div class="card-body">
              <h6>Job Information</h6>
              <div class="card-text">
                <div>
                  <p class="card-text-title">Job</p>
                  <p>{{vehicleData.job.description}}</p>
                </div>
              </div>
              <div class="card-text">
                <div>
                  <p class="card-text-title">Job Status</p>
                  <p><i class="fas fa-circle" v-bind:class="jobStatusColorClassObject"></i> {{
                    vehicleData.job.job_status}}
                  </p>
                </div>
              </div>
            </div>
          </div> -->
          
        </div>
        <div class="card-deck">
         <div class="card" style="width: 280px;flex: unset;margin-right: 0;height: 310px;">
            <div class="card-body" style="height: 283px;">
              <h6>Event Data</h6>
              <div class="card-text">
                <div >
                   <table class="table" style="display: block;height:280px;overflow-y: auto;">
                  <thead>
                  <tr>
                    <th></th>
                    <th> Date</th>
                    <th>Event Description</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr >
                    <td><i style="font-size:12px" class="fa" >&#xf03d;</i></td>
                    <td>Oct 1, 11:00 PM</td>
                    <td class="btn-cell"> Sharp Left Turn</td>
                  </tr>
                  <tr >
                    <td><i class="fas fa-volume-up" style="font-size:14px"></i></td>
                    <td>Oct 2, 11:15 PM</td>
                    <td class="btn-cell"> Sharp Right  Turn</td>
                  </tr>
                  <tr >
                    <td><i style="font-size:12px" class="fa" >&#xf03d;</i></td>
                    <td>Oct 3, 11:30 PM</td>
                    <td class="btn-cell"> Speed Limit Exceeded</td>
                  </tr>
                  <tr >
                    <td><i style="font-size:12px" class="fa" >&#xf03d;</i></td>
                    <td>Oct 4, 11:45 PM</td>
                    <td class="btn-cell"> Sharp Left Turn</td>
                  </tr>
                  <tr >
                    <td><i class="fas fa-volume-up" style="font-size:14px"></i></td>
                    <td>Oct 5, 12:00 PM</td>
                    <td class="btn-cell"> Sharp Right  Turn</td>
                  </tr>
                  
                  </tbody>
                </table> 
                  <!-- <p class="card-text-title">License Plate Number</p> -->
                  <!-- <p>{{ vehicleData.car.licensePlateNumber }}</p> -->
                </div>
              </div>
              <div class="card-text">
                <div>
                  <!-- <p class="card-text-title">Model</p> -->
                  <!-- <p>{{ vehicleData.car.modelName }}</p> -->
                </div>
              </div>
              <div class="card-text">
                <div>
                  <!-- <p class="card-text-title">Vehicle Status</p> -->
                  <!-- <p><i class="fas fa-circle fa-color-green" v-bind:class="vehicleStatusColorClassObject"></i> {{
                    vehicleDetails.vehicleStatus }} -->
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-deck call-logs card" style="margin-left: 1px; width: 660px; ">
          <div class="card">
            <div class="card-body" style="height: 306px;">
              <h6>
                Telematry Data
                <!-- <div class="call-log-btn-head"><i class="fas fa-filter"></i><i class="fas fa-search"></i></div> -->
              </h6>
              <div style="display:flex;" class="telematics-data"> 
               <div class="card" style="width: 160px;height: 278px;">
                <div class="card-body">
                  <h6>Status</h6>
                  <p class="card-text telematic-data-p" style="padding-top: 14px;"><img style="width:28px;" src="../assets/battery_4.png" >
                  {{telematicsData.Temperature}} &#8451;
                  &nbsp; &nbsp; &nbsp; &nbsp;<img style="width:28px;" v-if="telematicsData.SignalLevel == 4" src="../assets/lte_4.png" > 
                  <img style="width:28px;" v-if="telematicsData.SignalLevel == 3" src="../assets/lte_3.png" > 
                  <img style="width:28px;" v-if="telematicsData.SignalLevel == 2" src="../assets/lte_2.png" > 
                  <img style="width:28px;" v-if="telematicsData.SignalLevel == 1" src="../assets/lte_1.png" > 
                  <img style="width:28px;" v-if="telematicsData.SignalLevel == 0" src="../assets/lte_0.png" > 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;Altitude : {{telematicsData.Gps.alt}} &nbsp; &nbsp;&nbsp;&nbsp; Speed: {{telematicsData.Gps.spd}}</p><br>
                  <!-- <hr> -->
                  <h6>Gravity</h6>
                  <!-- <p class="card-text telematic-data-p">Temperature = </p>
                  <p class="card-text telematic-data-p"> Signal Level = {{telematicsData.SignalLevel}}</p>
                  <p class="card-text telematic-data-p"> Battery Level= {{telematicsData.BatteryLevel}} %</p> -->
                </div>
              </div>
              
              <div class="card" style="width: 160px;height:278px">
                <div class="card-body">
                  <h6 style="font-size: 12px;">Gyroscope</h6>
                  <div>
                    <p class="card-text telematic-data-p" style="font-size: 10px;">X = {{xGyroscope || 0}} </p>
                    <p class="card-text telematic-data-p" style="font-size: 10px;">Y = {{yGyroscope || 0}}</p>
                    <p class="card-text telematic-data-p" style="font-size: 10px;"> Z = {{zGyroscope || 0}}</p>
                  </div><br/>
                  <h6 class="card-title" style="font-size: 12px;">Linear Acceleration</h6>
                    <p class="card-text telematic-data-p" style="font-size: 10px;">X = {{telematicsData.LinearAcceleration.x || '' }} </p>
                    <p class="card-text telematic-data-p" style="font-size: 10px;">Y = {{telematicsData.LinearAcceleration.y || ''}}</p>
                    <p class="card-text telematic-data-p" style="font-size: 10px;">Z = {{telematicsData.LinearAcceleration.z || ''}}</p>
                   <br/>
                   <h6 class="card-title" style="font-size: 12px;">Acceleration</h6>
                    <p class="card-text telematic-data-p" style="font-size: 10px;">X = {{telematicsData.LinearAcceleration.x || '' }} </p>
                    <p class="card-text telematic-data-p" style="font-size: 10px;">Y = {{telematicsData.LinearAcceleration.y || ''}}</p>
                    <p class="card-text telematic-data-p" style="font-size: 10px;">Z = {{telematicsData.LinearAcceleration.z || ''}}</p>
                </div>
              </div>
              <!-- <div class="card" style="width: 160px;">
                <div class="card-body">
                  <h5 class="card-title">Status</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                </div>
              </div> -->
              </div>
              <div class="card-text">
                <!-- <table class="table">
                  <thead>
                  <tr>
                    <th>Serial Number</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Description</th>
                    <th>Call logs</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for='(callLog,key) in callLogDetailsArray'>
                    <td>{{ key}}</td>
                    <td>{{ callLog.deviceCallLogDetails.callLog.date | formatDate }}</td>
                    <td>{{ callLog.deviceCallLogDetails.callLog.date | formatTime}}</td>
                    <td>{{ callLog.deviceCallLogDetails.job.description }}</td>
                    <td>{{ callLog.deviceCallLogDetails.callLog.duration }}</td>
                    <td class="btn-cell"><i class="fas fa-clipboard-list"></i><i class="fas fa-volume-up"></i></td>
                  </tr>
                  </tbody>
                </table> -->
              </div>
            </div>
          </div>
        </div>
        </div>
          
        <!-- <div class="card-deck">
          <div class="card">
            <div class="card-body">
              <h6>Live Location</h6>
              <div class="card-text">
                <div id="map" v-bind:lat="liveLocationDetails.lat" v-bind:longi="liveLocationDetails.longi"></div>
              </div>
            </div>
          </div>
        </div> -->
        
        
      </div>
      <div class="col-sm-3 col-md-3 col-lg-3">
        <div class="card-deck">
            <div class="card license-card">
              <div class="card-body">
              <div class="" style="flex: unset;margin-right: 0;height: 192px; ">
                  <h6>Job Information</h6>
                  <div class="card-text">
                    <div>
                      <p class="card-text-title job-title"><strong>Job:</strong> {{vehicleData.job.description}}</p>
                    </div>
                  </div>
                  <div class="card-text">
                    <div>
                      <p class="card-text-title job-title"><strong>Job Status:</strong> <i class="fas fa-circle" v-bind:class="jobStatusColorClassObject"></i> {{
                        vehicleData.job.job_status}}</p>
                    </div>
                  </div>
                  <div class="card-text">
                    <div>
                      <p class="card-text-title job-title"><strong>Start Time:</strong>  </p>
                      <!-- <p><i class="fas fa-circle" v-bind:class="jobStatusColorClassObject"></i> {{
                        vehicleData.job.job_status}}
                      </p> -->
                    </div>
                  </div>
                  <div class="card-text">
                    <div>
                      <p class="card-text-title job-title"><strong>End Time:</strong>  </p>
                      <!-- <p><i class="fas fa-circle" v-bind:class="jobStatusColorClassObject"></i> {{
                        vehicleData.job.job_status}}
                      </p> -->
                    </div>
                  </div>
                  <div class="card-text">
                    <div>
                      <p class="card-text-title job-title"><strong>Start Location:</strong>  </p>
                      <!-- <p><i class="fas fa-circle" v-bind:class="jobStatusColorClassObject"></i> {{
                        vehicleData.job.job_status}}
                      </p> -->
                    </div>
                  </div>
                  <div class="card-text">
                    <div>
                      <p class="card-text-title job-title"><strong>End Location:</strong> </p>
                      <!-- <p><i class="fas fa-circle" v-bind:class="jobStatusColorClassObject"></i> {{
                        vehicleData.job.job_status}}
                      </p> -->
                    </div>
                  </div>
                  <div class="card-text">
                    <div>
                      <p class="card-text-title job-title"><strong>Geofence: </strong></p>
                      <!-- <p><i class="fas fa-circle" v-bind:class="jobStatusColorClassObject"></i> {{
                        vehicleData.job.job_status}}
                      </p> -->
                    </div>
                  </div>
              </div>
              <div class="card-text">
                <div>
                  <mapLoader>
                      <template slot-scope="scopeProps">
                          <createGeofence
                              :google="scopeProps.google"
                              :map="scopeProps.map"
                              :geofence="geofence"
                              :readonly="true"
                          />
                          <directionMarker
                              :google="scopeProps.google"
                              :map="scopeProps.map"
                              :routeDetails="routes"
                          />
                          <PlacesMarker
                              :google="scopeProps.google"
                              :map="scopeProps.map"
                              :places="coordinates"
                          />
                      </template>
                  </mapLoader>
                  <!-- <img style="width:100%;border: 1px solid;height: 435px;"/> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import EventBus from '../Utils/EventBus';
  import router from '../router'
  import DriverInfoService from '../ApiFile/DriverInfoService'
  import SaveUpdateDvrDetails from '../ApiFile/SaveUpdateDvrDetails'
  import CallLogsDashboard from '../ApiFile/CallLogsDashboard';
  import MqttServices from "../ApiFile/MqttServices";
  import StartRecording from './StartRecording';
  import mapLoader from "./maps/MapLoader";
  import PlacesMarker from "./maps/Placemarker1";
  import createGeofence from "./maps/CreateGeofence";
  import directionMarker from "./maps/DirectionsMarker";

  const Twilio = require('twilio-client');
  var seconds = 0,
    minutes = 0,
    hours = 0,
    t;
  $(document).ready(function () {
    /* Code to exit video  */
    $('#exitVideoClick').on('click', function () {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    })
  });

  export default {
    name: 'DriverInfo',
    props: ["callSid", "timerRouter", "fromOperatorToDashboard", "isTrackSubscribe", "trackSubscribed", "deviceId", "passConnToDisconnectOutgoingCall", "roomSid", "participantSid", "roomName", "room", "imeiNo"],
    components: {
      StartRecording,
      directionMarker,
        mapLoader,
        PlacesMarker,
        createGeofence
    },
    data() {
      return {
        show: false,
        hide: true,
        cameraSwitch: true,
        callSidThisPage: '',
        recordingUrl: '',
        recordingSid: '',
        message: '',
        audioEventBus: {},
        SaveNotesDisabled: true,
        time: '00.00.00',
        vehicleData: '',
        audioMute: true,
        fmsToken: '',
        vehicleDetails: {
          licensePlateNumber: '',
          model: '',
          vehicleStatus: 'Good',
          vehicleStatusColor: 'Green',
        },
        jobDetails: {
          jobStatus: 'Good',
          jobStatusColor: 'green'
        },
        liveLocationDetails: {
          lat: -25.344,
          longi: 131.036
        },
        callLogDetailsArray: [],
        liveCall: {
          notes: "",
          videoUrl: "",
          duration: "00:10:00"
        },
        telematicsData:{},
        coordinates: [
            {
                lat: 23.785028,
                lng: 120.776667
            }
        ],
        routes:null,
        xGyroscope : '',
        yGyroscope: '',
        zGyroscope : '',
        geofence: {
                "type": "polygon",
                "paths": [
                    {
                        "lng": 120.62624791504243,
                        "lat": 23.961124979598743
                    },
                    {
                        "lng": 120.82949498535493,
                        "lat": 24.33205072980901
                    },
                    {
                        "lng": 121.44472936035493,
                        "lat": 24.02636546109324
                    },
                    {
                        "lng": 121.28542760254243,
                        "lat": 23.337180796514954
                    },
                    {
                        "lng": 120.39553502441743,
                        "lat": 23.45817592855887
                    }
                ]
            },
      }
    },

    updated() {
      $('.modal-backdrop').hide();
      /* Code to show video on dashboard  */
      console.log('this.params.test', this.items);
      if (this.fromOperatorToDashboard === true) {
        var remoteMediaContainer = document.getElementById('remote_video');
        if (this.isTrackSubscribe === 'video') {
          //remoteMediaContainer.appendChild(this.isTrackSubscribe.attach());
        }
        if (this.trackSubscribed) {
          remoteMediaContainer.appendChild(this.trackSubscribed.videoRecord.attach());
          remoteMediaContainer.appendChild(this.trackSubscribed.audioRecord.attach());
        }
      }
    },

    mounted() {
      const dataTest = this;
      Twilio.Device.on('incoming', function (conn) {
        dataTest.SaveNotesDisabled = true;
        console.log('conn.parameters.From', conn.parameters.CallSid);
        dataTest.callSidThisPage = conn.parameters.CallSid;
      });
      Twilio.Device.on('disconnect', function (conn) {
        conn.disconnect();
        dataTest.SaveNotesDisabled = false;
      });
      this.routes = {
            origin: { placeId: 'ChIJm61hnNwqaTQRHWxfx-5FbWQ' },
            destination: { placeId: 'ChIJeWx978DTbjQRtbYmW1k4R2I'},
            travelMode: "DRIVING"
      };
    },

    created() {
      var vm = this;
      vm.fmsToken = localStorage.getItem("fmsToken");
      // this.timer();
      EventBus.$emit('notes', this.message);
      EventBus.$on('emitRecordingUrl', (payload) => {
        this.recordingUrl = payload;
      });
      this.getTelematicsData()
      /* Api call for jobs description  */
      DriverInfoService.driverInformationApi(vm.fmsToken, vm.deviceId)
        .then((res) => {
          console.log('driverInfo', res);
          this.vehicleData = res.data.data;
        }).catch((err) => {
        console.log(err);
      });
      /* Api call for list of call logs on dashboard   */
      CallLogsDashboard.CallLogsDashboard(vm.fmsToken)
        .then((response) => {
          console.log('data', response.data.callLogs);
          this.callLogDetailsArray = response.data.callLogs;
        }).catch((err) => {
        console.log(err)
      })
   },

    filters: {
      formatTime(value) {
        if (value) {
          var date = new Date(value);
          return date.toLocaleTimeString()
        }
      },
      formatDate(value) {
        if (value) {
          var date = new Date(value);
          return date.toLocaleDateString()
        }
      }
    },

    methods: {
      /* code to switch camera  */
      switchCamera(imeiNo, roomSid, roomName, cameraType) {
        this.cameraSwitch = !this.cameraSwitch;
        MqttServices.switchCameraMqtt(imeiNo, roomSid, roomName, cameraType)
          .then((response) => {
            console.log('response', response)
          }).catch((error) => {
          console.log('error', error)
        })
      },
      add() {
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
            minutes = 0;
            hours++;
          }
        }
        this.time = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        this.timer();
      },
      timer() {
        t = setTimeout(this.add, 1000);
      },
      /* code to disconnect audio call  */
      disconnectCall(callSid) {
        this.passConnToDisconnectOutgoingCall.disconnect();
        this.SaveNotesDisabled = false;
        clearInterval(t);
        this.time = '00:00:00';
        this.timerRouter = false;
        this.deviceId = "";
      },
      /* code to disconnect video call  */
      disconnectVideoCall() {
        var vm = this;
        /* Api to get composition id to save video playback  */
        SaveUpdateDvrDetails.composeVideoRecordings(vm.roomSid, vm.participantSid, vm.fmsToken)
          .then((videoResponse) => {
            console.log('videoResponse', videoResponse);
            vm.compositionSid = videoResponse.data.composition.sid;
            vm.videoResponse = videoResponse.data.composition.url;
            /* Api to update save logs  */
            SaveUpdateDvrDetails.updateCalllogsFromDvrToOperator(vm.roomSid, vm.message, vm.videoResponse, vm.compositionSid)
              .then((response) => {
                console.log('responseSaveUpdateDvrDetails', response)
              }).catch((error) => {
              console.log('error', error)
            });
          }).catch((error) => {
          console.log('error', error);
        });
        this.room.disconnect();
      },
      saveNotes(callSid, message) {
        /* Api to update save logs  */
        SaveUpdateDvrDetails.updateCalllogsFromDvrToOperator(callSid, message, this.recordingUrl.url, this.recordingUrl.recordingSid)
          .then((response) => {
            console.log('response', response.data);
            router.push("callLogs");
          }).catch((err) => {
          console.log('err', err);
        })
      },
      /* Code to exit video  */
      openFullscreen() {
        var elem = document.getElementById("remote_video");
        if (elem.requestFullscreen) {
          $("video").css({"width": window.innerWidth, "height": window.innerHeight});
          elem.requestFullscreen();
          $("#remote_video").append("<button class='exitVideo' id='exitVideoClick' > Exit FullScreen</button>");
        } else if (elem.mozRequestFullScreen) { /* Firefox */
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
          elem.msRequestFullscreen();
        }
      },
      muteOperator() {
        this.audioMute = false;
        Twilio.Device.activeConnection().mute(true);
      },
      unmuteOperator() {
        this.audioMute = true;
        Twilio.Device.activeConnection().mute(false);
      },
      getTelematicsData() {
        DriverInfoService.getTelematicsData()
          .then(response =>{
              console.log(response)
              this.telematicsData = response.data[0];
              if(this.telematicsData.Gyroscope){
                this.xGyroscope = this.telematicsData.Gyroscope.x;
                this.yGyroscope = this.telematicsData.Gyroscope.y;
                this.zGyroscope = this.telematicsData.Gyroscope.z;
              } else {
                this.xGyroscope = ''
                this.yGyroscope = ''
                this.zGyroscope = ''
              }
          })
          .catch(error => {
              console.log(error);
              this.$loading(false)
          })
        setTimeout(this.getTelematicsData, 10000);
      },
      showVideoControls(){
        var elem = document.getElementById("remote_video");
        if (elem.requestFullscreen) {
            $("video").attr("controls",true);
        } else if (elem.mozRequestFullScreen) { /* Firefox */
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
          elem.msRequestFullscreen();
        }
      }
    },
    computed: {
      vehicleStatusColorClassObject: function () {
        var statusColorObj = "";
        if (this.vehicleDetails.vehicleStatusColor == 'red') {
          statusColorObj = {'fa-color-red': true};
        }
        return statusColorObj;
      },
      jobStatusColorClassObject: function () {
        var statusColorObj = "";
        if (this.jobDetails.jobStatusColor == 'green') {
          statusColorObj = {'fa-color-green': true};
        }
        return statusColorObj;
      }
    },
  }
</script>

<style scoped>
  #map {
    height: 300px !important;
    width: 100%;
  }
  .col-sm-9 {
    padding-right: 0px;
  }
  .col-sm-3 {
    padding-left: 0px;
  }
  .col-sm-3 .card {
    margin-left: 0px;
    margin-left: -33px;
    /* background: #eceff3; */
  }
  .fa-color-red {
    color: red
  }
  .profile-img {
    width: 100px;
  }
  .fa-color-green {
    color: green
  }
  .call-log-btn-head {
    float: right;
  }
  .call-log-btn-head .fa-search {
    padding-left: 10px
  }
  .call-logs table .btn-cell {
    text-align: center;
    color: #7697f7;
  }
  .call-logs table .btn-cell .fa-clipboard-list {
    padding-right: 10px;
  }
  .license-card .card-text-title {
    border-top: gray 1px solid;
  }
  .license-card .notes-body {
    width: 100%;
    background: white;
    height: 150px
  }
  .video-card .video-area {
    width: 100%;
    background: gray;
    height: 100%;
    text-align: center;
  }
  .call-duration {
    text-align: center;
    font-size: 20px;
    font-weight: bold
  }
  .video-card .call-btns {
    padding: 0px;
    font-size: 16px;
    text-align: center;
    color: #7697f7;
    margin-top: 5px;
  }
  .video-card .call-btns .fa-microphone-slash {
    padding: 10px;
    border: 1px solid;
    border-radius: 50%;
  }
  .video-card .call-btns .fa-video-slash {
    padding: 10px;
    border: 1px solid;
    border-radius: 50%;
  }
  .video-card .call-btns .fa-phone {
    padding: 10px;
    background: red;
    border-radius: 50%;
    color: white;
  }
  .modal-open {
    overflow: visible !important;
  }
  .modal-backdrop.fade {
    opacity: 0 !important;
  }
  video {
    height: 154px;
    width: 238px;
    object-fit: cover !important;
  }
  .exitVideo {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 999999;
    background-color: white;
  }
  #remote_video video ~ video {
    display: none
  }
  .fa-volume-up {
    font-size: 27px;
    padding-right: 7px;
  }
  .fa-volume-mute {
    font-size: 27px;
    padding-right: 7px;
  }
 .card-text {
    padding: 0px 4px;
}
.card-deck {
    /* margin-right: 5px; */
    margin-left: 5px;
}
.card-body h6 {
    font-weight: bold;
    padding: 4px;
    background: #eceff3;
    color: #575858;
    font-size: 14px;
}
.card-text-title {
  color: #000;
  font-size: 12px;
}
.card-text {
    font-size: 12px;
}
.card-deck .card{
    margin-right: 3px !important;
    margin-left: 1px !important;
    padding: 1px !important;
    margin-top: -6px !important;
}
.table td, .table th {
    padding: 0.25rem;
}
.telematic-data-p{
    margin-top: 0;
    margin-bottom: -.10rem;
    padding-left: 8px;
}
.license-card .card-text-title{
  border-top: 0px ;
}
hr { 
  display: block;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  margin-left: auto;
  margin-right: auto;
  border-style: inset;
  border-width: 1px;
}
  .card-text-title {
    margin-bottom: 0px;
    font-weight: unset;
  }
</style>
