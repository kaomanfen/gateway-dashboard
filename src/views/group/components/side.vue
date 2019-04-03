<template>
  <el-tabs  v-model="activeName" type="border-card" class="group-api-card">
    <el-tab-pane label="接口列表" name="api">
      <el-row :gutter="10">
        <el-col :span="15">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="apiList">
          </el-input>
        </el-col>
        <permission-check :route-info="$route" component-name="apiCategoryAdd">
          <el-col :span="1">
            <el-button type="primary" @click="openDialogCategory">添加分类</el-button>
          </el-col>
        </permission-check>
      </el-row>
      <div style="max-height:75vh;overflow:auto;" class="side">
        <el-tree
          :data="apiData"
          node-key="id"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="apiTree"
          @node-click="select"
          :expand-on-click-node=false
          :default-expanded-keys="defaultExpandedKeys"
          v-loading="loading"
          highlight-current
          style="margin-top: 5px;">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span><svg-icon icon-class='folder' v-if="data.children !== undefined" style="margin-right: 5px"/>{{ node.data.name }}</span>
          <span class="tree-edit" v-if="(data.children !== undefined) && (data.id !== 0)">
            <permission-check :route-info="$route" component-name="GroupAddApiByCategory">
              <el-tooltip class="item" effect="dark" content="添加接口" placement="top">
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="() => append(data)" icon="el-icon-plus">
               </el-button>
              </el-tooltip>
            </permission-check>
            <permission-check :route-info="$route" component-name="apiCategoryEdit">
            <el-tooltip class="item" effect="dark" content="修改分类" placement="top">
              <el-button
                type="text"
                size="mini"
                @click.stop="() => edit(node, data)" icon="el-icon-edit">
              </el-button>
            </el-tooltip>
            </permission-check>
            <permission-check :route-info="$route" component-name="apiCategoryRemove">
            <el-tooltip class="item" effect="dark" content="删除分类" placement="top">
              <el-button
                type="text"
                size="mini"
                @click.stop="() => remove(node, data)" icon="el-icon-delete">
              </el-button>
            </el-tooltip>
            </permission-check>
          </span>
          <span class="tree-edit" v-if="(data.children == undefined) && (data.id !== 0)">
            <el-popover
              placement="top"
              width="250"
              v-model="copyApiVisible[data.id]">
  <p>接口【{{ data.name }}】您要</p>
  <div style="text-align: right; margin: 0">
     <el-button type="primary" size="mini" @click="copyApi(node, data,'version')">版本升级</el-button>
    <el-button type="primary" size="mini" @click="copyApi(node, data,'copy')">复制</el-button>
  </div>


               <el-button
                type="text"
                size="mini"
                @click.stop="()=>{}"
                 slot="reference" icon="el-icon-document">
              </el-button>
          </el-popover>
            <!--<el-tooltip class="item" effect="dark" content="删除接口" placement="top">-->
              <!--<el-button-->
                <!--type="text"-->
                <!--size="mini"-->
                <!--@click.stop="() => removeApi(node, data)" icon="el-icon-delete">-->
              <!--</el-button>-->
            <!--</el-tooltip>-->
          </span>
      </span>
        </el-tree>
      </div>

      <el-dialog :title="formCategory.title" :visible.sync="dialogFormCategory" width="30%">
        <el-form :model="formCategory" :rules="formCategoryRules" ref="formCategory">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="formCategory.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类备注" >
            <el-input v-model="formCategory.description" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormCategory = false">取 消</el-button>
          <el-button type="primary" v-if="dialogFormCategoryType==='add'" @click="addCategory('formCategory')">确 定</el-button>
          <el-button type="primary" v-if="dialogFormCategoryType==='update'" @click="updateCategory('formCategory')">更 新</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane label="测试集合" name="test">
      <el-row :gutter="10">
        <el-col :span="15">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="testList">
          </el-input>
        </el-col>
        <permission-check :route-info="$route" component-name="testCategoryAdd">
        <el-col :span="1">
          <el-button type="primary" @click="openDialogTestCategory">添加集合</el-button>
        </el-col>
        </permission-check>
      </el-row>
      <div style="max-height:75vh;overflow:auto;" class="side">
        <el-tree
          :data="testData"
          node-key="id"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="testTree"
          @node-click="testSelect"
          :expand-on-click-node=false
          v-loading="loading"
          highlight-current
          style="margin-top: 5px;">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span><svg-icon icon-class='folder' v-if="data.children !== undefined" style="margin-right: 5px"/>{{ node.data.name }}</span>
          <span class="tree-edit" v-if="(data.children !== undefined) && (data.id !== 0)">
            <!--<el-tooltip class="item" effect="dark" content="导入接口" placement="top">-->
              <!--<el-button-->
                <!--type="text"-->
                <!--size="mini"-->
                <!--@click.stop="() => testAppend(data)" icon="el-icon-plus">-->
            <!--</el-button>-->
            <!--</el-tooltip>-->
            <permission-check :route-info="$route" component-name="testCategoryEdit">
            <el-tooltip class="item" effect="dark" content="修改集合" placement="top">
              <el-button
                type="text"
                size="mini"
                @click.stop="() => testEdit(node, data)" icon="el-icon-edit">
              </el-button>
            </el-tooltip>
            </permission-check>
            <permission-check :route-info="$route" component-name="testCategoryRemove">
            <el-tooltip class="item" effect="dark" content="删除集合" placement="top">
              <el-button
                type="text"
                size="mini"
                @click.stop="() => testRemove(node, data)" icon="el-icon-delete">
              </el-button>
            </el-tooltip>
            </permission-check>
          </span>
          <span class="tree-edit" v-if="(data.children == undefined) && (data.id !== 0)">
            <permission-check :route-info="$route" component-name="testRemove">
            <el-tooltip class="item" effect="dark" content="删除用例" placement="top">
              <el-button
                type="text"
                size="mini"
                @click.stop="() => testRemoveApi(node, data)" icon="el-icon-delete">
              </el-button>
            </el-tooltip>
            </permission-check>
          </span>
      </span>
        </el-tree>
      </div>
      <el-dialog :title="testFormCategory.title" :visible.sync="testDialogFormCategory" width="30%">
        <el-form :model="testFormCategory" :rules="testFormCategoryRules" ref="testFormCategory">
          <el-form-item label="集合名称" prop="name">
            <el-input v-model="testFormCategory.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="简介" >
            <el-input v-model="testFormCategory.description" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="testDialogFormCategory = false">取 消</el-button>
          <el-button type="primary" v-if="testDialogFormCategoryType==='add'" @click="addTestCategory('testFormCategory')">确 定</el-button>
          <el-button type="primary" v-if="testDialogFormCategoryType==='update'" @click="updateTestCategory('testFormCategory')">更 新</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getApiMenu, getTestMenu } from '@/api/menu'
import { deleteCase, apiCopy } from '@/api/api'
import { addCategory, updateCategory, delectCategory, addTestCategory, updateTestCategory, delectTestCategory } from '@/api/object'
import Bus from '@/components/bus'
export default {
  name: 'side',
  data() {
    return {
      activeName: 'api',
      apiList: '',
      testList: '',
      defaultExpandedKeys: [],
      apiData: [{
        id: 0,
        name: '全部接口',
        description: '',
        children: []
      }],
      testData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: true,
      dialogFormCategory: false,
      formCategory: {
        name: '',
        description: '',
        id: 0,
        title: ''
      },
      dialogFormCategoryType: '',
      formCategoryRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },

      testDialogFormCategory: false,
      testFormCategory: {
        name: '',
        description: '',
        id: 0,
        title: ''
      },
      testDialogFormCategoryType: '',
      testFormCategoryRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      copyApiVisible: {}

    }
  },
  created() {
    this.fetchData()
    Bus.$on('side-tab-select', (e) => {
      this.activeName = e
    })
    if (this.$route.params.listId) {
      this.defaultExpandedKeys.push(this.$route.params.listId / 1)
    }
    if (this.$route.params.apiId) {
      this.defaultExpandedKeys.push(this.$route.params.apiId / 1)
    }
  },
  watch: {
    apiList(val) {
      this.$refs.apiTree.filter(val)
    },
    testList(val) {
      this.$refs.testTree.filter(val)
    }
  },
  methods: {
    fetchData() {
      const getApiMenuStatus = getApiMenu(this.$route.params.id).then(response => {
        this.apiData = [{
          id: 0,
          name: '全部接口',
          description: '',
          children: []
        }, ...response]
        this.loading = false
      })
      const getTestMenuStatus = getTestMenu(this.$route.params.id).then(response => {
        this.testData = response
        this.loading = false
      })
      return Promise.all([
        getApiMenuStatus,
        getTestMenuStatus
      ])
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    openDialogCategory() {
      this.formCategory.name = ''
      this.formCategory.description = ''
      this.formCategory.title = '添加分类'
      this.dialogFormCategory = true
      this.dialogFormCategoryType = 'add'
    },
    addCategory(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            project_id: this.$route.params.id,
            name: this.formCategory.name,
            description: this.formCategory.description
          }
          addCategory(data).then(response => {
            if (response.status === 1) {
              this.$notify.success({
                title: '成功',
                message: response.message
              })
              this.fetchData()
              this.dialogFormCategory = false
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
    updateCategory(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            name: this.formCategory.name,
            description: this.formCategory.description
          }
          updateCategory(this.formCategory.id, data).then(response => {
            if (response.status === 1) {
              this.$notify.success({
                title: '成功',
                message: response.message
              })
              this.fetchData()
              this.dialogFormCategory = false
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
    delectCategory(id) {
      delectCategory(id).then(response => {
        if (response.status === 1) {
          this.$notify.success({
            title: '成功',
            message: response.message
          })
          this.fetchData()
        } else {
          this.$notify.error({
            title: '失败',
            message: response.message
          })
        }
      })
    },
    select(data) {
      if (data.children) {
        this.$router.push({ name: 'groupList', params: { listId: data.id }})
      } else {
        this.$router.push({ name: 'groupDetail', params: { apiId: data.id }})
      }
    },
    append(data) {
      this.$router.push({ name: 'GroupAddApiByCategory', params: { categoryId: data.id }})
    },
    edit(node, data) {
      this.dialogFormCategoryType = 'update'
      this.formCategory.name = node.data.name
      this.formCategory.description = node.data.description
      this.formCategory.id = node.data.id
      this.dialogFormCategory = true
      this.formCategory.title = '修改分类'
    },
    remove(node, data) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.delectCategory(node.data.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    copyApi(node, data, type) {
      apiCopy(data.id, type).then(response => {
        if (response.status === 1) {
          this.$notify.success({
            title: '成功',
            message: response.message
          })
          this.copyApiVisible[data.id] = false
          this.fetchData().then(() => {
            // 动态展开
            this.$router.push({ name: 'groupDetail', params: { apiId: response.result.id }})
            this.$refs.apiTree.store.nodesMap[node.parent.data.id].expanded = true
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: response.message
          })
        }
      })
    },
    removeApi(node, data) {
      console.log('removeApi')
    },

    openDialogTestCategory() {
      this.testFormCategory.name = ''
      this.testFormCategory.description = ''
      this.testFormCategory.title = '添加集合'
      this.testDialogFormCategory = true
      this.testDialogFormCategoryType = 'add'
    },
    addTestCategory(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            project_id: this.$route.params.id,
            name: this.testFormCategory.name,
            description: this.testFormCategory.description
          }
          addTestCategory(data).then(response => {
            if (response.status === 1) {
              this.$notify.success({
                title: '成功',
                message: response.message
              })
              this.fetchData()
              this.testDialogFormCategory = false
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
    updateTestCategory(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            name: this.testFormCategory.name,
            description: this.testFormCategory.description
          }
          updateTestCategory(this.testFormCategory.id, data).then(response => {
            if (response.status === 1) {
              this.$notify.success({
                title: '成功',
                message: response.message
              })
              this.fetchData()
              this.testDialogFormCategory = false
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
    delectTestCategory(id) {
      delectTestCategory(id).then(response => {
        if (response.status === 1) {
          this.$notify.success({
            title: '成功',
            message: response.message
          })
          this.fetchData()
        } else {
          this.$notify.error({
            title: '失败',
            message: response.message
          })
        }
      })
    },
    deleteCase(id) {
      deleteCase(id).then(response => {
        if (response.status === 1) {
          this.$notify.success({
            title: '成功',
            message: response.message
          })
          this.fetchData()
        } else {
          this.$notify.error({
            title: '失败',
            message: response.message
          })
        }
      })
    },

    testSelect(data) {
      if (data.children) {
        this.$router.push({ name: 'groupTestApiList', params: { testListId: data.id }})
      } else {
        this.$router.push({ name: 'groupTestApi', params: { testId: data.id }})
      }
    },
    testAppend(data) {
      this.$router.push({ name: 'GroupAddApiByCategory', params: { categoryId: data.id }})
    },
    testEdit(node, data) {
      this.testDialogFormCategoryType = 'update'
      this.testFormCategory.name = node.data.name
      this.testFormCategory.description = node.data.description
      this.testFormCategory.id = node.data.id
      this.testDialogFormCategory = true
      this.testFormCategory.title = '修改集合'
    },
    testRemove(node, data) {
      this.$confirm('此操作将永久删除该集合, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.delectTestCategory(node.data.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    testRemoveApi(node, data) {
      this.$confirm('此操作将永久删除该测试用例, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.deleteCase(node.data.id)
        this.$router.push({ name: 'groupTestApiList', params: { testListId: 0 }})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .tree-edit{
    position: absolute;
    right: 1px;
    display:none;
  }
  .custom-tree-node:hover .tree-edit{
    display:inline;
  }
  .side::-webkit-scrollbar {
    display: none;
  }
</style>
