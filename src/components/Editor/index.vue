<template>
  <div class="json-editor">
    <textarea ref="textarea"></textarea>
  </div>
</template>

<script>
  import CodeMirror from 'codemirror'
  import 'codemirror/addon/lint/lint.css'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/theme/rubyblue.css'
  require('script-loader!jsonlint')
  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/addon/lint/lint'
  import 'codemirror/addon/lint/json-lint'
  import 'codemirror/addon/display/autorefresh'
  export default {
    name: 'jsonEditor',
    data() {
      return {
        jsonEditor: false,
        backText: null
      }
    },
    props: {
      value: {},
      readOnly: {
        type: Boolean,
        default: false
      },
      theme: {
        type: String,
        default: 'rubyblue'
      },
      lineNumbers: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      value(value) {
        const editor_value = JSON.parse(this.jsonEditor.getValue())
        if (JSON.stringify(value) !== JSON.stringify(editor_value)) {
          this.jsonEditor.setValue(JSON.stringify(value, null, 2))
        }
      }
    },
    mounted() {
      require('codemirror/theme/' + this.theme + '.css')
      this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        lineNumbers: this.lineNumbers,
        mode: 'application/json',
        gutters: ['CodeMirror-lint-markers'],
        theme: this.theme,
        autoRefresh: true,
        readOnly: this.readOnly,
        cursorHeight: 1,
        lint: true
      })
      this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      this.jsonEditor.on('cursorActivity', cm => {
        this.$emit('changed', JSON.parse(cm.getValue()))
        this.$emit('input', JSON.parse(cm.getValue()))
      })
    },
    methods: {
      getValue() {
        return this.jsonEditor.getValue()
      }
    }
  }
</script>

<style scoped>
  .json-editor{
    height: 100%;
    position: relative;
  }
  .json-editor >>> .CodeMirror {
    min-height: 300px;
  }
  .json-editor >>> .CodeMirror-scroll{
    min-height: 300px;
  }
  .json-editor >>> .cm-s-rubyblue span.cm-string {
    color: #F08047;
  }
  .json-editor >>> .CodeMirror
  {
    line-height:21px;
  }
</style>
