<template>
  <el-container>
    <el-main class="object-main">
      <el-card class="box-card" style="min-height:80vh">
        <div slot="header" class="clearfix">
          <span><b>编辑API</b></span>
        </div>
        <el-row :gutter="24">
          <el-col :span="18" :offset="3">
            <el-steps :active="active" finish-status="success" simple>
              <el-step title="基本信息"></el-step>
              <el-step title="前端配置"></el-step>
              <el-step title="后端配置"></el-step>
              <el-step title="响应结果"></el-step>
            </el-steps>
            <keep-alive>
              <base-info v-if="active===0" @active-num="nowActive" :editType="true" v-model="baseInfo" @submit="submit"></base-info>
              <front-end-config v-if="active===1" @active-num="nowActive" :editType="true" ref="frontEnd" v-model="frontEnd" @submit="submit"></front-end-config>
              <back-end-config v-if="active===2" @active-num="nowActive" :editType="true" v-model="backEnd" ref="backEnd" @submit="submit"></back-end-config>
              <response-results v-if="active===3" @active-num="nowActive" :editType="true" v-model="response" ref="response" @submit="submit"></response-results>
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
  import { getApiDetail, updateApi } from '@/api/api'
  export default {
    name: 'updateApiMain',
    components: {
      baseInfo,
      frontEndConfig,
      backEndConfig,
      responseResults
    },
    data() {
      return {
        id: 0,
        active: 0,
        baseInfo: {},
        frontEnd: {},
        backEnd: {},
        response: {},
        resdata: {}
      }
    },
    created() {
      this.id = this.$route.params.apiId
      this.fetchData()
    },
    methods: {
      fetchData() {
        getApiDetail(this.id).then(response => {
          this.resdata = response
          this.baseInfo = {
            service: response.base.project,
            sortValue: response.base.category_id,
            name: response.base.name,
            signature: (function(sign) {
              if (sign === 1) {
                return true
              } else {
                return false
              }
            }(response.base.is_sign)),
            auth: response.base.is_auth / 1,
            net: String(response.base.network),
            desc: response.base.description
          }
          this.frontEnd = {
            version: response.frontend.version.slice(1) * 1,
            requestMethod: response.frontend.method,
            path: response.frontend.path,
            pathGroup: response.frontend.request.path,
            headerGroup: response.frontend.request.header,
            queryGroup: response.frontend.request.query,
            bodyGroup: response.frontend.request.body,
            backendName: response.frontend.backend_name
          }
          this.backEnd = {
            path: response.backend.server_path,
            timeout: response.backend.timeout * 1,
            tryTimes: response.backend.try_times * 1,
            upstreamUrl: response.backend.upstream_url,
            isCache: (function(is_cache) {
              return is_cache === 1
            }(response.backend.is_cache))
          }
          this.response = {
            response_type: response.response.response_type,
            remark: response.response.remark,
            response: response.response.response,
            errorData: response.response.response_code ? response.response.response_code : [],
            mock: response.response.response_text
          }
        })
      },
      nowActive(data) {
        this.active = data
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

        updateApi(this.id, data).then(response => {
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
