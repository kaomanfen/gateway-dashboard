<template>
  <div class="vue-tui-editor"></div>
</template>


<script>
  require('tui-editor/dist/tui-editor-contents.css') // editor content
  const Editor = require('tui-editor/dist/tui-editor-Viewer')
  export default {
    props: ['value'],
    name: 'tuiEditorView',
    data() {
      return {
      }
    },
    watch: {
      value(value) {
        new Editor(Object.assign({
          el: this.$el,
          initialValue: value
        }))
      }
    }

  }
</script>

<style scoped>

</style>
