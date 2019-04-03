<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="100px" style="margin-top: 50px" class="ruleForm">
    <el-form-item label="版本号" prop="version">
      <el-row>
        <el-col :span="5">
          <el-input v-model.number="form.version" disabled>
            <template slot="prepend">v</template>
          </el-input>
        </el-col>
      </el-row>

    </el-form-item>
    <el-form-item label="请求path" prop="path">
      <el-row>
        <el-col :span="3">
          <el-select class="frc-select" @change="selectRequestMethod" v-model="form.requestMethod"  placeholder="请选择" >
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
            <el-option label="DELETE" value="DELETE"></el-option>
            <el-option label="HEAD" value="HEAD"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input :placeholder="form.backendName" disabled></el-input>
        </el-col>
        <el-col :span="18">
          <el-input placeholder="接口路径" v-model="form.path" class="input-with-select" @input="pathChange"></el-input>
        </el-col>
      </el-row>

      <span>请求Path必须包含请求参数中的Parameter Path，包含在{}中，比如/getUserInfo/{userId}</span>
    </el-form-item>
  <el-form-item label="请求参数">
    <div class="frc-radio-group">
      <el-radio-group  v-model="activeTab" >
        <el-radio-button v-for="(item,index) in radioGroup" :key="index" :label="index">{{ item }}</el-radio-button>
      </el-radio-group>
    </div>
    <el-tabs class="frc-tab" v-model="activeTab">
      <el-tab-pane label="Path" name="1">
        <el-row :gutter="5" v-for="(item,index) in form.pathGroup" :key="index">
          <el-col :span="4">
            <el-input size="small" placeholder="地址参数" v-model="item.name" style="margin-top: 5px" :disabled="true"></el-input>
          </el-col>
          <el-col :span="10">
            <el-form-item :prop="'pathGroup['+index+'].example'"  :rules="{
      required: true, message: '参数示例不能为空', trigger: 'blur'
    }">
              <el-input
                type="textarea"
                :rows="1"
                placeholder="参数示例"
                v-model="item.example"
              >
              </el-input>
            </el-form-item>

          </el-col>
          <el-col :span="10">
            <el-form-item  :prop="'pathGroup['+index+'].desc'"  :rules="{
      required: true, message: '备注不能为空', trigger: 'blur'
    }">
              <el-input
                type="textarea"
                :rows="1"
                placeholder="备注"
                v-model="item.desc"
              >
              </el-input>
            </el-form-item>

          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Header" name="2">
        <el-button type="primary" size="mini" @click="addHeader">添加Header</el-button>
        <el-row :gutter="7" v-for="(item,index) in form.headerGroup" :key="index">
          <el-col :span="4">
            <el-autocomplete
              size="small"
              style="margin-top: 4px"
              class="inline-input"
              v-model="item.name"
              :fetch-suggestions="querySearch"
              placeholder="请选择或输入"
            >
            </el-autocomplete>
          </el-col>
          <el-col :span="6">
            <el-input
              type="textarea"
              :rows="1"
              placeholder="参数值"
              v-model="item.value"
            >
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-input
              type="textarea"
              :rows="1"
              placeholder="备注"
              v-model="item.desc"
            >
            </el-input>
          </el-col>
          <el-col :span="1">
            <el-button type="text" @click="removeHeader(item)"><i class="el-icon-delete" ></i></el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Query" name="3">
        <el-button type="primary" size="mini" @click="addQuery">添加Query</el-button>
        <el-row :gutter="7" v-for="(item,index) in form.queryGroup" :key="index">
          <el-col :span="5">
            <el-input
              type="textarea"
              :rows="1"
              placeholder="参数名称"
              v-model="item.name"
            >
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="item.required" size="small" style="margin-top: 5px">
              <el-option label="必须" value="1"></el-option>
              <el-option label="非必须" value="0"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input
              type="textarea"
              :rows="1"
              placeholder="参数示例"
              v-model="item.example"
            >
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-input
              type="textarea"
              :rows="1"
              placeholder="备注"
              v-model="item.desc"
            >
            </el-input>
          </el-col>
          <el-col :span="1">
            <el-button type="text" @click="removeQuery(item)"><i class="el-icon-delete" ></i></el-button>
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="Body" name="4">
        <el-radio-group v-model="bodyType">
          <el-radio :label="1">json</el-radio>
        </el-radio-group>
        <schema-editor v-if="form.bodyGroup" v-model="form.bodyGroup"></schema-editor>
      </el-tab-pane>
    </el-tabs>
  </el-form-item>
    <el-form-item>
      <el-button  style="margin-top: 12px;" @click="previous">上一步</el-button>
      <el-button  style="margin-top: 12px;" type="primary" @click="next('form')">下一步</el-button>
      <el-button v-if="editType" style="margin-top: 12px;" type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import SchemaEditor from '@/components/SchemaEditor'
  export default {
    name: 'frontEndConfig',
    props: ['value', 'editType'],
    components: {
      SchemaEditor
    },
    data() {
      return {
        form: this.value,
        radioGroup: {
          1: 'Path',
          2: 'Header',
          3: 'Query',
          4: 'Body'
        },
        textarea: '',
        activeTab: '1',
        bodyType: 1,
        HttpRequestHeader: [
          { 'value': 'Accept' },
          { 'value': 'Accept-Charset' },
          { 'value': 'Accept-Encoding' },
          { 'value': 'Accept-Language' },
          { 'value': 'Accept-Datetime' },
          { 'value': 'Authorization' },
          { 'value': 'Cache-Control' },
          { 'value': 'Connection' },
          { 'value': 'Cookie' },
          { 'value': 'Content-Disposition' },
          { 'value': 'Content-Length' },
          { 'value': 'Content-MD5' },
          { 'value': 'Content-Type' },
          { 'value': 'Date' },
          { 'value': 'Expect' },
          { 'value': 'From' },
          { 'value': 'Host' },
          { 'value': 'If-Match' },
          { 'value': 'If-Modified-Since' },
          { 'value': 'If-None-Match' },
          { 'value': 'If-Range' },
          { 'value': 'If-Unmodified-Since' },
          { 'value': 'Max-Forwards' },
          { 'value': 'Origin' },
          { 'value': 'Pragma' },
          { 'value': 'Proxy-Authorization' },
          { 'value': 'Range' },
          { 'value': 'Referer' },
          { 'value': 'TE' },
          { 'value': 'User-Agent' },
          { 'value': 'Upgrade' },
          { 'value': 'Via' },
          { 'value': 'Warning' },
          { 'value': 'X-Requested-With' },
          { 'value': 'DNT' },
          { 'value': 'X-Forwarded-For' },
          { 'value': 'X-Forwarded-Host' },
          { 'value': 'X-Forwarded-Proto' },
          { 'value': 'Front-End-Https' },
          { 'value': 'X-Http-Method-Override' },
          { 'value': 'X-ATT-DeviceId' },
          { 'value': 'X-Wap-Profile' },
          { 'value': 'Proxy-Connection' },
          { 'value': 'X-UIDH' },
          { 'value': 'X-Csrf-Token' }
        ],
        rules: {
          path: [
            { required: true, message: '请填写路径', trigger: 'blur' },
            { pattern: /^\/.+/, message: '路径必须以 "/" 开始', trigger: 'blur' }
          ],
          version: [
            { required: true, message: '请填写版本号', trigger: 'blur' },
            { type: 'number', message: '版本号必须是数字', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.selectRequestMethod(this.value.requestMethod)
    },
    methods: {
      selectRequestMethod(requestMethod) {
        if (requestMethod === 'GET' || requestMethod === 'HEAD') {
          this.radioGroup = {
            1: 'Path',
            2: 'Header',
            3: 'Query'
          }
        } else {
          this.radioGroup = {
            1: 'Path',
            2: 'Header',
            3: 'Query',
            4: 'Body'
          }
        }
      },
      pathChange(data) {
        const regex = /\{(.+?)\}/gm
        const matches = []
        let match = {}
        while ((match = regex.exec(data))) {
          matches.push(match[1])
        }
        this.form.pathGroup = []
        for (const [index, value] of matches.entries()) {
          this.$set(this.form.pathGroup, index, { name: value, example: '', desc: '' })
        }
      },
      addHeader() {
        this.form.headerGroup.push({
          name: '',
          value: '',
          example: '',
          desc: ''
        })
      },
      removeHeader(item) {
        var index = this.form.headerGroup.indexOf(item)
        if (index !== -1) {
          this.form.headerGroup.splice(index, 1)
        }
      },
      addQuery() {
        this.form.queryGroup.push({
          name: '',
          required: '1',
          example: '',
          desc: ''
        })
      },
      removeQuery(item) {
        var index = this.form.queryGroup.indexOf(item)
        if (index !== -1) {
          this.form.queryGroup.splice(index, 1)
        }
      },
      previous() {
        this.$emit('active-num', 0)
        this.$emit('input', this.form)
      },
      next(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$emit('active-num', 2)
            this.$emit('input', this.form)
          } else {
            return false
          }
        })
      },
      submit() {
        this.$emit('input', this.form)
        this.$emit('submit', true)
      },
      querySearch(queryString, cb) {
        var results = queryString ? this.HttpRequestHeader.filter(this.createFilter(queryString)) : this.HttpRequestHeader
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter(queryString) {
        return (httpRequestHeaders) => {
          return (httpRequestHeaders.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      }
    }
  }
</script>

<style>

  .frc-tab>.el-tabs__header{
    display: none;
  }
  .frc-radio-group{
    text-align: center;
  }
  .frc-tab .el-form-item__error{
    position: relative;
  }

</style>
