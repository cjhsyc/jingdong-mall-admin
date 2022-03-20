<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!==0"/>
    </el-card>
    <el-card>
      <div v-show="scene===0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!cForm.category3Id" @click="addSpu">添加SPU
        </el-button>
        <el-table border :data="records" style="margin: 20px 0">
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="190"></el-table-column>
          <el-table-column prop="description" label="spu描述"></el-table-column>
          <el-table-column label="操作" width="300">
            <template v-slot="{row}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku"
                           @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu"
                           @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu所有sku列表"
                           @click="showSku(row)"></hint-button>
              <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="page" layout="prev, pager, next, jumper, ->, total, sizes" :total="total"
                       :page-sizes="[3, 5, 10, 20]" :page-size="limit" style="text-align: center"
                       @current-change="currentChange" @size-change="sizeChange">
        </el-pagination>
      </div>
      <SpuForm v-show="scene===1" @changeScene="changeScene" ref="spuForm"></SpuForm>
      <SkuForm v-show="scene===2" @changeScene="changeScene" ref="skuForm"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="closeDialog">
      <el-table :data="skuList" v-loading="loading">
        <el-table-column property="skuName" label="名称" width="150"></el-table-column>
        <el-table-column property="price" label="价格(元)" width="200"></el-table-column>
        <el-table-column property="weight" label="重量(kg)"></el-table-column>
        <el-table-column label="默认图片">
          <template v-slot="{row}">
            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px"/>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import CategorySelect from '@/components/CategorySelect'
import SpuForm from "@/views/product/spu/SpuForm";
import SkuForm from '@/views/product/spu/SkuForm'

export default {
  name: "Spu",
  components: {
    SkuForm,
    SpuForm,
    CategorySelect
  },
  data() {
    return {
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      page: 1,
      limit: 5,
      records: [],//spu列表数据
      total: 0,
      scene: 0,
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true,
    }
  },
  methods: {
    getCategoryId(cForm) {
      this.cForm = cForm
      if (this.cForm.category3Id) {
        this.getSpuList()
      }
    },
    async getAttrList() {
      const {category1Id, category2Id, category3Id} = this.cForm
      const result = await this.$api.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    async getSpuList() {
      const result = await this.$api.spu.reqSpuList(this.page, this.limit, this.cForm.category3Id)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    currentChange(page) {
      this.page = page
      this.getSpuList()
    },
    sizeChange(size) {
      this.limit = size
      this.getSpuList()
    },
    addSpu() {
      this.scene = 1
      this.$refs.spuForm.addSpuData(this.cForm.category3Id)
    },
    updateSpu(row) {
      this.$refs.spuForm.initSpuData(row)
      this.scene = 1
    },
    changeScene(value) {
      this.scene = value
      this.getSpuList()
    },
    addSku(row) {
      this.$refs.skuForm.getData(row, this.cForm)
      this.scene = 2
    },
    //查看sku列表
    async showSku(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      const res = await this.$api.sku.reqShowSku(spu.id)
      if (res.code === 200) {
        this.skuList = res.data
        this.loading = false
      }
    },
    //关闭对话框之前的回调
    closeDialog(done){
      this.skuList = []
      this.loading = true
      done()//关闭对话框
    }
  }
}
</script>

<style scoped>

</style>
