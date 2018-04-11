import axios from 'axios'
// axios 用法：
// https://www.npmjs.com/package/axios
var api = axios.create({
  baseURL: 'http://47.95.3.178:4002/api/',
  withCredentials: true,
  timeout: 60000,
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    if (JSON.parse(data).res_code < 0) {
      console.log(data)
    }
    return JSON.parse(data)
  }]
})

export default api
