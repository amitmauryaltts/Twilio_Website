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
            <span class="call-num">{{ usersMissedCallNum }}</span>
          </p>
        </div>
      </div>
      <div class="card bg-primary">
        <div class="card-body text-center">
          <p class="card-text">
            <i class="fas fa-phone fa-icon"></i>
            <span class="call-status">Completed</span>
            <span class="call-num">{{ usersCompletedCallNum }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="card-deck call-logs" >
      <div class="card">
        <div class="card-body">
          <h6>
            Call Logs {{this.callLogsData.length}}
            <div class="call-log-btn-head"><i class="fas fa-filter"></i><i class="fas fa-search"></i></div>
          </h6>
          <div class="card-text">
            <table class="table">
              <thead>
              <tr>
                <th>Serial Number</th>
                <th>License Plate Number</th>
                <th>Date</th>
                <th>Time</th>
                <th>Event Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="callLog in callLogsArray">
                <td>{{ callLog.callSerialNum}}</td>
                <td>{{  }}</td>
                <td>{{ callLog.callDate  }}</td>
                <td>{{ callLog.callTime }}</td>
                <td>{{ callLog.description  }}</td>
                <td>{{  }}</td>
                <td class="btn-cell">
                  <i class="fas fa-clipboard-list"></i>
                  <i style="font-size:16px" class="fa">&#xf03d;</i> &nbsp;
                  <i class="fas fa-volume-up"></i>
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

export default {
    name:'EventScreen',
    data(){
        return{
            loading: true,
            errored: false,
            callLogsData : [],
            usersOnlineNum : 0,
            callLogsArray:[]
        }
    },
    computed:{
        usersWaitingCallNum:function(){
            return 0;
        },
        usersMissedCallNum:function(){
            return 0;
        },
        usersCompletedCallNum: function(){
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
        }
    }
}
</script>

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
    font-size:24px;
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
</style>
