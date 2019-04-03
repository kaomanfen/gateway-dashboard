<template>
    <el-form ref="form" :model="form"  label-width="100px" style="margin-top: 50px" class="demo-dynamic">
    <el-tabs v-model="activeName">
      <el-tab-pane label="测试环境" name="test">
        <el-form-item label="域名"  prop="test_domain" :rules="{
      required: true, message: '测试环境 域名不能为空', trigger: 'blur'}">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-input v-model="form.test_domain"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in form.test_ip"
          :label="'ip ' + index"
          :key="domain.key"
          :prop="'test_ip.' + index + '.value'"
          :rules="[{
      required: true, message: '测试环境 ip不能为空', trigger: 'blur'
    },{pattern:/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,message:'测试环境 必须是ip地址', trigger: 'blur'}
    ]"
        >
          <el-row :gutter="10">
            <el-col :span="16">
              <el-input v-model="domain.value"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="text"><i class="el-icon-remove" style="color: red"  @click.prevent="removeDomain(domain,'test_ip')"></i></el-button>
              <el-button type="text" v-if="index===0"> <i class="el-icon-circle-plus" @click="addDomain('test_ip')"></i></el-button>
            </el-col>
          </el-row>
        </el-form-item>

      </el-tab-pane>
      <el-tab-pane label="Beta环境" name="beta">
        <el-form-item label="域名" prop="beta_domain">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-input v-model="form.beta_domain"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in form.beta_ip"
          :label="'ip ' + index"
          :key="domain.key"
          :prop="'beta_ip.' + index + '.value'"
        >
          <el-row :gutter="10">
            <el-col :span="16">
              <el-input v-model="domain.value"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="text"><i class="el-icon-remove" style="color: red" @click.prevent="removeDomain(domain,'beta_ip')"></i></el-button>
              <el-button type="text" v-if="index===0"> <i class="el-icon-circle-plus" @click="addDomain('beta_ip')"></i></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="正式环境" name="online">
        <el-form-item label="域名" prop="online_domain" :rules="{
      required: true, message: '正式环境 域名不能为空', trigger: 'blur'}">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-input v-model="form.online_domain"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in form.online_ip"
          :label="'ip ' + index"
          :key="domain.key"
          :prop="'online_ip.' + index + '.value'"
          :rules="[{
      required: true, message: '正式环境 ip不能为空', trigger: 'blur'
    },{pattern:/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,message:'正式环境 必须是ip地址', trigger: 'blur'}
    ]"
        >
          <el-row :gutter="10">
            <el-col :span="16">
              <el-input v-model="domain.value"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="text"><i class="el-icon-remove"  style="color: red" @click.prevent="removeDomain(domain,'online_ip')"></i></el-button>
              <el-button type="text" v-if="index===0"> <i class="el-icon-circle-plus" @click="addDomain('online_ip')"></i></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>


      <el-form-item v-if="type==='add'">
        <el-button  style="margin-top: 12px;" @click="previous">上一步</el-button>
        <el-button  style="margin-top: 12px;" @click="onSubmit('form')">提交</el-button>
      </el-form-item>
      <el-form-item v-if="type==='update'">
        <el-button  style="margin-top: 12px;" @click="updateSubmit('form')">提交</el-button>
      </el-form-item>
    </el-form>

</template>

<script>
  import { addObject, updateObject } from '@/api/object'
  export default {
    name: 'environment',
    data() {
      return {
        type: 'add',
        id: 0,
        activeName: 'test',
        form: {
          test_domain: '',
          test_ip: [
            {
              value: ''
            }],
          beta_domain: '',
          beta_ip: [
            {
              value: ''
            }],
          online_domain: '',
          online_ip: [
            {
              value: ''
            }]
        }
      }
    },
    created() {
      if (this.$route.params.id) {
        this.type = 'update'
      } else {
        this.$store.dispatch('StepsActive', 1)
      }
    },

    beforeRouteEnter(to, from, next) {
      // 如果直接访问本页面则跳回第一步
      next(vm => {
        if (from.name !== 'ObjectBaseInfo') {
          const active = vm.$store.state.object.active - 1
          vm.$store.dispatch('StepsActive', active)
          vm.$router.push({ name: 'ObjectBaseInfo' })
        }
      })
    },
    methods: {
      removeDomain(item, ip) {
        const index = this.form[ip].indexOf(item)
        if (index !== -1) {
          this.form[ip].splice(index, 1)
        }
      },
      addDomain(ip) {
        this.form[ip].push({
          value: ''
        })
      },
      previous() {
        const active = this.$store.state.object.active - 1
        this.$store.dispatch('StepsActive', active)
        this.$router.go(-1)
      },
      // 格式转换
      ObjTOArr(datas) {
        const ips = []
        for (const value of Object.values(datas)) {
          ips.push(value.value)
        }
        return ips
      },
      onSubmit(form) {
        this.$refs[form].validate((valid, error) => {
          if (valid) {
            this.$store.dispatch('EditObjEnv', this.form)
            const active = this.$store.state.object.active + 2
            this.$store.dispatch('StepsActive', active)
            const baseInfo = this.$store.state.object.baseInfo
            const env = this.$store.state.object.env
            const data = {
              'environment': {
                'test_servers': {
                  'domain': env.test_domain,
                  'servers': this.ObjTOArr(env.test_ip)
                },
                'beta_servers': {
                  'domain': env.beta_domain,
                  'servers': this.ObjTOArr(env.beta_ip)
                },
                'prod_servers': {
                  'domain': env.online_domain,
                  'servers': this.ObjTOArr(env.online_ip)
                }
              }
            }
            addObject(Object.assign(data, baseInfo)).then(response => {
              this.$router.push({ path: '/group/' + response.result.id })
            })
          } else {
            const notices = []
            for (const item of Object.values(error)) {
              notices.push(item[0].message)
            }
            this.$notify.error({
              title: '验证失败',
              dangerouslyUseHTMLString: true,
              message: notices.join('<br>')
            })
            return false
          }
        })
      },
      updateSubmit(form) {
        this.$refs[form].validate((valid, error) => {
          if (valid) {
            const data = {
              'environment': {
                'test_servers': {
                  'domain': this.form.test_domain,
                  'servers': this.ObjTOArr(this.form.test_ip)
                },
                'beta_servers': {
                  'domain': this.form.beta_domain,
                  'servers': this.ObjTOArr(this.form.beta_ip)
                },
                'prod_servers': {
                  'domain': this.form.online_domain,
                  'servers': this.ObjTOArr(this.form.online_ip)
                }
              }
            }
            updateObject(this.id, data).then(response => {
              if (response.status === 1) {
                this.$notify.success({
                  title: '成功',
                  message: response.message
                })
                this.$emit('updateEnv', true)
              } else {
                this.$notify.error({
                  title: '失败',
                  message: response.message
                })
              }
            })
          } else {
            const notices = []
            for (const item of Object.values(error)) {
              notices.push(item[0].message)
            }
            this.$notify.error({
              title: '验证失败',
              dangerouslyUseHTMLString: true,
              message: notices.join('<br>')
            })
            return false
          }
        })
      },
      fetchData(id, data) {
        this.id = id
        this.form = (function(item) {
          if (item.beta_ip.length === 0) {
            item.beta_ip.push({ value: '' })
          }
          if (item.online_ip.length === 0) {
            item.online_ip.push({ value: '' })
          }
          if (item.test_ip.length === 0) {
            item.test_ip.push({ value: '' })
          }
          return item
        }(data))
      }
    }
  }
</script>

<style scoped>

</style>
