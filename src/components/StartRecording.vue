<template>
  <div>
    <div>
    </div>
  </div>
</template>

<script>
  import VoiceServices from '../ApiFile/VoiceServices';
  import EventBus from '../Utils/EventBus';

  var myVar;
  var recordSid;
  var callSid;

  export default {
    name: 'StartRecording',
    props: ['callSidforRecording'],
    data() {
      return {
        count: 0,
        pause: false,
        resume: false,
      }
    },
    created() {
      console.log('callSidforRecording', this.callSidforRecording);
      VoiceServices.startRecording(this.callSidforRecording)
        .then((response) => {
          console.log('response', response);
          recordSid = response.data.sid;
          callSid = response.data.callSid;
          EventBus.$emit('emitRecordingUrl', {
            "url": response.data.recording.uri,
            "recordingSid": response.data.recording.sid
          });
          if (response.status === 200) {
            data.pause = true;
          }
        }).catch((err) => {
        console.log('err', err);
      })
    },
    methods: {
      startRecording(callSidforRecording) {
        var data = this;
        var checkbox = document.getElementById("checkrecordingid");
        if (checkbox.checked) {
          /* Api is Call To get Start Recording  */
          VoiceServices.startRecording(callSidforRecording)
            .then((response) => {
              console.log('response', response);
              recordSid = response.data.sid;
              callSid = response.data.callSid;
              EventBus.$emit('emitRecordingUrl', {
                "url": response.data.recording.uri,
                "recordingSid": response.data.recording.sid
              });
              if (response.status === 200) {
                data.pause = true;
              }
            }).catch((err) => {
            console.log('err', err);
          })
        } else {
          clearInterval(myVar);
          data.resume = false;
          data.pause = false;
        }
      },
      onPause() {
        VoiceServices.onPause(recordSid, callSid)
          .then((data) => {
            console.log(data);
            clearInterval(myVar);
            this.pause = false;
            this.resume = true;
          }).catch((err) => {
          console.log(err);
        });
      },
      onResume() {
        var data = this;
        VoiceServices.onResume(recordSid, callSid)
          .then((resdata) => {
            console.log(resdata);
            data.pause = true;
            data.resume = false;
          }).catch((err) => {
          console.log(err);
        });
      },
    }
  }
</script>
