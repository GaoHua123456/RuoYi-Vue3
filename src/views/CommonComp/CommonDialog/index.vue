<template>
  <div class="app-container">
    <!-- 打开弹窗按钮 -->
    <el-button type="primary" @click="openDialog">打开搜索弹窗</el-button>

    <!-- 通用弹窗组件 -->
    <CommonDialog v-model:visible="dialogVisible" title="搜索条件" width="800px" @confirm="handleConfirm" @close="handleClose">
      <!-- 弹窗内容：嵌入通用搜索表单 -->
      <CommonSearchForm v-model="queryParams" :fields="searchFields" @search="handleSearch" @reset="handleReset" :showBtn="false" :centered="true" />
    </CommonDialog>
  </div>
</template>

<script setup>
  import { ref, reactive } from "vue";
  import CommonDialog from "./dialog.vue"; // 你的弹窗组件路径
  import CommonSearchForm from "../CommonSearch/search.vue"; // 你的通用搜索表单组件路径
  // 引入配置 搜索字段  搜索参数
  import { searchFields, defaultQueryParams } from "./option.js";

  // 控制弹窗显示
  const dialogVisible = ref(false);

  // 搜索参数（绑定到通用搜索表单）
  const queryParams = reactive({ ...defaultQueryParams });

  // 打开弹窗
  function openDialog() {
    dialogVisible.value = true;
  }

  // 弹窗确认按钮，触发搜索逻辑（或者其他业务）
  function handleConfirm() {
    console.log("弹窗确认，查询参数为:", { ...queryParams });
    dialogVisible.value = false;
  }

  // 弹窗关闭
  function handleClose() {
    console.log("弹窗关闭");
  }

  // 搜索事件（搜索按钮触发）
  function handleSearch(params) {
    console.log("搜索参数:", params);
    // 你可以根据需求调用接口或刷新数据
  }

  // 重置事件（重置按钮触发）
  function handleReset() {
    console.log("搜索条件已重置");
  }
</script>

<style scoped>
  .app-container {
    padding: 16px;
  }
</style>
