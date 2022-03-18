<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option :value="tm.id" v-for="tm in tradeMarketList" :key="tm.id" :label="tm.tmName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImages">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" v-model="attr" value-key="id">
          <el-option :value="item" v-for="item in unSelectSaleAttr" :key="item.id" :label="item.name"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left: 20px" :disabled="!attr.id"
                   @click="addSaleAttr">添加销售属性
        </el-button>
        <el-table border style="margin: 20px 0" :data="spu.spuSaleAttrList">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性名" width="200" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值名称列表">
            <template v-slot="{row}">
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable
                      :disable-transitions="false"
                      @close="row.spuSaleAttrValueList.splice(index,1)">{{ tag.saleAttrValueName }}
              </el-tag>
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" :ref="row.saleAttrName"
                        size="small" @keyup.enter.native="$refs[row.saleAttrName].blur()"
                        @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">+ 添 加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240">
            <template v-slot="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSpu">保存</el-button>
        <el-button @click="$emit('changeScene',0);Object.assign($data,$options.data())">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: "",
        spuImageList: [],
        spuSaleAttrList: [],
      },
      tradeMarketList: [],
      spuImages: [],
      baseSaleAttrList: [],
      attr: {},//未选择的销售属性的ID和名称
    }
  },
  computed: {
    //还未选择的销售属性
    unSelectSaleAttr() {
      return this.baseSaleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((ele) => {
          return ele.saleAttrName !== item.name
        })
      })
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.spuImages = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      this.spuImages = fileList
    },
    async initSpuData(spu) {
      let result = await this.$api.spu.reqSpu(spu.id)
      if (result.code === 200) {
        this.spu = result.data
      }
      result = await this.$api.spu.reqTradeMarketList()
      if (result.code === 200) {
        this.tradeMarketList = result.data
      }
      result = await this.$api.spu.reqSpuImages(spu.id)
      if (result.code === 200) {
        const spuImages = result.data
        spuImages.forEach((item) => {
          item.url = item.imgUrl
          item.name = item.imgName
        })
        this.spuImages = spuImages
      }
      result = await this.$api.spu.reqBaseSaleAttrList()
      if (result.code === 200) {
        this.baseSaleAttrList = result.data
      }
    },
    addSaleAttr() {//添加销售属性
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId: this.attr.id,
        saleAttrName: this.attr.name,
        spuSaleAttrValueList: []
      })
      this.attr = {}
    },
    addSaleAttrValue(row) {//添加按钮事件
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      this.$nextTick(() => {
        this.$refs[row.saleAttrName].focus()
      })
    },
    handleInputConfirm(row) {
      const {baseSaleAttrId, inputValue} = row
      if (inputValue.trim() === '') {
        this.$message.warning('属性值不能为空！')
        row.inputVisible = false
        return
      }
      if (row.spuSaleAttrValueList.some(value => {
        return value.saleAttrValueName === inputValue
      })) {
        this.$message.warning('已有该属性值！')
        row.inputVisible = false
        return;
      }
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName: inputValue
      })
      row.inputVisible = false
    },
    async saveSpu() {
      this.spu.spuImageList = this.spuImages.map(value => {
        return {
          imgName: value.name,
          imgUrl: value.response?.data || value.url,
        }
      })
      const result = await this.$api.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        this.$message.success('保存成功！')
        this.$emit('changeScene', 0)
      }
      Object.assign(this.$data,this.$options.data())
    },
    async addSpuData(id) {
      this.spu.category3Id = id
      let result = await this.$api.spu.reqTradeMarketList()
      if (result.code === 200) {
        this.tradeMarketList = result.data
      }
      result = await this.$api.spu.reqBaseSaleAttrList()
      if (result.code === 200) {
        this.baseSaleAttrList = result.data
      }
    }
  }
}
</script>

<style scoped>
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
