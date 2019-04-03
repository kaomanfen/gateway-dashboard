<template>
  <el-container class="traffic-control">
    <el-header style="height: 40px;line-height: 40px">
      <h3 >流量控制</h3>
      <el-button type="primary" size="small" class="add" @click="addPolicy">创建策略</el-button>
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          label="策略名称"
          width="150">
          <template slot-scope="scope">
              <router-link :to="{name:'trafficControlDetail',params:{detailId:scope.row.id}}">
                <el-button type="text" size="small">{{scope.row.name}}</el-button>
              </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="单位">
          <template slot-scope="scope">
            {{other.timeMap[scope.row.period]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="api_limit"
          label="api流量限制">
        </el-table-column>
        <el-table-column
          prop="user_limit"
          label="用户流量限制">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editPolicy(scope.row)">编辑策略</el-button>
            <el-button type="text" size="small" @click="bindApi(scope.row)">绑定API</el-button>
            <el-button type="text" size="small" @click="delPolicy(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog :title="addDialogFormData.title" :visible.sync="addDialogFormVisible" @close="addDialogClose">
      <el-form :model="addDialogFormData" :rules="addFormRules" ref="addForm">
        <el-form-item label="名称" label-width="120px" prop="name">
          <el-input v-model="addDialogFormData.name" ></el-input>
          支持汉字、英文字母、数字、英文格式的下划线，必须以英文字母或汉字开头，4~50个字符
        </el-form-item>
        <el-form-item label="单位时间" label-width="120px" prop="unit">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-select v-model="addDialogFormData.unit">
                <el-option label="秒" value="s"></el-option>
                <el-option label="分钟" value="m"></el-option>
                <el-option label="小时" value="h"></el-option>
                <el-option label="天" value="d"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="API流量限制" label-width="120px" prop="apiDefault">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-input v-model="addDialogFormData.apiDefault" ></el-input>
            </el-col>
            <el-col :span="1">
              次
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="用户流量限制" label-width="120px" prop="userDefault">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-input v-model="addDialogFormData.userDefault" ></el-input>
            </el-col>
            <el-col :span="1">
              次
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="绑定API" :visible.sync="bindDialogFormVisible"  width="60%" @open="bindDialogOpen">
      <div style="margin: 10px 0"><b>您将对下列策略添加API:</b></div>
      <el-alert
        :title="'策略名称：'+bindDialogFormData.name"
        type="info"
        style="color: black"
        :closable="false">
      </el-alert>
      <div style="color: red;margin: 10px 0">
        <b>
          请注意：如果API上原来已经绑定了一个策略，请先解绑，然后再来绑定！
        </b>
      </div>
      <div>
        <b>
          选择要添加的API:
        </b>
      </div>
      <div>
       <el-row :gutter="40">
         <el-col :span="14">
           <el-row :gutter="10">
             <el-col :span="6">
               <el-select v-model="bindDialogFormData.zone" placeholder="请选择分组" size="small" @change="zoneSelect">
                 <el-option
                   v-for="item in bindDialogFormData.zones"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
             </el-col>
             <el-col :span="6">
               <el-select v-model="bindDialogFormData.subject" placeholder="请选择项目" size="small" @change="subjectSelect">
                 <el-option
                   v-for="item in bindDialogFormData.subjects"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
             </el-col>
             <el-col :span="10">
               <el-input v-model="bindDialogFormData.search_value" placeholder="请输入内容" size="small"></el-input>

             </el-col>
             <el-col :span="2">
               <el-button size="small" @click="apiSearch">搜索</el-button>
             </el-col>
             <el-col :span="24">
               <el-table
                 :data="bindDialogFormData.apiTableData"
                 height="300px"
                 @selection-change="apiListSelect"
               >
                 <el-table-column
                   type="selection"
                   :selectable="checkSelectable"
                   width="55">
                 </el-table-column>
                <el-table-column
                  prop="name"
                  label="api名称">

                </el-table-column>
                 <el-table-column
                   prop="policy"
                   label="已绑定策略">

                 </el-table-column>
               </el-table>
               <div class="table-bottom">
                 <el-button size="small" style="float: left" @click="addApis">添加选中</el-button>
                 <el-pagination
                   :page-size="20"
                   layout="total, prev, pager, next"
                   :total="bindDialogFormData.apiTableTotal"
                   :current-page.sync="bindDialogFormData.apiTanleCurrentPage"
                   @current-change="apiTablePaginationChange"
                   style="float: right"
                 >
                 </el-pagination>
               </div>

             </el-col>
           </el-row>
         </el-col>
         <el-col :span="10">
           <el-table
             :data=bindDialogFormData.selectApiList
             height="350px"
           >
             <el-table-column
               prop="name"
               label="已选择的API">
               <template slot-scope="scope">
                <span>
                  {{scope.row.name}}
                </span>
                 <span style="float: right">
                   <el-button size="mini" type="danger" plain @click="deleteSelect(scope)">删除</el-button>
                 </span>
               </template>
             </el-table-column>
           </el-table>
         </el-col>
       </el-row>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBindApi">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import { getGroups, getProjectList } from '@/api/group'
  import { list, post, put, del, bind, projectsList } from '@/api/trafficControl'
  export default {
    name: 'trafficControl',
    data() {
      return {
        tableData: [],
        addDialogFormVisible: false,
        addDialogFormData: {
          id: 0,
          titie: '',
          name: '',
          unit: 's',
          apiDefault: '',
          userDefault: ''
        },
        addFormRules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          unit: [{ required: true, message: '请输入单位时间', trigger: 'blur' }],
          apiDefault: [
            { required: true, message: '请输入API流量限制', trigger: 'blur' }
          ],
          userDefault: [{ required: true, message: '请输入用户流量限制', trigger: 'blur' }]
        },

        bindDialogFormVisible: false,
        bindDialogFormData: {
          id: 0,
          name: '',
          zone: '',
          zones: [],
          subject: '',
          subjects: [],
          search_value: '',
          apiTableData: [],
          apiTableTotal: 0,
          apiTanleCurrentPage: 1,
          selectApi: [],
          selectApiList: [],
          selectAllId: []
        },
        other: {
          timeMap: {
            s: '秒',
            m: '分钟',
            h: '小时',
            d: '天'
          }
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        list().then(response => {
          this.tableData = response
        })
      },
      bindDialogOpen() {
        getGroups().then(response => {
          this.bindDialogFormData.zones = response
        })
      },
      zoneSelect(val) {
        getProjectList(val).then(response => {
          this.bindDialogFormData.subjects = response
        })
      },
      subjectSelect(val) {
        this.bindDialogFormData.apiTanleCurrentPage = 1
        this.bindDialogFormData.selectApiList = []
        this.bindDialogFormData.selectAllId = []
        projectsList(val, 1).then(response => {
          this.bindDialogFormData.apiTableData = response.data
          this.bindDialogFormData.apiTableTotal = response.total
          this.bindDialogFormData.apiTanleCurrentPage = response.current_page
        })
      },
      apiTablePaginationChange(val) {
        let searchValue = ''
        if (this.bindDialogFormData.search_value.length > 0) {
          searchValue = this.bindDialogFormData.search_value
        } else {
          searchValue = undefined
        }
        projectsList(this.bindDialogFormData.subject, val, searchValue).then(response => {
          this.bindDialogFormData.apiTableData = response.data
          this.bindDialogFormData.apiTableTotal = response.total
          this.bindDialogFormData.apiTanleCurrentPage = response.current_page
        })
      },
      apiSearch() {
        projectsList(this.bindDialogFormData.subject, 1, this.bindDialogFormData.search_value).then(response => {
          this.bindDialogFormData.apiTableData = response.data
          this.bindDialogFormData.apiTableTotal = response.total
          this.bindDialogFormData.apiTanleCurrentPage = response.current_page
        })
      },
      apiListSelect(val) {
        this.bindDialogFormData.selectApi = val
      },
      addApis() {
        let ids = []
        if (this.bindDialogFormData.selectApi.length > 0) {
          this.bindDialogFormData.selectApiList = this.bindDialogFormData.selectApiList.concat(this.bindDialogFormData.selectApi)
          this.bindDialogFormData.selectApiList.forEach(function(item) {
            ids.push(item.id)
          })
        } else {
          this.bindDialogFormData.selectApiList = []
          ids = []
        }
        this.bindDialogFormData.selectAllId = ids
      },
      deleteSelect(data) {
        this.bindDialogFormData.selectApiList.splice(data.$index, 1)
        this.bindDialogFormData.selectAllId.splice(this.bindDialogFormData.selectAllId.indexOf(data.row.id), 1)
      },
      checkSelectable(row) {
        if (row.ratelimitapi && row.ratelimitapi.api_id === row.id) {
          return false
        }
        if (this.bindDialogFormData.selectAllId.includes(row.id)) {
          return false
        }

        return true
      },

      saveAdd() {
        this.$refs['addForm'].validate((valid) => {
          const data = {
            name: this.addDialogFormData.name,
            period: this.addDialogFormData.unit,
            api_limit: this.addDialogFormData.apiDefault,
            user_limit: this.addDialogFormData.userDefault
          }
          if (valid) {
            if (this.addDialogFormData.id > 0) {
              put(this.addDialogFormData.id, data).then(response => {
                if (response.status === 1) {
                  this.$notify.success({
                    title: '成功',
                    message: response.message
                  })
                  this.fetchData()
                  this.addDialogFormVisible = false
                } else {
                  this.$notify.error({
                    title: '失败',
                    message: response.message
                  })
                }
              })
            } else {
              post(data).then(response => {
                if (response.status === 1) {
                  this.$notify.success({
                    title: '成功',
                    message: response.message
                  })
                  this.fetchData()
                  this.addDialogFormVisible = false
                } else {
                  this.$notify.error({
                    title: '失败',
                    message: response.message
                  })
                }
              })
            }
          } else {
            return false
          }
        })
      },
      addDialogClose() {
        this.addDialogFormData = {
          id: 0,
          title: '',
          name: '',
          unit: 's',
          apiDefault: '',
          userDefault: ''
        }
      },
      addPolicy() {
        this.addDialogFormData.title = '添加策略'
        this.addDialogFormVisible = true
      },
      editPolicy(data) {
        this.addDialogFormData.title = '编辑策略'
        this.addDialogFormData = {
          id: data.id,
          name: data.name,
          unit: data.period,
          apiDefault: data.api_limit,
          userDefault: data.user_limit
        }
        this.addDialogFormVisible = true
      },
      delPolicy(id) {
        del(id).then(response => {
          if (response.status === 1) {
            this.$notify.success({
              title: '成功',
              message: response.message
            })
            this.fetchData()
            this.addDialogFormVisible = false
          } else {
            this.$notify.error({
              title: '失败',
              message: response.message
            })
          }
        })
      },
      bindApi(data) {
        this.bindDialogFormData.id = data.id
        this.bindDialogFormData.name = data.name
        this.bindDialogFormVisible = true
      },
      saveBindApi() {
        const data = {
          project_id: this.bindDialogFormData.subject,
          apis_id: this.bindDialogFormData.selectAllId
        }
        bind(this.bindDialogFormData.id, data).then(response => {
          if (response.status === 1) {
            this.$notify.success({
              title: '成功',
              message: response.message
            })
            this.fetchData()
            this.bindDialogFormVisible = false
          } else {
            this.$notify.error({
              title: '失败',
              message: response.message
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .el-header h3{
    float: left;
    margin: 0;
  }
  .add{
    float: right;
  }
  .table-bottom{
    margin: 10px 0;
  }
</style>
