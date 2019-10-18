<template>
  <div id="app">
    <div class="wrapper">
      <nav id="sidebar" class="active">
        <div class="sidebar-header">
          <i class='fas fa-bars' id="sidebarCollapse"></i>
          <span class="sidebar-menu-text menu-text-display">Menu</span>
        </div>
        <ul class="list-unstyled components">
          <li id="dashboardMenu">
            <router-link v-bind:to="'/dashboard'" class="nav-link ">
              <i class="fas fa-calculator"></i>
              <span class="sidebar-menu-text menu-text-display">Dashboard</span>
            </router-link>
          </li>
          <li id="callLogs" class="activeMenu">
            <router-link v-bind:to="'/callLogs'" class="nav-item nav-link active" active-class="active" exact>
              <i class="fas fa-phone-volume"></i>
              <span class="sidebar-menu-text menu-text-display"> Call Logs</span>
            </router-link>
          </li>
          <li id="operatorCallsMenu">
            <router-link v-bind:to="'/operatorCalls'" class="nav-item nav-link active">
              <i class="fas fa-desktop"></i>
              <span class="sidebar-menu-text menu-text-display">Operator Calls</span>
            </router-link>
          </li>
          <li>
            <a href="#">
              <i class="far fa-life-ring"></i>
              <span class="sidebar-menu-text menu-text-display">Driver</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fas fa-car-alt"></i>
              <span class="sidebar-menu-text menu-text-display">Fleet</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fas fa-briefcase"></i>
              <span class="sidebar-menu-text menu-text-display">Job</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fas fa-cog"></i>
              <span class="sidebar-menu-text menu-text-display">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
      <div id="content">
        <nav class="navbar navbar-expand-sm">
          <a class="navbar-brand" href="#">
            <img src="/static/askeyLogoSm1.PNG" alt="logo" style="">
          </a>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
              <a class="nav-link" href="#" id="navbardrop" data-toggle="dropdown">
                John Doe
                <img src="/static/profile1.PNG" class="rounded-circle" alt="John Doe">
              </a>
            </li>
          </ul>
        </nav>
        <router-view/>
      </div>
    </div>
    <div class="col-md-12">
      <div>
        <PopUp v-if="show && accept===false" @clicked="acceptCall" :key="accept" :client=connFrom
               :deviceId=imeiToDeviceID></PopUp>
      </div>
    </div>
  </div>
</template>

<script>

  import ApiIntegration from './ApiFile/ApiIntegration';
  import PopUp from './components/PopUp';
  import router from './router';
  import SaveUpdateDvrDetails from './ApiFile/SaveUpdateDvrDetails';
  import EventBus from './Utils/EventBus';
  import connect from 'twilio-video';

  const Twilio = require('twilio-client');
  const TaskRouter = require('twilio-taskrouter');

  var popupForm;
  var globalConnObject;
  var saveData;
  var worker;

  export default {
    name: 'App',
    components: {PopUp},
    methods: {
      clickToShow: function () {
        popupForm.show = true;
      },
      acceptCall: function () {
        popupForm.accept = true;
      }
    },
    created() {
      /*    Side bar  code start here   */
      $(document).ready(function () {
        $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
          $('.sidebar-menu-text').toggleClass('menu-text-display');
        });
        $('#callLogs').on('click', function () {
          $('#callLogs').addClass("activeMenu")
          $('#dashboardMenu').removeClass("activeMenu");
          $('#operatorCallsMenu').removeClass("activeMenu")
        })
        $('#dashboardMenu').on('click', function () {
          $('#dashboardMenu').addClass("activeMenu")
          $('#callLogs').removeClass("activeMenu");
          $('#operatorCallsMenu').removeClass("activeMenu")
        })
        $('#operatorCallsMenu').on('click', function () {
          $('#operatorCallsMenu').addClass("activeMenu")
          $('#callLogs').removeClass("activeMenu");
          $('#dashboardMenu').removeClass("activeMenu")
        })
      });
      /*    Side bar  code end here   */
      popupForm = this;
      var fmsToken = this.$route.query.access_token == undefined ? localStorage.getItem("fmsToken") : this.$route.query.access_token;   //Getting FMS token from Local Storage
      console.log(fmsToken);
      localStorage.setItem("fmsToken", fmsToken);
      window.fmsToken = localStorage.getItem("fmsToken");
      console.log(window.fmsToken);
    },

    data() {
      return {
        show: false,
        accept: false,
        connFrom: '',
        recordingUrl: '',
        recordingSid: '',
        trimClientFromIncoming: '',
        trimClientTo: '',
        imeiToDeviceID: '',
        deviceLoginToken: ''
      }
    },

    updated() {
      if (popupForm.accept === true) {
        globalConnObject.accept();
        saveData = globalConnObject.parameters;
        const trimFrom = saveData.From;
        const trimClientFrom = trimFrom.substring(7);
        const trimTo = saveData.To;
        popupForm.trimClientTo = trimTo.substring(7);
        $('.modal-backdrop').hide();
        /*  On Incoming call answer save Call logs */
        SaveUpdateDvrDetails.saveCallLogsFromDvrToOperator(saveData.CallSid, trimClientFrom, popupForm.trimClientTo, popupForm.imeiToDeviceID, 'incoming', "voice")
          .then((resdata) => {
            if (resdata.status === 200) {
              if (window.notAcceptCall === false) {
                window.location.href = 'https://askey-vue.herokuapp.com';
              } else {
                router.push({
                  name: "DriverInfo",
                  params: {
                    callSid: saveData.CallSid,
                    deviceId: popupForm.imeiToDeviceID,
                    passConnToDisconnectOutgoingCall: globalConnObject,
                    noDivert: true
                  }
                })
              }
            }
          }).catch((error) => {
          console.log('error', error)
        });
      } else {
        console.log('reject');
      }
    },

    mounted() {
      popupForm = this;
      console.log(this);
      console.log(this.show);
      /* Getting Access Token To Setup Twilio */
      ApiIntegration.getAccessTokenApi()
        .then(response => {
          console.log(response);
          console.log('inside api token', this);
          const accessTokenKey = response.data.accessToken;
          EventBus.$on('emitRecordingUrl', (payload) => {
            popupForm.recordingUrl = payload;
          });
          localStorage.setItem('setAccessToken', accessTokenKey);
          Twilio.Device.setup(accessTokenKey);
          Twilio.Device.ready(function (device) {
            console.log('Twilio.Device Ready!');
            window.device = device;
          });
          Twilio.Device.on("connect", function (conn) {
            console.log('Twilio.Device connect: ' + conn);
          });
          Twilio.Device.error(function (error) {
            console.log('Twilio.Device Error: ' + error.message);
          });
          Twilio.Device.on('incoming', function (conn) {
            console.log('twilio incoming call');
            popupForm.connFrom = conn.parameters.From;
            var trimClientID = conn.parameters.From;
            popupForm.trimClientFromIncoming = trimClientID.substring(7);
            popupForm.imeiToDeviceID = popupForm.trimClientFromIncoming;
            console.log(' popupForm.imeiToDeviceID', popupForm.imeiToDeviceID)
            popupForm.clickToShow();
            globalConnObject = conn;
            /* Api is Call To get access token From user auth login  */
            // ApiIntegration.getAccessTokenFromAuthLogin()
            //   .then((response)=>{
            //     popupForm.deviceLoginToken = response.data.access_token;
            //   }).catch((error)=>{
            //   console.log('error', error);
            // });
            /* Api is Call To get DeviceId From IMEI  */
            // ApiIntegration.getDeviceIdFromImei(popupForm.trimClientFromIncoming,popupForm.deviceLoginToken)
            //   .then((response) => {
            //     console.log('response', response.data.deviceid);
            //     popupForm.imeiToDeviceID = response.data.deviceid;
            //     popupForm.clickToShow();
            //   }).catch((error) => {
            //   console.log('error', error)
            // });
            if (window.location.href === `${window.location.hostname}/dashboard`) {
              /* API is call to get update the call logs  */
              SaveUpdateDvrDetails.updateCalllogsFromDvrToOperator(saveData.CallSid, '', popupForm.recordingUrl.url, popupForm.recordingUrl.recordingSid)
                .then((response) => {
                  console.log('response', response.data);
                  conn.disconnect();
                }).catch((err) => {
                console.log('error', err);
              })
            }
            console.log('conn.parameters.From', conn.parameters.From);
          });
          Twilio.Device.on('disconnect', function (conn) {
            /* API is call to get update the call logs  */
            SaveUpdateDvrDetails.updateCalllogsFromDvrToOperator(conn.parameters.CallSid, '', popupForm.recordingUrl.url, popupForm.recordingUrl.recordingSid)
              .then((response) => {
                console.log('response', response.data);
                conn.disconnect();
                popupForm.accept = false;
                popupForm.show = false;
              }).catch((err) => {
              console.log('err', err);
            });
            ApiIntegration.updateWorker()
              .then((response) => {
                console.log('update worker', response);
              }).catch((error) => {
              console.log('error', error);
            })
          });
          /* Api for Capability Token for Task router */
          if (response.status === 200) {
            ApiIntegration.getApiForCapabilityToken()
              .then(res => {
                // worker = new TaskRouter.Worker(res.data.response.body.workerCapabilityToken, true);
                //              console.log(worker);
                //
                //  worker.on("ready", function (worker) {
                //    console.log("ready");
                //    console.log(worker.sid)             // 'WKxxx'
                //    console.log(worker.friendlyName)    // 'Worker 1'
                //    console.log(worker.activityName)    // 'Reserved'
                //    console.log(worker.available)       // false
                //
                //  });
                //
                //  worker.on("reservation.created", function (reservation) {
                //    console.log("reservation.created");
                //    console.log(JSON.stringify(reservation));
                //    reservation.conference();
                //
                //    console.log(worker.sid)             // 'WKxxx'
                //    console.log(worker.friendlyName)    // 'Worker 1'
                //    console.log(worker.activityName)    // 'Reserved'
                //    console.log(worker.available)       // false
                //  });
                //
                //  worker.on("reservation.accepted", function (worker) {
                //    console.log("reservation.accepted");
                //    console.log(worker.sid)             // 'WKxxx'
                //    console.log(worker.friendlyName)    // 'Worker 1'
                //    console.log(worker.activityName)    // 'Reserved'
                //    console.log(worker.available)       // false
                //  });
                //
                //  worker.on("reservation.accept", function (worker) {
                //    console.log("reservation.accept");
                //    console.log(worker.sid)             // 'WKxxx'
                //    console.log(worker.status)    // 'Worker 1'
                //  });
                //
                //  worker.on("reservation.reject", function (reservation) {
                //    console.log("reservation.reject");
                //    console.log(worker.sid)             // 'WKxxx'
                //    console.log(worker.friendlyName)    // 'Worker 1'
                //    console.log(worker.activityName)    // 'Reserved'
                //    console.log(worker.available)       // false
                //  });
              })
              .catch(err => {
                console.log("not getting access token" + err);
              })
          }
        })
        .catch(error => {
          console.log("not getting" + error);
        })
    },
  }

</script>
<style>
  .activeMenu {
    border: 1px solid grey;
    opacity: 5;
    background: darkgrey;
  }
  a,
  a:hover,
  a:focus {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
  }
  .navbar {
    padding: 5px 5px;
    background: #fff;
    border: none;
    border-radius: 0;
    margin-bottom: 40px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  }
  i, span {
    display: inline-block;
  }
  .wrapper {
    display: flex;
    align-items: stretch;
  }
  #sidebar {
    min-width: 250px;
    max-width: 250px;
    background: #6382d7;
    color: #fff;
    transition: all 0.3s;
  }
  #sidebar.active {
    min-width: 80px;
    max-width: 80px;
    text-align: center;
  }
  #sidebar ul li a {
    text-align: left;
  }
  #sidebar.active ul li a {
    padding: 20px 10px;
    text-align: center;
    font-size: 0.85em;
  }
  #sidebar.active ul li a i {
    margin-right: 0;
    display: block;
    font-size: 1.8em;
    margin-bottom: 5px;
  }
  #sidebar.active ul ul a {
    padding: 10px !important;
  }
  #sidebar .sidebar-header {
    padding: 20px;
    background: #6382d7;
  }
  #sidebar ul.components {
    padding: 0 0;
  }
  #sidebar ul li a {
    padding: 20px;
    font-size: 1.1em;
    display: block;
  }
  #sidebar ul li a:hover {
    color: #7386D5;
    background: #fff;
  }
  #sidebar ul li a i, #sidebar .sidebar-header i {
    margin-right: 10px;
  }
  #sidebar ul li.active > a,
  a[aria-expanded="true"] {
    color: #fff;
    background: #7d97de;
    border-left: 5px solid white;
  }
  a[data-toggle="collapse"] {
    position: relative;
  }
  #content {
    width: 100%;
    min-height: 100vh;
    transition: all 0.3s;
  }
  @media (max-width: 768px) {
    #sidebar {
      min-width: 80px;
      max-width: 80px;
      text-align: center;
      margin-left: -80px !important;
    }
    #sidebar.active {
      margin-left: 0 !important;
    }
    #sidebar ul li a {
      padding: 20px 10px;
    }
    #sidebar ul li a span {
      font-size: 0.85em;
    }
    #sidebar ul li a i {
      margin-right: 0;
      display: block;
    }
    #sidebar ul ul a {
      padding: 10px !important;
    }
    #sidebar ul li a i {
      font-size: 1.3em;
    }
    #sidebar {
      margin-left: 0;
    }
    #sidebarCollapse span {
      display: none;
    }
  }
  .menu-text-display {
    display: none;
  }
  .navbar li {
    color: #bcbccb;
  }
  .navbar li .fa-bell {
    color: #bcbccb;
    border-right: 1px solid #bcbccb;
    padding-right: 10px;
  }
  .fa-caret-down {
    padding-left: 10px;
  }
  .card {
    border-color: #d4d7da;
  }
  .card-deck {
    margin-right: 5px;
    margin-left: 5px;
  }
  .card-body {
    padding: 0px;
  }
  .card-body h6 {
    font-weight: bold;
    padding: 4px;
    background: #eceff3;
    color: #575858;
  }
  .card-text-title {
    font-weight: bold;
    color: #acafbc;
  }
  .card-text {
    padding: 5px;
  }
  .card-text-title {
    margin-bottom: 5px;
  }
  .navbar {
    margin-bottom: 10px;
  }
  .card-deck {
    margin-bottom: 10px;
  }
  .table th {
    border-top: 0px;
  }
  #sidebarCollapse {
    font-size: 24px
  }
  .modal-open {
    overflow: visible !important;
  }
  nav li:hover,
  nav li.router-link-active,
  nav li.router-link-exact-active {
    background-color: indianred;
    cursor: pointer;
  }
  video {
    height: 100%;
    width: 100%;
    object-fit: unset !important;
    margin-left: -5px;

  }
  #remote_video video ~ video {
    display: none
  }
  body{
    overflow-x: hidden !important;
  }

</style>
