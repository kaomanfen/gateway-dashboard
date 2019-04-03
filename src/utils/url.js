export function pathParamsEncode(url, params) {
  for (const elem of params) {
    url = url.replace('{' + elem.name + '}', elem.example)
  }
  return url
}
