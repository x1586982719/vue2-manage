<template>
  <div>
    <el-form label-width="80px" :model="saveSpu">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input v-model="saveSpu.spuName" autofocus></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmName">
        <el-select v-model="saveSpu.tmId" placeholder="请选择">
          <el-option
            v-for="trademark in trademarkList"
            :key="trademark.id"
            :value="trademark.id"
            :label="trademark.tmName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input v-model="saveSpu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" prop="spuImageList">
        <el-upload
          action="dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-success="handleAvatarSuccess"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" prop="spuSaleAttrList">
        <el-select v-model="attrIdAndAttrName" placeholder="请选择">
          <el-option
            v-for="unselect in unSelectedAttr"
            :key="unselect.id"
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
          >
          </el-option>
        </el-select>
        <el-button type=" primary" icon="el-icon-plus" @click="addAttr"
          >添加销售属性</el-button
        >
        <el-table border :data="saveSpu.spuSaleAttrList">
          <el-table-column
            label="序号"
            width="100"
            type="index"
          ></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性名称列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="attr in row.spuSaleAttrValueList"
                :key="attr.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row, attr)"
              >
                {{ attr.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ New Tag
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ $index }">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteAttr($index)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveBtn">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  //   created() {
  //     this.SpuInit();
  //   },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      attrIdAndAttrName: "",
      trademarkList: [],
      attrList: [],
      saveSpu: {
        category3Id: "",
        spuSaleAttrList: [],
        spuImageList: [],
      },
      spuImageList: [],
      spuInfo: {},
    };
  },
  props: ["scene"],
  methods: {
    async SpuInit(spuId) {
      const SpuInfoRes = await this.$API.spu.reqSpuInfo(spuId); //获取SPU详细数据
      if (SpuInfoRes.code === 200) {
        this.saveSpu = SpuInfoRes.data;
      }
      const TradeMarkListRes = await this.$API.spu.reqTrademarkList(); //获取品牌列表
      if (TradeMarkListRes.code === 200) {
        this.trademarkList = TradeMarkListRes.data;
      }
      const SpuImgListRes = await this.$API.spu.reqSpuImgList(spuId); //获取SPU图片
      if (SpuImgListRes.code === 200) {
        let imgArr = SpuImgListRes.data;
        imgArr.forEach((item) => {
          item.url = item.imgUrl;
          item.name = item.imgName;
        });
        this.spuImageList = imgArr;
      }
      const AttrListRes = await this.$API.spu.reqAttrList(); //获取销售属性列表
      if (AttrListRes.code === 200) {
        this.attrList = AttrListRes.data;
      }
    },
    async AddSpu(category3Id) {
      this.saveSpu.category3Id = category3Id;
      const TradeMarkListRes = await this.$API.spu.reqTrademarkList(); //获取品牌列表
      if (TradeMarkListRes.code === 200) {
        this.trademarkList = TradeMarkListRes.data;
      }
      const AttrListRes = await this.$API.spu.reqAttrList(); //获取销售属性列表
      if (AttrListRes.code === 200) {
        this.attrList = AttrListRes.data;
      }
    },
    cancel() {
      let initSpu = { spuSaleAttrList: [], spuImageList: [] };
      this.saveSpu = initSpu;
      this.spuImageList = [];
      this.$emit("getSaveSpu", "spu");
    },
    addAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.saveSpu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = "";
    },
    deleteAttr($index) {
      this.saveSpu.spuSaleAttrList.splice($index, 1);
    },
    handleClose(row, attr) {
      this.spuSaleAttrList = row.spuSaleAttrValueList.splice(
        row.spuSaleAttrValueList.indexOf(attr),
        1
      );
    },

    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },

    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
      row.inputValue = "";
    },

    async saveBtn() {
      this.saveSpu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageUrl: item.url,
          imageName: item.name,
        };
      });
      const res = await this.$API.spu.reqUpdateOrSaveSpu(this.saveSpu);
      if (res.code === 200) {
        if (this.scene == "editSpu") {
          this.$message.success("修改成功！");
        } else {
          this.$message.success("添加成功！");
        }
        this.$emit("getSaveSpu", "spu");
      }
    },
    handleAvatarSuccess(res, file, filelist) {
      this.spuImageList = filelist;
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file) {
      //将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      //file参数:代表的是删除的那个张图片
      //fileList:照片墙删除某一张图片以后，剩余的其他的图片
      // console.log(file, fileList,22222);
      //收集照片墙图片的数据
      //对于已有的图片【照片钱中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      this.spuImageList = fileList;
    },
  },
  computed: {
    unSelectedAttr() {
      let res = this.attrList.filter((item) => {
        return this.saveSpu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>