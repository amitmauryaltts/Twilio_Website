<template>
  <div class="callLogs">
    <div class="card-deck call-status-logs">
      <div class="card bg-success">
        <div class="card-body text-center">
          <p class="card-text">
            <i class="fas fa-user-check fa-icon"></i>
            <span class="call-status">Online</span>
            <span class="call-num">{{ usersOnlineNum }}</span>
          </p>
        </div>
      </div>
      <div class="card bg-warning">
        <div class="card-body text-center">
          <p class="card-text">
            <i class="far fa-clock fa-icon"></i>
            <span class="call-status">Waiting</span>
            <span class="call-num">{{ usersWaitingCallNum }}</span>
          </p>
        </div>
      </div>
      <div class="card bg-danger">
        <div class="card-body text-center">
          <p class="card-text">
            <i class="fas fa-phone-slash fa-icon"></i>
            <span class="call-status">Missed</span>
            <span class="call-num">{{ missedTaskData.length  }}</span>
          </p>
        </div>
      </div>
      <div class="card bg-primary">
        <div class="card-body text-center">
          <p class="card-text">
            <i class="fas fa-phone fa-icon"></i>
            <span class="call-status">Completed</span>
            <span class="call-num">{{ callLogsLength }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="card-deck call-logs" >
      <div class="card">
        <div class="card-body">
          <h6>
            Call Logs {{callLogsLength}}
            <div class="call-log-btn-head"  @click="showModal">
              <i class="fas fa-filter"></i>
            </div>
          </h6>
          <div class="card-text">
            <table class="table">
              <thead>
              <tr>
                <th>Call Direction</th>
                <th>Date</th>
                <th>Time</th>
                <th>License Plate Number</th>
                <th>Job Description</th>
                <th>Call Duration</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody v-if="this.callLogsData.length > 0">
              <tr v-for="(callLog) in sortArrays(callLogsData)" :key="callLog.sid" >
                <td style="text-transform: capitalize;">{{ callLog.deviceCallLogDetails.callLog.category}} </td>
                <td >{{ callLog.deviceCallLogDetails.callLog.date | formatDate }}</td>
                <td >{{ callLog.deviceCallLogDetails.callLog.date | formatTime }}</td>
                <td v-if="callLog.deviceCallLogDetails.car.licensePlateNumber"><button @click="showDriverInformation(callLog.deviceCallLogDetails)" >{{ callLog.deviceCallLogDetails.car.licensePlateNumber }}</button></td>
                <td v-else-if="callLog.deviceCallLogDetails.car =='deviceId does not exists' ">{{ callLog.deviceCallLogDetails.car.licensePlateNumber }}</td>
                <td >  {{  callLog.deviceCallLogDetails.job.description }}</td>
                <td >{{ callLog.deviceCallLogDetails.callLog.duration }} seconds</td>
                <td class="btn-cell" >
                  <i  class="fas fa-clipboard-list"
                      @click="showNoteDetails(callLog.deviceCallLogDetails.callLog.notes)"></i>
                  <i style="font-size:16px" class="fa" v-if="(videoLoader == false || videoCallid != callLog.deviceCallLogDetails.callLog.id) && callLog.deviceCallLogDetails.callLog.type == 'video' " @click="playVideo(callLog.deviceCallLogDetails.callLog.id, callLog.deviceCallLogDetails.callLog.recordingsid, 'Video', callLog.deviceCallLogDetails)">&#xf03d;</i>
                  <span v-if="videoLoader && videoCallid == callLog.deviceCallLogDetails.callLog.id" v-cloak>Loading...</span>
                  &nbsp;<i class="fas fa-volume-up" v-if="callLog.deviceCallLogDetails.callLog.type == 'voice'" @click="playAudio(callLog.deviceCallLogDetails.callLog.id, 'Audio', callLog.deviceCallLogDetails.callLog.recordingurl,callLog.deviceCallLogDetails )"></i>
                </td>
              </tr>
              </tbody>
              <tbody v-else-if="this.callLogsData.length == 0">
              <tr >
                <td>No Data Found</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Media Player Popup-->
    <div class="popUp">
      <div class="modal fade" id="mediaPlayerPopup" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered modal-dialog-media-player">
          <div class="modal-content modal-content-media-player">
                  <span class="close " >
                     <label style="margin-top: 10px;font-size: 20px;margin-left: 145px;" v-if="showVideoRecording">Video Playback</label>
                     <label style="margin-top: 10px;font-size: 20px;margin-left: 145px;" v-if="showAudioRecording">Audio Playback</label>
                     <br/>
                     <label style="margin-top: 10px;font-size: 20px;margin-left: 17px;"> Driver Information :</label>
                     <ul>
                        <li style="font-size: 16px;"> Driver Name:  {{driverName}}</li>
                        <li style="font-size: 16px;">Driver ID: {{driverId}}</li>
                     </ul>
                     <hr>
                  </span>
            <!-- Modal body -->
            <span style="color:red;margin-left:13px;"></span>
            <div class="modal-body">
              <vue-plyr v-if="showVideoRecording">
                <video poster="poster.png" v-bind:src="videoLink">
                  <source v-bind:src="videoLink" type="video/mp4" size="720">
                  <track kind="captions" label="English" srclang="en" src="captions-en.vtt" default>
                </video>
              </vue-plyr>
              <vue-plyr v-if="showAudioRecording">
                <audio>
                  <source v-bind:src="audioLinks" type="audio/mp3"/>
                </audio>
              </vue-plyr>
              <br>
              <button type="button" class="btn btn-primary btn-block" style="width:22%" @click="closeVideoAudioPopup"
              >close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Call Logs Filter Popup-->
    <div class="popUp">
      <div class="modal fade" id="CallLogsModal" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered modal-dialog-call-log">
          <div class="modal-content modal-content-call-log">
                  <span class="close ">
                     <label style="margin-top: 10px;font-size: 20px;margin-left: 13px;">Filters</label>
                     <label style="margin-left: 158px;font-size: 20px;color: blue;" @click="reset">Reset</label>
                     <label style="margin: 15px;" @click="closeModal">&times;</label>
                     <hr>
                  </span>
            <label style="margin-top: 10px;font-size: 16px;margin-left:13px;"> <b>Status</b></label>
            <!-- Modal body -->
            <span style="color:red;margin-left:13px;"></span>
            <div class="modal-body" style="flex: 0;">
              <input type="checkbox" id="today" v-model="callLogsFilter.today">
              <label for="today">Today</label><br>
              <input type="checkbox" id="yesterday" v-model="callLogsFilter.yesterday">
              <label for="yesterday">Yesterday</label><br>
              <input type="checkbox" id="thismonth" v-model="callLogsFilter.month">
              <label for="thismonth">This Month</label><br>
              <hr>
            </div>
            <label style="font-size: 16px;margin-left:13px;"> <b>Call Length</b></label>
            <!-- Modal body -->
            <span style="color:red;margin-left:13px;"></span>
            <div class="modal-body" >
              <input type="checkbox" id="fifteenMinute" v-model="callLogsFilter.fifteenMinute">
              <label for="fifteenMinute">1-15 Min</label><br>
              <input type="checkbox" id="thirtyMinute" v-model="callLogsFilter.thirtyMinute">
              <label for="thirtyMinute">15-30 Min</label><br>
              <input type="checkbox" id="fourtyFiveMinute" v-model="callLogsFilter.fourtyFiveMinute">
              <label for="fourtyFiveMinute">30-45 Min</label><br>
              <input type="checkbox" id="oneHour" v-model="callLogsFilter.oneHour">
              <label for="oneHour">45-1 Hour</label><br>
              <input type="checkbox" id="aboveOneHour" v-model="callLogsFilter.aboveOneHour">
              <label for="aboveOneHour">Above 1 Hour</label><br>
              <button type="button" class="btn btn-primary btn-block" style="width:22%"
                      @click="filterCallLogs(callLogsFilter, 'clickEvent')" >Done</button>
              <hr>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Note Details Popup-->
    <div class="popUp">
      <div class="modal fade" id="showNoteDetailsModal" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered modal-dialog-notes">
          <div class="modal-content">
                  <span class="close ">
                     <label style="margin-top: 10px;font-size: 20px;margin-left: 13px;">Notes</label>
                     <hr>
                  </span>
            <!-- Modal body -->
            <span style="color:red;margin-left:13px;"></span>
            <div class="modal-body">
              <p v-if="showNotes != undefined"><b>Note:</b> {{showNotes}}</p>
              <p v-else-if="showNotes == undefined">No Notes Found</p>
              <br>
              <button type="button" class="btn btn-primary btn-block" style="width:22%" @click="closeNotesPopup"
              >close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Car Information Popup-->
    <div class="popUp">
      <div class="modal fade" id="carInformationModal" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered modal-dialog-notes">
          <div class="modal-content">
                  <span class="close "> <label style="margin-top: 10px;font-size: 20px;margin-left: 13px;"></label>
                  </span>
            <!-- Modal body -->
            <span style="color:red;margin-left:13px;"></span>
            <div class="modal-body">
              <h5> <b>Driver Information</b></h5>
              <ul>
                <li><b>Driver Name:</b> {{driverName}}</li>
                <li><b>Driver ID:</b> {{driverId}}</li>
              </ul>
              <h5><b>Car Information</b></h5>
              <ul>
                <li> <b> Model Name :</b> {{carModelName}}</li>
                <li> <b>License Plate Number :</b> {{carLicensePlateNumber}}</li>
              </ul>
              <h5><b>Job Description</b></h5>
              <ul>
                <li> <b> Job Description:</b> {{job_description}}</li>
              </ul>
              <br>
              <button type="button" class="btn btn-primary btn-block" style="width:22%" @click="closeCarDriverInformationPopup"
              >close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CallLogsService from '../ApiFile/CallLogsService.js';
import WorkersStatusService from '../ApiFile/WorkersStatusService.js';
import moment from 'moment';
import Vue from 'vue'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import { constants } from 'fs';
import {fmsToekn} from '../App.vue';
Vue.use(VuePlyr)

var userType = "operator" //or admin
var fmsToken;

export default {
  name: 'CallLogs',
   data () {
    return {
	  loading: true,
    errored: false,
    callLogsData : [],
    usersOnlineNum : 0,
    usersWaitingCallNum: 0,
  	usersMissedCallNum:0,
  	usersCompletedCallNum:0,
    audioLinks : '',
    audioObj : {},
    callLogsFilter : {},
    missedTaskData : [],
    completedTaskData : [],
    showAudioRecording : false,
    showVideoRecording: false,
    showNotes : '',
    callLogsLength:0,
    driverName : '',
    driverId : '',
    carId : '',
    carModelName : '',
    carLicensePlateNumber :'',
    job_description : '',
    videoLink : '',
    videoLoader:false,
    videoCallid : ''
    }
  },
  created(){
    this.$loading(true)
    /* To get the FMS Token */
    this.fmsToken = localStorage.getItem("fmsToken");
    fmsToken = this.fmsToken
    this.getOnlineWaitingTaskCount()
    this.getCallLogs(this.fmsToken);
  },
  methods :{
    /* Function to show number of online 
    and waiting data */
    getOnlineWaitingTaskCount() {
      WorkersStatusService.getOnlineWaitingTaskCount()
        .then(response =>{
            if(response.data.workspaceRealTimeStatistics) {
                var responseData = response.data.workspaceRealTimeStatistics
                this.usersOnlineNum = responseData.tasksByStatus.assigned;
                this.usersWaitingCallNum = responseData.tasksByStatus.reserved + responseData.tasksByStatus.pending
            }
        })
        .catch(error => {
            console.log(error);
            this.$loading(false)
        })
        setTimeout(this.getOnlineWaitingTaskCount, 10000);
    },
    /* 
      Function to play Audio Recording Playback
    */
    playAudio: function(sid, checkVideoAudio, recordingurl, carDriverInformation){
        var vm = this;
        vm.driverName = carDriverInformation.driver.title +" " +carDriverInformation.driver.firstName +" "+ carDriverInformation.driver.lastName
        vm.driverId = carDriverInformation.driver.driverId;
        $('#mediaPlayerPopup').modal('show');
        if(checkVideoAudio == 'Audio') {
          vm.showVideoRecording = false;
          vm.showAudioRecording = true;
        } else if(checkVideoAudio  == 'Video') {
          vm.showVideoRecording = true;
          vm.showAudioRecording = false;
        }
        var audioLink = recordingurl;
        var extension = audioLink.substring(audioLink.indexOf('.') + 1);
        if(extension == "json") {
              audioLink = audioLink.substring(0, audioLink.indexOf('.'));
              vm.audioLinks = 'https://api.twilio.com'+ audioLink + '.mp3'
        } else {
              vm.audioLinks = 'https://api.twilio.com'+ audioLink
        }
    },
    /* Function to play video recording playback
    */
    playVideo: function(callid, recordingSid, checkVideoAudio, carDriverInformation){
          var vm = this;
          vm.recordingSid =recordingSid;
          vm.videoLoader = true;
          vm.videoCallid = callid;
          vm.driverName = carDriverInformation.driver.title +" " +carDriverInformation.driver.firstName +" "+ carDriverInformation.driver.lastName
          vm.driverId = carDriverInformation.driver.driverId;
          var timeout = setInterval(function(){
          /* 
           API call to play video  recordings
          */
          CallLogsService.playVideoRecordings(vm.recordingSid)
            .then(response =>{
              console.log(response)
              if(Object.keys(response.data.response.body).length == 0){
                //vm.$loading(true)
              }else{
                vm.videoLoader = false;
                clearInterval(timeout);
                vm.videoLink = response.data.response.body.videoRecordingUrl;
                $('#mediaPlayerPopup').modal('show');
                if(checkVideoAudio == 'Audio'){
                  vm.showVideoRecording = false;
                  vm.showAudioRecording = true;
                } else if(checkVideoAudio  == 'Video'){
                  vm.showVideoRecording = true;
                  vm.showAudioRecording = false;
                }
              }
          })
          .catch(error => {
            console.log(error);
            this.$loading(false)
          })}
          , 3000);
    },
    pauseAudio: function(sid) {
          var vm = this;
          this.audioObj.pause();
          for(var i =0 ; i<vm.callLogsData.length; i++){
              if(vm.callLogsData[i].sid == sid)
                    vm.callLogsData[i].showVolumeDown = true;
          }
          vm.$forceUpdate();
    },
    /* To close the video recording playback
    */
    closeVideoAudioPopup(){
        $('#mediaPlayerPopup').modal('hide');
        this.showVideoRecording = false;
        this.showAudioRecording = false;
    },
    /*
      Function to get the call logs history
    */
    getCallLogs(fmsToken){
        CallLogsService.getCallLogs(userType,this.fmsToken)
          .then(response =>{
            if(response.data.callLogs){
               this.callLogsData = response.data.callLogs;
               this.callLogsLength = this.callLogsData.length
            }
            if(response.data.errorMessage){
            }
            this.$loading(false)
          })
          .catch(error => {
             console.log(error);
             this.$loading(false)
          })
    },
    /*
      Function to sort the call logs data in order
    */
    sortArrays(arrays) {
      return arrays.slice().sort(function(a, b) {
          var date1 = new Date(a.deviceCallLogDetails.callLog.date);
          var date2 = new Date(b.deviceCallLogDetails.callLog.date);
          return new Date(date2) - new Date(date1);
      });
      return arrays;
    },
    /*
      Function to show the  Driver Information  in Popup
      After Clicking on the Licesense Plate Number
    */
    showDriverInformation(carDriverInformation){
        $('#carInformationModal').modal('show')
        this.driverName = carDriverInformation.driver.title +" " +carDriverInformation.driver.firstName +" "+ carDriverInformation.driver.lastName
        this.driverId = carDriverInformation.driver.driverId;
        this.carId = carDriverInformation.driver.carId;
        this.carModelName = carDriverInformation.car.modelName
        this.carLicensePlateNumber = carDriverInformation.car.licensePlateNumber;
        this.job_description = carDriverInformation.car == "deviceId does not exists" ?'No Job Description Found': carDriverInformation.job.description;
    },
    /*
      Funtion to close the Popup of Driver Information
      
    */
    closeCarDriverInformationPopup(){
      $('#carInformationModal').modal('hide')
    },
    /*
      Function to Filter the call logs Data
    */
    filterCallLogs(callLogsFilter, clickEvent){
        this.$loading(true)
        if(Object.keys(callLogsFilter).length > 0) {
           this.filterRequiredMsg = ''
            var jsonData = [];
            var durations = [];
            var startDate;
            var endDate;
            var startDate;
            var dateObj = {}
            var currentDate =  new Date();
            endDate = new Date(new Date().toUTCString()).getTime();
            if(callLogsFilter.today == true) {
              jsonData.push("today");
              currentDate.setUTCHours(0,0,0,0);
              currentDate.toUTCString();
              startDate = new Date(currentDate.toUTCString()).getTime();
            }
            if(callLogsFilter.yesterday == true) {
              jsonData.push("yesterday");
              currentDate.setUTCHours(-24,0,0,0);
              currentDate.toUTCString();
              startDate = new Date(currentDate.toUTCString()).getTime();
            }
            if(callLogsFilter.month == true) {
              jsonData.push("month");
              var currentDay = currentDate.getDate();
              currentDate.setUTCHours(- ((currentDay-1)*24),0,0,0);
              currentDate.toUTCString();
              startDate = new Date(currentDate.toUTCString()).getTime();
            }
            if(callLogsFilter.fifteenMinute == true) {
              jsonData.push("fifteenMinute");
              durations.push({
                startDuration : 0,
                endDuration: 60*15
              })
            }
            if(callLogsFilter.thirtyMinute == true) {
              jsonData.push("thirtyMinute");
              durations.push({
                startDuration : 60*15,
                endDuration: 60*30
              })
            }
            if(callLogsFilter.fourtyFiveMinute == true) {
                jsonData.push("fourtyFiveMinute");
                durations.push({
                  startDuration : 60*30,
                  endDuration: 60*45
                })
            }
            if(callLogsFilter.oneHour == true) {
                jsonData.push("oneHour");
                durations.push({
                  startDuration : 60*45,
                  endDuration: 60*60
                })
            }
            if(callLogsFilter.aboveOneHour == true) {
              jsonData.push("aboveOneHour");
              durations.push({
                startDuration : 60*60,
                endDuration: 60*60*24
              })
            }
            if(startDate == undefined) {
              dateObj = null
            } else {
              dateObj = {
                  "startDate": startDate,
                  "endDate": endDate
              }
            }
            if(jsonData.length > 0) {
               /* API call to filter call logs */
                CallLogsService.filterCallLogs(dateObj, durations, userType, this.fmsToken)
                .then(response => {
                  if(response.data.callLogs){
                    this.callLogsData = response.data.callLogs;
                    this.callLogsLength = this.callLogsData.length;
                  }
                  if(response.data.errorMessage){
                  }
                  if(clickEvent == "clickEvent"){
                      $('#CallLogsModal').modal('hide');
                  }
                  this.$loading(false)
                })
                .catch(error => {
                  console.log(error)
                  this.$loading(false)
                })
              } else if(jsonData.length == 0) {
                this.getCallLogs()
                if(clickEvent == "clickEvent"){
                  $('#CallLogsModal').modal('hide');
                }
            }
        } else if(Object.keys(callLogsFilter).length == 0){
            this.getCallLogs()
            $('#CallLogsModal').modal('hide');
        }
    },
    showModal(){
        $('#CallLogsModal').modal('show');
    },
    closeModal(){
        $('#CallLogsModal').modal('hide');
    },
    reset(){
        this.callLogsFilter = {}
        this.$loading(true)
        this.getCallLogs()
        $('#CallLogsModal').modal('hide');
    },
    showNoteDetails(notes){
        $('#showNoteDetailsModal').modal('show');
        this.showNotes = notes;
    },
    closeNotesPopup(){
       $('#showNoteDetailsModal').modal('hide');
    }
  },
  computed:{
    
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
          return  date.toLocaleDateString()
        }
      }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bg-success{
  background-color: #4ad991 !important;
  border-color: #43ca86;
}
.bg-warning{
  background-color: #ffca83 !important;
  border-color: #f89b2d;
}
.bg-danger{
  background-color: #ff6366 !important;
  border-color: #d44447;
}
.bg-primary{
  background-color: #7697f7 !important;
  border-color: #5b78ca;
}
.call-status-logs{
  color:white;
  font-weight: bold;
}
.fa-icon{
  padding:10px;
  font-size:36px;
  width:24%;
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
.call-status-logs .card-body span{
  font-size:21px;
  font-weight: 400;
}
.call-log-btn-head{
  float:right;
}
.call-log-btn-head .fa-search{
  padding-left:10px
}
.call-logs table .btn-cell{
   color:#7697f7;
}
.call-logs table .btn-cell .fa-clipboard-list{
  padding-right:10px;
}
 #location i{
    font-size:24px;
    padding-right:10px;
}
#CallLogsModal{
}
.btn-primary {
    background-color: rgb(63,72, 204);
    border-color: rgb(63,72, 204);
}
#location i{
    color: rgb(63,72, 204);
}
#licensePlate p{
    font-weight: bold;
    color:#4d4d4d;
}
#licensePlateNum{
    font-size:1.5rem;
}
#driver, #carModel, #location{
    text-align:left;
    padding:1rem;
}
#driver p:first-child {
    font-size: 12px;
    font-weight: bold;
    color: gray
}
#carModel p:first-child {
    font-size: 12px;
    font-weight: bold;
    color: gray;
}
#location p:first-child {
  font-size: 12px;
  font-weight: bold;
  color: gray;
}
.modal-dialog-call-log{
  position: absolute;
  right:0px;
}
.modal-content-call-log{
  height: 810px;
  margin-top:40px;
  border-radius:0em;
  margin-right: 8px;
  width: 350px;
}
.model-content-events{
  height: 810px;
  width: 1000px;
}
.modal-dialog-media-player{
  height: 810px;
  width: 1000px;
}
.modal-content-media-player{
}
.modal-dialog-notes{
  height: 200px;
  width: 439px;
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
[v-cloak]{
  display:none;
}
</style>
