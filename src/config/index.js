/*
All base url are defined 
*/

// module.exports = {
//   base_url: 'https://fgv1el6pmh.execute-api.us-east-1.amazonaws.com/dev/',
//   base_url_two:'https://btt6y09a8a.execute-api.us-west-2.amazonaws.com/v1/',
//   base_url_three:'https://fij2jqx9oa.execute-api.us-east-1.amazonaws.com/v1/',
//   base_url_four: 'https://8j9fpqq547.execute-api.us-east-1.amazonaws.com/v1/',
//   base_url_five:'https://aim9p7l5w8.execute-api.us-east-1.amazonaws.com/dev/',
//   base_url_six: 'https://ujsai3knwa.execute-api.us-east-2.amazonaws.com/dev/',
//   header:{
//     'Authorization' : 'Bearer '+ window.accesstoken,
//     'x-api-key' : '6HVyolAusLjqZTQxPYBS3AQiFnf3RSJ8xL1l0h48',
//     'Content-Type': 'application/json'
// 	}
// };

/*
base url resolve cors issue
*/

module.exports = {
  base_url: 'https://9zbsn3542k.execute-api.us-east-2.amazonaws.com/dev/',
  base_url_two: 'https://9zbsn3542k.execute-api.us-east-2.amazonaws.com/v1/',
  base_url_three: 'https://5thzi7r527.execute-api.us-east-2.amazonaws.com/v1/',
  base_url_four: 'https://9zbsn3542k.execute-api.us-east-2.amazonaws.com/v1/',
  base_url_five:'https://wsfxdtej4c.execute-api.us-east-2.amazonaws.com/v1/',
  base_url_six: 'https://ujsai3knwa.execute-api.us-east-2.amazonaws.com/dev/',
  base_url_seven: 'https://8wqa2o7b3l.execute-api.us-east-2.amazonaws.com:443/v1/',
  base_url_eight: 'https://9zbsn3542k.execute-api.us-east-2.amazonaws.com/dev/',
  base_url_nine:'https://5thzi7r527.execute-api.us-east-2.amazonaws.com:443/v1/',
  header:{
    authorization : 'Bearer '+ localStorage.getItem("fmsToken"),
    contentType: 'application/json'
  },
  telematicsWebsockeUrl:'wss://fc8k2pesn9.execute-api.us-east-2.amazonaws.com/v1'
};

