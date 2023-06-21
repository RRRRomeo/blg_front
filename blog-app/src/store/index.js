import Vuex from 'vuex'
import Vue from 'vue'
import {getToken, setToken, removeToken} from '@/request/token'
import {login, getUserInfo, logout, register} from '@/api/login'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    id: '',
    account: '',
    name: '',
    avatar: '',
    token: getToken(),
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      console.log("mutations")
      state.token = token;
    },
    SET_ACCOUNT: (state, account) => {
      console.log("mutations")
      state.account = account
    },
    SET_NAME: (state, name) => {
      console.log("mutations")
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      console.log("mutations")
      state.avatar = avatar
    },
    SET_ID: (state, id) => {
      console.log("mutations")
      state.id = id
    }
  },
  actions: {
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        login(user.account, user.password).then(data => {
          console.log("data:", data)
          commit('SET_TOKEN', data.data['token'])
          setToken(data.data['token'])
          resolve()
        }).catch(error => {
          console.log("login err:", error);
          reject(error)
        })
      })
    },
    // 获取用户信息
    getUserInfo({commit, state}) {
      let that = this
      return new Promise((resolve, reject) => {
        getUserInfo().then(rsp => {
          console.log("resp data:", rsp)
          if (rsp.data) {
            commit('SET_ACCOUNT', rsp.data.currentUser.account)
            commit('SET_NAME', rsp.data.currentUser.nickname)
            commit('SET_AVATAR', rsp.data.currentUser.avatar)
            commit('SET_ID', rsp.data.currentUser.id)
          } else {
            commit('SET_ACCOUNT', '')
            commit('SET_NAME', '')
            commit('SET_AVATAR', '')
            commit('SET_ID', '')
            removeToken()
          }
          resolve(rsp)
        }).catch(error => {
          console.log("catch err:", error)
          reject(error)
        })
      })
    },
    // 退出
    logout({commit, state}) {
      return new Promise((resolve, reject) => {
        logout().then(data => {

          commit('SET_TOKEN', '')
          commit('SET_ACCOUNT', '')
          commit('SET_NAME', '')
          commit('SET_AVATAR', '')
          commit('SET_ID', '')
          removeToken()
          resolve()

        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    fedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ACCOUNT', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ID', '')
        removeToken()
        resolve()
      }).catch(error => {
        // reject(error)
        resolve()
      })
    },
    register({commit}, user) {
      console.log("register start\n");
      return new Promise((resolve, reject) => {
        console.log("Promise start\n");
        register(user.account, user.nickname, user.password).then((data) => {
          console.log("data:", data)
          console.log("register ==>\n")
          commit('SET_TOKEN', data.data['token'])
          console.log("commit out\n")
          setToken(data.data['token'])
          resolve()
        }).catch((error) => {
          console.log("catch err:", error)
          reject(error)
          // resolve()
        })
      })
    }
  }
})
