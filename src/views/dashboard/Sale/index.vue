<template>
  <div class="out">
    <el-card>
      <div class="header">
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="first"></el-tab-pane>
          <el-tab-pane label="访问量" name="second"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span @click="getDay">本日</span>
          <span @click="getWeek">本周</span>
          <span @click="getMonth">本月</span>
          <span @click="getYear">本年</span>
          <el-date-picker
            class="datePicker"
            v-model="value"
            value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini">
          </el-date-picker>
        </div>
      </div>
      <div class="content">
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <div class="ranking">
              <h3>门店{{ title }}排名</h3>
              <ul>
                <li>
                  <span class="index topThree">1</span>
                  <span class="store">肯德基</span>
                  <span class="sales">23232</span>
                </li>
                <li>
                  <span class="index topThree">2</span>
                  <span class="store">肯德基</span>
                  <span class="sales">23232</span>
                </li>
                <li>
                  <span class="index topThree">3</span>
                  <span class="store">肯德基</span>
                  <span class="sales">23232</span>
                </li>
                <li>
                  <span class="index">4</span>
                  <span class="store">肯德基</span>
                  <span class="sales">23232</span>
                </li>
                <li>
                  <span class="index">5</span>
                  <span class="store">肯德基</span>
                  <span class="sales">23232</span>
                </li>
                <li>
                  <span class="index">6</span>
                  <span class="store">肯德基</span>
                  <span class="sales">23232</span>
                </li>
                <li>
                  <span class="index">7</span>
                  <span class="store">肯德基</span>
                  <span class="sales">23232</span>
                </li>
                <li>
                  <span class="index">8</span>
                  <span class="store">肯德基</span>
                  <span class="sales">23232</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'

export default {
  name: "Sale",
  data() {
    return {
      value: [],//  日期
      activeName: 'first',
      myCharts: null
    }
  },
  computed: {
    title() {
      return this.activeName === 'first' ? '销售额' : '访问量'
    }
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts)
    this.myCharts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月',],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          type: 'bar',
          barWidth: '60%',
          data: [233, 52, 200, 334, 390, 330, 220, 231, 345, 643, 123, 34]
        }
      ]
    })
  },
  watch: {
    activeName() {
      this.myCharts.setOption({
        title: {
          text: this.title + '趋势',
        },
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            data: this.title === '销售额' ? [233, 52, 200, 334, 390, 330, 220, 231, 345, 643, 123, 34] : [32, 123, 45, 656, 432, 78, 258, 434, 654, 143, 456, 255]
          }
        ]
      })
    }
  },
  methods: {
    getDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.value = [day, day]
    },
    getWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.value = [start, end]
    },
    getMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.value = [start, end]
    },
    getYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.value = [start, end]
    }
  }
}
</script>

<style scoped lang="scss">
.out {
  padding: 20px 0;

  .header {
    position: relative;

    .tab {
      width: 100%;
    }

    .right {
      position: absolute;
      right: 0;
      top: 0;

      .datePicker {
        width: 220px;
      }

      span {
        padding: 0 10px;
        cursor: pointer;
      }
    }
  }

  .content {
    .charts {
      width: 100%;
      height: 300px;
    }

    .ranking {
      h3 {
        margin: 0;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          padding: 5px 0;

          .index {
            border-radius: 50%;
            display: inline-block;
            width: 18px;
            height: 18px;
            text-align: center;
            float: left;
          }

          .topThree {
            color: white;
            background-color: deeppink;
          }

          .store {
            padding-left: 20px;
          }

          .sales {
            float: right;
          }
        }
      }
    }
  }
}


</style>
