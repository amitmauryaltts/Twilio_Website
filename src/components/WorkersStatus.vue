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
            <span class="call-num">{{ this.missedTaskData.length  }}</span>
          </p>
        </div>
      </div>
      <div class="card bg-primary">
        <div class="card-body text-center">
          <p class="card-text">
            <i class="fas fa-phone fa-icon"></i>
            <span class="call-status">Completed</span>
            <span class="call-num">{{ completedTaskData.length }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="card-deck call-logs " >
      <div class="card online-table">
        <div class="card-body">
          <h6>
            Online
            <div class="call-log-btn-head"></div>
          </h6>
          <div class="card-text">
            <table class="table  fixed_header">
              <thead>
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Time</th>
                <th style="white-space: nowrap;overflow: hidden;">License Plate Number</th>
                <th>Operator</th>
              </tr>
              </thead>
              <tbody v-if="onlineTableData.length > 0">
              <tr v-for="(callLog, key) in onlineTableData" :key="key">
                <td v-if="callLog.deviceCallLogDetails.car.licensePlateNumber">
                  <img src="../assets/outgoing.png" v-if="callLog.deviceCallLogDetails.callLog.category == 'outgoing'" />
                  <img src="../assets/incoming.png" v-if="callLog.deviceCallLogDetails.callLog.category == 'incoming'"/>
                </td>
                <td v-if="callLog.deviceCallLogDetails.car.licensePlateNumber">{{ callLog.deviceCallLogDetails.callLog.date | formatOnlineDate }}</td>
                <td v-if="callLog.deviceCallLogDetails.car.licensePlateNumber">{{ callLog.deviceCallLogDetails.callLog.date| formatOnlineTime }}</td>
                <td v-if="callLog.deviceCallLogDetails.car.licensePlateNumber">{{  callLog.deviceCallLogDetails.car.licensePlateNumber }}</td>
                <td v-if="callLog.deviceCallLogDetails.car.licensePlateNumber">{{ callLog.deviceCallLogDetails.callLog.operatorname }}</td>
              </tr>
              </tbody>
              <tbody v-else-if="onlineTableData.length == 0">
              <tr >
                <td style="white-space: nowrap;overflow: hidden;">No Data Found</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card waiting-table">
        <div class="card-body">
          <h6>
            Waiting
            <div class="call-log-btn-head"></div>
          </h6>
          <div class="card-text">
            <table class="table">
              <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>License Plate Number</th>
                <th>Waiting </th>
              </tr>
              </thead>
              <tbody v-if="waitingData.length > 0">
              <tr v-for="data in waitingData" :key="data.sid">
                <td>{{ data.dateCreated | formatDate }}</td>
                <td>{{ data.dateCreated| formatTime }}</td>
                <td>{{ data.licensePlateNumber }}</td>
                <td>{{ data.age/1000 }}&nbsp;sec</td>
              </tr>
              </tbody>
              <tbody v-else-if="waitingData.length == 0">
              <tr >
                <td>No Data Found</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="card-deck call-logs " >
      <div class="card">
        <div class="card-body">
          <h6>
            Users
            <div class="call-log-btn-head" @click="showModal"><i class="fas fa-filter" ></i></div>
          </h6>
          <div class="card-text">
            <ul class="nav md-pills nav-justified pills-success" style=" margin-left: 29px;" v-if="workersList.length > 0">
              <div  v-for="workers in workersList" :key="workers.sid" >
                <li class="nav-item dropdown"  v-if="workers.activityName != 'Offline' ">
                  <a class="nav-link  tab-circle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true"
                     aria-expanded="false" style="margin-right: 15px;">
                    <img src="../assets/online_icon.png" v-if="workers.activityName == 'Online'"/>
                    <img src="../assets/busy_icon.png" v-if="workers.activityName == 'Busy'" />
                    <img src="../assets/away_icon.png" v-if="workers.activityName == 'Away'"/>
                    <img src="../assets/dnd_icon.png" v-if="workers.activityName == 'Do Not Disturb'"/>&nbsp;
                    {{workers.friendlyName}}&nbsp;&nbsp;&nbsp; <i class="fas fa-ellipsis-h"></i></a>
                  <div class="dropdown-menu dropdown-success">
                    <a class="dropdown-item" href="#"><img src="../assets/online_icon.png"/>&nbsp;Online</a>
                    <a class="dropdown-item" href="#"><img src="../assets/busy_icon.png"  />&nbsp;Away</a>
                    <a class="dropdown-item" href="#"><img src="../assets/away_icon.png"/>&nbsp;Busy</a>
                    <a class="dropdown-item" href="#"><img src="../assets/dnd_icon.png" />&nbsp;Do not disturb</a>
                  </div>
                </li>
                &nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            </ul>
            <ul class="nav md-pills nav-justified pills-success" style=" margin-left: 29px;" v-else-if="workersList.length == 0">
              <h5> No Data Found</h5>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="popUp">
      <div class="modal fade" id="usersCallModal" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
                  <span class="close ">
                     <label style="margin-top: 10px;font-size: 20px;margin-left: 13px;">Filters</label>
                     <label style="margin-left: 158px;font-size: 20px;color: blue;" @click="reset">Reset</label>
                     <label style="margin: 15px;" @click="closeModal">&times;</label>
                     <hr>
                  </span>
            <label style="margin-top: 10px;font-size: 16px;margin-left:13px;"> <b>Status</b></label>
            <!-- Modal body -->
            <div class="modal-body">
              <input type="checkbox" id="online" v-model="workerStatusFilter.Online">
              <label for="online">Online</label><br>
              <input type="checkbox" id="away" v-model="workerStatusFilter.Away">
              <label for="away">Away</label><br>
              <input type="checkbox" id="busy" v-model="workerStatusFilter.Busy">
              <label for="busy">Busy</label><br>
              <input type="checkbox" id="dnd" v-model="workerStatusFilter.dnd">
              <label for="dnd">Do Not Disturb</label>
              <button type="button" class="btn btn-primary btn-block" style="width:22%"
                      @click="filterWorkerStatus(workerStatusFilter, 'clickEvent')">Done</button>
              <hr>
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
import { json } from 'body-parser';

var timeout;
var filterTimeout;
var x = 0;
var fmsToken;
var waitingTableData = [];

export default {
  name: 'WorkersStatus',
  data () {
    return {
	  loading: true,
    errored: false,
    callLogsData : [],
    usersOnlineNum : 0,
    usersWaitingCallNum : 0,
    showPopUp : false,
    polling: null,
    workersList : [],
    workerStatusFilter : {},
    filterRequiredMsg : '',
    completedTaskData : [],
    missedTaskData : [],
    waitingTableData : [],
    fmsToken : '',
    waitingData : [],
    pageLoadingCount:0,
    onlineTableData: '',
    tempWorkerStatusFilter: {}
    }
  },
  created(){
    $('#usersCallModal').modal('hide');
    /* Get the FMS token */
    this.fmsToken = localStorage.getItem("fmsToken");
    fmsToken = this.fmsToken
    this.getOnlineTableData();
    this.getWaitingTableData()
    this.getWorkersStatus();
    //this.getOnlineWaitingTaskCount()
  },
  methods:{
      loadingCount(){
        if(this.pageLoadingCount == 0)
          this.$loading(true)
      },
      /* Funtction to get the worker status
     */
      getWorkersStatus() {
        this.loadingCount();
        /*APIs call to get the worker status */
        WorkersStatusService.getWorkersStatus()
            .then(response =>{
              console.log(response);     
              if(response.data.workers){
                this.workersList = response.data.workers;
                this.pageLoadingCount++;
                this.$loading(false)
              } 
            })
            .catch(error => {
              console.log(error);
              this.$loading(false)
          })
          timeout = setTimeout(this.getWorkersStatus, 10000);
      },
      /* APIs to filter the worker status */
      filterWorkerStatus(workerStatusFilter, clickEvent){
        console.log(workerStatusFilter);
        if(clickEvent == 'clickEvent') {
           this.tempWorkerStatusFilter = workerStatusFilter;
        } else {
          workerStatusFilter= this.tempWorkerStatusFilter
        }
        if(Object.keys(this.tempWorkerStatusFilter ).length > 0) {
           this.filterRequiredMsg = ''
            clearTimeout(timeout);
            var jsonData = []
            if(workerStatusFilter.Online == true) {
              jsonData.push("Online")
            }
            if(workerStatusFilter.Away == true) {
              jsonData.push("Away")
            }
            if(workerStatusFilter.Busy == true) {
              jsonData.push("Busy")
            }
            if(workerStatusFilter.dnd == true) {
              jsonData.push("Do Not Distrub")
            }
            console.log(jsonData)
            if(jsonData.length > 0) {
              /* APIs call to filter worker status */
                WorkersStatusService.filterWorkerStatus(jsonData)
                .then(response => {
                  console.log(response)
                   this.workersList = response.data.workers;
                   if(clickEvent == "clickEvent"){
                      $('#usersCallModal').modal('hide');
                   }
                 filterTimeout =   setTimeout(this.filterWorkerStatus, 10000);
                })
                .catch(error => {
                  console.log(error)
                })
            } else if(jsonData.length == 0) {
                 this.getWorkersStatus()
                  if(clickEvent == "clickEvent"){
                    $('#usersCallModal').modal('hide');
                  }
            }
        } else if(Object.keys(workerStatusFilter).length == 0){
             this.getWorkersStatus();
             $('#usersCallModal').modal('hide');
        }
    },
    getOnlineTableData() {
        WorkersStatusService.getOnlineTableData(this.fmsToken )
        .then(response =>{
          console.log(response);
          this.onlineTableData = response.data.callLogs;
        })
        .catch(error => {
          console.log(error)
        })
        setTimeout(this.getOnlineTableData, 10000);
    },
    getWaitingTableData() {
       var jsonData = ["pending","reserved"]
       WorkersStatusService.getWaitingTableData(jsonData)
        .then(response =>{
          console.log(response);
          this.waitingTableData = response.data.tasks;
          if(this.waitingTableData.length > 0)
              this.getLicensePlatNumber(this.waitingTableData)
          else {
            this.waitingData = []
          }
        })
        .catch(error => {
          console.log(error)
        })
        setTimeout(this.getWaitingTableData, 10000);
    },
    getNumber(list, callback){
        var attributesData = JSON.parse(attributes)
        console.log(attributesData);
        var fromValue = attributesData.from;
        var  deviceId = fromValue.substring(fromValue.indexOf(':') + 1);
        console.log(deviceId)
        WorkersStatusService.getLicensePlatNumber(deviceId, fmsToken)
            .then(response =>{
              console.log(response);
              this.waitingTableData[x].licensePlateNumber = response.data.message;
              console.log(this.waitingTableData)
              this.waitingData.push(waitingTableData[x]) ;
              console.log(this.waitingData)
              callback();
            })
            .catch(error => {
              console.log(error)
        })
    },
    getLicensePlatNumber(attributes)  {
        var vm = this;
        this.getNumber(attributes[x],function(){
          x++;
          if(x < attributes.length) {
             vm.getLicensePlatNumber(attributes)
          }
        }); 
    },
    // getOnlineWaitingTaskCount() {
    //     WorkersStatusService.getOnlineWaitingTaskCount()
    //         .then(response =>{
    //           console.log(response);
    //           if(response.data.workspaceRealTimeStatistics){
    //               var responseData = response.data.workspaceRealTimeStatistics
    //               this.usersOnlineNum = responseData.tasksByStatus.assigned;
    //               this.usersWaitingCallNum = responseData.tasksByStatus.reserved + responseData.tasksByStatus.pending
    //           }
    //         })
    //         .catch(error => {
    //           console.log(error)
    //       })
    //      setTimeout(this.getOnlineWaitingTaskCount, 10000);
    // },
    showModal(){
          $('#usersCallModal').modal('show');
    },
    closeModal(){
          $('#usersCallModal').modal('hide');
    },
    reset(){
          this.workerStatusFilter = {};
          this.tempWorkerStatusFilter = {};
          clearTimeout(filterTimeout);
          this.getWorkersStatus()
          $('#usersCallModal').modal('hide');
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
        formatOnlineTime(value) {
          if (value) {
             var date = new Date(value);
            return date.toLocaleTimeString()
          }
        },
        formatOnlineDate(value) {
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
  text-align:center;
   color:#7697f7;
}
.call-logs table .btn-cell .fa-clipboard-list{
  padding-right:10px;
}
.online-table{
  width: 50%;
  display: block;
  height: 300px;
  overflow-y: scroll;
}
.waiting-table{
  width: 50%;
   display: block;
  height: 300px;
  overflow-y: scroll;
}
.pills-success .nav-item .dropdown-toggle.nav-link:focus {
  background-color: #00C851;
  color: #fff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.tab-circle{
    border-radius: 7px;
    border: 1px solid #EFEBF9;
    padding: 10px;
    width: 177px;
    height: 50px;
    margin-top: 25px;
}
#location i{
  font-size:24px;
  padding-right:10px;
}
#usersCallModal{
  /* text-align:center; */
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
.modal-dialog{
  position: absolute;
  right:0px;
}
.modal-content{
  height: 810px;
  margin-top:40px;
  border-radius:0em;
  margin-right: 8px;
  width: 350px;
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
</style>
