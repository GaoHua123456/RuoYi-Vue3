# CommonForm 通用表单组件

## 概述

CommonForm 是一个基于岗位管理页面的通用表单组件，使用了封装好的表格、搜索表单、弹窗等组件来实现完整的 CRUD 功能。

## 特性

- ✅ **完整的 CRUD 操作**：支持新增、修改、删除、查询、导出
- ✅ **响应式搜索表单**：使用 CommonSearchForm 组件
- ✅ **灵活的数据表格**：使用 MyTable 组件，支持自定义插槽
- ✅ **模态弹窗表单**：使用 CommonDialog 组件
- ✅ **分页功能**：集成分页组件
- ✅ **权限控制**：支持按钮级别的权限控制
- ✅ **配置化**：字段配置独立管理，易于维护
- ✅ **表单验证**：完整的表单验证规则

## 组件结构

```
CommonForm/
├── index.vue          # 主组件文件
├── option.js          # 配置文件
└── README.md          # 说明文档
```

## 使用方法

### 1. 基本使用

```vue
<template>
  <CommonForm />
</template>

<script setup>
import CommonForm from '@/views/CommonComp/CommonForm/index.vue'
</script>
```

### 2. 自定义配置

修改 `option.js` 文件来自定义字段配置：

```javascript
// 搜索字段配置
export const searchFields = [
  {
    label: "字段名称",
    prop: "fieldName",
    type: "input", // input, select, date-range, number, radio, textarea
    attrs: { placeholder: "请输入..." },
    options: [] // 用于 select 和 radio 类型
  }
];

// 表格列配置
export const tableColumns = [
  { type: "selection", width: "55", align: "center" },
  { label: "列标题", prop: "fieldName", align: "center" },
  { 
    label: "自定义列", 
    prop: "customField", 
    slotName: "customSlot" // 使用自定义插槽
  }
];

// 表单字段配置
export const formFields = [
  {
    label: "字段名称",
    prop: "fieldName",
    type: "input",
    attrs: { placeholder: "请输入..." },
    rules: [{ required: true, message: "不能为空", trigger: "blur" }]
  }
];
```

## 支持的字段类型

### 搜索表单字段类型

- `input` - 输入框
- `select` - 下拉选择框
- `date-range` - 日期范围选择器
- `number` - 数字输入框
- `radio` - 单选框组
- `textarea` - 文本域
- `switch` - 开关
- `checkbox` - 复选框组

### 表格列类型

- `selection` - 多选框列
- 普通数据列（支持自定义插槽）

### 表单字段类型

- `input` - 输入框
- `select` - 下拉选择框
- `number` - 数字输入框
- `radio` - 单选框组
- `textarea` - 文本域

## 自定义插槽

### 表格自定义插槽

```vue
<MyTable :columns="tableColumns" :data="data">
  <!-- 状态列自定义插槽 -->
  <template #statusSlot="{ row }">
    <dict-tag :options="statusOptions" :value="row.status" />
  </template>

  <!-- 时间列自定义插槽 -->
  <template #createTimeSlot="{ row }">
    <span>{{ parseTime(row.createTime) }}</span>
  </template>

  <!-- 操作列自定义插槽 -->
  <template #actionSlot="{ row }">
    <el-button @click="handleEdit(row)">编辑</el-button>
    <el-button @click="handleDelete(row)">删除</el-button>
  </template>
</MyTable>
```

## API 接口

组件使用以下 API 接口：

- `listPost` - 获取岗位列表
- `addPost` - 新增岗位
- `updatePost` - 修改岗位
- `delPost` - 删除岗位
- `getPost` - 获取岗位详情
- `export` - 导出岗位数据

## 权限控制

组件支持以下权限控制：

- `system:post:add` - 新增权限
- `system:post:edit` - 修改权限
- `system:post:remove` - 删除权限
- `system:post:export` - 导出权限

## 事件处理

### 搜索事件

- `@search` - 搜索按钮点击事件
- `@reset` - 重置按钮点击事件

### 表格事件

- `@selection-change` - 选择变化事件

### 弹窗事件

- `@confirm` - 确认按钮点击事件
- `@close` - 关闭弹窗事件

## 样式定制

组件使用 Element Plus 的样式系统，可以通过以下方式定制：

```scss
.app-container {
  padding: 16px;
}

.mb8 {
  margin-bottom: 8px;
}
```

## 注意事项

1. **API 接口**：确保相关的 API 接口已经实现
2. **权限配置**：根据实际需求配置权限控制
3. **字典数据**：确保字典数据已正确配置
4. **组件依赖**：确保所有依赖的组件都已正确引入

## 扩展说明

这个组件可以作为其他管理页面的模板，只需要：

1. 修改 `option.js` 中的字段配置
2. 替换相应的 API 接口
3. 调整权限控制配置
4. 根据需要添加自定义插槽

通过这种方式，可以快速创建各种管理页面，提高开发效率。 