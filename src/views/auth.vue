<template>

</template>
<script>
  export default {
    name: 'auth',
    created() {
      this.check()
    },
    methods: {
      check() {
        const token = this.$route.query.token
        if (token) {
          this.$store.dispatch('AuthLogin', token).then(() => {
            this.$router.push({ path: '/' })
          })
        } else {
          this.$router.push({ path: '/login' })
        }
      }
    }

  }
</script>
