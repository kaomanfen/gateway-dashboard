<template>
  <div>
    <el-row>
      <el-col>
        显示JSON-SCHEMA:
        <el-switch v-model="showJsonSchema"></el-switch>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button type="primary" size="mini" @click="importJsonDialogVisible=true">导入 json</el-button>
      </el-col>
    </el-row>
    <div class="custom-tree-container" v-show="showJsonSchema===false">
      <div class="block">
        <el-tree
          class="jsTree"
          :data="data5"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
          <el-row slot-scope="{ node, data }" :gutter="10" style="width: 100%;">
            <el-col :span="10">
              <el-row :gutter="10">
                <el-col :span="22">
                  <el-input
                    placeholder="请输入内容"
                    v-model="data.label"
                    v-if="data.label==='root' && node.level===1 || data.label==='items' && node.parent.data.value2==='array'"
                    size="small"
                    :disabled="true">
                  </el-input>
                  <el-input
                    placeholder="请输入内容"
                    v-model="data.label"
                    v-else
                    size="small">
                  </el-input>
                </el-col>
                <el-col :span="2" class="add-tree-require">
                  <el-checkbox v-model="data.checked" size="small"></el-checkbox>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4" class="add-tree-pl">
              <el-select v-model="data.value2" clearable default-first-option placeholder="请选择"
                         @change="() => change(data)" size="small">
                <el-option
                  v-for="item in data.option"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="add-tree-pl">
              <el-input
                placeholder="description"
                v-model="data.description" size="small">
                <i slot="suffix" class="el-input__icon el-icon-edit" @click="()=>showDialog(data)"></i>
              </el-input>
            </el-col>
            <el-col :span="1" class="add-tree-editor">
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)" v-if="data.value2 !=='object'">
                x
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => append(data)" v-if="data.value2=='object'">
                +
              </el-button>

            </el-col>
          </el-row>
        </el-tree>
      </div>
      <el-dialog
        title="Description"
        :visible.sync="editor.dialogVisible"
        width="30%">
        <el-input type="textarea" v-model="editor.content"></el-input>
        <span slot="footer" class="dialog-footer">
      <el-button @click="editor.dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="()=>closeDialog()">确 定</el-button>
    </span>
      </el-dialog>
      <el-dialog
        title="导入 json"
        :visible.sync="importJsonDialogVisible"
        width="30%"
        >
        <el-tabs v-model="importBy" >
          <el-tab-pane  label="JSON" name="json">
            <json-editor theme="neat"  v-model="importJson"></json-editor>
          </el-tab-pane>
          <el-tab-pane label="JSON-SCHEMA" name="json-schema">
            <json-editor theme="neat"  v-model="importJsonSchema"></json-editor>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
    <el-button @click="importJsonDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="importDataBy">确 定</el-button>
  </span>
      </el-dialog>

    </div>
    <json-editor theme="neat"  :readOnly="true" v-model="schema" v-show="showJsonSchema"></json-editor>
  </div>

</template>
<script>
import JsonEditor from '@/components/Editor/index'
import GenerateSchema from 'generate-schema'
export default {
  name: 'SchemaEditor',
  components: { JsonEditor },
  props: ['value'],
  data() {
    const data = [
      {
        id: 0,
        label: 'root',
        checked: false,
        option: [
          {
            value: 'string',
            label: 'string'
          },
          {
            value: 'number',
            label: 'number'
          },
          {
            value: 'array',
            label: 'array'
          },
          {
            value: 'object',
            label: 'object'
          },
          {
            value: 'boolean',
            label: 'boolean'
          },
          {
            value: 'integer',
            label: 'integer'
          }
        ],
        children: [],
        value2: 'object',
        description: ''
      }
    ]
    const editor = {
      id: -1,
      content: 'Description',
      dialogVisible: false
    }
    const schema = {}
    const jsondata = []
    return {
      data5: JSON.parse(JSON.stringify(data)),
      editor: JSON.parse(JSON.stringify(editor)),
      schema: JSON.parse(JSON.stringify(schema)), // 提交的数据格式
      jsondata: JSON.parse(JSON.stringify(jsondata)), // 组件加载的数据格式
      showJsonSchema: false,
      edit: false,
      id: 0,
      importJsonDialogVisible: false,
      importBy: 'json',
      importJson: {},
      importJsonSchema: {}
    }
  },

  created() {

  },
  mounted() {
    if (Object.keys(this.value).length === 0) {
      return
    }
    this.id = 10000
    const dataTmp = this.data5
    dataTmp[0] = this.tojson('root', this.value, [])
    this.data5 = JSON.parse(JSON.stringify(dataTmp))
  },
  methods: {
    append(data) {
      const newChild = {
        id: this.id++,
        label: 'feild_' + this.id,
        option: [
          {
            value: 'string',
            label: 'string'
          },
          {
            value: 'number',
            label: 'number'
          },
          {
            value: 'array',
            label: 'array'
          },
          {
            value: 'object',
            label: 'object'
          },
          {
            value: 'boolean',
            label: 'boolean'
          },
          {
            value: 'integer',
            label: 'integer'
          }
        ],
        value2: 'string',
        description: '',
        children: []
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    change(data) {
      // if(data.value2!='object'){
      data.children = []
      // }
      if (data.value2 === 'array') {
        const newChild = {
          label: 'items',
          option: [
            {
              value: 'string',
              label: 'string'
            },
            {
              value: 'number',
              label: 'number'
            },
            {
              value: 'array',
              label: 'array'
            },
            {
              value: 'object',
              label: 'object'
            },
            {
              value: 'boolean',
              label: 'boolean'
            },
            {
              value: 'integer',
              label: 'integer'
            }
          ],
          value2: 'string',
          desription: '',
          children: []
        }

        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      }
    },
    showDialog(data) {
      this.editor.id = data.id
      this.editor.content = data.description
      this.editor.dialogVisible = true
    },
    closeDialog() {
      console.log(this.editor.content)
      this.editor.dialogVisible = false
      this.data5[0].description = this.editor.content
    },
    changeFormat(data) {
      // 这个是固定的返回结果
      var result = {
        'properties': {},
        'required': []
      }

      // 循环当前的data
      data.forEach(element => {
        // 这里面的都应该属于上个子集的数据
        // 定义一个返回结果的对象
        // console.log(data[])
        var loop_tmp = {}
        loop_tmp['type'] = element['value2'] // 这个是返回类型的
        loop_tmp['description'] = element['description']
        if (element['checked'] === true && element.value2 !== 'object') {
          result['required'].push(element['label'])
        }
        // 然后判断是否存在新的子集
        if (element['children'] && element['children'].length > 0) {
          var tmp = this.changeFormat(element['children'])
          if (element['value2'] === 'array') {
            loop_tmp['items'] = tmp['properties']['items']
          } else {
            loop_tmp['properties'] = tmp['properties']
          }
          loop_tmp['required'] = tmp['required']
        }
        result['properties'][element['label']] = loop_tmp
      })
      return result
    },
    tojson(name, data, required) {
      var id = 0
      //
      function toSchema(name, data, required) {
        var result = {
          'value2': data['type'],
          'description': data['description'],
          'id': id,
          'checked': false,
          'option': [
            {
              value: 'string',
              label: 'string'
            },
            {
              value: 'number',
              label: 'number'
            },
            {
              value: 'array',
              label: 'array'
            },
            {
              value: 'object',
              label: 'object'
            },
            {
              value: 'boolean',
              label: 'boolean'
            },
            {
              value: 'integer',
              label: 'integer'
            }
          ],
          'label': name,
          'children': []
        }
        id++
        if (required.indexOf(name) !== -1) {
          result['checked'] = true
        }
        if (data['type'] === 'array') {
          result.children.push(toSchema('items', data['items'], data['required'] ? data['required'] : []))
        }
        if (data['properties']) {
          for (var field_name in data['properties']) {
            var loop_data = data['properties'][field_name]
            result.children.push(toSchema(field_name, loop_data, data['required'] ? data['required'] : []))
          }
        }
        return result
      }

      return toSchema(name, data, required)
    },
    importDataBy() {
      if (this.importBy === 'json-schema') {
        const dataTmp = this.data5
        dataTmp[0] = this.tojson('root', this.importJsonSchema, [])
        this.data5 = JSON.parse(JSON.stringify(dataTmp))
      }
      if (this.importBy === 'json') {
        let schema = null
        schema = GenerateSchema.json('empty object', this.importJson)
        const dataTmp = this.data5
        dataTmp[0] = this.tojson('root', schema, [])
        this.data5 = JSON.parse(JSON.stringify(dataTmp))
      }
      this.importJsonDialogVisible = false
    }
  },
  watch: {
    data5: {
      handler: function(val, oldVal) {
        this.schema = this.changeFormat(val).properties.root
        this.$emit('input', this.schema)
        this.jsondata[0] = this.tojson('root', this.schema, [])
      },
      deep: true
    }
  }
}
</script>

<style >
.jsTree .el-tree-node__content{
  margin: 5px 0;
}
</style>
