<template>
    <el-main class="new-timeline">
      <ul class="timeline-ul">
        <li class="timeline-item" v-for="(item,index) in logs" :key="index">
          <div class="timeline-item-tail" :class="logs.length-1===index ? lastItem : ''"></div>
          <div class="timeline-item-head">
            <span class="avatar">
            </span>
          </div>
          <div class="timeline-item-content">
            <div class="heade">
              <div class="timeago">
                {{item.create_time}}
              </div>
              <div class="headetype headeText">
                项目动态
              </div>
              <div class="headetime headeText">
                {{item.created_at}}
              </div>
            </div>
            <div class="content">
              <span v-html="item.content"></span>
              <TimeLine :diff-data="item.data" ></TimeLine>
            </div>
          </div>
        </li>
        <li class="timeline-item" v-if="logs.length>0">
          <div class="timeline-item-last"></div>
          <div class="timeline-item-content last-block" v-loading="loading">
            <el-button type="text"  @click="loadMore" v-if="current_page!==last_page">查看更多</el-button>
            <span  v-else>以上为全部内容</span>
          </div>
        </li>
        <li class="timeline-item" v-else>
          <div class="timeline-item-last"></div>
          <div class="timeline-item-content last-block">
            <span>没有动态数据</span>
          </div>
        </li>
      </ul>

    </el-main>
</template>

<script>
  import { operationLogs } from '@/api/log'
  import { formatTime } from '@/utils/index'
  import TimeLine from '@/components/TimeLine'
  export default {
    name: 'activity',
    props: ['dataId', 'type'],
    components: {
      TimeLine
    },
    data() {
      return {
        current_page: null,
        last_page: null,
        logs: [],
        loading: false

      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      dataId() {
        this.fetchData()
      }
    },
    computed: {
      lastItem() {
        return {
          'last-item': true
        }
      }

    },
    methods: {
      fetchData() {
        operationLogs(this.type, this.dataId).then(response => {
          this.current_page = response.current_page
          this.last_page = response.last_page
          response.data.forEach((item) => {
            const unixTime = new Date(item.created_at)
            item.create_time = formatTime(unixTime.getTime() / 1000)
          })
          this.logs = response.data
        })
      },
      loadMore() {
        this.current_page++
        this.loading = true
        operationLogs(this.type, this.dataId, this.current_page).then(response => {
          this.current_page = response.current_page
          this.last_page = response.last_page
          response.data.forEach((item) => {
            const unixTime = new Date(item.created_at)
            item.create_time = formatTime(unixTime.getTime() / 1000)
            this.logs.push(item)
            this.loading = false
          })
        })
      }

    }

  }
</script>

<style scoped>
  .new-timeline{
    margin-left: 100px;
    overflow:initial;
  }
  .timeline-ul {
    list-style-type:none;

  }
  .timeline-item{
    min-height: 60px;
    position: relative;
    padding: 0 0 20px;
    list-style: none;
    margin: 0;
    font-size: 13px;
  }
  .timeline-item-tail{
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 4px solid #4895ea;
  }
  .timeline-item-last{
    position: absolute;
    left: 4px;
    height: 100%;
  }
  .timeline-item-head .avatar{
    position:absolute;
    left: -3.5px;
    border: 4px solid #4895ea;
    box-sizing: content-box;
    border-radius: 200px;
    background-color: #FFF;
    width: 10px;
    height: 10px;
    overflow:hidden;
  }
  .timeline-item-content{
    min-width: 300px;
    width: 75%;
    margin-left: 70px;
    padding: 0;
    padding-bottom: 10px;
    border-radius: 8px;
  }
  .timeline-item-content .timeago{
    position: absolute;
    left: -120px;
    color: #c0c1c1;
  }
  .timeline-item-content .heade{
    height: 40px;
    line-height: 40px;
    background-color: rgba(203, 227, 249, 0.35);
  }
  .timeline-item-content .headeText{
    color: #797c94;
  }
  .timeline-item-content .headetype{
    padding: 0 10px;
    float: left;
  }
  .timeline-item-content .headetime{
    float: left;
  }
  .timeline-item-content .content{
    min-height: 50px;
    padding: 10px;
    color: #797c94;
    background-color: rgba(203, 227, 249, 0.18);
  }

  .last-item{
    border-left: 4px dotted #4895ea;
  }
  .last-block{
    background-color: rgba(203, 227, 249, 0.18);
    text-align: center;
    height: 40px;
    line-height: 40px;

  }
</style>
