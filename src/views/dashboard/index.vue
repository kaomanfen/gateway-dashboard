<template>
  <div>
    <el-card class="box-card">
      <permission-check :route-info="$route" component-name="projectAdd">
        <router-link :to="{name:'Object'}">
          <el-button size="mini" type="primary" style="position: relative; float: right;z-index: 1">添加项目</el-button>
        </router-link>
      </permission-check>
        <el-tabs v-model="active" type="card">
        <el-tab-pane label="项目列表" name="1">
          <el-row  v-loading="loading">
            <el-col :span="4" v-for="(elem,index) in projectList" :key="index" >
              <a @click="appSelect(elem)">
                <div class="grid-content bg-purple" >{{ elem.name }}</div>
              </a>
            </el-col>

          </el-row>

        </el-tab-pane>
        <el-tab-pane label="分组动态" name="2" v-if="permissionsStatus.zoneActivity">
          <activity type="group" :dataId="$route.params.zoneId"></activity>
        </el-tab-pane>
        <el-tab-pane label="成员列表" name="3">
          <permission-check :route-info="$route" component-name="projectUserRemove">
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
                <el-select v-model="scope.row.role" @change="changePermissions(scope.row)" placeholder="请选择" size="small" v-if="permissionsStatus.zoneUserEdit">
                  <el-option
                    v-for="item in roles"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
                <el-select v-model="scope.row.role" @change="changePermissions(scope.row)" placeholder="请选择" size="small" v-else disabled >
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
                <permission-check :route-info="$route" component-name="zoneUserRemove">
                  <el-button type="text" v-show="scope.row.role!=='owner'" icon="el-icon-delete" style="color: red" @click="delUser(scope.row.id)"></el-button>
                </permission-check>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="分组设置" name="4" v-if="permissionsStatus.zoneEdit">
          <el-form ref="form" :model="form"  :rules="rules" label-width="80px">
            <el-row  type="flex" justify="center" :gutter="20">
              <el-col :span="12">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                  <el-input v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="privilege">
                  <el-radio-group v-model="form.privilege">
                    <el-radio :label="1">公开</el-radio>
                    <el-radio :label="2">私有</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit('form')">添加</el-button>
                  <el-button  v-if="$store.getters.roles.is_admin === 1"  style="margin-top: 12px"  type="danger"  @click="removeDialogVisible = true" plain>删除分组</el-button>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </el-tab-pane>
      </el-tabs>
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
      <el-dialog
        title="提示"
        :visible.sync="removeDialogVisible"
        width="50%"
        @open="removeDialogOpen"
        center>
        <el-row type="flex"  justify="center">
          <el-col :span="12" >
            <div class="" style="text-align: center;margin-bottom: 30px">
              <h3><b>您确定要删除「{{removeForm.zone}}」吗？</b></h3>
            </div>
          </el-col>
        </el-row>
        <el-form :model="removeForm">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="15">
              <el-form-item label="输入分组名" label-width="85px">
                <el-input v-model="inZone" auto-complete="off"></el-input>
                <span>删除操作不可逆，请输入分组名称，确认你已知晓该操作所带来的影响。</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
    <el-button @click="removeDialogVisible = false">取消</el-button>
    <el-button  @click="remove" type="danger" :disabled="removeForm.status">确定删除</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>

</template>

<script>
  import default_avatar from '@/assets/images/default.jpg'
  import { updateGroup, getGroup, getProjectList, delGroup } from '@/api/group'
  import { getPermissionsUserList, changePermissions, addUser, delUser, getUserList } from '@/api/permissions'
  import Activity from '@/components/Activity'
  import { componentCheck } from '@/utils/permission'
  export default {
    name: 'dashboard',
    components: {
      Activity
    },
    data() {
      return {
        active: '1',
        type: 1,
        zoneId: 0,
        loading: false,
        projectList: [{
          id: 0,
          name: ''
        }],
        form: {
          name: '',
          description: '',
          privilege: 1
        },
        rules: {
          name: [
            { required: true, message: '分组名称必填', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '备注必填', trigger: 'blur' }
          ],
          privilege: [
            { required: true, message: '权限必选', trigger: 'blur' }
          ]
        },
        userList: [],
        roles: [
          { key: 'owner', value: 'owner', disabled: true },
          { key: 'master', value: 'master' },
          { key: 'reporter', value: 'reporter' },
          { key: 'developer', value: 'developer' },
          { key: 'guest', value: 'guest' }
        ],
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
        addUserOptions: [],
        permissionsStatus: {
          zoneActivity: false,
          zoneEdit: false,
          zoneUserEdit: false
        },
        removeDialogVisible: false,
        removeForm: {
          zone: '',
          inZone: '',
          status: true
        }
      }
    },
    computed: {
      inZone: {
        // getter
        get: function() {
          return this.removeForm.inZone
        },
        // setter
        set: function(newValue) {
          this.removeForm.status = newValue !== this.removeForm.zone
          this.removeForm.inZone = newValue
        }
      }
    },
    mounted() {
      this.zoneId = this.$route.params.zoneId
      if (this.zoneId === undefined) {
        return
      }
      this.fetchZone(this.zoneId)
      this.fetchProjects(this.zoneId)
      this.getPermissionsUserList(this.zoneId)
      this.permissionsCheckTab()
    },
    watch: {
      $route() {
        this.zoneId = this.$route.params.zoneId
        if (this.zoneId === undefined) {
          return
        }
        this.fetchZone(this.zoneId)
        this.fetchProjects(this.zoneId)
        this.getPermissionsUserList(this.zoneId)
        this.permissionsCheckTab()
      }
    },
    methods: {
      appSelect(item) {
        this.$store.dispatch('selectedApp', item)
        this.$router.push({ name: 'groupApi', params: { id: item.id }})
      },
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
              this.getPermissionsUserList(this.zoneId)
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
              privilege_id: this.zoneId,
              role: this.addUserForm.role,
              type: this.type
            }
            addUser(data).then(response => {
              if (response.status === 1) {
                this.addUserdialogVisible = false
                this.getPermissionsUserList(this.zoneId)
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
      getPermissionsUserList(zoneId) {
        getPermissionsUserList(zoneId, this.type).then(response => {
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
          privilege_id: this.zoneId,
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
      fetchProjects(zoneId) {
        this.loading = true
        getProjectList(zoneId).then(response => {
          this.projectList = response
          this.loading = false
        })
      },
      fetchZone(zoneId) {
        getGroup(zoneId).then(response => {
          this.form.name = response.name
          this.form.description = response.description
          this.form.privilege = response.privilege
        })
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const zoneId = this.zoneId
            updateGroup(zoneId, this.form).then(response => {
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
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      permissionsCheckTab() {
        this.permissionsStatus.zoneActivity = componentCheck(this.$route, 'zoneActivity')
        this.permissionsStatus.zoneEdit = componentCheck(this.$route, 'zoneEdit')
        this.permissionsStatus.zoneUserEdit = componentCheck(this.$route, 'zoneUserEdit')
      },
      removeDialogOpen() {
        this.removeForm.zone = this.$store.state.app.sidebar.selected.name
      },
      remove() {
        delGroup(this.zoneId).then(response => {
          if (response.status === 1) {
            this.$notify.success({
              title: '成功',
              message: response.message
            })
            this.removeDialogVisible = false
            window.location = '/'
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

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .grid-content {
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin: 10px;
  }

</style>
