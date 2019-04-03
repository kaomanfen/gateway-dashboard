<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="140px" style="margin-top: 50px" class="ruleForm">
    <el-form-item label="所属服务">
      <el-input v-model="form.service" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="选择分类" prop="sort">
      <el-select v-model="form.sortValue" placeholder="请选择" style="display:block">
        <el-option
          v-for="item in form.sort"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="接口名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="认证">
      <el-radio v-model="form.auth" :label="0">不认证</el-radio>
      <el-radio v-model="form.auth" :label="1">认证</el-radio>
      <el-radio v-model="form.auth" :label="2">不认证但解析</el-radio>
    </el-form-item>
    <el-form-item label="签名">
      <el-switch v-model="form.signature"></el-switch>
    </el-form-item>
    <el-form-item label="网络" prop="net">
      <el-radio-group v-model="form.net">
        <el-radio label="1">外网</el-radio>
        <el-radio label="2">内网</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input type="textarea" v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button style="margin-top: 12px;" type="primary" @click="next('form')">下一步</el-button>
      <el-button v-if="editType" style="margin-top: 12px;" type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
  import { fetchCategory } from '@/api/object'
  export default {
    name: 'baseInfo',
    props: ['value', 'editType'],
    data() {
      return {
        form: {
          service: '',
          sort: [],
          sortValue: '',
          name: '',
          auth: 0,
          signature: false,
          net: '2',
          desc: ''

        },
        rules: {
          sort: [
            { required: true, message: '请选择分类', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请填写接口名称', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '请填写接口描述', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.form.service = this.$store.state.app.sidebar.selected.name
      this.fetchSort()
    },
    mounted() {
      this.form.sortValue = this.$route.params.categoryId
    },
    watch: {
      $route() {
        this.form.sortValue = this.$route.params.categoryId
      },
      value(value) {
        this.form.sortValue = value.sortValue
        this.form.name = value.name
        this.form.auth = value.auth
        this.form.signature = value.signature
        this.form.net = value.net
        this.form.desc = value.desc
      }
    },
    methods: {
      next(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$emit('active-num', 1)
            this.$emit('input', this.form)
          } else {
            return false
          }
        })
      },
      submit() {
        this.$emit('input', this.form)
        this.$emit('submit', true)
      },
      fetchSort() {
        fetchCategory(this.$route.params.id).then(response => {
          this.form.sort = response
        })
      }

    }
  }
</script>

<style scoped>

</style>
