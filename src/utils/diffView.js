const json5 = require('json5')

export function diffView(jsondiffpatch, formattersHtml, curDiffData) {
  const json5_parse = (json) => {
    if (typeof json === 'object' && json) return json
    try {
      console.log(json5.parse(json))
      return json5.parse(json)
    } catch (err) {
      return json
    }
  }

  const diffText = (left, right) => {
    left = left || ''
    right = right || ''
    if (left === right) {
      return null
    }
    var delta = jsondiffpatch.diff(left, right)
    return formattersHtml.format(delta, left)
  }

  const diffJson = (left, right) => {
    left = json5_parse(left)
    right = json5_parse(right)
    const delta = jsondiffpatch.diff(left, right)
    return formattersHtml.format(delta, left)
    // return '';
  }

  const valueMaps = {
    '1': '必需',
    '0': '非必需',
    'text': '文本',
    'file': '文件',
    'undone': '未完成',
    'done': '已完成'
  }

  const handleParams = (item) => {
    const newItem = Object.assign({}, item)
    // newItem._id = undefined

    Object.keys(newItem).forEach(key => {
      switch (key) {
        case 'required': newItem[key] = valueMaps[newItem[key]]; break
        case 'type': newItem[key] = valueMaps[newItem[key]]; break
      }
    })
    return newItem
  }

  const diffArray = (arr1, arr2) => {
    arr1 = arr1 || []
    arr2 = arr2 || []
    arr1 = arr1.map(handleParams)
    arr2 = arr2.map(handleParams)
    return diffJson(arr1, arr2)
  }

  let diffView = []

  if (curDiffData && typeof curDiffData === 'object' && curDiffData.current) {
    const { current, old } = curDiffData
    if (current.path !== old.path) {
      diffView.push({
        title: 'Api 路径',
        content: diffText(old.path, current.path)
      })
    }
    if (current.name !== old.name) {
      diffView.push({
        title: 'Api 名称',
        content: diffText(old.name, current.name)
      })
    }
    if (current.server_path !== old.server_path) {
      diffView.push({
        title: '后端路径',
        content: diffText(old.server_path, current.server_path)
      })
    }
    if (current.timeout !== old.timeout) {
      diffView.push({
        title: '后端超时',
        content: diffText(old.timeout, current.timeout)
      })
    }
    if (current.description !== old.description) {
      diffView.push({
        title: '备注',
        content: diffText(old.description, current.description)
      })
    }
    if (current.is_auth !== old.is_auth) {
      diffView.push({
        title: '认证',
        content: diffText(String(old.is_auth), String(current.is_auth))
      })
    }
    if (current.is_sign !== old.is_sign) {
      diffView.push({
        title: '签名',
        content: diffText(String(old.is_sign), String(current.is_sign))
      })
    }
    if (current.network !== old.network) {
      diffView.push({
        title: '网络',
        content: diffText(String(old.network), String(current.network))
      })
    }

    if (current.method !== old.method) {
      diffView.push({
        title: 'Method',
        content: diffText(old.method, current.method)
      })
    }

    if (current.category_id !== old.category_id) {
      diffView.push({
        title: '分类 id',
        content: diffText(old.category_id, current.category_id)
      })
    }

    if (current.status !== old.status) {
      diffView.push({
        title: '接口状态',
        content: diffText(valueMaps[old.status], valueMaps[current.status])
      })
    }
    const oldReq = old.request
    const currentReq = current.request
    diffView.push({
      title: 'Request Path Params',
      content: diffArray(oldReq.path, currentReq.path)
    })

    diffView.push({
      title: 'Request Query',
      content: diffArray(oldReq.query, currentReq.query)
    })

    diffView.push({
      title: 'Request Header',
      content: diffArray(oldReq.header, currentReq.header)
    })

    // let oldValue = current.req_body_type === 'form' ? old.req_body_form : old.req_body_other
    // if (current.req_body_type !== old.req_body_type) {
    //   diffView.push({
    //     title: 'Request Type',
    //     content: diffText(old.req_body_type, current.req_body_type)
    //   })
    //   oldValue = null
    // }
    diffView.push({
      title: 'Request Body',
      content: diffJson(oldReq.body, currentReq.body)
    })
    // if (current.req_body_type === 'json') {
    //   diffView.push({
    //     title: 'Request Body',
    //     content: diffJson(oldValue, current.req_body_other)
    //   })
    // } else if (current.req_body_type === 'form') {
    //   diffView.push({
    //     title: 'Request Form Body',
    //     content: diffArray(oldValue, current.req_body_form)
    //   })
    // } else {
    //   diffView.push({
    //     title: 'Request Raw Body',
    //     content: diffText(oldValue, current.req_body_other)
    //   })
    // }

    let oldResValue = old.response
    if (current.response_type !== old.response_type) {
      diffView.push({
        title: 'Response Type',
        content: diffText(old.response_type, current.response_type)
      })
      oldResValue = ''
    }

    if (current.response === 1) {
      diffView.push({
        title: 'Response Body',
        content: diffJson(oldResValue, current.response)
      })
    } else {
      diffView.push({
        title: 'Response Body',
        content: diffText(oldResValue, current.response)
      })
    }
  }
  diffView = diffView.filter(item => item.content)
  return diffView
}
