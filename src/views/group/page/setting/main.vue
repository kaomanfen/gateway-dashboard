<template>
  <el-container style="min-height:95vh;background-color: #eceef1">
    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="项目配置">
          <base-info ref="baseInfo" @updateBaseInfo="reload"></base-info>
        </el-tab-pane>
        <el-tab-pane label="环境配置">
          <environment ref="environment" @updateEnv="reload"></environment>
        </el-tab-pane>
        <!--<el-tab-pane label="请求配置">-->

        <!--</el-tab-pane>-->
      </el-tabs>
    </el-main>
  </el-container>

</template>

<script>
  import BaseInfo from '@/views/setting/object/page/baseInfo'
  import Environment from '@/views/setting/object/page/environment'
  import { getObject } from '@/api/object'
  export default {
    name: 'ApiSettingMain',
    components: {
      BaseInfo,
      Environment
    },
    created() {
      this.fetchData()
    },
    data() {
      return {
        id: this.$route.params.id
      }
    },
    methods: {
    // 格式转换
      ArrToObj(datas) {
        const ips = []
        for (const value of datas) {
          ips.push({ value: value })
        }
        return ips
      },
      fetchData() {
        const id = this.id
        getObject(id).then(response => {
          const baseInfo = {
            name: response.name,
            desc: response.desc,
            group_id: response.group_id,
            backend_name: response.backend_name,
            product_line: response.product_line,
            base_path: response.base_path,
            project_type: String(response.project_type),
            ding_robot: response.ding_robot,
            jwt_secret: response.jwt_secret
          }
          const environment = {
            test_domain: response.test_servers.domain ? response.test_servers.domain : '',
            beta_domain: response.beta_servers.domain ? response.beta_servers.domain : '',
            online_domain: response.prod_servers.domain ? response.prod_servers.domain : '',
            test_ip: response.test_servers.servers ? this.ArrToObj(response.test_servers.servers) : [''],
            beta_ip: response.beta_servers.servers ? this.ArrToObj(response.beta_servers.servers) : [''],
            online_ip: response.prod_servers.servers ? this.ArrToObj(response.prod_servers.servers) : ['']
          }
          this.$refs.baseInfo.fetchData(id, baseInfo)
          this.$refs.environment.fetchData(id, environment)
        })
      },
      reload() {
        this.fetchData()
      }
    }

  }
</script>

<style scoped>

</style>
