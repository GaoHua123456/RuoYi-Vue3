<template>
  <div class="app-container">
    <!-- 🔍 通用搜索表单组件使用示例 -->
    <CommonSearchForm
      v-model="queryParams"
      :fields="searchFields"
      @search="handleSearch"
      @reset="handleReset"
    />
  </div>
</template>

<script setup>
  import { reactive } from "vue";
  import CommonSearchForm from "./search.vue"; // ✅ 引入封装好的组件

  // 搜索参数（双向绑定）
  const queryParams = reactive({
    roleName: "",
    roleKey: "",
    status: "",
    dateRange: [],
  });

  // 表单字段配置
  const searchFields = [
    {
      label: "角色名称",
      prop: "roleName",
      type: "input",
      attrs: { placeholder: "请输入角色名称", clearable: true },
    },
    {
      label: "权限字符",
      prop: "roleKey",
      type: "input",
      attrs: { placeholder: "请输入权限字符", clearable: true },
    },
    {
      label: "状态",
      prop: "status",
      type: "select",
      options: [
        { label: "正常", value: "0" },
        { label: "停用", value: "1" },
      ],
    },
    {
      label: "创建时间",
      prop: "dateRange",
      type: "date-range",
      attrs: {
        type: "daterange",
        valueFormat: "YYYY-MM-DD",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        rangeSeparator: "-",
        clearable: true,
      },
    },
  ];

  // 点击搜索回调
  function handleSearch(params) {
    console.log("搜索参数：", params);
    // 执行搜索请求...
  }

  // 点击重置回调
  function handleReset() {
    console.log("搜索条件已重置");
  }
</script>

<style scoped>
  .app-container {
    padding: 16px;
  }
</style>
