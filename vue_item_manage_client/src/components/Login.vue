<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
  .login_container {
    position: relative;
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
</style>
