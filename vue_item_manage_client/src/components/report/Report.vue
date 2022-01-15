<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <div id="main" style="width: 1000px; height: 600px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts
import * as echarts from 'echarts'

export default {
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#e9eef3'
            }
          }
        }
      }
    }
  },
  created () {

  },
  // 页面上面的DOM元素已经渲染完毕
  async mounted () {
    const mainCharts = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    const newData = Object.assign(res.data, this.options)
    mainCharts.setOption(newData)
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
