<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "BarCharts",
  mounted() {
    const lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [30, 40, 10, 50, 20, 22, 12, 45, 34, 44, 26, 56],
        }
      ],
      grid: {
        left: 0,
        bottom: 0,
        top: 0,
        right: 0,
      }
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
