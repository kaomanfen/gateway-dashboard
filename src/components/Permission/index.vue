<template>
  <div class="permisson">
    <slot v-if="status"></slot>
  </div>

</template>

<script>
  import { componentCheck } from '@/utils/permission'
  export default {
    name: 'permissionCheck',
    props: [
      'routeInfo',
      'componentName'
    ],
    mounted() {
      this.status = componentCheck(this.routeInfo, this.componentName)
    },
    watch: {
      routeInfo() {
        this.status = componentCheck(this.routeInfo, this.componentName)
      }
    },
    data() {
      return {
        status: true
      }
    },
    methods: {

    }
  }
</script>

<style scoped>
.permisson{
  display:initial;
}

</style>
