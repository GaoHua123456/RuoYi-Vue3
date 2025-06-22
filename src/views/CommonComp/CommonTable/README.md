# CommonTable 通用表格组件

## 📖 概述

基于 Vue 3 + Element Plus 的通用表格组件，支持多级嵌套表头、自定义插槽渲染。

## 🎯 核心特性

- ✅ 多级嵌套表头（二级、三级、四级...）
- ✅ 自定义插槽渲染
- ✅ 向后兼容
- ✅ 递归组件设计
- ✅ 表单验证集成

## 🏗️ 架构设计

```
CommonTable/
├── index.vue          # 使用示例
├── table.vue          # 主表格组件
├── TableColumn.vue    # 递归列组件
└── README.md          # 文档
```

## 🧠 知识体系

### 1. Vue 3 Composition API
```javascript
// 核心概念
<script setup>           // 编译时语法糖
defineProps()            // 属性定义和验证
computed()               // 计算属性
ref/reactive()           // 响应式数据
```

### 2. 递归组件设计
```vue
<!-- 递归组件模板 -->
<template>
  <el-table-column v-if="hasChildren">
    <!-- 递归调用自身 -->
    <TableColumn v-for="childColumn in column.children" :column="childColumn">
      <!-- 插槽传递 -->
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </TableColumn>
  </el-table-column>
</template>
```

### 3. 插槽传递机制
```vue
<!-- 动态插槽 -->
<template v-for="(_, name) in $slots" #[name]="slotProps">
  <slot :name="name" v-bind="slotProps" />
</template>

<!-- 插槽作用域 -->
<template #default="scope">
  <slot :name="column.slotName" :row="scope.row" :index="scope.$index" />
</template>
```

### 4. Element Plus 集成
```javascript
// 核心组件
el-table              // 表格容器
el-table-column       // 表格列定义
el-button             // 操作按钮
el-input              // 输入框

// 列配置对象
{
  label: '列标签',
  prop: '数据字段',
  width: '列宽度',
  align: '对齐方式',
  slotName: '插槽名称',
  children: [子列配置]
}
```

### 5. 数据处理和验证
```javascript
// 嵌套属性访问
function getCellValue(row, prop) {
  return prop.split('.').reduce((obj, key) => {
    return obj && obj[key] !== undefined ? obj[key] : ''
  }, row)
}

// 验证规则
const VALIDATION_RULES = {
  required: (message) => [{ required: true, message, trigger: "blur" }],
  email: (message) => [
    { required: true, message, trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ]
}
```

## 📝 使用示例

### 基础用法
```vue
<template>
  <MyTable :columns="columns" :data="tableData">
    <template #actionSlot="{ row, index }">
      <el-button @click="handleEdit(row)">编辑</el-button>
    </template>
  </MyTable>
</template>

<script setup>
const columns = [
  { label: "姓名", prop: "name" },
  { label: "年龄", prop: "age" },
  { label: "操作", prop: "action", slotName: "actionSlot" }
]
</script>
```

### 嵌套表头
```javascript
const nestedColumns = [
  {
    label: "基本信息",
    children: [
      { prop: "name", label: "姓名" },
      { prop: "age", label: "年龄" }
    ]
  }
]
```

## 🔧 配置说明

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `label` | String | ✅ | 列标签 |
| `prop` | String | ⚠️ | 数据字段名（叶子节点必填） |
| `width` | String | ❌ | 列宽度 |
| `align` | String | ❌ | 对齐方式 |
| `slotName` | String | ❌ | 自定义插槽名 |
| `children` | Array | ❌ | 子列配置数组 |

## 🚀 最佳实践

1. **性能优化**：使用 `computed` 缓存计算结果
2. **代码组织**：提取常量和配置
3. **错误处理**：添加数据验证和边界条件检查
4. **用户体验**：提供加载状态和空数据提示

---

**版本**: 1.0.0  
**更新时间**: 2024年 