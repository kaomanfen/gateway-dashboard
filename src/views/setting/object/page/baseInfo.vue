<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="140px" style="margin-top: 50px">
    <el-form-item label="项目名称" prop="name">
    <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="项目描述">
    <el-input v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item label="分组" prop="group_id">
      <el-select v-model="form.group_id" placeholder="请选择" disabled>
        <el-option
          v-for="item in groups"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="后端服务" prop="backend_name">
      <el-input v-if="type==='update'" v-model="form.backend_name" disabled></el-input>
      <el-input v-else v-model="form.backend_name"></el-input>
    </el-form-item>
    <el-form-item prop="product_line">
      <span slot="label">产品线
        <el-tooltip class="item" effect="dark" content="多个产品线使用英文逗号分隔" placement="top-end">
        <i class="el-icon-question"></i>
        </el-tooltip>
      </span>
      <el-input v-model="form.product_line"></el-input>
    </el-form-item>
    <el-form-item label="基本路径(留空则为/)">
    <el-input v-model="form.base_path"></el-input>
    </el-form-item>
    <el-form-item label="权限" prop="auth">
      <el-radio-group v-model="form.project_type">
        <el-tooltip class="item" effect="dark" content="只有组长和项目开发者可以索引并查看项目信息" placement="bottom">
        <el-radio label="1">私有</el-radio>
          </el-tooltip>
        <el-tooltip class="item" effect="dark" content="任何人都可以索引并查看项目信息" placement="bottom">
          <el-radio label="2">公开</el-radio>
        </el-tooltip>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <span slot="label">钉钉机器人
        <el-tooltip class="item" effect="dark" content="钉钉机器人 webhook 地址" placement="top-end">
        <i class="el-icon-question"></i>
        </el-tooltip>
      </span>
      <el-input v-model="form.ding_robot"></el-input>
    </el-form-item>
    <el-form-item label="项目密钥">
      <el-input v-model="form.jwt_secret_new" disabled v-if="type==='add'"></el-input>
      <el-input v-model="form.jwt_secret" disabled v-if="type==='update'"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button  v-if="type==='add'" style="margin-top: 12px;" @click="next('form')">下一步</el-button>
      <el-button  v-if="type==='update'" style="margin-top: 12px;" @click="submit('form')">提交</el-button>
      <el-button  v-if="$store.getters.roles.is_admin === 1 && type==='update'"  style="margin-top: 12px"  type="danger"  @click="removeDialogVisible = true" plain>删除项目</el-button>
    </el-form-item>
    <el-dialog
      title="提示"
      :visible.sync="removeDialogVisible"
      width="50%"
      center>
      <el-row type="flex"  justify="center">
        <el-col :span="12" >
          <div class="grid-content bg-purple-dark" style="text-align: center;margin-bottom: 30px">
            <h3><b>您确定要删除「{{removeForm.subject}}」吗？</b></h3>
          </div>
        </el-col>
      </el-row>
      <el-form :model="removeForm">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="15">
            <el-form-item label="输入项目名" label-width="85px">
              <el-input v-model="inSubject" auto-complete="off"></el-input>
              <span>删除操作不可逆，请输入项目名称，确认你已知晓该操作所带来的影响。</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="removeDialogVisible = false">取消</el-button>
    <el-button  @click="remove" type="danger" :disabled="removeForm.status">确定删除</el-button>
  </span>
    </el-dialog>
  </el-form>
</template>

<script>
  import { updateObject, delObject } from '@/api/object'
  import { getGroups } from '@/api/group'
  import { randomMD5 } from '@/utils/secret'
  export default {
    name: 'baseInfo',
    data() {
      return {
        type: 'add',
        id: 0,
        form: {
          name: '',
          desc: '',
          group_id: '',
          backend_name: '',
          product_line: '',
          base_path: '',
          project_type: '2',
          ding_robot: '',
          jwt_secret: '',
          jwt_secret_new: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          project_type: [
            { required: true, message: '请选择权限', trigger: 'blur' }
          ],
          product_line: [
            { required: true, message: '请填写产品线', trigger: 'blur' }
          ],
          backend_name: [
            { required: true, message: '请填写后端服务名', trigger: 'blur' }
          ],
          group_id: [
            { required: true, message: '请选择分组', trigger: 'blur' }
          ]
        },
        groups: {},
        removeDialogVisible: false,
        removeForm: {
          subject: this.$store.state.app.app.selected === null ? 0 : this.$store.state.app.app.selected.name,
          inSubject: '',
          status: true
        }
      }
    },
    computed: {
      inSubject: {
        // getter
        get: function() {
          return this.removeForm.inSubject
        },
        // setter
        set: function(newValue) {
          this.removeForm.status = newValue !== this.removeForm.subject
          this.removeForm.inSubject = newValue
        }
      }
    },
    created() {
      this.fetchGroup()
      if (this.$route.params.id) {
        this.type = 'update'
      } else {
        this.$store.dispatch('StepsActive', 0)
        this.form.jwt_secret_new = randomMD5(true)
      }
    },

    methods: {
      fetchGroup() {
        getGroups().then(response => {
          this.groups = response
          this.form.group_id = this.$store.getters.sidebar.selected.id / 1
        })
      },
      next(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$store.dispatch('EditObjBaseInfo', this.form)
            const active = this.$store.state.object.active + 1
            this.$store.dispatch('StepsActive', active)
            this.$router.push({ name: 'ObjectBaseEnv' })
          } else {
            return false
          }
        })
      },
      fetchData(id, data) {
        this.id = id
        this.form = data
      },
      submit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            updateObject(this.id, this.form).then(response => {
              if (response.status === 1) {
                this.$notify.success({
                  title: '成功',
                  message: response.message
                })
                this.$emit('updateBaseInfo', true)
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
      remove() {
        delObject(this.id).then(response => {
          if (response.status === 1) {
            this.$notify.success({
              title: '成功',
              message: response.message
            })
            this.removeDialogVisible = false
            this.$router.push({ path: '/' })
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

</style>
