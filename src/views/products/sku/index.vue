<template>
  <div id="wangeditor">
    <div ref="editorElem"></div>
  </div>
</template>

<script>
import E from "wangeditor";

export default {
  name: "Sku",
  mounted() {
    this.editor = new E(this.$refs.editorElem); //获取组件并构造编辑器
    this.editor.create(); // 创建富文本实例
  },
  beforeUpdate() {
    this.editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "video", // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo", // 重复
    ];
  },
  data() {
    return {
      editor: null,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
