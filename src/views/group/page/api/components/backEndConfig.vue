<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="100px" style="margin-top: 50px" class="ruleForm">
    <el-form-item label="请求path" prop="path">
      <el-input placeholder="接口名称" v-model="form.path" ></el-input>
    </el-form-item>
    <el-form-item label="后端超时" prop="timeout">
      <el-input placeholder="超时时间" v-model.number="form.timeout">
        <template slot="append">秒</template>
      </el-input>
    </el-form-item>
    <el-form-item label="后端服务" prop="upstreamUrl">
      <el-input placeholder="填写 ip地址或者域名" v-model="form.upstreamUrl">
      </el-input>
    </el-form-item>
    <el-form-item label="重试次数" prop="replay">
      <el-input-number v-model.number="form.tryTimes" controls-position="right" min="0" max="3"></el-input-number>
    </el-form-item>
    <el-form-item label="是否缓存">
      <el-switch v-model="form.isCache"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button  style="margin-top: 12px;" @click="previous">上一步</el-button>
      <el-button  style="margin-top: 12px;" type="primary" @click="next('form')">下一步</el-button>
      <el-button v-if="editType" style="margin-top: 12px;" type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'backEndConfig',

    props: ['value', 'editType'],
    data() {
      return {
        form: this.value,
        rules: {
          path: [
            { required: true, message: '请填写路径', trigger: 'blur' },
            { pattern: /^\/.+/, message: '路径必须以 "/" 开始', trigger: 'blur' }
          ],
          timeout: [
            { required: true, message: '请填写超时时间', trigger: 'blur' },
            { type: 'number', message: '超时时间必须是数字', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      previous() {
        this.$emit('active-num', 1)
        this.$emit('input', this.form)
      },
      next(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$emit('active-num', 3)
            this.$emit('input', this.form)
          } else {
            return false
          }
        })
      },
      submit() {
        this.$emit('input', this.form)
        this.$emit('submit', true)
      }
    }
  }
</script>

<style scoped>

</style>
