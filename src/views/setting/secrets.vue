<template>
  <el-container>
    <el-header style="height: 40px;line-height: 40px">
      <h3>密钥管理</h3>
      <el-button @click="add" type="primary" class="secret-add" size="mini">添加密钥</el-button>
    </el-header>
    <el-main>
      <el-table
        :data="tableData" border
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="name"
          label="密钥名称">
        </el-table-column>
        <el-table-column
          prop="app_key"
          label="appKey">
        </el-table-column>
        <el-table-column
          prop="app_secret"
          label="appSecret">
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
            <el-button v-if="scope.row.status===1" @click="delect(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="title" :visible.sync="dialogFormVisible" width="30%" @close="secretDialogClose('secretForm')">
        <el-form :model="secretForm" :rules="rules" ref="secretForm">
          <el-form-item label="密钥名称" prop="name">
            <el-input v-model="secretForm.name" auto-complete="off" ></el-input>
          </el-form-item>
          <el-form-item label="appKey" prop="appKey">
            <el-input v-model="secretForm.appKey" auto-complete="off" :disabled="secretForm.appKeyStatus"></el-input>
          </el-form-item>
          <el-form-item label="appSecret">
            <el-input v-model="secretForm.appSecret" auto-complete="off" :disabled="secretForm.appSecretStatus"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-if="type==='add'" type="primary" @click="addSecret('secretForm')">确 定</el-button>
          <el-button v-if="type==='update'" type="primary" @click="updateSecret('secretForm')">更 新</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
  import { getList, addSecret, updateSecret, delectSecret } from '@/api/secrets'
  import { randomWord } from '@/utils/secret'
  export default {
    name: 'secrets',
    data() {
      return {
        loading: true,
        tableData: [],
        title: '',
        type: '',
        dialogFormVisible: false,
        secretForm: {
          id: 0,
          name: '',
          appKey: null,
          appSecret: null,
          appKeyStatus: false,
          appSecretStatus: true
        },
        rules: {
          name: [
            { required: true, message: '请输入密钥名称', trigger: 'blur' }
          ],
          appKey: [
            { required: true, message: '请输入appKey', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        getList().then(response => {
          this.tableData = response
          this.loading = false
        })
      },
      secretDialogClose(form) {
        // 关闭窗口清除验证状态
        this.$refs[form].clearValidate()
      },
      addSecret(form) {
        const data = {
          name: this.secretForm.name,
          app_key: this.secretForm.appKey,
          app_secret: this.secretForm.appSecret
        }
        this.$refs[form].validate((valid) => {
          if (valid) {
            addSecret(data).then(response => {
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
      updateSecret(form) {
        const data = {
          name: this.secretForm.name
        }
        this.$refs[form].validate((valid) => {
          if (valid) {
            updateSecret(this.secretForm.id, data).then(response => {
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
      delectSecret(id) {
        delectSecret(id).then(response => {
          if (response.status === 1) {
            this.$notify.success({
              title: '成功',
              message: response.message
            })
            this.fetchData()
          } else {
            this.$notify.error({
              title: '失败',
              message: response.message
            })
          }
        })
      },
      add() {
        this.title = '添加密钥'
        this.type = 'add'
        this.secretForm.name = ''
        this.secretForm.appKey = ''
        this.secretForm.appSecret = ''
        this.secretForm.appSecret = randomWord(true, 32, 48)
        this.secretForm.appKeyStatus = false
        this.dialogFormVisible = true
      },
      edit(data, form) {
        this.title = '编辑密钥'
        this.type = 'update'
        this.secretForm.id = data.id
        this.secretForm.name = data.name
        this.secretForm.appKey = data.app_key
        this.secretForm.appSecret = data.app_secret
        this.secretForm.appKeyStatus = true
        this.dialogFormVisible = true
      },
      delect(data) {
        this.$confirm('此操作将永久删除该密钥, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.delectSecret(data.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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
  .secret-add{
    float: right;
  }
</style>
