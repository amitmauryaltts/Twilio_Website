import DriverInfoService from '../ApiFile/DriverInfoService';

export default {
  callPopupCommomCode(){
    DriverInfoService.getAccessTokenFromFms()
      .then((response)=>{
        console.log('response',response);
        if(response.data.status===0){
          DriverInfoService.driverInformationApi(response.data.access_token)
            .then((res)=>{
               console.log('driverInfo',res);
               return res.data.data;
            }).catch((err)=>{
            console.log(err)
          })
        }
      }).catch((error)=>{
      console.log(error)
    });
  }
}
