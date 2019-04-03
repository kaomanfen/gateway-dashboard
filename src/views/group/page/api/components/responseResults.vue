<template>
  <el-form :model="form" :rules="rules" ref="form" label-width="120px" style="margin-top: 50px" class="ruleForm">
    <el-form-item label="返回类型">
      <el-radio-group v-model="form.response_type" @change="returnType">
        <el-radio :label="1">json</el-radio>
        <el-radio :label="2">html</el-radio>
        <el-radio :label="3">透传</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="响应参数" v-if="form.response_type===1">
      <schema-editor v-if="form.response_type===1 && form.response!==undefined" v-model="form.response"></schema-editor>
    </el-form-item>
    <el-form-item>
      <span slot="label">MOCK 参数
        <el-tooltip class="item" effect="dark" content="在发布测试之前使用" placement="top-end">
        <i class="el-icon-question"></i>
        </el-tooltip>
      </span>
      <json-editor theme="neat" v-model="form.mock"></json-editor>
    </el-form-item>
    <el-form-item label="错误码">
      <el-card shadow="never" class="error-params">
        <div slot="header" class="clearfix">
          <el-table
            :data="form.errorData"
            style="width: 100%">
            <el-table-column
              prop="code"
              label="错误码"
              width="200px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.code" placeholder="例：10000"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="msg"
              label="错误信息"
            width="300px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.msg" placeholder="例：参数不全"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="desc"
              label="描述"
              width="300px">
              >
              <template slot-scope="scope">
                <el-input v-model="scope.row.desc" placeholder="错误描述"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="todo"
              label="操作"
              >
              >
              <template slot-scope="scope">
                <el-button type="text" @click="remove(scope)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
        <el-button type="primary" size="mini" @click="add">添加一条</el-button>
      </el-card>
    </el-form-item>
    <el-form-item label="备注">
      <tui-editor v-model="form.remark"></tui-editor>
    </el-form-item>
    <el-form-item>
      <el-button  style="margin-top: 12px;" @click="previous">上一步</el-button>
      <el-button  style="margin-top: 12px;" type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import TuiEditor from '@/components/TuiEditor/editor'
  import SchemaEditor from '@/components/SchemaEditor/index'
  import JsonEditor from '@/components/Editor'
export default {
    name: 'responseResults',
    props: ['value'],
    components: {
      SchemaEditor,
      TuiEditor,
      JsonEditor
    },
    data() {
      return {
        form: this.value,
        rules: {}
      }
    },
    methods: {
      add() {
        this.form.errorData.push({
          code: '',
          msg: '',
          desc: ''
        })
      },
      remove(item) {
        const index = this.form.errorData.indexOf(item.row)
        if (index !== -1) {
          this.form.errorData.splice(index, 1)
        }
      },
      returnType(type) {
        if (type !== 1) {
          this.form.bodyGroup = undefined
        }
      },
      previous() {
        this.$emit('active-num', 2)
        this.$emit('input', this.form)
      },
      submit() {
        this.$emit('input', this.form)
        this.$emit('submit', true)
      }

    }
  }
</script>

<style>
.error-params .el-card__body{
  padding: 5px 10px;
}
</style>
