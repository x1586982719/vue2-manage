<template>
    <div>
        <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加</el-button>
        <el-table :data="listData.records" style="width: 100%;">
            <el-table-column prop="id" label="序号" width="80px">
            </el-table-column>
            <el-table-column prop="tmName" label="品牌名称" width="width">
            </el-table-column>
            <el-table-column prop="logoUrl" label="品牌logo" width="width">
                <template slot-scope="{row}">
                    <img :src="row.logoUrl" style="width:100px;height:100px">
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{row}">
                    <el-button type="warning" icon="el-icon-edit" @click="editTradeMark(row)">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination @size-change="getList()" @current-change="getList()" :current-page.sync="page"
                :page-size.sync="limit" :page-sizes="[1, 2, 3, 4, 5]" layout="total,sizes,prev, pager, next, jumper"
                :total="listData.total" style="textAlign:center;margin-top:30px">
            </el-pagination>
        </div>
        <el-dialog :title="form.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogVisible" width="50%">
            <el-form :model="form" style="width: 80%" :rules="rules" ref="ruleForm" label-position="left">
                <el-form-item label="品牌名称" prop="tmName" label-width="100px">
                    <el-input v-model="form.tmName" placeholder="请输入品牌名称" style="width:300px;margin: 15px 0"></el-input>
                </el-form-item>
                <el-form-item label="添加图片" prop="logoUrl" label-width="100px">
                    <el-upload class="avatar-uploader" action="dev-api/admin/product/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep"

export default {
    name: 'Products',
    data() {
        return {
            page: 1,
            limit: 5,
            listData: [],
            dialogVisible: false,
            form: {
                logoUrl: '',
                tmName: '',
            },
            rules: {
                // 写没写过自定义表单验证
                tmName: [
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
                ],
                logoUrl: [
                    { required: true, message: '请上传logo', trigger: 'change' }
                ],
            }
        }

    },
    created() {
        this.getList()
    },
    // 放在mouted和created里面的区别
    // 是什么？
    // 放在那个里面更好
    // mounted() {

    // },
    methods: {
        // async和await的用法和prmise的区别
        async getList() {
            let { page, limit } = this
            let result = await this.$API.trademark.reqTradeMarkList(page, limit)
            if (result.code === 200) {
                this.listData = result.data
            }
        },
        submit() {
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    this.dialogVisible = false
                    let result = await this.$API.trademark.reqTradeMarkUpdate(this.form)
                    if (result.code === 200) {
                        this.$message.success(this.form.id ? '修改品牌成功' : '添加品牌成功')
                        this.form = { logoUrl: '', tmName: '' }
                        this.page = Math.ceil(this.listData.total / this.limit); //跳转到最后一页
                        this.getList()
                    } else {
                        return Promise.reject(new Error('faile'))
                    }
                }
            });

        },
        handleAvatarSuccess(res, file) {
            this.form.logoUrl = res.data
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        editTradeMark(row) {
            this.dialogVisible = true
            this.attrAdd = cloneDeep(row)
        },
        deleteTradeMark(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'

                });
                let { id } = row
                let result = await this.$API.trademark.reqTradeMarkDelete(id)
                if (result.code === 200) {
                    this.$message.success('删除成功！')
                    this.page = Math.ceil(this.listData.total / this.limit); //跳转到最后一页
                    this.getList()
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        cancel() {
            this.dialogVisible = false
            if (this.form.id) {
                this.form = { logoUrl: '', tmName: '' }
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>