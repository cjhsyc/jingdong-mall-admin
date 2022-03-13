<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addTradeMark">添加</el-button>
    <el-table :data="list" style="width: 100%;margin: 20px 0 20px" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="400" align="center">
      </el-table-column>
      <el-table-column label="品牌logo" width="400" align="center">
        <template v-slot="{row}">
          <img :src="row.logoUrl" alt="品牌logo" style="width: 100px;height: 100px">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" layout="prev, pager, next, jumper, ->, total, sizes" :total="total"
                   :page-sizes="[3, 5, 10, 20]" :page-size="limit" @current-change="getPageList"
                   @size-change="sizeChange"
                   style="text-align: center">
    </el-pagination>
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <el-form :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" :label-width="'90px'" prop="tmName">
          <el-input autocomplete="off" style="width: 80%" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" :label-width="'90px'" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <div class="el-upload">
              <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddTradeMark">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      list: [],
      dialogFormVisible: false,
      tmForm: {
        tmName: '',
        logoUrl: '',
      },
      rules: {
        tmName: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'},
          {min: 1, max: 15, message: '长度不超过 15 个字符', trigger: 'change'}
        ],
        logoUrl: [
          {required: true, message: '请上传图片'}
        ]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    async getPageList(page = 1) {
      this.page = page
      const result = await this.$api.tradeMark.reqTradeMarkList(this.page, this.limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    sizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
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
    addTradeMark() {
      this.tmForm.logoUrl = ''
      this.tmForm.tmName = ''
      this.dialogFormVisible = true
    },
    updateTradeMark(row) {
      this.tmForm = {...row}//不能将row的引用直接赋给tmForm，因为修改tmForm也会修改row
      this.dialogFormVisible = true
    },
    addOrUpdateTradeMark() {
      //判断是否通过表单验证
      this.$refs.ruleForm.validate(async (bo) => {
        if (bo) {
          this.dialogFormVisible = false
          const result = await this.$api.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
          console.log(result)
          if (result.code === 200) {
            this.$message.success(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
            this.tmForm.id ? this.getPageList(this.page) : this.getPageList()
          }
        } else {
          return false
        }
      })

    },
    cancelAddTradeMark() {
      this.dialogFormVisible = false
    },
    deleteTradeMark(row) {
      this.$confirm('此操作将永久删除该品牌, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await this.$api.tradeMark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getPageList(this.list.length ? this.page : this.page - 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>
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
