<template>
<div>
  <headermenu :id="id"></headermenu>
<router-view></router-view>
</div>

</template>
<script>
import Headermenu from './components/headerMenu'
export default {
  name: 'groupMain',
  components: {
    Headermenu
  },
  data() {
    return {}
  },
  watch: {
    $route() {
      this.setTitle()
    }
  },
  created() {
    this.setTitle()
  },
  props: ['id'],
  methods: {
    setTitle() {
      if (this.$store.state.app.sidebar.selected) {
        this.$route.matched[0].meta.title = this.$store.state.app.sidebar.selected.name
        this.$route.matched[0].redirect = '/zone/' + this.$store.state.app.sidebar.selected.id
      } else {
        this.$route.matched[0].meta.title = '分组'
      }
      if (this.$store.state.app.app.selected) {
        this.$route.matched[1].meta.title = this.$store.state.app.app.selected.name
      } else {
        this.$route.matched[1].meta.title = '项目'
      }
    }
  }
}
</script>
