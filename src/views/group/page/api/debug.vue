<template>
  <el-card class="box-card">
    <el-container>
      <el-header  style="height: 20px;line-height: 20px">
        <h3>接口调试-{{title}}[{{version}}]</h3>
        <router-link :to="{name:'groupDetail',params:{apiId:apiId}}">
        <el-button style="float: right;" type="primary" >接口详情</el-button>
        </router-link>
      </el-header>
      <el-main>
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" style="margin-top: 50px" class="ruleForm">
          <el-form-item class="debug">
              <el-col :md="16" :lg="18">
                  <el-row>
                    <el-col :span="4">
                      <el-select class="debug-select" v-model="form.requestMethod" size="small" :disabled="true" >
                        <el-option label="GET" value="GET"></el-option>
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="PUT" value="PUT"></el-option>
                        <el-option label="DELETE" value="DELETE"></el-option>
                        <el-option label="HEAD" value="HEAD"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="8">
                      <el-select v-model="selectedUri" size="small" style="width: 100%" @change="defaultSelectedIp">
                        <el-option
                          v-for="(v,k) in  gatwayRequestUriOptions"
                          :key="k"
                          :label="k+' : '+v.value"
                          :value="k">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="8">
                      <el-input v-model="form.requestPath" size="small" :disabled="true"></el-input>
                    </el-col>
                  </el-row>
              </el-col>
              <el-col :md="4" :lg="2">
                <el-row :gutter="50">
                  <el-col :span="12">
                    <el-button type="primary"  size="small" @click="run">发送</el-button>
                  </el-col>
                  <permission-check :route-info="$route" component-name="testAdd">
                  <el-col :span="12">
                    <el-button type="primary"  size="small" @click="saveButtonStatus=true">保存</el-button>
                  </el-col>
                  </permission-check>
                </el-row>
            </el-col>
          </el-form-item>
          <el-form-item label="设定后端服务IP" label-width="110px" v-show="false">
            <el-row :gutter="2">
              <el-col :span="12">
                <el-select v-model="form.selectedIp" placeholder="请选择" size="small">
                  <el-option
                    v-for="(v,k) in ips[selectedUri]"
                    :key="k"
                    :label="v"
                    :value="v">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="认证">
            <el-switch
              v-model="form.auth"
              disabled>
            </el-switch>
          </el-form-item>
          <el-form-item label="签名">
            <el-switch
              v-model="form.sign"
              disabled>
            </el-switch>
          </el-form-item>
          <el-form-item class="debug">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="PATH PARAMETERS" v-if="form.path.length>0" name="1">

                <el-row :gutter="20" v-for="(v,index) in form.path" :key="index" class="response-params">
                  <el-col :span="4">
                    <el-row :gutter="4">
                      <el-col :span="24">
                        <el-input
                          placeholder="参数"
                          v-model="v.name"
                          :disabled="true"
                          size="small">
                        </el-input>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="0.5">
                    =
                  </el-col>
                  <el-col :span="13">
                    <el-input v-model="v.example" placeholder="参数值" size="small"></el-input>
                  </el-col>
                </el-row>

              </el-collapse-item>
              <el-collapse-item title="QUERY PARAMETERS"  v-if="form.query.length>0" name="2">
                <el-row :gutter="20"  v-for="(v,index) in form.query" :key="index"  class="response-params">
                  <el-col :span="4">
                    <el-row :gutter="4">
                      <el-col :span="23">
                        <el-input
                          placeholder="参数"
                          v-model="v.name"
                          :disabled="true"
                          size="small">
                        </el-input>
                      </el-col>
                      <el-col :span="1">
                        <el-checkbox v-model="v.required" :disabled="true"></el-checkbox>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="0.5">
                    =
                  </el-col>
                  <el-col :span="13">
                    <el-input v-model="v.example" placeholder="参数值" size="small"></el-input>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="HEADER"  v-if="form.header.length>0" name="3">
                <el-row :gutter="20"  v-for="(v,index) in form.header" :key="index" class="response-params">
                  <el-col :span="4">
                    <el-row :gutter="4">
                      <el-col :span="24">
                        <el-input
                          placeholder="参数"
                          v-model="v.name"
                          :disabled="true"
                          size="small">
                        </el-input>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="0.5">
                    =
                  </el-col>
                  <el-col :span="13">
                    <el-input v-model="v.value" placeholder="参数值" size="small"></el-input>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="BODY" name="4">
                <json-editor theme="neat"  ref="requestBody"  v-model="form.body"></json-editor>
              </el-collapse-item>


            </el-collapse>

          </el-form-item>
        </el-form>
        <el-menu default-active="1" class="Response" mode="horizontal">
          <el-menu-item index="1">Response</el-menu-item>
        </el-menu>
        <el-alert
          v-show="form.response.status>0"
          :type="form.response.type"
          :title="String(form.response.status)"
          show-icon class="response-status"
          :closable="false">
          <div>{{ form.response.msg }}</div>
          <div class="response-time" v-show="false">{{ form.response.time }} s</div>
        </el-alert>
        <el-row :gutter="20" class="response-body">
          <el-col :span="8">
            <h4>headers</h4>
              <json-editor theme="neat" :line-numbers="false"   v-model="form.response.header"  :readOnly="true"></json-editor>
          </el-col>
          <el-col :span="16">
            <h4>Body</h4>
              <json-editor theme="neat" v-model="form.response.body"  :readOnly="true" ></json-editor>

          </el-col>
        </el-row>
      </el-main>
      <el-dialog
        title="保存到…"
        :visible.sync="saveButtonStatus"
        width="30%">
        <el-form ref="saveForm" :model="saveForm" label-width="120px">
          <el-form-item label="用例名">
            <el-input v-model="saveForm.name"></el-input>
          </el-form-item>
          <el-form-item label="将此用例保存到">
            <el-select v-model="saveForm.collect" placeholder="请选择活动区域" style="display:inline">
              <el-option v-for="(item, index) in collectList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="saveButtonStatus = false">取 消</el-button>
    <el-button type="primary" @click="saveData">保 存</el-button>
  </span>
      </el-dialog>

    </el-container>
  </el-card>
</template>

<script>
  import Bus from '@/components/bus'
  import { getObject } from '@/api/object'
  import { getApiRunInfo, runs, getTestRunInfo, saveRunApi, updateRunApi } from '@/api/api'
  import { pathParamsEncode } from '@/utils/url'
  import { getTestCollectMenu } from '@/api/menu'
  import JsonEditor from '@/components/Editor'
  import { requestPamramsToPostMan } from '@/utils/object'
  export default {
    name: 'debug',
    data() {
      return {
        id: this.$route.params.id,
        apiId: this.$route.params.apiId ? this.$route.params.apiId / 1 : 0,
        testId: this.$route.params.testId ? this.$route.params.testId / 1 : 0,
        title: '',
        version: '',
        form: {
          requestMethod: '',
          requestUri: '',
          requestPath: '',
          selectedIp: '',
          path: [],
          query: [],
          header: [],
          body: {},
          response: {
            header: {},
            body: {},
            status: 0,
            type: 'success',
            msg: '',
            time: 0
          },
          auth: false,
          sign: false
        },
        selectedUri: 'test',
        requestUriOptions: {
          test: { value: ''
          },
          beta: { value: ''
          },
          online: { value: ''
          }
        },
        gatwayRequestUriOptions: {
          test: { value: 'test'
          },
          beta: { value: 'beta'
          },
          online: { value: 'online'
          }
        },
        ips: {
          test: [],
          beta: [],
          online: []
        },
        rules: {},
        activeNames: ['1', '2', '3', '4'],
        saveButtonStatus: false,
        saveForm: {
          name: '',
          collect: 0
        },
        save: {
          name: '',
          method: '',
          path: '',
          env: '',
          test_id: this.$route.params.testId ? this.$route.params.testId : '0',
          server_ip: '',
          project_id: this.$route.params.id,
          collect_id: '',
          api_id: this.$route.params.apiId ? this.$route.params.apiId : '0',
          request: {},
          response: {},
          backend_name: '',
          status: '',
          error: '',
          version: ''
        },
        baseInfo: {},
        apiInfo: {},
        collectList: []

      }
    },
    components: {
      JsonEditor
    },
    created() {
      Bus.$emit('side-tab-select', 'test')
      this.fetchData()
    },
    methods: {
      requestBody(data) {
        this.form.body = data
      },

      defaultSelectedIp() {
        this.form.requestUri = this.requestUriOptions[this.selectedUri].value
        this.form.selectedIp = this.ips[this.selectedUri][0] ? this.ips[this.selectedUri][0] : ''
      },
      getObject() {
        return new Promise((resolve, reject) => {
          getObject(this.id).then(response => {
            this.save.backend_name = response.backend_name
            this.baseInfo = response
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      getApiRunInfo() {
        return new Promise((resolve, reject) => {
          if (this.testId > 0) {
            getTestRunInfo(this.testId).then(response => {
              this.form.response.status = response.status
              this.form.response.msg = response.error
              if (response.status > 200) {
                this.form.response.type = 'error'
              } else {
                this.form.response.type = 'success'
              }
              this.apiInfo = response
              this.title = response.name
              this.apiId = response.api_id
              this.version = response.version
              resolve()
            }).catch(error => {
              reject(error)
            })
          } else {
            getApiRunInfo(this.apiId).then(response => {
              this.apiInfo = response
              this.title = response.name
              this.version = response.version
              resolve()
            }).catch(error => {
              reject(error)
            })
          }
        })
      },
      getTestCollectMenu() {
        return new Promise((resolve, reject) => {
          getTestCollectMenu(this.id).then(response => {
            this.collectList = response
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      fetchData() {
        this.getObject().then(() => {
          this.getApiRunInfo().then(() => {
            const testData = this.baseInfo.test_servers
            const betaData = this.baseInfo.beta_servers
            const onlineData = this.baseInfo.prod_servers
            this.requestUriOptions.test = {
              value: testData.domain
            }
            this.requestUriOptions.beta = {
              value: betaData.domain
            }
            this.requestUriOptions.online = {
              value: onlineData.domain
            }
            this.ips.test = testData.servers
            this.ips.beta = betaData.servers
            this.ips.online = onlineData.servers

            this.saveForm.name = this.apiInfo.name
            this.form.requestMethod = this.save.method = this.apiInfo.method
            this.save.path = this.apiInfo.path

            this.form.requestPath = '/' + this.baseInfo.backend_name + this.apiInfo.path

            this.form.path = this.apiInfo.request.path
            this.form.sign = (function(sign) {
              sign === 1 ? sign = true : sign = false
              return sign
            }(this.apiInfo.is_sign))
            this.form.auth = (function(auth) {
              auth === 1 ? auth = true : auth = false
              return auth
            }(this.apiInfo.is_auth))
            this.form.query = (function(query) {
              for (const elem of query) {
                elem.required === '1' ? elem.required = true : elem.required = false
              }
              return query
            }(this.apiInfo.request.query))

            this.form.header = this.apiInfo.request.header
            this.form.body = this.apiInfo.request.body
            this.form.response.header = this.apiInfo.response ? this.apiInfo.response.header : {}
            this.form.response.body = this.apiInfo.response ? this.apiInfo.response.body : {}
            this.save.api_id = this.apiInfo.api_id
            if (this.testId > 0) {
              this.selectedUri = this.apiInfo.env
              this.saveForm.collect = this.apiInfo.collect_id
              this.form.requestUri = this.requestUriOptions[this.selectedUri].value
              this.form.selectedIp = this.apiInfo.server_ip
            } else {
              this.defaultSelectedIp()
            }
          })
        })
        this.getTestCollectMenu()
      },
      run() {
        const data = {
          path: pathParamsEncode(this.form.requestPath, this.form.path),
          method: this.form.requestMethod,
          server_ip: this.form.selectedIp,
          version: this.version,
          is_sign: (function(sign) {
            sign === true ? sign = 1 : sign = 0
            return sign
          }(this.form.sign)),
          is_auth: (function(auth) {
            auth === true ? auth = 1 : auth = 0
            return auth
          }(this.form.auth)),
          host: this.form.requestUri,
          body: this.form.body,
          query: requestPamramsToPostMan(this.form.query),
          header: requestPamramsToPostMan(this.form.header, 'header'),
          env: this.selectedUri
        }
        runs(data).then((response) => {
          this.save.status = response.status
          this.save.error = response.message
          this.form.response.status = response.status
          this.form.response.msg = response.message
          this.form.response.body = response.body
          this.form.response.header = response.header
          this.form.response.time = response.time
          if (response.status > 200) {
            this.form.response.type = 'error'
          } else {
            this.form.response.type = 'success'
          }
          document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight
        })
      },
      saveData() {
        this.save.server_ip = this.form.selectedIp
        this.save.env = this.selectedUri
        this.save.name = this.saveForm.name
        this.save.collect_id = this.saveForm.collect
        this.save.request.path = this.form.path
        this.save.request.header = this.form.header
        this.save.version = this.version
        this.save.api_id = this.apiId
        this.save.request.query = (function(query) {
          for (const elem of query) {
            elem.required === true ? elem.required = '1' : elem.required = '0'
          }
          return query
        }(this.form.query))
        this.save.request.body = this.form.body
        this.save.response.header = this.form.response.header
        this.save.response.body = this.form.response.body
        if (this.testId > 0) {
          updateRunApi(this.testId, this.save).then((response) => {
            if (response.status === 1) {
              this.$notify.success({
                title: '成功',
                message: response.message
              })
              location.reload()
            } else {
              this.$notify.error({
                title: '失败',
                message: response.message
              })
            }
            this.saveButtonStatus = false
          })
        } else {
          saveRunApi(this.save).then((response) => {
            if (response.status === 1) {
              this.$notify.success({
                title: '成功',
                message: response.message
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: response.message
              })
            }
            this.saveButtonStatus = false
          })
        }
      }
    }
  }
</script>

<style>
.debug > .el-form-item__content{
  margin-left: 0 !important;
}
.response-body h4{
  margin: 20px 0;
}
.response-status{
    margin: 5px 0;
  position: relative;


}
.el-header h3{
  float: left;
  margin: 0;
}
.response-status .el-alert__title{
  font-size:20px
}
.response-params{
    line-height: 32px;
    margin: 10px 0;
  }
.response-time{
  position: absolute;
  top:10px;
  right: 20px;

}
</style>
