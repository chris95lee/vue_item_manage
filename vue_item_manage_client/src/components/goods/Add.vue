<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <el-steps :active="activeIndex - 0" finish-status="success" space="20%" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProp" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="selectedTableCheckList">
                <el-checkbox v-for="(cb ,i) in item.attr_vals" :key="i" :label="cb" border checked></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 之前发送请求时，在main.js中可见axios请求拦截器都添加了token。但这里的upload并没有添加，于是在headers请求头中绑定 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 基本信息tab
      activeIndex: '0',
      // 添加商品的表单
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 商品参数tab
      // 动态参数列表数据
      manyTableData: [],
      selectedTableCheckList: [],
      // 商品小户型tab
      onlyTableData: [],
      // 上传图片
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        authorization: window.sessionStorage.getItem('token')
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
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data
    },
    // cascader
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return this.$message.error('请选择三级分类')
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClicked () {
      // 访问商品参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品属性失败')
        }
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    // 图片
    handlePreview (file) {
      console.log(file)
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    handleSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    }
  },
  computed: {
    cateID () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
  .el-checkbox {
    margin: 0 5px 0 0!important;
  }
</style>
