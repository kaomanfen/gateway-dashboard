<template>
  <el-container>
    <el-header style="height: 40px;line-height: 40px">
      <h3 >API 列表</h3>
    </el-header>
    <el-main>
      <el-table
        :data="tableList"
        @selection-change="apiListSelect">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="项目">
          <template slot-scope="scope">
            {{scope.row.project.name !== null ? scope.row.project.name:''}}
          </template>
        </el-table-column>
        <el-table-column
          label="API名称">
          <template slot-scope="scope">
            {{scope.row.api.name}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="delApis([scope.row.id])">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <div class="table-bottom">
      <el-button size="small" style="float: left" @click="allDel">批量删除</el-button>
    </div>
  </el-container>
</template>

<script>
  import { detailList, detailDel } from '@/api/trafficControl'
  export default {
    name: 'trafficControlDetail',
    data() {
      return {
        tableList: [],
        selectApis: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        detailList(this.$route.params.detailId).then(response => {
          this.tableList = response
        })
      },
      apiListSelect(val) {
        this.selectApis = val
      },
      allDel() {
        const ids = []
        this.selectApis.forEach(function(item) {
          ids.push(item.id)
        })

        this.delApis(ids)
      },
      delApis(ids) {
        const data = {
          ids: ids
        }
        detailDel(this.$route.params.detailId, data).then(response => {
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
      }
    }
  }
</script>

<style scoped>
.table-bottom{
  margin: 10px;
}
</style>
