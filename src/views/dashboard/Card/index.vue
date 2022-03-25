<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" content="￥ 12233">
            <template v-slot:charts>
              <span>周同比55.5%</span><i class="el-icon-caret-top"></i>&nbsp;
              <span>日同比11.11%</span><i class="el-icon-caret-bottom"></i>
            </template>
            <template v-slot:footer>
              <span>日销售额 ￥ 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" content="112233">
            <template v-slot:charts>
              <LineCharts></LineCharts>
            </template>
            <template v-slot:footer>
              <span>日销售额 ￥ 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" content="112233">
            <template v-slot:charts>
              <BarCharts></BarCharts>
            </template>
            <template v-slot:footer>
              <span>日销售额 ￥ 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" content="50%">
            <template v-slot:charts>
              <Progress></Progress>
            </template>
            <template v-slot:footer>
              <span>周同比55.5%</span><i class="el-icon-caret-top"></i>&nbsp
              <span>日同比11.11%</span><i class="el-icon-caret-bottom"></i>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import LineCharts from './LineCharts'
import BarCharts from './BarCharts'
import Progress from './Progress'

export default {
  name: "Card",
  components: {
    BarCharts, Detail, LineCharts, Progress
  }
}
</script>

<style scoped>
.el-icon-caret-top {
  color: #409eff;
}

.el-icon-caret-bottom {
  color: red;
}
</style>
