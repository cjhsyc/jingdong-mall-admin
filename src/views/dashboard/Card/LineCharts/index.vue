<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "LineCharts",
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
          type: 'line',
          data: [30, 40, 10, 50, 20, 22, 12, 45, 34],
          itemStyle: {//拐点样式
            opacity: 0
          },
          lineStyle: {
            color: 'blue',
          },
          areaStyle: {
            color: {//渐变色
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'blue' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          smooth: true,//平滑的
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
