import Cookies from 'js-cookie'

export function setCookies(key, value, expiresDay) {
  return Cookies.set(key, value, { expires: expiresDay })
}

export function getCookies(key) {
  return Cookies.get(key)
}

export function delCookies(key) {
  return Cookies.remove(key)
}
