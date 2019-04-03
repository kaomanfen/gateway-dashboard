<template>
  <el-container>
    <el-header style="height: 40px;line-height: 40px">
      <h3>防火墙规则</h3>
      <!--<el-button @click="add" type="primary" class="secret-add" size="mini">添加</el-button>-->
    </el-header>
    <el-main>
      <el-table
        :data="tableData" border
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="title"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="name"
          label="标识">
        </el-table-column>
        <el-table-column
          prop="rules"
          label="规则">
          <template slot-scope="scope">
            <div v-for="rule in scope.row.rules">
                {{rule}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type===1" type="success" close-transition size="mini">自定义</el-tag>
            <el-tag v-if="scope.row.type===2" type="danger" close-transition size="mini">系统</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===1" type="success" close-transition size="mini">正常</el-tag>
            <el-tag v-if="scope.row.status===0" type="danger" close-transition size="mini">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===1" @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button v-if="scope.row.status===1 && scope.row.type===1" @click="delect(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="title" :visible.sync="dialogFormVisible" width="20%" @close="dialogClose">
        <el-form :model="filterForm" :rules="rules" ref="filterForm">
          <el-form-item label="名称" prop="title">
            <el-input v-model="filterForm.title" auto-complete="off" :disabled="filterForm.disable"></el-input>
          </el-form-item>
          <el-form-item label="标识" prop="name">
            <el-input v-model="filterForm.name" auto-complete="off" :disabled="filterForm.disable"></el-input>
          </el-form-item>
          <el-form-item label="规则" prop="rules">
            <el-input  type="textarea" v-model="filterFormRules" placeholder="一行一个" autosize></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="type==='add'" type="primary" @click="add">确 定</el-button>
          <el-button v-if="type==='update'" type="primary" @click="update">更 新</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
  import { list, put } from '@/api/wafs'
  export default {
    name: 'filterList',
    data() {
      return {
        loading: false,
        tableData: [],
        title: '',
        type: '',
        dialogFormVisible: false,
        filterForm: {
          id: 0,
          title: '',
          name: '',
          rules: null,
          type: -1,
          status: -1,
          disable: false
        },
        rules: {
          title: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入标识', trigger: 'blur' }
          ],
          rules: [
            { required: true, message: '请输入规则', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      filterFormRules: {
        // getter
        get: function() {
          if (this.filterForm.rules !== null) {
            return this.filterForm.rules.join('\n')
          }

          return ''
        },
        // setter
        set: function(newValue) {
          this.filterForm.rules = newValue.split('\n')
        }
      }
    },
    methods: {
      fetchData() {
        list().then(response => {
          this.tableData = response
          this.loading = false
        })
      },
      edit(data) {
        this.type = 'update'
        this.filterForm = { ...data }
        this.filterForm.disable = data.type === 2
        this.dialogFormVisible = true
      },
      delect(row) {

      },
      update() {
        const data = {
          title: this.filterForm.title,
          name: this.filterForm.name,
          rules: this.filterForm.rules
        }
        this.$refs['filterForm'].validate((valid) => {
          if (valid) {
            put(this.filterForm.id, data).then(response => {
              if (response.status === 1) {
                this.$notify.success({
                  title: '成功',
                  message: response.message
                })
                this.fetchData()
                this.dialogFormVisible = false
              } else {
                this.$notify.error({
                  title: '失败',
                  message: response.message
                })
              }
            })
          } else {
            return false
          }
        })
      },
      add() {
        this.type = 'add'
      },
      dialogClose() {
        this.filterForm = {
          id: 0,
          title: '',
          name: '',
          rules: null,
          type: -1,
          status: -1
        }
      }
    }
  }
</script>

<style scoped>
  .el-header h3{
    float: left;
    margin: 0;
  }
  .secret-add{
    float: right;
  }
</style>
