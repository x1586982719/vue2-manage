<template>
  <div>
    <el-form label-width="100px" ref="form">
      <el-form-item label="SPU名称">{{ SpuInfo.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuForm.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格（元）">
        <el-input v-model="skuForm.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量（千克）">
        <el-input v-model="skuForm.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" v-model="skuForm.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in AttrInfoList"
            :key="attr.id"
          >
            <el-select v-model="attr.attrIdAndValueId">
              <el-option
                v-for="attrVal in attr.attrValueList"
                :key="attrVal.id"
                :label="attrVal.valueName"
                :value="`${attr.id}:${attrVal.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.saleAttrName"
            v-for="attr in SpuSaleAttrList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                v-for="val in attr.spuSaleAttrValueList"
                :label="val.saleAttrValueName"
                :value="`${attr.id}:${val.id}`"
                :key="val.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="SpuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column label="图片" width="width">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      skuForm: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      imageList: [],
      SpuInfo: [],
      SpuImageList: [],
      SpuSaleAttrList: [],
      AttrInfoList: [],
    };
  },
  methods: {
    cancel() {
      this.$emit("changeScenes", "spu");
    },
    async initSkuForm(spuId, { category1Id, category2Id, category3Id }) {
      this.skuForm.category3Id = category3Id;
      this.skuForm.spuId = spuId;
      let ResSpuInfo = await this.$API.spu.reqSpuInfo(spuId);
      if (ResSpuInfo.code === 200) {
        this.SpuInfo = ResSpuInfo.data;
        this.skuForn = this.SpuInfo.tmId;
      }
      let ResSpuImageList = await this.$API.spu.reqSpuImgList(spuId);
      if (ResSpuImageList.code === 200) {
        ResSpuImageList.data.forEach((item) => {
          item.isDefault = 0;
        });
        this.SpuImageList = ResSpuImageList.data;
      }
      let ResSpuSaleAttrList = await this.$API.spu.reqSpuSaleAttrList(spuId);
      if (ResSpuSaleAttrList.code === 200) {
        this.SpuSaleAttrList = ResSpuSaleAttrList.data;
      }
      let ResAttrInfoList = await this.$API.spu.reqAttrInfoList({
        category1Id,
        category2Id,
        category3Id,
      });
      if (ResAttrInfoList.code === 200) {
        this.AttrInfoList = ResAttrInfoList.data;
      }
    },
    handleSelectionChange(params) {
      this.imageList = params;
    },
    changeDefault(row) {
      this.SpuImageList.forEach((item) => (item.isDefault = 0));
      row.isDefault = 1;
      this.skuForm.skuDefaultImg = row.imgUrl;
    },
    async save() {
      const { AttrInfoList, skuForm, SpuSaleAttrList, imageList } = this;

      //平台属性
      skuForm.skuAttrValueList = AttrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //销售属性
      skuForm.skuSaleAttrValueList = SpuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      skuForm.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //发请求
      console.log(skuForm);

      let result = await this.$API.spu.reqAddSku(skuForm);

      if (result.code === 200) {
        this.$message({ type: "success", message: "添加SKU成功" });
        this.$emit("changeScenes", "spu");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>