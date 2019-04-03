<template>
  <el-container>
    <el-main>
      <el-tabs :tab-position="tabPosition" style="min-height: 80vh" @tab-click="tabClick">
        <el-tab-pane label="首页" name="index">

        </el-tab-pane>
        <el-tab-pane label="正式环境"  :lazy="true" name="prod">
          <el-container>
            <el-header class="app-line-header" style="height: 40px;line-height: 40px">
              <h3>正式环境</h3>
              <el-button  class="app-line-add" @click="addname(env)" type="primary" size="small">添加产品线</el-button>
            </el-header>
            <el-main >
              <el-table
                :data="prod"
                border
                v-loading="loading"
                style="width: 100%;height: 100%">
                <el-table-column
                  prop="id"
                  sortable
                  label="id">
                </el-table-column>
                <el-table-column
                  prop="title"
                  label="产品线">
                </el-table-column>
                <el-table-column
                  prop="name"
                  sortable
                  label="英文名">
                </el-table-column>
                <el-table-column
                  prop="platform"
                  :filters="[{ text: 'ios', value: 'ios' }, { text: 'android', value: 'android' }]"
                  :filter-method="filterTag"
                  label="平台">
                </el-table-column>
                <el-table-column
                  prop="num"
                  label="配置数">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editname(scope.row,'prod')">修改</el-button>
                    <el-button @click="handleClick(scope.row)" type="text" size="small">配置</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-tab-pane>
        <el-tab-pane label="Beta环境"  :lazy="true" name="beta" >
          <el-container>
            <el-header class="app-line-header" style="height: 40px;line-height: 40px">
              <h3>Beta环境</h3>
            </el-header>
            <el-main>
              <el-table
                :data="beta"
                border
                v-loading="loading"
                style="width: 100%">
                <el-table-column
                  prop="id"
                  sortable
                  label="id">
                </el-table-column>
                <el-table-column
                  prop="title"
                  label="产品线">
                </el-table-column>
                <el-table-column
                  prop="name"
                  sortable
                  label="英文名">
                </el-table-column>
                <el-table-column
                  prop="platform"
                  :filters="[{ text: 'ios', value: 'ios' }, { text: 'android', value: 'android' }]"
                  :filter-method="filterTag"
                  label="平台">
                </el-table-column>
                <el-table-column
                  prop="num"
                  label="配置数">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editname(scope.row,'beta')">修改</el-button>
                    <el-button @click="handleClick(scope.row)" type="text" size="small">配置</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>

        </el-tab-pane>
        <el-tab-pane label="测试环境"  :lazy="true" name="test" >
          <el-container>
            <el-header class="app-line-header" style="height: 40px;line-height: 40px">
              <h3>测试环境</h3>
            </el-header>
            <el-main>
              <el-table
                :data="test"
                border
                v-loading="loading"
                style="width: 100%">
                <el-table-column
                  prop="id"
                  sortable
                  label="id">
                </el-table-column>
                <el-table-column
                  prop="title"
                  label="产品线">
                </el-table-column>
                <el-table-column
                  prop="name"
                  sortable
                  label="英文名">
                </el-table-column>
                <el-table-column
                  prop="platform"
                  :filters="[{ text: 'ios', value: 'ios' }, { text: 'android', value: 'android' }]"
                  :filter-method="filterTag"
                  label="平台">
                </el-table-column>
                <el-table-column
                  prop="num"
                  label="配置数">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editname(scope.row,'test')">修改</el-button>
                    <el-button @click="handleClick(scope.row)" type="text" size="small">配置</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
      <el-dialog :title="dialogForm.dtitle" :visible.sync="dialogForm.visible" width="30%" @close="dialogClose">
        <el-form :model="dialogForm">
          <el-form-item label="产品名称" :label-width="dialogForm.formLabelWidth">
            <el-input v-model="dialogForm.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="英文名" :label-width="dialogForm.formLabelWidth">
            <el-input v-model="dialogForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户端" :label-width="dialogForm.formLabelWidth">
            <el-radio-group v-model="dialogForm.platform">
              <el-radio label="ios">ios</el-radio>
              <el-radio label="android">android</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogForm.visible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
  import { projectsList, addProjects, updateProjects } from '@/api/app'
  export default {
    name: 'list',
    data() {
      return {
        tabPosition: 'left',
        test: [],
        beta: [],
        prod: [],
        dialogForm: {
          id: 0,
          env: '',
          dtitle: '添加产品线',
          visible: false,
          formLabelWidth: '80px',
          title: '',
          name: '',
          platform: 'ios'

        },
        env: '',
        loading: false
      }
    },
    methods: {

      fetchData(env) {
        this.loading = true
        projectsList().then(response => {
          this[env] = response
          this.loading = false
        })
      },

      addname(type) {
        this.dialogForm.env = type
        this.dialogForm.visible = true
      },
      editname(row, type) {
        this.dialogForm.id = row.id
        this.dialogForm.title = row.title
        this.dialogForm.name = row.name
        this.dialogForm.platform = row.platform
        this.dialogForm.dtitle = '编辑产品线'
        this.dialogForm.env = type
        this.dialogForm.visible = true
      },
      tabClick(elem) {
        this.env = elem.name
        if (elem.name === 'index') {
          return
        }
        this.fetchData(elem.name)
      },
      handleClick(elem) {
        this.$router.push({ name: 'AppConfig', params: { env: this.env, appid: elem.id }})
      },
      dialogClose() {
        this.dialogForm = {
          id: 0,
          env: '',
          dtitle: '添加产品线',
          visible: false,
          formLabelWidth: '80px',
          title: '',
          name: '',
          platform: 'ios'

        }
      },
      filterTag(value, row) {
        return row.platform === value
      },
      save() {
        const data = {
          title: this.dialogForm.title,
          name: this.dialogForm.name,
          env: this.dialogForm.env,
          platform: this.dialogForm.platform
        }
        if (this.dialogForm.id === 0) {
          addProjects(data).then(response => {
            if (response.status === 1) {
              this.$notify.success({
                title: '成功',
                message: response.message
              })
              this.fetchData(data.env)
              this.dialogForm.visible = false
            } else {
              this.$notify.error({
                title: '失败',
                message: response.message
              })
            }
          })
        } else {
          updateProjects(this.dialogForm.id, data).then(response => {
            if (response.status === 1) {
              this.$notify.success({
                title: '成功',
                message: response.message
              })
              this.fetchData(data.env)
              this.dialogForm.visible = false
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
  }
</script>

<style scoped>
  .app-line-header h3{
    float: left;
    margin: 0;
  }
  .app-line-add{
    float: right;
  }
</style>
