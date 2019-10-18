<template>
  <div class="popUp">
    <div class="modal fade" id="answerCallModal" data-keyboard="false" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <!-- Modal body -->
          <div class="modal-body">
            <img src="@/assets/phoneCalling.png" id="phoneCallImg">
            <div id="licensePlate" style="clear:both">
<!--              <p>Client ID</p>-->
<!--              <p id="licensePlateNum">{{ client }}</p>-->
            </div>
            <div id="driver" style="float:left;width:50%;border-right: 1px solid lightgray">
              <p class="">Driver Name</p>
              <p>{{ driverFirstName || ''}} {{driverLastName || '' }} </p>
            </div>
            <div id="carModel" style="float:left;width:50%">
              <p>Model</p>
              <p>{{ modelNumber || ''}}</p>
            </div>
            <div id="location" style="clear:both">
              <p><i class="fa fa-map-marker"></i>Live Location</p>
              <p>{{ location}}</p>
            </div>
            <button type="button" class="btn btn-primary btn-block" @click="clicked">Answer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CallLogs from "./CallLogs";
  import DriverInfoService from '../ApiFile/DriverInfoService'

  export default {
    name: 'PopUp',
    props: ["client", "deviceId"],
    data() {
      return {
        location: 'ASKEY Computer Corporation 10F, NO.19 JIANKANG RD.,ZHONGHE DIST.',
        vehicleData: '',
        driverFirstName: '',
        driverLastName: '',
        modelNumber: ''
      }
    },

    mounted() {
      $('#answerCallModal').modal('show');
      console.log('this.client', this.client);
    },

    methods: {
      clicked() {
        this.$emit('clicked');
      }
    },

    created() {
      var vm = this;
      vm.fmsToken = localStorage.getItem("fmsToken");
      console.log('vm.device.id', vm.deviceId);
      /*  Api is Call To get Driver Information  */
      DriverInfoService.driverInformationApi(vm.fmsToken, vm.deviceId)
        .then((res) => {
          console.log('driverInfo', res);
          vm.vehicleData = res.data.data;
          vm.driverFirstName = vm.vehicleData.driver.firstName;
          vm.driverLastName = vm.vehicleData.driver.lastName;
          vm.modelNumber = vm.vehicleData.car.modelName;
        }).catch((err) => {
        console.log(err);
        console.log('errpopup', err)
      })
    },
    components: {
      CallLogs
    }
  }
</script>

<style scoped>
  #location i {
    font-size: 24px;
    padding-right: 10px;
  }
  #answerCallModal {
    text-align: center;
  }
  .btn-primary {
    background-color: rgb(63, 72, 204);
    border-color: rgb(63, 72, 204);
  }
  #location i {
    color: rgb(63, 72, 204);
  }
  #licensePlate p {
    font-weight: bold;
    color: #4d4d4d;
  }
  #licensePlateNum {
    font-size: 1.5rem;
  }
  #driver, #carModel, #location {
    text-align: left;
    padding: 1rem;
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
  .modal-body {
    padding: 3rem;
  }

</style>
