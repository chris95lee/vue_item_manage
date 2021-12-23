<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列expand -->
        <el-table-column type="expand">
          <template v-slot="slot">
            <el-row v-for="(item1, i1) in slot.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span=5>
                <el-tag closable @close="removeRightById(slot.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span=19>
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 !== 0 ? 'bdtop' : '', 'vcenter']">
                  <!-- 二级 -->
                  <el-col :span=6>
                    <el-tag type="success" closable @close="removeRightById(slot.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span=18>
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(slot.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列index -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="slot">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(slot.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(slot.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(slot.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleFormVisible" width="50%" :before-close="handleClose" @close="addDialogClosed">
      <!-- 表单主体 -->
      <el-form :model="addRoleForm" ref="addRoleFormRef" :rules="addRoleRules" label-width="90px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 表单底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editRoleFormVisible" width="50%" :before-close="handleClose" @close="editDialogClosed">
      <!-- 表单主体 -->
      <el-form :model="editRoleForm" ref="editRoleFormRef" :rules="editRoleRules" label-width="90px">
        <el-form-item label="角色名称">
          <el-input v-model="editRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <!-- 表单底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形结构 -->
      <el-tree :data="rightTree" show-checkbox node-key="id" default-expand-all :props="treeProps" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      // 添加角色对话框
      addRoleFormVisible: false,
      // 添加角色的表单
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色表单的验证规则对象
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 修改角色
      editRoleFormVisible: false,
      // 修改角色的表单
      editRoleForm: {},
      // 修改角色的表单的规则
      editRoleRules: {
        roleName: [],
        roleDesc: []
      },
      // 分配角色权限
      setRightDialogVisible: false,
      // 所有权限tree
      rightTree: [],
      // tree控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的节点的id值数组
      defKeys: [],
      // 记录弹出分配权限框的的角色的id
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    // 添加角色
    addRole () {
      this.addRoleFormVisible = true
    },
    // 添加角色对话框
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 监听添加角色对话框关闭
    addDialogClosed () {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 显示修改角色对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      }
      this.editRoleForm = res.data
      this.editRoleFormVisible = true
    },
    // 监听修改对话框关闭
    editDialogClosed () {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 修改角色信息并提交
    editRoleInfo () {
      // 预验证
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败')
        }
        // 成功：关闭对话框，刷新数据列表，提示修改成功
        this.editRoleFormVisible = false
        this.getRoleList()
        this.$message.success('更新角色信息成功')
      })
    },
    // 删除角色信息
    async removeRoleById (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // confirmResult确认删除返回字符串confirm，取消返回字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getRoleList()
    },
    // 根据id删除权限
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // 这样会导致页面重新刷新
      // this.getRoleList()
      role.children = res.data
    },
    // 展示设置权限对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/' + 'tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有权限数据失败')
      }
      this.rightTree = res.data
      // 递归获取三级节点
      // this.defKeys = []
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 获取角色选中的三级权限的id，保存到defKeys
    getLeafKeys (node, arr) {
      // 如果当前node节点不包含children属性，即已经是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击确定将选中和半选中的权限发送给后端
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('修改权限失败')
      }
      this.$message.success('修改权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
