<template>
  <el-container>
    <el-header>Header <el-button type="info" @click="logout">退出</el-button></el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      // 清空token
      window.sessionStorage.clear()
      // 重定向到login
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>>
