/**
 *  搜索
 * @param {array|object} source 源数据
 * @param {float|int} param 需要搜索的项
 * @param {string} data 搜索内容
 * @return {array|object}
 */
export function baseSearch(source, param, data) {
  let arrByZM

  if (Array.isArray(source)) {
    arrByZM = []
    if (source.length === 0) {
      return arrByZM
    }
    for (const [index, elem] of source.entries()) {
      if (elem[param].search(data) !== -1) {
        // 判断输入框中的值是否可以匹配到数据，如果匹配成功
        arrByZM[index] = elem
        // 向空数组中添加数据
      }
    }
  }

  if (Object.prototype.toString.call(source) === '[object Object]') {
    arrByZM = {}
    if (Object.keys(source).length === 0) {
      return arrByZM
    }
    for (const [index, elem] of Object.entries(source)) {
      if (elem[param].search(data) !== -1) {
        // 判断输入框中的值是否可以匹配到数据，如果匹配成功
        arrByZM[index] = elem
        // 向空对象中添加数据
      }
    }
  }

  return arrByZM
}

export function firstObj(source) {
  let firstArr
  if (Array.isArray(source)) {
    firstArr = []
    if (source.length === 0) {
      return firstArr
    }
    firstArr = source.shift()
  }
  if (Object.prototype.toString.call(source) === '[object Object]') {
    firstArr = {}
    let firstKey = null
    if (Object.keys(source).length === 0) {
      return firstArr
    }

    firstKey = Object.keys(source)[0]
    firstArr[firstKey] = source[firstKey]
  }
  return firstArr
}

// json-schema 转 树形表对象
export function schemaObj(data, pid, depth, inRequired) {
  let id = pid
  const tmp = []

  if (data.type === 'array') {
    const pid = id
    id++
    const nowDepth = depth
    depth++
    const children = schemaObj(data.items, id, depth, data.required)
    tmp.push({ id: id, pid: pid, depth: nowDepth, name: '[items]', description: '此字段表示数组类型', type: data.type, children: children })
    return tmp
    // return this.schemaObj(data.items, id, nowDepth, data.required)
  }
  if (data.type === 'object' && data.properties) {
    const pid = id
    id++
    const nowDepth = depth
    depth++
    const children = schemaObj(data.properties, id, depth, data.required)
    tmp.push({ id: id, pid: pid, depth: nowDepth, name: '[items]', description: '此字段表示数组类型', type: data.type, children: children })
    return tmp
    // return this.schemaObj(data.properties, id, nowDepth, data.required)
  }
  if (data.type && data.type.type === undefined) {
    const pid = id
    id++
    const nowDepth = depth
    depth++
    tmp.push({ id: id, pid: pid, depth: nowDepth, name: '[items]', description: '此字段表示数组类型', type: data.type })
    return tmp
  }
  for (const [key, elem] of Object.entries(data)) {
    if (elem.type === 'object' && elem.properties) {
      id++
      const nowDepth = depth
      depth++
      const children = schemaObj(elem.properties, id, depth, elem.required)
      const required = inRequired ? (inRequired.indexOf(key) > -1 ? '是' : '否') : '否'
      tmp.push({ id: id, pid: pid, depth: nowDepth, required: required, name: key, description: elem.description, type: elem.type, children: children })
    } else if (elem.type === 'array' && elem.items) {
      const pid = id
      id++
      const nowDepth = depth
      depth++
      const children = schemaObj(elem.items, id, depth, elem.required)
      const required = inRequired ? (inRequired.indexOf(key) > -1 ? '是' : '否') : '否'
      tmp.push({ id: id, pid: pid, depth: nowDepth, required: required, name: key, description: elem.description, type: elem.type, children: children })
    } else {
      id++
      const required = inRequired ? (inRequired.indexOf(key) > -1 ? '是' : '否') : '否'
      tmp.push({ id: id, pid: pid, depth: depth, required: required, name: key, description: elem.description, type: elem.type })
    }
  }
  return tmp
}

// json-schema 转 数组 （只适用于一维）
export function schemaArray(data) {
  const result = []
  let required = []
  let properties = {}
  if (!data) {
    return result
  }
  if (data.required) {
    required = data.required
  }
  if (data.properties) {
    properties = data.properties
  }
  if (Object.keys(properties).length > 0) {
    for (const [index, elem] of Object.entries(properties)) {
      let checked = false
      if (required.indexOf(index) > -1) {
        checked = true
      }
      result.push({
        key: index,
        checked: checked,
        value: elem.examples ? elem.examples[0] : ''
      })
    }
  }
  return result
}
export function arraySchema(schema, data) {
  if (data.length === 0) {
    return {}
  }
  for (const elem of data) {
    const node = schema.properties[elem.key]
    if (elem.value === '') {
      continue
    }
    if (node.type === 'integer') {
      node.examples = [parseInt(elem.value)]
    } else {
      node.examples = [elem.value]
    }
  }
  return schema
}

export function value2Key(data, key, value) {
  const result = {}
  for (const elem of data) {
    result[elem[key]] = elem[value]
  }
  return result
}

export function requestPamramsToPostMan(data, type = 'query') {
  if (data.length === 0) {
    return []
  }
  const obj = {}
  data.forEach((item) => {
    if (type === 'header') {
      obj[item.name] = item.value
    } else {
      obj[item.name] = item.example
    }
  })
  return obj
}

export function isEmpty(data) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return true
    }
  }
  if (Object.prototype.toString.call(data) === '[object Object]') {
    if (Object.keys(data).length === 0) {
      return true
    }
  }
  return false
}
