import axios from 'axios'
import { createStore } from 'vuex'


const API_URL = 'http://localhost:8081/api'
axios.interceptors.request.use(function (config) {
  const token = JSON.parse(localStorage.getItem('currentUser') ?? '{}')?.accessToken || null
  console.log(token)
  if (token) {
    config.headers = {
      ...config.headers,
      'x-access-token': token
    }
  }
  return config;
})

axios.interceptors.response.use(function (value) {
  return value
}, function (error) {
  if (error.response) {
    console.log(error.response)
    if (error.response.status === 401) {
      attemptRefreshToken()
    }
  }
})

const attemptRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') ?? '{}')
  const token = user?.refreshToken;
  if (!token) store.dispatch('logout')

  axios.post(API_URL + '/auth/refreshtoken', { refreshToken: token }).then((success: any) => {

    const userData = { ...user, accessToken: success?.data.accessToken }
    localStorage.setItem('currentUser', JSON.stringify(userData))

    store.commit('saveUser', userData)
  }).catch(err => {
    store.dispatch('logout')
  })
}

const store = createStore({
  state: {
    currentUser:

      (localStorage.getItem('currentUser') !== null) ?
        JSON.parse(localStorage.getItem('currentuser') as string)
        : null,
    error: '',
    status: ''
  },
  mutations: {
    register(state, newUser) {
      state.currentUser = newUser
      state.status = 'Success in registering!'
    },
    showError(state, message: ErrorResponse) {
      const newError: string = message.response.data.message
      state.error = newError;
    },
    setError(state, newError) {
      state.error = newError
    },
    saveUser(state, user: UserData) {
      state.currentUser = user;
    },
    login(state, newUser: UserData) {
      state.currentUser = newUser;
      localStorage.setItem('currentUser', JSON.stringify(newUser))
    }
  },
  actions: {
    register({ commit, state }, userData) {
      axios.post(API_URL + '/auth/signup', userData
      ).then(data => {
        commit('register', data.data as UserData)
      })
        .catch(error => {
          commit('showError', error as ErrorResponse)
        })
    },
    login({ commit, state }, userData) {
      axios.post(API_URL + '/auth/signin', userData)
        .then(data => {
          console.log(data)
          commit('login', data.data as UserData)
        })
        .catch(error => {
          commit('showError', error as ErrorResponse)
        })
    },
    logout({ commit, state }) {
      localStorage.removeItem('currentUser');
      window.location.reload();
    },
    getOwnData({ commit, state }) {
      if (state.currentUser) {
        const url = API_URL + '/users/' + state.currentUser._id
        console.log(url)//
        axios.get(API_URL + '/users/' + state.currentUser._id).then(data => {
          console.log(data)
        }).catch(error => {
          console.log(error.response)
        })
      }
    }
  },
  modules: {
  }
})
export default store;
interface ErrorResponse {
  response: {
    data: {
      message: string
    }
  }
}

interface UserData {
  username: string,
  email: string,
  _id: string,
  roles: { _id: string, name: string }[],
  accessToken: string,
  refreshToken: string,
  exp: number
}