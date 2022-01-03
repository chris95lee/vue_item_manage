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
            <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加参数</el-button>
            <el-table :data="manyTableData" border stripe>
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showModifyDialog(scope.row.attr_id)">修改</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialog(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible=true">添加属性</el-button>
            <el-table :data="onlyTableData" border stripe>
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showModifyDialog(scope.row.attr_id)">修改</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteDialog(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 添加属性/参数对话框 -->
      <el-dialog :title="'添加' + DialogText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
          <el-form-item :label="DialogText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改属性/参数对话框 -->
      <el-dialog :title="'修改' + DialogText" :visible.sync="modifyDialogVisible" width="50%" @close="modifyDialogClosed">
        <el-form ref="modifyFormRef" :model="modifyForm" :rules="modifyFormRules" label-width="100px">
          <el-form-item :label="DialogText" prop="attr_name">
            <el-input v-model="modifyForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyParams">确 定</el-button>
        </span>
      </el-dialog>
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
      onlyTableData: [],
      // 添加参数对话框
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 修改参数对话框
      modifyDialogVisible: false,
      modifyForm: {
        attr_name: ''
      },
      modifyFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
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
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框显示隐藏
        item.inputVisible = false
        // 文本框输入的值
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 捕捉关闭对话框时重置表单
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 提交表单
    addParams () {
      // 表单预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateID}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('提交信息失败')
        }
        this.$message.success('提交信息成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 修改对话框
    async showModifyDialog (attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes/${attrId}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.modifyForm = res.data
      this.modifyDialogVisible = true
    },
    modifyParams () {
      this.$refs.modifyFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${this.modifyForm.attr_id}`,
          {
            attr_name: this.modifyForm.attr_name,
            attr_sel: this.activeName
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数信息失败')
        }
        this.$message.success('修改参数信息成功')
        this.getParamsData()
        this.modifyDialogVisible = false
      })
    },
    modifyDialogClosed () {
      this.$refs.modifyFormRef.resetFields()
    },
    // 删除参数
    /*
    deleteDialog (id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { data: res } = this.$http.delete(`categories/${this.cateID}/attributes/${id}`)
        console.log(res)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getParamsData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
    */
    async deleteDialog (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateID}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParamsData()
    },
    // +tag
    showInput (row) {
      row.inputVisible = true
      // 文本框自动获得焦点
      // nextTick当页面中的元素重新渲染后才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      const { data: res } = await this.$http.put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
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
    },
    // 添加对话框
    DialogText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
  .cate_opt {
    margin: 15px 0;
  }
  .el-tag {
    margin: 5px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
