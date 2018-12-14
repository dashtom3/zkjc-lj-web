import axios from 'axios'
export default{
  baseUrl: 'http://47.105.102.248:8080/information/',
  success (obj, msg, url) {
    obj.$message({
      message: msg,
      type: 'success',
      duration: '1000',
      onClose: function () {
        if (url !== '') {
          obj.$router.push(url)
        }
      }
    })
  },
  error (obj, msg, url) {
    obj.$message({
      message: msg,
      duration: '1000',
      onClose: function () {
        if (url !== '') {
          obj.$router.push(url)
        }
      }
    })
  },
  httpGet(self,url,data){
    return new Promise((resolve, reject) => {
      axios.get(encodeURI(this.baseUrl + url + "?" + this.getHttpData(data))).then((res)=>{
          if(res.data.code == 200){
            resolve(res.data)
          }else {
            this.error(self,res.data.message,'')
            reject(res.data.message)
          }
      }).catch((res)=>{
        if(self.loading){
          self.loading = false
        }
        reject('网络错误')
      })
    })
  },
  httpGetWithToken(url,data){
    return new Promise((resolve, reject) => {
      axios.get(this.baseUrl + url + "?token="+this.getToken() + this.getHttpData(data)).then((res)=>{
        if(res.data.status == 1){
          resolve(res.data)
        }else {
          reject(res.data.message)
        }
      }).catch((res)=>{
        reject('网络错误')
      })
    })
  },
  httpPost(url,data){
    return new Promise((resolve, reject) => {
      axios.post(this.baseUrl + url,data).then((res)=>{
        if(res.data.status == 1){
          resolve(res.data)
        }else {
          reject(res.data.message)
        }
      }).catch((res)=>{
        reject('网络错误')
      })
    })
  },
  httpPostWithToken(url,data){
    return new Promise((resolve, reject) => {
      axios.post(this.baseUrl + url + "?token="+this.getToken(),data).then((res)=>{
        if(res.data.status == 1){
          resolve(res.data)
        }else {
          reject(res.data.message)
        }
      }).catch((error)=>{
        reject('网络错误')
      })
    })
  },
  getHttpData: function (data) {
    var temp = ''
    for (var i in data) {
      if (data[i] != null && data[i] !== 'null') {
        temp = temp + '&' + i + '=' + data[i]
      }
    }
    return temp
  },
  getToken: function () {
    return localStorage.getItem('cartoken')
  },
  setToken: function (token) {
    localStorage.setItem('cartoken', token)
  },
  getUser: function () {
    return JSON.parse(localStorage.getItem('caruser'))
  },
  setUser: function (caruser) {
    localStorage.setItem('caruser', JSON.stringify(caruser))
    this.setToken(caruser.token)
  },
  logout: function () {
    localStorage.removeItem('cyguser')
    localStorage.removeItem('cygtoken')
  }
}
