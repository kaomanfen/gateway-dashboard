<template>
<el-container>
<el-main>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>添加分组</span>
    </div>
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
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </el-card>
</el-main>
</el-container>
</template>

<script>
  import { addGroup } from '@/api/group'
  export default {
    name: 'addZone',
    data() {
      return {
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
        }
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            addGroup(this.form).then(response => {
              if (response.status === 1) {
                this.$notify.success({
                  title: '成功',
                  message: response.message
                })
                this.$router.push({ name: 'Zone' })
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
      }
    }
  }
</script>

<style scoped>

</style>
