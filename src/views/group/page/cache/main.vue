<template>
  <el-container>
    <el-main>
      <el-form class="form-container" :model="cacheForm" :rules="rules" ref="cacheForm">

        <el-form-item label="请选择环境" prop="env">
          <el-radio-group v-model="cacheForm.env">
            <el-radio-button label="test">测试环境</el-radio-button>
            <el-radio-button label="beta">预发布</el-radio-button>
            <el-radio-button label="prod">生产环境</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请选择类型" prop="type">
          <el-radio-group v-model="cacheForm.type" prop="type">
            <el-radio-button label="projects">项目</el-radio-button>
            <el-radio-button label="routes">路由</el-radio-button>
          </el-radio-group>

        </el-form-item>
        <el-form-item>
          <el-button v-loading="loading" type="primary" icon="el-icon-search" @click="searchCache()" style="margin-left: 20px">查看</el-button>
          <permission-check :route-info="$route" component-name="projectCacheUpdate">
          <el-button v-loading="updateLoading" type="primary" @click="updateCache()" style="margin-left: 20px">更新</el-button>
          </permission-check>
        </el-form-item>
        <div v-show="cacheForm.type==='routes' && routeData!==undefined">
          <el-row type="flex"  justify="space-between" style="height: 32px;line-height: 32px">
            <el-col :span="3">
              <el-input placeholder="搜索网关路径" icon="search" size="small" v-model="schfilter" class="search-input">
              </el-input>
            </el-col>
            <el-col :span="2">
              <div class="routes-count">共 {{ routerCount }} 条</div>
            </el-col>
          </el-row>


          <el-table
            :data="routeTableData"
            style="width: 100%"
            >
            <el-table-column
              prop="key"
              label="网关路径">
            </el-table-column>
            <el-table-column
              prop="method"
              label="请求类型">
            </el-table-column>
            <el-table-column
              prop="path"
              label="后端路径">
            </el-table-column>
            <el-table-column
              prop="response_type"
              label="响应类型">
            </el-table-column>
            <el-table-column
              prop="network"
              label="网络">
            </el-table-column>
            <el-table-column
              prop="is_sign"
              label="签名">
            </el-table-column>
            <el-table-column
              prop="is_auth"
              label="认证">
            </el-table-column>
          </el-table>
        </div>
        <div v-show="cacheForm.type==='projects' && projectData !==undefined">
          <el-table
            :data="projectData"
            style="width: 100%"
            >
            <el-table-column
              prop="domain"
              label="domain">
            </el-table-column>
            <el-table-column
              prop="server"
              label="server">
              <template slot-scope="scope">
                <div v-for="(ip,key) in scope.row.server" :key="key">
                  {{ ip }}
                  <br>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-form>
    </el-main>

  </el-container>

</template>

<script>
  import editor from '@/components/Editor'
  import { getCache, updateCache } from '@/api/cache'
  export default {
    name: 'ApiCacheMain',
    components: {
      editor
    },
    created() {

    },
    computed: {
      routeTableData() {
        const search = this.schfilter
        let data = []
        if (search) {
          data = this.routeData.filter(item => (~item.key.indexOf(search)))
          this.routerCount = data.length
          return data
        }
        this.routerCount = this.routeData.length
        return this.routeData
      }
    },
    data() {
      return {
        loading: false,
        updateLoading: false,
        isEditorShow: false,
        cacheForm: {
          env: '',
          type: ''
        },
        id: this.$route.params.id,
        value: {},
        rules: {
          env: [
            { required: true, message: '请选择环境', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ]
        },
        routeData: [],
        projectData: [],
        netWork: {
          1: '外网',
          2: '内网'
        },
        auth: {
          0: '未认证',
          1: '认证'
        },
        sign: {
          0: '未签名',
          1: '签名'
        },
        restype: {
          1: 'json',
          2: 'html',
          3: '透传'
        },
        routerCount: 0,
        schfilter: ''
      }
    },
    methods: {
      updateCache() {
        this.$refs.cacheForm.validate(valid => {
          if (valid) {
            this.updateLoading = true
            updateCache(this.id, this.cacheForm.env, this.cacheForm.type).then(response => {
              if (response.status === 1) {
                this.$notify({
                  title: '成功',
                  message: response.message,
                  type: 'success'
                })
              } else {
                this.$notify({
                  title: '失败',
                  message: response.message,
                  type: 'error'
                })
              }

              this.updateLoading = false
            })
          } else {
            return false
          }
        })
      },
      searchCache() {
        this.$refs.cacheForm.validate(valid => {
          if (valid) {
            this.loading = true
            getCache(this.id, this.cacheForm.env, this.cacheForm.type).then(response => {
              if (this.cacheForm.type === 'routes') {
                this.isEditorShow = true
                const routeValue = []
                this.routerCount = Object.values(response).length
                for (const [index, elem] of Object.entries(response)) {
                  routeValue.push({
                    key: index,
                    response_type: this.restype[elem.response_type],
                    is_auth: this.auth[elem.is_auth],
                    network: this.netWork[elem.network],
                    is_sign: this.sign[elem.is_sign] ? this.sign[elem.is_sign] : '',
                    path: elem.path,
                    method: elem.method
                  })
                }
                this.routeData = routeValue
                this.loading = false
              }
              if (this.cacheForm.type === 'projects') {
                const domain = response.domain
                const prefix = response.prefix
                const project_id = ''
                const serverList = []
                if (response.servers) {
                  response.servers.forEach((item) => {
                    serverList.push(item)
                  })
                }
                this.isEditorShow = true
                this.projectData = [{ domain: domain, prefix: prefix, project_id: project_id, server: serverList }]
                this.loading = false
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .json-editor >>> .CodeMirror {
    height: auto;
  }
  .routes-count{
    float: right;
    font-size: 15px;
    font-weight: bold;
    color: #909399;
  }
</style>
