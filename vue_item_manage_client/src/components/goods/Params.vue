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
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isBtnDisable">添加参数</el-button>
            <el-table :data="manyTableData" border stripe>
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template>
                  <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isBtnDisable">添加属性</el-button>
            <el-table :data="onlyTableData" border stripe>
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
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
      },
      // 激活页签
      activeName: 'many',
      manyTableData: [],
      onlyTableData: []
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
      this.getParamsData()
    },
    handleTabClick () {
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData () {
      if (this.selectedCate.length !== 3) {
        this.selectedCate = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取信息失败')
      }
      this.$message.success('获取信息成功')
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    }
  },
  computed: {
    isBtnDisable () {
      if (this.selectedCate.length !== 3) {
        return true
      }
      return false
    },
    // 当前分类的id
    cateID () {
      if (this.selectedCate.length === 3) {
        return this.selectedCate[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
  .cate_opt {
    margin: 15px 0;
  }
</style>
