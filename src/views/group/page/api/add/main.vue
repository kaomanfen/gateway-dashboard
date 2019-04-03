<template>
  <el-container>
    <el-main class="object-main">
      <el-card class="box-card" style="min-height:80vh">
        <div slot="header" class="clearfix">
          <span><b>添加API</b></span>
        </div>
        <el-row :gutter="24">
          <el-col :span="18" :offset="3">
            <el-steps :active="active" finish-status="success" simple class="api-steps">
              <el-step title="基本信息"></el-step>
              <el-step title="前端配置"></el-step>
              <el-step title="后端配置"></el-step>
              <el-step title="响应结果"></el-step>
            </el-steps>
            <keep-alive>
              <base-info v-if="active===0" @active-num="nowActive" v-model="baseInfo"></base-info>
              <front-end-config v-if="active===1" @active-num="nowActive" ref="frontEnd"  v-model="frontEnd"></front-end-config>
              <back-end-config v-if="active===2" @active-num="nowActive"  ref="backEnd" v-model="backEnd"></back-end-config>
              <response-results v-if="active===3" @active-num="nowActive" ref="response" v-model="response" @submit="submit"></response-results>
            </keep-alive>
          </el-col>
        </el-row>
      </el-card>

    </el-main>
  </el-container>

</template>

<script>
  import baseInfo from '../components/baseInfo'
  import frontEndConfig from '../components/frontEndConfig'
  import backEndConfig from '../components/backEndConfig'
  import responseResults from '../components/responseResults'
  import { addApi } from '@/api/api'
  import { getObject } from '@/api/object'
  export default {
    name: 'addApiMain',
    components: {
      baseInfo,
      frontEndConfig,
      backEndConfig,
      responseResults
    },
    data() {
      return {
        active: 0,
        baseInfo: {
          service: '',
          sort: [],
          sortValue: '',
          name: '',
          auth: 0,
          signature: false,
          net: '2',
          desc: ''

        },
        frontEnd: {
          version: 1,
          requestMethod: 'POST',
          path: '',
          pathGroup: [],
          headerGroup: [],
          queryGroup: [],
          bodyGroup: {}
        },
        backEnd: {
          path: '',
          timeout: 2,
          tryTimes: 0,
          upstreamUrl: '',
          isCache: false
        },
        response: {
          response_type: 1,
          errorData: [],
          response: {},
          remark: '',
          mock: {}
        }
      }
    },
    watch: {
      'baseInfo.auth': {
        handler: function(val, oldVal) {
          if (val === 1) {
            this.frontEnd.headerGroup.push({ 'name': 'Authorization', 'value': 'Bearer', 'example': '', 'desc': '' })
          } else {
            this.frontEnd.headerGroup.forEach((item, index, obj) => {
              if (item.name === 'Authorization') {
                obj.splice(index, 1)
              }
            })
          }
        }
      }
    },
    created() {
      this.getBackEndName()
    },
    methods: {
      nowActive(data) {
        this.active = data
      },
      getBackEndName() {
        getObject(this.$route.params.id).then(response => {
          this.frontEnd.backendName = response.backend_name
        })
      },
      submit() {
        const base = {
          category_id: this.baseInfo.sortValue,
          name: this.baseInfo.name,
          is_sign: this.baseInfo.signature === true ? 1 : 0,
          is_auth: this.baseInfo.auth,
          project_id: this.$route.params.id,
          network: this.baseInfo.net,
          description: this.baseInfo.desc
        }
        const frontend = {
          version: 'v' + this.frontEnd.version,
          method: this.frontEnd.requestMethod,
          path: this.frontEnd.path,
          request: {
            path: this.frontEnd.pathGroup,
            header: this.frontEnd.headerGroup,
            query: this.frontEnd.queryGroup,
            body: this.frontEnd.bodyGroup
          }
        }

        const backend = {
          server_path: this.backEnd.path,
          timeout: this.backEnd.timeout,
          try_times: this.backEnd.tryTimes,
          upstream_url: this.backEnd.upstreamUrl,
          is_cache: this.backEnd.isCache === true ? 1 : 0
        }

        const response = {
          response_type: this.response.response_type,
          remark: this.response.remark,
          response: this.response.response,
          response_code: this.response.errorData,
          response_text: this.response.mock
        }

        const data = {
          base: base,
          frontend: frontend,
          backend: backend,
          response: response
        }

        addApi(data).then(response => {
          if (response.status === 1) {
            this.$notify.success({
              title: '成功',
              message: response.message
            })
            this.$router.push({ name: 'groupDetail', params: { apiId: response.result.id }})
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
  .object-main{
    padding-top: 0;
    padding-left: 0;
  }
  .box-card .hgx{
    border-bottom: .5px dashed #dee5e7;
    margin-top: 0;
    margin-bottom: 20px
  }
  .object-main >>> .el-step__head.is-success {
    color: #000000;
    border-color:#000000;
  }
  .object-main >>> .el-step__title.is-success {
    color:#000000;
  }
  .object-main >>> .el-step__head.is-process {
    color: #67c23a;
    border-color: #67c23a;
  }
  .object-main >>> .el-step__title.is-process{
    color: #67c23a;
  }
</style>
