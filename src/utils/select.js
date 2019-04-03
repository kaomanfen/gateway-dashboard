export function getGroupSelect() {
  const selectItem = localStorage.getItem('groupSelect')
  if (selectItem !== undefined && selectItem !== 'undefined') {
    return JSON.parse(selectItem)
  } else {
    return {}
  }
}
export function getAppSelect() {
  const selectItem = localStorage.getItem('appSelect')
  if (selectItem !== undefined && selectItem !== 'undefined') {
    return JSON.parse(selectItem)
  } else {
    return {}
  }
}

export function setSelect(key, value) {
  return localStorage.setItem(key, JSON.stringify(value))
}

export function delSelect(key) {
  return localStorage.removeItem(key)
}
