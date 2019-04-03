<template>
  <el-container>
  <el-header>
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="3">
        <h3 >测试集合 </h3>
      </el-col>
      <el-col :span="10">
        <el-form ref="form" :model="form">
          <el-form-item label="选择环境">
            <el-select v-model="form.env"  class="env-select">
              <el-option v-for="(item,index) in env.domainValue" :key="index" :label="item.key+'：http://'+item.value" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" class="api-test" size="small" @click="run">开始测试</el-button>
      </el-col>
    </el-row>
  </el-header>
  <el-main>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="测试中…"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        prop="name"
        label="用例名称">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="跳转到接口调试" placement="top">
          <router-link :to="{name:'groupTestApi',params:{testId:scope.row.id}}">
            <span style="color: #2395f1">{{scope.row.name}}</span>
          </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="key"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.status">
            <el-tooltip class="item" effect="dark" content="请求通过" placement="top" v-if="scope.row.status==='200'">
              <i class="el-icon-success" style="color: #67C23A"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="请求异常" placement="top" v-else>
              <i class="el-icon-error" style="color: #F56C6C"></i>
            </el-tooltip>
          </div>

        </template>
      </el-table-column>
      <el-table-column
        prop="path"
        label="接口路径">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="跳转到接口详情" placement="top">
          <router-link :to="{name:'groupDetail',params:{apiId:scope.row.api_id}}">
            <span style="color: #2395f1">/{{ scope.row.backend_name }}{{scope.row.path}}</span>
          </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="report"
        label="测试报告">
        <template slot-scope="scope">
          <div v-if="scope.row.request">
            <el-button size="small" @click="reportData(scope.row)">测试报告</el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>
  </el-main>
    <el-dialog title="测试报告" :visible.sync="dialogTableVisible" class="report-dialog" @close="dialogClose">
      <el-tabs v-model="activeName">
        <el-tab-pane label="Request" name="Request">
          <el-row>
            <el-col :span="4">
                <b>URL</b>
            </el-col>
            <el-col :span="20">
              {{ dialogInfo.url }}
            </el-col>
          </el-row>
          <div v-if="dialogInfo.request.header">
            <el-row>
              <el-col :span='4'>
                <b>Header</b>
              </el-col>
              <el-col :span="20">
                <json-editor theme="neat" v-model="dialogInfo.request.header" :readOnly="true" :lineNumbers="false"></json-editor>
              </el-col>
            </el-row>
          </div>
          <div v-if="dialogInfo.request.query">
            <el-row>
              <el-col :span='4'>
                <b>Query</b>
              </el-col>
              <el-col :span="20">
                <json-editor theme="neat" v-model="dialogInfo.request.query" :readOnly="true" :lineNumbers="false"></json-editor>
              </el-col>
            </el-row>
          </div>
          <div v-if="dialogInfo.request.body">
            <el-row>
              <el-col :span='4'>
                <b>Body</b>
              </el-col>
              <el-col :span="20">
                <json-editor theme="neat" v-model="dialogInfo.request.body" :readOnly="true" :lineNumbers="false"></json-editor>
              </el-col>
            </el-row>
          </div>

        </el-tab-pane>
        <el-tab-pane label="Response" name="Response">
          <el-row>
            <div v-if="dialogInfo.response.header">
              <el-col :span='4'>
                <b>Header</b>
              </el-col>
              <el-col :span="20">
                <json-editor theme="neat" v-model="dialogInfo.response.header" :readOnly="true" :lineNumbers="false"></json-editor>

              </el-col>
            </div>
          </el-row>
          <div v-if="dialogInfo.response.body">
            <el-row>
              <el-col :span='4'>
                <b>Body</b>
              </el-col>
              <el-col :span="20">
                <json-editor theme="neat" v-model="dialogInfo.response.body" :readOnly="true" :lineNumbers="false"></json-editor>
              </el-col>
            </el-row>
          </div>

        </el-tab-pane>
        <el-tab-pane label="验证结果" name="status">
          <el-row>
            <el-col :span='4'>
              <b>验证结果</b>
            </el-col>
            <el-col :span="20">
              <div v-if="dialogInfo.status==='200'">
                验证通过
              </div>
              <div v-else>
                验证失败
              </div>

            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </el-container>
</template>

<script>
import Bus from '@/components/bus'
import { testList, batchTest } from '@/api/api'
import { requestPamramsToPostMan } from '@/utils/object'
import { pathParamsEncode } from '@/utils/url'
import jsonEditor from '@/components/Editor'
export default {
  name: 'testList',
  components: {
    jsonEditor
  },
  data() {
    return {
      form: {
        env: 'test'
      },
      env: {
        title: '',
        domain: {
          test: 'test',
          beta: 'beta',
          prod: 'online'
        },
        domainValue: [
          { key: 'test', value: 'test' },
          { key: 'beta', value: 'beta' },
          { key: 'prod', value: 'online' }
        ]
      },
      tableData: [],
      activeName: 'Request',
      loading: false,
      dialogTableVisible: false,
      dialogInfo: {
        url: '',
        request: {},
        response: {},
        status: null

      }
    }
  },
  created() {
    this.getTitle()
    this.fetchData()
    Bus.$emit('side-tab-select', 'test')
  },
  watch: {
    route() {
      this.fetchData()
    }
  },
  methods: {
    getTitle() {
      this.env.title = this.$store.state.app.app.selected.name
    },
    fetchData() {
      testList(this.$route.params.id, this.$route.params.testListId).then(response => {
        this.tableData = response
      })
    },
    run() {
      this.loading = true
      const data = {
        env: this.form.env,
        project_id: this.$route.params.id,
        collect_id: this.$route.params.testListId
      }
      batchTest(data).then(response => {
        location.reload()
      })
    },
    reportData(row) {
      this.dialogInfo.url = pathParamsEncode(row.path, row.request.path)
      this.dialogInfo.request.header = row.request.header ? requestPamramsToPostMan(row.request.header, 'header') : undefined
      this.dialogInfo.request.query = row.request.query ? requestPamramsToPostMan(row.request.query) : undefined
      this.dialogInfo.response = row.response
      this.dialogInfo.status = row.status
      this.dialogTableVisible = true
    },
    dialogClose() {
      this.dialogInfo = {
        request: {},
        response: {},
        status: null
      }
    }
  }
}
</script>

<style scoped>
  .el-header h3{
    margin: 0;
  }
  .env-select {
    width: 60%;

  }

  .report-dialog >>> .el-dialog__body{
    min-height: 450px;
  }
  .report-dialog >>> .el-tabs__content{
    padding-left: 100px;
  }
  pre {
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }
</style>
