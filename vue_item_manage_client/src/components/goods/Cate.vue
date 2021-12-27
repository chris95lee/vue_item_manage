<template>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
        <!-- 添加分类 -->
        <el-row>
          <el-col :span="4">
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
          <!-- 是否有效 -->
          <template slot="isOK" slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.cat_deleted===false"></i>
            <i class="el-icon-close" v-else></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" type="primary" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!-- 编辑 -->
          <template slot="opt">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </tree-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </el-card>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
        <el-form :model="addCateForm" ref="addCateFormRef" :rules="addCateFormRules" width="100px">
          <el-form-item label="分类名称" prop="cat_name" label-width="100px">
            <el-input v-model="addCateForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" label-width="100px">
            <el-cascader v-model="parentCate" :options="parentCateList" :props="cascaderProps" clearable @change="parentCateChange"></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      cateList: [],
      // 总数据条数
      total: 0,
      // 为table指定列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 当前列使用模板，及其名称
          type: 'template',
          template: 'isOK'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '编辑',
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 选中的父级分类列表
      parentCate: [],
      // 级联选择器cascader配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加分类
    showAddCateDialog () {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 获取父级分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories/', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      this.parentCateList = res.data
    },
    // 监听添加分类表单信息变化
    parentCateChange () {
      if (this.parentCate.length > 0) {
        this.addCateForm.cat_pid = this.parentCate[this.parentCate.length - 1]
        this.addCateForm.cat_level = this.parentCate.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加分类
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories/', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类信息失败')
        }
        this.$message.success('添加分类信息成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加对话框关闭事件
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.parentCate = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
  .treeTable {
    margin-top: 15px;
  }
  .el-cascader {
    width: 100%;
  }
</style>>
