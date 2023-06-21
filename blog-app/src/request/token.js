export function getToken() {
  return localStorage.token
}

export function setToken(token) {
  console.log("settoken\n")
  return localStorage.token = token
}

export function removeToken() {
  return localStorage.removeItem('token')
}