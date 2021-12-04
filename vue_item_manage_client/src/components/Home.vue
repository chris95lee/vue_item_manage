<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/brand.jpg" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px' ">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition = "false">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
              <!-- 二级菜单模板区 -->
              <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-peoplefill',
        103: 'iconfont icon-commandfill',
        101: 'iconfont icon-goodsnewfill',
        102: 'iconfont icon-cart_fill_light',
        145: 'iconfont icon-form_fill_light'
      },
      // 是否折叠
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      // 清空token
      window.sessionStorage.clear()
      // 重定向到login
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    // 点击按钮实现折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    div {
      display: flex;
      align-items: center;
      img {
          width: 40px;
      }
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right : 10px;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 10px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>>
