<template>
    <div>
        <el-card class="box-card">
            <CategorySelect @getCategoryId="getCategoryId" :show="!FormVisible" />
        </el-card>
        <el-card class="box-card">
            <div v-show="FormVisible">
                <el-button type="primary" style="margin-bottom:10px" @click="addAttr"
                    :disabled="!categoryId.category3Id">添加属性</el-button>
                <el-table :data="AttrInfo">
                    <el-table-column prop="id" label="序号" width="100px"></el-table-column>
                    <el-table-column prop="attrName" label="属性名" width="250px">
                    </el-table-column>
                    <el-table-column prop="attrValueList" label="属性值列表" width="">
                        <template slot-scope="{row}">
                            <el-tag v-for="tag in row.attrValueList" :key="tag.id" style="margin-right:10px">{{
                            tag.valueName
                            }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300px">
                        <template slot-scope="{row}">
                            <el-button type="warning" icon="el-icon-edit" style="margin:0 10px" @click="AttrEdit(row)">
                                修改</el-button>
                            <el-popconfirm :title="`确定删除${row.attrName}吗？`" @onConfirm="AttrDelete(row)">
                                <el-button type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="!FormVisible">
                <el-form>
                    <el-form-item label="属性名">
                        <el-input v-model="attrAdd.attrName" style="width:200px"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="el-icon-plus" @click="pushAttrValue" :disabled="!attrAdd.attrName">
                    添加属性</el-button>
                <el-table :data="attrAdd.attrValueList" style="width: 100%; margin: 20px 0px" border>
                    <el-table-column label="序号" width="100" align="center" type="index"></el-table-column>
                    <el-table-column label="属性值名称" prop="valueName">
                        <template slot-scope="{row,$index}">
                            <el-input v-model="row.valueName" @blur="iptBlur(row)" @keyup.native.enter="iptBlur(row)"
                                v-if="row.flag" :ref="$index"></el-input>
                            <span v-else style="display:block" @click="toEdit(row, $index)">{{ row.valueName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{$index}">
                            <el-button type="danger" icon="el-icon-delete" @click="deleteAttrValue($index)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="saveSubmit">提交</el-button>
                <el-button @click="FormVisible = true">取消</el-button>
            </div>
        </el-card>

    </div>
</template>

<script>
import CategorySelect from "@/components/CategorySelect"
import cloneDeep from "lodash/cloneDeep"
export default {
    name: 'attr',
    data() {
        return {
            count: 3,
            FormVisible: true,
            AttrInfo: [],
            categoryId: {
                category1Id: '',
                category2Id: '',
                category3Id: ''
            },
            attrAdd: {
                attrName: '',
                attrValueList: [],
                categoryId: 0,
                categoryLevel: 3,
            }
        }
    },
    components: { CategorySelect },
    methods: {
        async getCategoryId(categoryId) {
            const { category1Id, category2Id, category3Id } = categoryId
            Object.assign(this.categoryId, categoryId)//合并对象
            let res = await this.$API.attr.reqAttrInfoList(category1Id, category2Id, category3Id)
            if (res.code === 200) {
                this.AttrInfo = res.data
            }
        },
        async AttrDelete(row) {
            console.log(row);
            try {
                await this.$API.attr.reqAttrDelete(row.id)
                this.$message.success('成功删除！')
                this.getCategoryId(this.categoryId)
            }
            catch (error) {
                this.$message(error)
            }

        },
        addAttr() {
            this.FormVisible = false
            this.attrAdd = {
                attrName: '',
                attrValueList: [],
                categoryId: this.categoryId.category3Id,
                categoryLevel: 3,
            }
        },
        pushAttrValue() {
            this.attrAdd.attrValueList.push({
                attrId: this.attrAdd.id,
                valueName: '',
                flag: true //添加时默认输入框显示
            })
            this.$nextTick(() => {
                this.$refs[this.attrAdd.attrValueList.length - 1].focus()
            })
        },
        deleteAttrValue(index) {
            this.attrAdd.attrValueList.splice(index, 1)
        },
        async saveSubmit() {
            this.attrAdd.attrValueList = this.attrAdd.attrValueList.filter(item => {
                if (item.valueName != '') {
                    delete item.flag
                    return true
                }
            })
            try {
                await this.$API.attr.reqAttrSave(this.attrAdd)
                this.$message.success('添加成功！')
                this.FormVisible = true
                this.getCategoryId(this.categoryId)
            } catch (error) {
                this.$message(error)
            }
        },
        AttrEdit(row) {
            this.FormVisible = false
            this.attrAdd = cloneDeep(row)
            this.attrAdd.attrValueList.forEach((item) => {
                //这样书写也可以给属性值添加flag自动，但是会发现视图不会跟着变化（因为flag不是响应式数据）
                //因为Vue无法探测普通的新增 property,这样书写的属性并非响应式属性（数据变化视图跟这边）
                //第一个参数:对象  第二个参数:添加新的响应式属性  第三参数：新的属性的属性值
                // 这个是什么意思？你知道不》我没问你项目里面的这个
                // 我问的是为什么要用$set
                // 如果是直接里面插入flag,视图不是响应式
                // item.flag = false;
                // 这个地方是因为item里面刚开始不含有flag，导致加载时找不到，用set就可以避免这个问题如果item.flag的话就没有flag这个值
                // 获取不到这个值
                // 这个问题面试百分之90会问

                // this.$get(item)
                this.$set(item, "flag", false);
            });
        },
        iptBlur(row) {
            if (row.valueName.trim() == '') {
                this.$message.warning('内容不能为空！')
                return
            }
            const res = this.attrAdd.attrValueList.some(item => {
                if (item !== row) {
                    return item.valueName.trim() == row.valueName.trim()
                }
            })
            if (res) {
                this.$message.warning('内容不能重复！')
                return
            }
            row.flag = false
        },
        toEdit(row, index) {
            row.flag = true
            console.log(index, 'index');
            // 这为什么要用nextTick
            // 这个也是
            // 你了解一下
            // nextTick的用法
            this.$nextTick(() => {
                console.log(this.$refs[index], 'this.$refs');
                this.$refs[index].focus()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}

.box-card {
    width: 100%;
    margin-bottom: 30px;
}
</style>