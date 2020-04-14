<template>
  <div>
    <!-- 面包屑头部导航 -->
    <Breadbcrumb :items="titles"></Breadbcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <div class="echarts"></div>
    </el-card>
    </div>
</template>

<script>
import Breadbcrumb from 'components/common/BreadCrumb'
import echarts from 'echarts'

export default {
  components:{
    Breadbcrumb
  },
  data(){
    return{
      titles:["数据统计","数据报表"],
      options:{
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }
    }
  },
  async mounted(){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementsByClassName('echarts')[0]);
    const { data: res } = await this.$http({url:'reports/type/1'})
    // 指定图表的配置项和数据
    var opt = Object.assign({},this.options,res.data);
    console.log(res.data);
    
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(opt);
  },
}
</script>

<style scoped>
.el-card{
  margin-top: 20px;
}
.el-card{
  height: 100vh;
}
.echarts{
  height: 400px;
  margin-top: 15px;
}
</style>