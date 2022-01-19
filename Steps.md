1. 概述
1.1 开发模式：前后端分离
1.2 技术栈：Vue, Vue-router, axios, ElementUI, echarts
2. 项目初始化【使用vue ui创建并配置】
----前台----
2.1 安装Vue-CLI，并创建项目
2.2 配置Vue-router
2.3 配置ElementUI
2.4 配置axios
2.5 初始化git远程库
  【添加公钥ssh-keygen -t -rsa -C 'lh6649298@163.com'】
  【ssh -T git@github.com】
2.6 本地托管到github
----后台----
2.7 安装MySQL
2.8 安装Node.js
2.9 配置项目相关信息
2.10 启动项目
2.11 使用Postman测试后台项目接口是否正常
3. 项目开发
4. serve build
4.1 serve时检查警告包括eslint、定义未使用变量等
4.2 build时检查警告包括size过大、console.log未移除（可通过插件babel-plugin-transform-remove-console自动移除，还可以通过额外的条件控制serve时不移除，build时移除）
5. 项目优化
5.1 项目优化策略
(1) 生成打包报告
  为了直观发现项目中存在的问题
    <1>通过命令行参数的形式生成报告 vue-cli-service build --report
    <2>通过UI面板查看【推荐】可以在控制台和分析面板方便地看到项目中所存在的问题
  通过vue.config.js修改webpack的默认配置
    通过vue-cli 3.0工具生成的项目，默认隐藏了所有webpack的配置项，使得程序员把工作重心放到实现具体功能和业务逻辑上。但如果需要修改webpack配置，则需要通过在根目录创建vue.config.js进行自定义配置
(2) 第三方库启用CDN
  import引入依赖包，都会打包合并到一个文件中，导致单文件体积过大。于是通过webpack的externals节点，配置并加载外部的CDN资源。凡是在externals中声明的第三方依赖包，都不会被打包，而在使用时去window全局查找这个对象来使用。
  <1> 配置externals节点
  <2> public/index.html中添加CDN资源引用css
  <3> public/index.html中添加CDN资源引用js【这里vue和vue-router暂时不用CDN引入01.18】
(3) Element-UI组件CDN优化
  <1> 在main-prod.js中，注释掉element-ui按需加载的代码
  <2> 在index.html中，通过CDN加载element-ui的js和css样式
(4) 路由懒加载
  <1> 在打包构建项目时，js包会变得非常大，影响页面加载。如果能把不同路由对应的组件分割成不同的代码块，当路由被访问时才加载对应组件，就会更加高效。
  <2> 安装@babel/plugin-syntax-dynamic-import
  <3> 在babel.config.js配置文件中声明该插件
  <4> 将路由改造为按需加载的形式
(5) 首页内容定制
6. 项目上线
6.1 配置
(1) 通过node创建web服务器
(2) 开启gzip配置
  减小文件体积，提高传输速度，通过服务器端使用express做gzip压缩
(3) 配置https服务
  实际开发由后端完成。[申请SSL证书]
  <1> https://freessl.org，申请域名，选择品牌
  <2> 输入邮箱，选择相关选项
  <3> 验证DNS（在域名管理后台添加txt记录）
  <4> 下载SSL证书（full_chain.pem公钥，private.key私钥）
(4) 使用pm2管理应用
  pm2 node进程管理工具