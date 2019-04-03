<template>
  <el-container class="api-list">
    <el-header style="height: 40px;line-height: 40px">
      <h3 >接口列表</h3>
      <permission-check :route-info="$route" component-name="GroupAddApi">
      <router-link :to="{name:'GroupAddApi'}">
        <el-button type="primary" class="api-add">添加接口</el-button>
      </router-link>
      </permission-check>
    </el-header>
    <el-main>
      <el-table
        :data="apiList" border
        style="width: 100%"
        @filter-change="filterTag"
        :row-class-name="tableRowClassName"
        class="api-table"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          :render-header="nameRenderHeader"
          min-width="250"
          >
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text"> {{ scope.row.name }}</el-button>
            <el-tooltip v-if="scope.row.is_auth === 1" class="item" effect="dark" content="认证" placement="top">
            <svg-icon  icon-class="auth"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="version"
          label="版本"
          :render-header="versionRenderHeader"
          width="80">
        </el-table-column>
        <el-table-column
          prop="category"
          label="分类"
          width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.category!==null">
                {{ scope.row.category.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          :render-header="pathRenderHeader"
          min-width="250">
          <template slot-scope="scope">
            ({{  scope.row.method }}) {{ scope.row.path }}
          </template>
        </el-table-column>
        <el-table-column
          prop="client_type"
          :filters="[{text: '签名', value: 1}, {text: '不签名', value: 0}]"
          column-key="sign"
          :filter-multiple="false"
          :filtered-value="filter.sign"
          label="签名"
          width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.is_sign === 1">签名</span>
            <span v-else>不签名</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="is_auth"-->
          <!--:filters="[{text: '认证', value: 1}, {text: '无认证', value: 0}]"-->
          <!--column-key="auth"-->
          <!--:filter-multiple="false"-->
          <!--:filtered-value="filter.auth"-->
          <!--label="认证"-->
          <!--width="70">-->
          <!--<template slot-scope="scope">-->
            <!--<span v-if="scope.row.is_auth === 1">认证</span>-->
            <!--<span v-else>无认证</span>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column
          prop="status"
          label="环境"
          width="70">
          <template slot-scope="scope">
            <span class="status-front">测试</span><i class="el-icon-success status-icon" v-if="scope.row.test_api_id !== 0"></i><br />
            <span class="status-front">预发</span><i class="el-icon-success status-icon" v-if="scope.row.beta_api_id !== 0"></i><br />
            <span class="status-front">线上</span><i class="el-icon-success status-icon" v-if="scope.row.prod_api_id !== 0"></i>
          </template>
        </el-table-column>
        <el-table-column
          label="关注"
          width="50">
          <template slot-scope="scope">
              <i class="el-icon-star-on" v-if="scope.row.follow != null" style="font-size: 20px;color: red"></i>

              <el-button type="text" v-else size="small" icon="el-icon-star-off" @click="followApi(scope.row.id)" style="font-size: 20px;color: #999999"></el-button>
          </template>
        </el-table-column>
        <el-table-column
        label="创建人"
        width="70"
        >
          <template slot-scope="scope">
            {{scope.row.user.name}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-row>
              <permission-check :route-info="$route" component-name="apiPublish">
              <el-col :span="8">
                <el-button type="text" size="small" @click="openDialogPublic(scope.row)">发布</el-button>
              </el-col>
              </permission-check>
              <permission-check :route-info="$route" component-name="GroupUpdateApi">
              <el-col :span="8">
                <router-link :to="{name:'GroupUpdateApi',params:{ apiId: scope.row.id }}">
                  <el-button type="text" size="small">编辑</el-button>
                </router-link>
              </el-col>
              </permission-check>
              <permission-check :route-info="$route" component-name="apiCopy">
                <el-col :span="8">
                  <el-popover
                    placement="left"
                    width="250"
                    v-model="copyApiDetailVisible[scope.row.id]">
                    <p>接口【{{ scope.row.name }}】您要</p>
                    <div style="text-align: right; margin: 0">
                      <el-button type="primary" size="mini" @click="copyApi(scope.row,'version')">版本升级</el-button>
                      <el-button type="primary" size="mini" @click="copyApi(scope.row,'copy')">复制</el-button>
                    </div>


                    <el-button type="text" size="small" @click.stop="()=>{}" slot="reference">复制</el-button>
                  </el-popover>
                </el-col>
              </permission-check>
            </el-row>
              <el-row>
                <permission-check :route-info="$route" component-name="apiOffline">
                <el-col :span="8">
                  <el-button type="text" size="small" @click="openDialogOffLine(scope.row)">下线</el-button>
                </el-col>
                </permission-check>
                <permission-check :route-info="$route" component-name="apiRemove">
                  <el-col :span="8">
                    <el-button type="text" size="small" @click="deleteApi(scope.row.id)">删除</el-button>
                  </el-col>
                </permission-check>

              </el-row>
          </template>
        </el-table-column>
      </el-table>

    </el-main>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      :total="total"
    >
    </el-pagination>

    <el-dialog title="发布接口" :visible.sync="DialogVisible" :close-on-click-modal="false">

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
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="publicApi">确 定</el-button>
      </div>

    </el-dialog>

    <el-dialog title="下线接口" :visible.sync="DialogOffLineVisible" :close-on-click-modal="false">

      <el-form :model="formPublic">
        <h5>您要下线的API:</h5>
        <el-tag>{{formPublic.name}}</el-tag>
        <h5>您要下线的环境:</h5>
        <el-radio-group v-model="formPublic.environment">
          <el-radio-button v-if="formPublic.onlineEnv.test != 0" label="test">测试</el-radio-button>
          <el-radio-button v-if="formPublic.onlineEnv.beta != 0" label="beta">预发布</el-radio-button>
          <el-radio-button  v-if="formPublic.onlineEnv.prod != 0" label="prod">线上</el-radio-button>
        </el-radio-group>
        <div style="margin-top: 20px">
            <el-alert
              title="该操作将导致此API在指定的环境无法被访问。请确保客户端已经不再使用，或者确认需要强制下线"
              type="error">
            </el-alert>
        </div>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="DialogOffLineVisible = false">取 消</el-button>
        <el-button type="primary" @click="offLineApi">确 定</el-button>
      </div>

    </el-dialog>

  </el-container>

</template>

<style scoped>
  .api-list  .el-header{
    padding-left: 0;
  }
  .api-list .el-main{
    padding-left: 0;
  }



.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.el-header h3{
  float: left;
  margin: 0;
}
  .api-add{
    float: right;
  }
  .status-front{
    padding-right: 5px;
  }
  .status-icon{
    color: #00b500;
  }

</style>

<script>
import { getApiList, publicApi, offLineApi, deleteApi, followApi, apiCopy } from '@/api/api'
import Bus from '@/components/bus'
import PermissionCheck from '@/components/Permission/index'
export default {
  components: { PermissionCheck },
  created() {
    const page = this.$route.query.page ? this.$route.query.page : 1
    this.page = parseInt(page)
    this.fetchData()
    Bus.$emit('side-tab-select', 'api')
  },
  watch: {
    $route() {
      this.fetchData()
    }
  },
  methods: {
    fetchData() {
      const listId = this.$route.params.listId ? this.$route.params.listId : 0
      const auth = this.$route.query.auth !== undefined ? this.$route.query.auth : undefined
      const sign = this.$route.query.sign !== undefined ? this.$route.query.sign : undefined
      const name = this.$route.query.name !== undefined ? this.$route.query.name : undefined
      const path = this.$route.query.path !== undefined ? this.$route.query.path : undefined
      const version = this.$route.query.version !== undefined ? this.$route.query.version : undefined
      if (auth !== undefined) {
        this.filter.auth.push(auth / 1)
      }
      if (sign !== undefined) {
        this.filter.sign.push(sign / 1)
      }
      if (name !== undefined) {
        this.search.name = name
      }
      if (path !== undefined) {
        this.search.path = path
      }
      if (version !== undefined) {
        this.versionFilter = version
      }
      getApiList(this.$route.params.id, listId, this.page, auth, sign, name, path, version).then(response => {
        const data = response.data
        this.apiList = data
        this.total = response.total
        this.pageSize = 20
        this.loading = false
      })
    },
    openDialogPublic(data) {
      this.DialogVisible = true
      // this.formPublic = {
      //   id: data.id,
      //   name: data.name,
      //   description: '',
      //   environment: 'test',
      //   onlineEnv: { test: 1, beta: 1, prod: 1 }
      // }
      this.formPublic.id = data.id
      this.formPublic.name = data.name
      // this.formPublic.id = data.id
    },
    openDialogOffLine(data) {
      this.DialogOffLineVisible = true
      // this.formPublic = {
      //   id: data.id,
      //   name: data.name,
      //   description: '',
      //   environment: 'test',
      //   // onlineEnv: { 'test': data.test_api_id, 'beta': data.beta_api_id, 'prod': data.prod_api_id }
      //   onlineEnv: { test: data.test_api_id, beta: data.beta_api_id, prod: data.prod_api_id }
      // }
      this.formPublic.id = data.id
      this.formPublic.name = data.name
      this.formPublic.onlineEnv = { test: data.test_api_id, beta: data.beta_api_id, prod: data.prod_api_id }
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
        this.DialogVisible = false
      })
    },
    deleteApi(id) {
      this.$confirm('此操作将永久删除改接口吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteApi(id).then(response => {
          console.log(response)
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
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    followApi(id) {
      followApi(id).then(response => {
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
      })
    },
    offLineApi() {
      offLineApi(this.formPublic.id, this.formPublic.environment).then(response => {
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
        this.DialogOffLineVisible = false
      })
    },
    handleCurrentChange(val) {
      this.page = val
      const newQuery = {}
      Object.assign(newQuery, this.$route.query, { page: val })
      if (this.$route.params.listId) {
        this.$router.push({ name: 'groupList', params: { listId: this.$route.params.listId }, query: newQuery })
      } else {
        this.$router.push({ name: 'groupApi', query: newQuery })
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    handleClick(data) {
      this.$router.push({ name: 'groupDetail', params: { apiId: data.id }})
    },
    filterTag(filters) {
      const newQuery = {}
      if (filters.auth) {
        if (filters.auth.length === 1) {
          Object.assign(newQuery, this.$route.query, { auth: filters.auth[0] })
        } else {
          Object.assign(newQuery, this.$route.query, { auth: undefined })
        }
        this.filter.auth = filters.auth
      }
      if (filters.sign) {
        if (filters.sign.length === 1) {
          Object.assign(newQuery, this.$route.query, { sign: filters.sign[0] })
        } else {
          Object.assign(newQuery, this.$route.query, { sign: undefined })
        }
        this.filter.sign = filters.sign
      }
      if (this.$route.params.listId) {
        this.$router.push({ name: 'groupList', params: { listId: this.$route.params.listId }, query: newQuery })
      } else {
        this.$router.push({ name: 'groupApi', query: newQuery })
      }
    },
    nameRenderHeader(h, { column, $index }) {
      return [
        h(
          'div',
          {
            style: {
              padding: 0
            }
          },
          column.label
        ),
        h(
          'el-input',
          {
            style: {
              width: '100%',
              padding: 0
            },
            props: {
              size: 'small',
              value: this.search.name
            },
            on: {
              input: value => {
                this.search.name = value
              },
              focus: e => {
                this.search.path = ''
              },
              blur: e => {
                this.searchList('name', this.search.name)
              }
            },
            nativeOn: {
              keyup: (e) => {
                if (e.keyCode === 13) {
                  this.searchList('name', this.search.name)
                }
              }
            }
          }
        )
      ]
    },
    pathRenderHeader(h, { column, $index }) {
      return [
        h(
          'div',
          {
            style: {
              padding: 0
            }
          },
          column.label
        ),
        h(
          'el-input',
          {
            style: {
              width: '100%',
              padding: 0
            },
            props: {
              size: 'small',
              value: this.search.path
            },
            on: {
              input: value => {
                this.search.path = value
              },
              focus: e => {
                this.search.name = ''
              },
              blur: e => {
                this.searchList('path', this.search.path)
              }
            },
            nativeOn: {
              keyup: (e) => {
                if (e.keyCode === 13) {
                  this.searchList('path', this.search.path)
                }
              }
            }
          }
        )
      ]
    },
    versionRenderHeader(h, { column, $index }) {
      return [
        h(
          'div',
          {
            style: {
              padding: 0
            }
          },
          column.label
        ),
        h(
          'el-input',
          {
            style: {
              width: '100%',
              padding: 0
            },
            props: {
              size: 'small',
              value: this.versionFilter
            },
            on: {
              input: value => {
                this.versionFilter = value
              },
              blur: e => {
                this.searchByVersion(this.versionFilter)
              }
            },
            nativeOn: {
              keyup: (e) => {
                if (e.keyCode === 13) {
                  this.searchByVersion(this.versionFilter)
                }
              }
            }
          }
        )
      ]
    },
    searchList(type, value) {
      const newQuery = {}
      if (type === 'name') {
        if (value.length > 0) {
          Object.assign(newQuery, this.$route.query, { name: value, path: undefined, page: undefined })
        } else {
          Object.assign(newQuery, this.$route.query, { name: undefined })
        }
      }
      if (type === 'path') {
        if (value.length > 0) {
          Object.assign(newQuery, this.$route.query, { path: value, name: undefined, page: undefined })
        } else {
          Object.assign(newQuery, this.$route.query, { path: undefined })
        }
      }
      if (this.$route.params.listId) {
        this.$router.push({ name: 'groupList', params: { listId: this.$route.params.listId }, query: newQuery })
      } else {
        this.$router.push({ name: 'groupApi', query: newQuery })
      }
    },
    searchByVersion(value) {
      const newQuery = {}
      if (value.length > 0) {
        Object.assign(newQuery, this.$route.query, { page: undefined, version: value })
      } else {
        Object.assign(newQuery, this.$route.query, { version: undefined })
      }
      if (this.$route.params.listId) {
        this.$router.push({ name: 'groupList', params: { listId: this.$route.params.listId }, query: newQuery })
      } else {
        this.$router.push({ name: 'groupApi', query: newQuery })
      }
    },
    copyApi(data, type) {
      apiCopy(data.id, type).then(response => {
        if (response.status === 1) {
          this.$notify.success({
            title: '成功',
            message: response.message
          })
          this.copyApiDetailVisible[data.id] = false
          this.fetchData()
        } else {
          this.$notify.error({
            title: '失败',
            message: response.message
          })
        }
      })
    }

  },
  data() {
    return {
      pageSize: 0,
      page: 1,
      DialogVisible: false,
      DialogOffLineVisible: false,
      apiList: [],
      total: 0,
      formPublic: {
        id: 0,
        name: '',
        description: '',
        environment: '',
        onlineEnv: { test: 1, beta: 1, prod: 1 }
      },
      dialogFormCategory: false,
      dialogFormCategoryType: '',
      formCategoryRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      filter: {
        auth: [],
        sign: []
      },
      search: {
        name: '',
        path: ''
      },
      versionFilter: '',
      copyApiDetailVisible: {}
    }
  }
}
</script>
