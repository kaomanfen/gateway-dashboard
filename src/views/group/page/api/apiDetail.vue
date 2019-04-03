<template>
  <el-card class="box-card">
    <el-container>
      <el-header style="height: 20px;line-height: 20px">
        <h3>基本信息</h3>
        <permission-check :route-info="$route" component-name="GroupUpdateApi">
            <router-link :to="{name:'GroupUpdateApi',params:{ apiId:  $route.params.apiId }}">
              <el-button style="float: right;margin: 0 5px" type="primary" size="mini">编辑</el-button>
            </router-link>
        </permission-check>
        <router-link :to="{ name: 'groupDebugApi', params: { apiId: $route.params.apiId }}">
          <el-button style="float: right;margin: 0 5px" type="primary" size="mini">调试</el-button>
        </router-link>
        <permission-check :route-info="$route" component-name="apiPublish">
          <el-button style="float: right;margin: 0 5px" type="primary" size="mini" @click="openDialogPublic">发布</el-button>
        </permission-check>
        <el-button style="float: right;margin: 0 5px" type="primary" size="mini" @click="returnGo">返回</el-button>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="4">
            所属服务
          </el-col>
          <el-col :span="4">
            {{ baseInfo.projectName }}
          </el-col>
          <el-col :span="4">
            分类
          </el-col>
          <el-col :span="4">
            {{ baseInfo.categoryName }}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            接口名称
          </el-col>
          <el-col :span="4">
            {{ baseInfo.name }}
          </el-col>
          <el-col :span="4">
            网络
          </el-col>
          <el-col :span="4">
            {{ baseInfo.netWork }}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            签名
          </el-col>
          <el-col :span="4">
            {{ baseInfo.isSign }}
          </el-col>
          <el-col :span="4">
            认证
          </el-col>
          <el-col :span="4">
            {{ baseInfo.isAuth }}
          </el-col>
          <el-col :span="4">
            Parent Id
          </el-col>
          <el-col :span="4">
            {{baseInfo.parentId}}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            描述
          </el-col>
          <el-col :span="10">
            {{ baseInfo.description }}
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-container>
      <el-header style="height: 20px;line-height: 20px">
        <h3>前端配置</h3>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="4">
            请求方法
          </el-col>
          <el-col :span="4">
            {{ frontEnd.method }}
          </el-col>
          <el-col :span="4">
            版本号
          </el-col>
          <el-col :span="4">
            {{ frontEnd.version }}
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="4">
            请求路径
          </el-col>
          <el-col :span="20">
            /{{frontEnd.backend_name}}{{ frontEnd.path }}
          </el-col>
        </el-row>
        <div v-if="frontEnd.request.path.length>0">
          <el-row :gutter="20">
            <el-col :span="12">
              路径参数
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-table
                :data="frontEnd.request.path"
                style="width: 100%;font-weight: normal"
                border>
                <el-table-column
                  prop="name"
                  label="参数名称	"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="example"
                  label="示例">
                </el-table-column>
                <el-table-column
                  prop="desc"
                  label="备注">
                </el-table-column>

              </el-table>
            </el-col>
          </el-row>
        </div>
        <div v-if="frontEnd.request.header.length>0">
          <el-row :gutter="20">
            <el-col :span="12">
              Headers
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-table
                :data="frontEnd.request.header"
                style="width: 100%;font-weight: normal"
                border>
                <el-table-column
                  prop="name"
                  label="参数名称	"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="value"
                  label="参数值">
                </el-table-column>
                <el-table-column
                  prop="example"
                  label="示例">
                </el-table-column>
                <el-table-column
                  prop="desc"
                  label="备注">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div v-if="frontEnd.request.query.length>0">
          <el-row :gutter="20">
            <el-col :span="12">
              Query
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-table
                :data="frontEnd.request.query"
                style="width: 100%;font-weight: normal"
                border>
                <el-table-column
                  prop="name"
                  label="参数名称	"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="required"
                  label="是否必须	">
                  <template slot-scope="scope">
                    <span v-if="scope.row.required === '1'">必须</span>
                    <span v-else>非必须</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="example"
                  label="示例	">
                </el-table-column>
                <el-table-column
                  prop="desc"
                  label="备注">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
        <div v-if="frontEnd.request.body.length>0">
        <el-row :gutter="20">
          <el-col :span="12">
            Body
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <tree-table   style="width: 100%;font-weight: normal" :expandAll="true" :data="frontEnd.request.body" :columns="other.frontEnd.request.body.columns" border></tree-table>
          </el-col>
        </el-row>
        </div>
      </el-main>
    </el-container>
    <el-container>
      <el-header style="height: 20px;line-height: 20px">
        <h3>后端配置</h3>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="4">
            超时时间
          </el-col>
          <el-col :span="4">
            {{ backEnd.timeout }}秒
          </el-col>
          <el-col :span="4">
            路径
          </el-col>
          <el-col :span="4">
            {{ backEnd.path }}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            重试次数
          </el-col>
          <el-col :span="4">
            {{ backEnd.tryTimes }}
          </el-col>
          <el-col :span="4">
            是否缓存
          </el-col>
          <el-col :span="4">
            {{ backEnd.isCache }}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            后端服务
          </el-col>
          <el-col :span="20">
            {{ backEnd.upstreamUrl }}
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-container>
      <el-header style="height: 20px;line-height: 20px">
        <h3>响应结果</h3>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="4">
            返回类型
          </el-col>
          <el-col :span="4">
            {{ response.type }}
          </el-col>

        </el-row>
        <div v-if="response.response.length>0">
          <el-row :gutter="20">
            <el-col :span="24">
              <tree-table   style="width: 100%;font-weight: normal" :expandAll="true" :data="response.response" :columns="other.frontEnd.request.body.columns" border></tree-table>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="20">
          <el-col :span="4">
            Mock参数
          </el-col>

          <json-editor theme="neat" v-model="response.response_text" :readOnly="true"></json-editor>


        </el-row>

        <div v-if="response.error">
          <el-row :gutter="20">
            <el-col :span="12">
              错误信息
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-table
                :data="response.error"
                style="width: 100%;font-weight: normal"
                border>
                <el-table-column
                  prop="code"
                  label="错误码"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="message"
                  label="错误信息	">
                </el-table-column>
                <el-table-column
                  prop="description"
                  label="备注">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>

        <el-row :gutter="20">
          <el-col :span="24">
            备注
          </el-col>
          <br>
          <div style="font-weight: normal;" class="editor-col">
            <tui-editor-view v-model="response.remark"></tui-editor-view>
          </div>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog title="发布接口" :visible.sync="publishDialogVisible" :close-on-click-modal="false">

      <el-form :model="formPublic">
        <h5>您要发布的API:</h5>
        <el-tag>{{formPublic.name}}</el-tag>
        <h5>您要发布的环境:</h5>
        <el-radio-group v-model="formPublic.environment">
          <el-radio-button label="test">测试</el-radio-button>
          <el-radio-button label="beta">预发布</el-radio-button>
          <el-radio-button label="prod">线上</el-radio-button>
        </el-radio-group>
        <h5>发布备注:</h5>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="formPublic.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="publishDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="publicApi">确 定</el-button>
      </div>

    </el-dialog>
  </el-card>
</template>

<script>
  import { getApiDetail, publicApi } from '@/api/api'
  import { schemaObj } from '@/utils/object'
  import treeTable from '@/components/TreeTable'
  import Bus from '@/components/bus'
  import TuiEditorView from '@/components/TuiEditor/view'
  import JsonEditor from '@/components/Editor'
  export default {
    name: 'apiDetail',
    components: {
      TuiEditorView,
      treeTable,
      JsonEditor
    },
    data() {
      return {
        baseInfo: {
          projectName: '',
          categoryName: '',
          name: '',
          netWork: '',
          isSign: '',
          isAuth: '',
          description: '',
          parentId: 0
        },
        frontEnd: {
          method: '',
          path: '',
          version: '',
          request: {
            path: [],
            header: [],
            query: [],
            body: []
          }
        },
        backEnd: {
          path: '',
          timeout: '',
          tryCount: 0,
          upstreamUrl: '',
          isCache: ''
        },
        response: {
          type: '',
          response: {},
          response_text: {},
          error: [],
          remark: ''
        },
        other: {
          network: {
            1: '外网',
            2: '内网'
          },
          isAuth: {
            2: '不认证但解析',
            1: '认证',
            0: '不认证'
          },
          isSign: {
            1: '签名',
            0: '无需签名'
          },
          resType: {
            1: 'json',
            2: 'html',
            3: '透传'
          },
          isCache: {
            1: '缓存',
            0: '不缓存'
          },
          frontEnd: {
            request: {
              body: {
                columns: [
                  {
                    text: 'name',
                    value: 'name'
                  },
                  {
                    text: 'required',
                    value: 'required'
                  },
                  {
                    text: 'type',
                    value: 'type'
                  },
                  {
                    text: 'description',
                    value: 'description'
                  }
                ]
              }
            }
          }
        },
        publishDialogVisible: false,
        formPublic: {
          id: 0,
          name: '',
          description: '',
          environment: '',
          onlineEnv: { test: 1, beta: 1, prod: 1 }
        }
      }
    },
    created() {
      this.fetchData()
      Bus.$emit('side-tab-select', 'api')
    },
    watch: {
      $route() {
        this.fetchData()
      }
    },
    methods: {
      schema2Arr(data) {
        let params = null
        if (data) {
          params = []
          for (const [key, elem] of Object.entries(data.properties)) {
            let require = '否'
            if (data.required !== undefined) {
              if (data.required.indexOf(key) !== -1) {
                require = '是'
              }
            }
            params.push({ name: key, description: elem.description, require: require })
          }
          return params
        }
      },

      schema2ArrDepth(data) {
        let required = []
        if (data.length === 0) {
          return []
        }
        if (data.required !== undefined) {
          required = data.required
        }
        if (data.properties === undefined) {
          return []
        }
        return schemaObj(data.properties, 1, 1, required)
      },

      fetchData() {
        getApiDetail(this.$route.params.apiId).then(response => {
          const base = response.base
          const backend = response.backend
          const frontend = response.frontend
          const responseData = response.response
          const other = this.other
          this.baseInfo = {
            projectName: base.project,
            categoryName: base.category,
            name: base.name,
            netWork: other.network[base.network],
            isSign: other.isSign[base.is_sign],
            isAuth: other.isAuth[base.is_auth],
            description: base.description,
            parentId: base.parent_id
          }
          this.frontEnd = {
            method: frontend.method,
            path: frontend.path,
            backend_name: frontend.backend_name,
            version: frontend.version,
            request: {
              path: frontend.request.path,
              header: frontend.request.header,
              query: frontend.request.query,
              body: frontend.request.body ? this.schema2ArrDepth(frontend.request.body) : []
            }
          }
          this.backEnd = {
            path: backend.server_path,
            timeout: backend.timeout,
            tryTimes: backend.try_times,
            isCache: other.isCache[backend.is_cache],
            upstreamUrl: backend.upstream_url
          }
          let errorArr = null
          if (responseData.response_code !== undefined && responseData.response_code.length !== 0) {
            errorArr = []
            for (const elem of responseData.response_code) {
              errorArr.push({ code: elem.code, description: elem.desc, message: elem.msg })
            }
          }

          this.response = {
            type: other.resType[responseData.response_type],
            response: this.schema2ArrDepth(responseData.response),
            error: errorArr,
            remark: responseData.remark,
            response_text: responseData.response_text
          }
        })
      },
      returnGo() {
        this.$router.go(-1)
      },
      openDialogPublic() {
        this.publishDialogVisible = true

        this.formPublic.id = this.$route.params.apiId
        this.formPublic.name = this.baseInfo.name
      },
      publicApi() {
        publicApi(this.formPublic.id, this.formPublic.environment, this.formPublic.description).then(response => {
          if (response.status === 1) {
            this.fetchData()
            this.$notify.success({
              title: '操作成功',
              message: response.message
            })
          } else {
            this.$notify.error({
              title: '操作失败',
              message: response.message
            })
          }
          this.publishDialogVisible = false
        })
      }
    }
  }
</script>

<style scoped>
  h3{
    float: left;
    margin: 0;
  }
  .el-row {
    margin-bottom: 20px;

  }

  .el-col:nth-child(odd){
    font-weight: bold;
  }
  .editor-col{
    width: auto;
  }
</style>
