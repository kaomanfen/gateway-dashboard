<template>
<el-container>
  <el-header style="height: 40px;line-height: 40px;margin: 40px 40px 0 40px">
    <el-button type="primary" class="addConfig" @click="addConfig" size="small">添加配置项</el-button>
  </el-header>
  <el-main >
    <el-table
      :data="tableData"
      border
      style="width: 100%;height: 100%">
      <el-table-column
        prop="id"
        sortable
        label="id">
      </el-table-column>
      <el-table-column
        prop="name"
        label="key"
        sortable
      >
      </el-table-column>
      <el-table-column
      prop="value"
      label="value"
      >
      </el-table-column>
      <el-table-column
        prop="versions"
        label="适用版本">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-main>


  <el-dialog :title="dialogForm.title" :visible.sync="dialogForm.visible" :width="dialogForm.width" @close="dialogClose">
    <el-form :model="dialogForm">
      <el-row>
        <el-col :span="dialogForm.inputGroupSpan">
          <el-form-item label="key" :label-width="dialogForm.formLabelWidth">
            <el-input v-model="dialogForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="value" :label-width="dialogForm.formLabelWidth">
            <el-input v-model="dialogForm.value" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="适用版本" :label-width="dialogForm.formLabelWidth">
            <el-input v-model="dialogForm.versions" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="dialogForm.formLabelWidth">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6}"
              placeholder="请输入备注"
              v-model="dialogForm.remark">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2" v-if="dialogForm.type==='add'">
          <div class="search-Box">
            <el-input   placeholder="请输入关键字"  v-model="dialogForm.search"></el-input>
          </div>
          <div style="max-height: 350px ;overflow:auto;" class="side">
            <el-table
              :data="tables"
              @select="selectedRow"
              style="width: 100%">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="title"
                label="产品线">
                <template slot-scope="scope">
                   <span v-if="scope.row.id != sEnv">{{scope.row.title}}</span>

                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogForm.visible = false">取 消</el-button>
      <el-button type="primary" @click="saveData" v-if="dialogForm.type==='add'">确 定</el-button>
      <el-button type="primary" @click="updateData" v-if="dialogForm.type==='edit'">更 新</el-button>
    </div>
  </el-dialog>



</el-container>

</template>

<script>
  import { auditList, addAudit, updateAudit, projectsList } from '@/api/app'
  export default {
    name: 'config',
    data() {
      return {
        id: 0,
        sEnv: '',
        loading: false,
        env: {
          prod: '正式环境',
          beta: 'Beta环境',
          test: '测试环境'
        },
        tableData: [],
        dialogForm: {
          search: '',
          width: '60%',
          inputGroupSpan: 12,
          id: '',
          type: 'add',
          title: '添加配置项',
          visible: false,
          formLabelWidth: '80px',
          productLineData: [],
          selected: [],
          name: '',
          value: '',
          versions: '',
          remark: ''

        }
      }
    },
    created() {
      this.id = this.$route.params.appid
      this.sEnv = this.$route.params.env
      this.setTitle()
      this.fetchData()
    },
    watch: {
      $route(to, from) {
        if (to.name === 'AppConfig') {
          this.id = this.$route.params.appid
          this.sEnv = this.$route.params.env
          this.setTitle()
          this.fetchData()
        }
      }
    },
    computed: {
      tables: function() {
        const search = this.dialogForm.search
        if (search) {
          return this.dialogForm.productLineData.filter(function(dataNews) {
            return Object.keys(dataNews).some(function(key) {
              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.dialogForm.productLineData
      }
    },
    methods: {
      setTitle() {
        this.$route.matched[3].meta.title = this.env[this.sEnv]
      },
      edit(elem) {
        this.dialogForm.type = 'edit'
        this.dialogForm.width = '30%'
        this.dialogForm.inputGroupSpan = 24
        this.dialogForm.visible = true
        this.dialogForm.title = '编辑配置项'
        this.dialogForm.id = elem.id
        this.dialogForm.name = elem.name
        this.dialogForm.value = elem.value
        this.dialogForm.versions = elem.versions
        this.dialogForm.remark = elem.remark
      },
      addConfig() {
        this.dialogForm.type = 'add'
        this.dialogForm.width = '60%'
        this.dialogForm.inputGroupSpan = 12
        this.dialogForm.visible = true
        this.dialogForm.title = '添加配置项'
        this.fetchProjects()
      },
      dialogClose() {
        this.dialogForm = {
          search: '',
          width: '60%',
          inputGroupSpan: 12,
          id: '',
          type: 'add',
          title: '添加配置项',
          visible: false,
          formLabelWidth: '80px',
          productLineData: [],
          selected: [],
          name: '',
          value: '',
          versions: '',
          remark: ''

        }
      },
      selectedRow(newData) {
        const arr = []
        newData.forEach((x) => arr.push(x.id))
        this.dialogForm.selected = arr
      },
      fetchProjects() {
        projectsList(this.sEnv).then(response => {
          const data = []
          const appid = this.$route.params.appid / 1
          response.forEach(function(item) {
            if (item.id !== appid) {
              data.push(item)
            }
          })
          this.dialogForm.productLineData = data
        })
      },
      fetchData() {
        this.loading = true
        console.log(this.sEnv)
        auditList(this.sEnv, this.id).then(response => {
          this.tableData = response
          this.loading = false
        })
      },
      saveData() {
        const data = {

          name: this.dialogForm.name,
          env: this.sEnv,
          value: this.dialogForm.value,
          versions: this.dialogForm.versions,
          remark: this.dialogForm.remark,
          copy_project_id: this.dialogForm.selected

        }
        addAudit(this.id, data).then(response => {
          if (response.status === 1) {
            this.$notify.success({
              title: '成功',
              message: response.message
            })
            this.fetchData()
            this.dialogForm.visible = false
          } else {
            this.$notify.error({
              title: '失败',
              message: response.message
            })
          }
        })
      },
      updateData() {
        const data = {
          name: this.dialogForm.name,
          value: this.dialogForm.value,
          versions: this.dialogForm.versions,
          remark: this.dialogForm.remark
        }
        updateAudit(this.dialogForm.id, data).then(response => {
          if (response.status === 1) {
            this.$notify.success({
              title: '成功',
              message: response.message
            })
            this.fetchData()
            this.dialogForm.visible = false
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
  .addConfig{
    float: right;
  }
  .side::-webkit-scrollbar {
    display: none;
  }

</style>
