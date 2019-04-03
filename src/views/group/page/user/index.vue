<template>
<el-container>
  <el-main>
    <el-card class="box-card">
      <permission-check :route-info="$route" component-name="projectUserAdd">
        <el-button size="small" type="primary" style="float:right" @click="addUserdialogVisible=true">添加成员</el-button>
      </permission-check>
        <el-table
      :data="userList"
      :show-header="false"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名字">
        <template slot-scope="scope">
          <img style="width: 25px" :src="scope.row.avatar"/>
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        width="140">
        <template slot-scope="scope">
          <!--<span style="margin-right: 5px">{{ scope.row.role }}</span>-->
          <el-select v-model="scope.row.role" @change="changePermissions(scope.row)" placeholder="请选择" size="small" v-if="permissionsStatus.projectUserEdit">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
          <el-select v-model="scope.row.role" @change="changePermissions(scope.row)" placeholder="请选择" size="small" v-else disabled>
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="50">
        <template slot-scope="scope">
          <permission-check :route-info="$route" component-name="projectUserAdd">
          <el-button type="text"  v-show="scope.row.role!=='owner'"  icon="el-icon-delete" style="color: red" @click="delUser(scope.row.id)"></el-button>
          </permission-check>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </el-main>
  <el-dialog
    title="添加成员"
    :visible.sync="addUserdialogVisible"
    width="20%"
    @open="getUserInfo"
    @close="addUserdialogHandleClose">
    <el-form ref="addUserForm" :model="addUserForm" :rules="addUserForm.rules" label-width="80px">
      <el-form-item label="用户名" prop="uid">
        <el-select v-model="addUserForm.uid" filterable placeholder="请选择" size="small">
          <el-option
            v-for="item in addUserForm.userList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限" prop="role">
        <el-select v-model="addUserForm.role" placeholder="请选择" size="small">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addUserdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser('addUserForm')">确 定</el-button>
  </span>
  </el-dialog>
</el-container>
</template>

<script>
  import default_avatar from '@/assets/images/default.jpg'
  import { getPermissionsUserList, changePermissions, addUser, delUser, getUserList } from '@/api/permissions'
  import { componentCheck } from '@/utils/permission'
  export default {
    name: 'groupUsermanager',
    data() {
      return {
        type: 2,
        id: 0,
        userList: [],
        addUserdialogVisible: false,
        addUserForm: {
          uid: '',
          role: '',
          userList: [],
          rules: {
            uid: { required: true, message: '用户必填', trigger: 'blur' },
            role: { required: true, message: '角色必选', trigger: 'blur' }
          }

        },
        roles: [
          { key: 'owner', value: 'owner', disabled: true },
          { key: 'master', value: 'master' },
          { key: 'reporter', value: 'reporter' },
          { key: 'developer', value: 'developer' },
          { key: 'guest', value: 'guest' }
        ],
        permissionsStatus: {
          projectUserEdit: false
        }
      }
    },
    watch: {
      $route() {
        this.id = this.$route.params.id
        if (this.id === undefined) {
          return
        }
        this.getPermissionsUserList(this.id)
        this.permissionsCheck()
      }
    },
    mounted() {
      this.id = this.$route.params.id
      if (this.id === undefined) {
        return
      }
      this.getPermissionsUserList(this.id)
      this.permissionsCheck()
    },
    methods: {
      addUserdialogHandleClose() {
        this.addUserForm.uid = ''
        this.addUserForm.role = ''
      },
      getUserInfo() {
        getUserList().then(response => {
          this.addUserForm.userList = response
        })
      },
      delUser(id) {
        this.$confirm('此操作将永久删除该用户权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delUser(id).then(response => {
            if (response.status === 1) {
              this.getPermissionsUserList(this.id)
              this.$notify.success({
                title: '成功',
                message: response.message
              })
              location.reload()// 为了重新实例化vue-router对象 避免bug
            } else {
              this.$notify.error({
                title: '失败',
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
      addUser(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
              uid: this.addUserForm.uid,
              privilege_id: 0,
              project_id: this.id,
              role: this.addUserForm.role,
              type: this.type
            }
            addUser(data).then(response => {
              if (response.status === 1) {
                this.addUserdialogVisible = false
                this.getPermissionsUserList(this.id)
                this.$notify.success({
                  title: '成功',
                  message: response.message
                })
                location.reload()// 为了重新实例化vue-router对象 避免bug
              } else {
                this.$notify.error({
                  title: '失败',
                  message: response.message
                })
              }
            })
          }
        })
      },
      getPermissionsUserList(id) {
        getPermissionsUserList(id, this.type).then(response => {
          response.forEach((item) => {
            if (item.avatar.length === 0) {
              item.avatar = default_avatar
            }
          })
          this.userList = response
        })
      },
      changePermissions(elem) {
        const data = {
          uid: elem.uid,
          privilege_id: this.id,
          role: elem.role,
          type: this.type
        }
        changePermissions(elem.id, data).then(response => {
          if (response.status === 1) {
            this.$notify.success({
              title: '成功',
              message: response.message
            })
            location.reload()// 为了重新实例化vue-router对象 避免bug
          } else {
            this.$notify.error({
              title: '失败',
              message: response.message
            })
          }
        })
      },
      permissionsCheck() {
        this.permissionsStatus.projectUserEdit = componentCheck(this.$route, 'projectUserEdit')
      }
    }
  }
</script>

<style scoped>

</style>
