import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/request/token'

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 10000
})


// request拦截器
service.interceptors.request.use(config => {
  console.log("Request URL:", config.baseURL + config.url);
  console.log("sercvice send, token:\n", store.state.token)
  if (config.url != "/login") {
    if (store.state.token) {
      console.log("token:", getToken())
      const bearerToken = `Bearer ${getToken()}`;
      config.headers['Authorization'] = bearerToken
    }
  }
  console.log("request:", config)
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    console.log("reponse start\n")
    //全局统一处理 Session超时
    if (response.headers['session_time_out'] == 'timeout') {
      store.dispatch('fedLogOut')
    }

    const res = response.data;

    //200 为成功状态
    if (res.code !== 200) {

      //90001 Session超时
      if (res.code === 90001) {
        return Promise.reject('error');
      }

      //20001 用户未登录
      if (res.code === 20001) {
        console.info("用户未登录")

        Message({
          type: 'warning',
          showClose: true,
          message: '未登录或登录超时，请重新登录哦'
        })

        return Promise.reject('error');
      }

      //70001 权限认证错误
      if (res.code === 70001) {
        console.info("权限认证错误")
        Message({
          type: 'warning',
          showClose: true,
          message: '你没有权限访问哦'
        })
        return Promise.reject('error');
      }
      console.log("res.msg:", res.msg)

      return Promise.reject(res.msg);
    } else {
      console.log("else res:", response.data)
      return response.data;
    }
  },
  error => {
    Message({
      type: 'warning',
      showClose: true,
      message: '连接超时'
    })
    console.log("get rsp err:", error);
    return Promise.reject('error')
  })

export default service
