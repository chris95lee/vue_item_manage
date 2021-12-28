<template>
  <div>
    <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <!-- 警告区域 -->
        <el-alert type="warning" title="注意：只允许为第三级分类设置相关参数" :closable="false" show-icon></el-alert>
        <!-- 选择商品分类区域 -->
        <el-row class="cate_opt">
          <el-col>
            <span>选择商品分类：</span>
            <el-cascader v-model="selectedCate" :options="goodCateList" :props="cateProps" @change="handleChange"></el-cascader>
          </el-col>
        </el-row>
        <!-- 切换区域 -->
      </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 级联选择框
      selectedCate: [],
      goodCateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败')
      }
      this.goodCateList = res.data
    },
    handleChange () {
      if (this.selectedCate.length !== 3) {
        this.selectedCate = []
        return
      }
      this.$message.success('选择成功')
    }
  }
}
</script>

<style lang="less" scoped>
  .cate_opt {
    margin: 15px 0;
  }
</style>
