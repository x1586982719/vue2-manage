<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" v-model="form">
      <el-form-item label="一级分类" style="padding-right: 30px">
        <el-select
          v-model="form.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            v-for="first in list1"
            :key="first.id"
            :label="first.name"
            :value="first.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" style="padding-right: 30px">
        <el-select
          v-model="form.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            v-for="second in list2"
            :key="second.id"
            :label="second.name"
            :value="second.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" style="padding-right: 30px">
        <el-select
          v-model="form.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            v-for="third in list3"
            :key="third.id"
            :label="third.name"
            :value="third.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      form: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      attrInfoList: [],
    };
  },
  props: ["show"],
  mounted() {
    this.getCategory();
  },
  methods: {
    async getCategory() {
      let res = await this.$API.attr.reqCategoryList1();
      if (res.code === 200) {
        this.list1 = res.data;
      }
    },
    async handler1() {
      this.list2 = [];
      this.list3 = [];
      this.form.category2Id = "";
      this.form.category3Id = "";
      const { category1Id } = this.form;
      let res = await this.$API.attr.reqCategoryList2(category1Id);
      if (res.code === 200) {
        this.list2 = res.data;
      }
    },
    async handler2() {
      this.list3 = [];
      this.form.category3Id = "";
      const { category2Id } = this.form;
      let res = await this.$API.attr.reqCategoryList3(category2Id);
      if (res.code === 200) {
        this.list3 = res.data;
      }
    },
    async handler3() {
      const { category1Id, category2Id, category3Id } = this.form;
      this.$emit("getCategoryId", { category1Id, category2Id, category3Id });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>