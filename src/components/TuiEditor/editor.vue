<template>
  <div class="vue-tui-editor"></div>
</template>

<script>
require('codemirror/lib/codemirror.css') // codemirror
require('tui-editor/dist/tui-editor.css') // editor ui
require('tui-editor/dist/tui-editor-contents.css') // editor content
require('highlight.js/styles/github.css') // code block highlight
require('./editor.css')
const Editor = require('tui-editor')
export default {
  props: ['value'],
  name: 'tuiEditor',
  data() {
    return {
      editor: null,
      contentBackup: ''
    }
  },
  mounted() {
    const vm = this
    const editor = this.editor = new Editor({
      el: this.$el,
      initialEditType: 'wysiwyg',
      previewStyle: 'tab',
      height: '500px',
      language: 'zh',
      initialValue: this.value
    })
    editor.on('change', function() {
      const content = editor.getHtml()
      vm.$emit('input', content)
      vm.contentBackup = content
    })
  }

}
</script>

<style scoped>

</style>
