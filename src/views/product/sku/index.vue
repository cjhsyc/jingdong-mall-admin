<template>
  <div>
    <el-card>
      <el-table border :data="skuList" style="margin-bottom: 20px">
        <el-table-column type="index" align="center" width="80" label="序号"></el-table-column>
        <el-table-column prop="skuName" width="200" label="名称"></el-table-column>
        <el-table-column prop="skuDesc" width="200" label="描述"></el-table-column>
        <el-table-column prop="xxx" width="140" label="默认图片">
          <template v-slot="{row}">
            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px"/>
          </template>
        </el-table-column>
        <el-table-column prop="weight" width="100" label="重量(kg)"></el-table-column>
        <el-table-column prop="price" width="100" label="价格(元)"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button type="success" icon="el-icon-sort-down" size="mini" title="下架"
                       v-show="row.isSale===1" style="margin-left: 10px" @click="cancelSale(row)"></el-button>
            <el-button type="success" icon="el-icon-sort-up" size="mini" title="上架"
                       v-show="row.isSale===0" @click="onSale(row)"></el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
            <el-button type="info" icon="el-icon-info" size="mini" title="查看详情" @click="getInfo(row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" layout="prev, pager, next, jumper, ->, total, sizes" :total="total"
                     :page-sizes="[3, 5, 10, 20]" :page-size="limit" style="text-align: center"
                     @current-change="currentChange" @size-change="sizeChange">
      </el-pagination>
      <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" size="40%">
        <el-row>
          <el-col :span="6">名称</el-col>
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述</el-col>
          <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格</el-col>
          <el-col :span="16">{{ skuInfo.price }}元</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性</el-col>
          <el-col :span="16">
            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin-right: 5px">
              {{ item.attrName }}-{{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-col :span="16">
            <!--indicator-position="outside"-->
            <el-carousel height="350px" width="350px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="" style="width: 100%"/>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      skuList: [],
      skuInfo: {},
      drawer: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    async getSkuList() {
      const res = await this.$api.sku.reqSkuList(this.page, this.limit)
      if (res.code === 200) {
        this.total = res.data.total
        this.skuList = res.data.records
      }
    },
    currentChange(page) {
      this.page = page
      this.getSkuList()
    },
    sizeChange(size) {
      this.limit = size
      this.page = 1
      this.getSkuList()
    },
    async cancelSale(row) {
      const res = await this.$api.sku.reqCancel(row.id)
      if (res.code === 200) {
        row.isSale = 0
        this.$message.success('下架成功！')
      }
    },
    async onSale(row) {
      const res = await this.$api.sku.reqSale(row.id)
      if (res.code === 200) {
        row.isSale = 1
        this.$message.success('上架成功！')
      }
    },
    edit() {
      this.$message('正在开发中。。。')
    },
    //sku详情
    async getInfo(sku) {
      const res = await this.$api.sku.reqSkuByID(sku.id)
      if (res.code === 200) {
        this.skuInfo = res.data
        this.drawer = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-drawer__body {
  padding: 20px;

  .el-row {
    padding-top: 10px;

    .el-col {
      font-size: 18px;
      padding-right: 10px;
    }

    .el-col-6 {
      font-weight: bold;
      text-align: right;
    }
  }
}

/*scss中的深度选择器*/
::v-deep .el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: lightskyblue;
  border-radius: 50%;
}
</style>
