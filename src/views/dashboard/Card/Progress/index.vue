<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "Progress",
  mounted() {
    const lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        //最小值和最大值
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [60],
          barWidth: 15,
          color: 'yellowgreen',
          //背景颜色
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          //文本
          label: {
            show: true,
            formatter: '|',
            position: 'right'
          }
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
