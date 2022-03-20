<template>
  <el-form label-width="80px">
    <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格（元）" type="number" v-model="skuInfo.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input placeholder="重量（千克）" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline label-width="100px">
        <el-form-item :label="item.attrName" v-for="(item,index) in spuAttrInfoList" :key="item.id"
                      style="margin-bottom: 10px">
          <el-select placeholder="请选择" value-key="valueId" v-model="skuInfo.skuAttrValueList[index]">
            <el-option :value="{attrId:item.id,valueId:ele.id}" v-for="ele in item.attrValueList" :key="ele.id"
                       :label="ele.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline label-width="100px">
        <el-form-item :label="item.saleAttrName" v-for="(item,index) in spuSaleAttrList" :key="item.id">
          <el-select placeholder="请选择" v-model="skuInfo.skuSaleAttrValueList[index]" value-key="saleAttrValueId">
            <el-option :value="{saleAttrId:item.id,saleAttrValueId:ele.id}" v-for="ele in item.spuSaleAttrValueList"
                       :key="ele.id" :label="ele.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table border :data="spuImageList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column label="图片">
          <template v-slot="{row}">
            <img :src="row.imgUrl" style="width: 100px;height: 100px"/>
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称"></el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" v-show="row.isDefault==='0'" @click="setDefault(row)">设为默认</el-button>
            <el-button size="mini" v-show="row.isDefault==='1'">默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      spuAttrInfoList: [],
      //收集的sku信息
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          /*{
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          },*/
        ],
        //平台属性
        skuAttrValueList: [
          {
            /*attrId: 0,
            valueId: 0,*/
          },
        ],
        //销售属性
        skuSaleAttrValueList: [
          {
            /*id: 0,
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0,*/
          },
        ],
      },
      spu: {}
    }
  },
  methods: {
    //初始化数据
    async getData(spu, cForm) {
      const {category1Id, category2Id, category3Id} = cForm
      //收集父组件传来的数据
      this.skuInfo.category3Id = category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      //获取图片
      let result = await this.$api.sku.reqSpuImageList(spu.id)
      if (result.code === 200) {
        this.spuImageList = result.data
        this.spuImageList.forEach(value => {
          this.$set(value, 'isDefault', '0')
        })
      }
      //获取销售属性数据
      result = await this.$api.sku.reqSpuSaleAttrList(spu.id)
      if (result.code === 200) {
        this.spuSaleAttrList = result.data
      }
      //获取平台属性数据
      result = await this.$api.sku.reqAttrInfoList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.spuAttrInfoList = result.data
      }
    },
    //取消按钮回调
    cancel() {
      this.$emit('changeScene', 0)
      Object.assign(this.$data, this.$options.data())
    },
    //表格复选框改变时的回调（参数是数组：被选中的数据）
    handleSelectionChange(params) {
      this.skuInfo.skuImageList = params.map(value => {
        return {
          imgName: value.imgName,
          imgUrl: value.imgUrl,
          isDefault: value.isDefault,
          spuImageId: value.id
        }
      })
    },
    //设置默认按钮事件
    setDefault(row) {
      this.spuImageList.forEach(value => {
        value.isDefault = '0'
      })
      row.isDefault = '1'
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    async save() {
      const res = await this.$api.sku.reqAddSku(this.skuInfo)
      if (res.code === 200) {
        this.$message.success('保存成功！')
        this.cancel()
      }
    }
  }
}
</script>

<style scoped>

</style>
