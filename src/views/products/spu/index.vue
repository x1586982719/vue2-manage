<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getSpuList" :show="!FormVisible" />
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="scene == 'spu'">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSpu"
          :disabled="!category3Id"
          >添加SPU
        </el-button>
        <el-table :data="SpuList.records" border>
          <el-table-column
            label="序号"
            type="index"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="操作" prop="id">
            <template slot-scope="row">
              <el-button
                type="success"
                icon="el-icon-plus"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                @click="edit(row)"
              ></el-button>
              <el-button type="info" icon="el-icon-message"></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteSpu(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="getSpuList(category3Id)"
          @current-change="getSpuList(category3Id)"
          :current-page.sync="page"
          :page-size.sync="limit"
          :page-sizes="[1, 2, 3, 4, 5]"
          layout="total,sizes,prev, pager, next, jumper"
          :total="SpuList.total"
          style="textalign: center; margin-top: 30px"
        >
        </el-pagination>
      </div>
      <SpuForm
        @getSaveSpu="getSaveSpu"
        :scene="scene"
        v-show="scene == 'addSpu' || scene == 'editSpu'"
        ref="spu"
      />
      <SkuForm
        @changeScenes="getSaveSku"
        v-show="scene == 'skuForm'"
        ref="sku"
      />
    </el-card>
  </div>
</template>

<script>
import CategorySelect from "@/components/CategorySelect";
import SpuForm from "./SpuForm/index.vue";
import SkuForm from "./SkuForm/index.vue";
export default {
  name: "Spu",
  data() {
    return {
      scene: "spu",
      FormVisible: true,
      SpuList: {},
      limit: 5,
      page: 1,
      category1Id: undefined,
      category2Id: undefined,
      category3Id: undefined,
    };
  },
  methods: {
    async getSpuList(categoryId) {
      if (categoryId instanceof Object) {
        const { category1Id, category2Id, category3Id } = categoryId;
        this.category1Id = category1Id;
        this.category2Id = category2Id;
        this.category3Id = category3Id;
      } else {
        this.category3Id = categoryId;
      }
      const { page, limit } = this;
      let res = await this.$API.spu.reqSpuList(page, limit, this.category3Id);
      if (res.code === 200) {
        this.SpuList = res.data;
      }
    },
    async deleteSpu(row) {
      try {
        await this.$API.spu.reqDeleteSpu(row.row.id);
        this.$message.success("删除成功！");
        this.getSpuList(this.category3Id);
      } catch (error) {
        this.$message(error);
      }
    },
    getSaveSpu(scene) {
      this.scene = scene;
      this.getSpuList(this.category3Id);
    },
    getSaveSku(scene) {
      this.scene = scene;
    },
    edit(row) {
      this.scene = "editSpu";
      this.$refs.spu.SpuInit(row.row.id);
    },
    addSpu() {
      this.scene = "addSpu";
      this.$refs.spu.AddSpu(this.category3Id);
    },
    addSku(row) {
      this.scene = "skuForm";
      let { category1Id, category2Id, category3Id } = this;
      this.$refs.sku.initSkuForm(row.row.id, {
        category1Id,
        category2Id,
        category3Id,
      });
    },
  },
  components: { CategorySelect, SpuForm, SkuForm },
};
</script>

<style lang="scss" scoped>
</style>