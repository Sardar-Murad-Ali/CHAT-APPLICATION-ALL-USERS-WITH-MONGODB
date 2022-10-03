
import axios from "axios"


let token=localStorage.getItem("token")
// console.log(token) 

const authFetch = axios.create({
    baseURL: '/api/v1',
  })
  // request

  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common['Authorization'] = `Bearer ${token}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  // response

  authFetch.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // console.log(error.response)
      // if (error.response.status === 401) {
      //   logoutUser()
      // }
      return Promise.reject(error)
    }
  )


  export {authFetch}