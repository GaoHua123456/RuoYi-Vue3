<template>
  <el-table 
    :data="data" 
    style="width: 100%" 
    :border="true"
    v-bind="tableProps"
    @selection-change="handleSelectionChange"
  >
    <template v-for="col in columns" :key="getColumnKey(col)">
      <!-- 递归渲染列：支持多级嵌套表头 -->
      <TableColumn :column="col">
        <!-- 传递所有插槽到递归组件 -->
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </TableColumn>
    </template>
  </el-table>
</template>

<script setup>
/**
 * 通用表格组件 - 主组件
 * 支持多级嵌套表头和自定义插槽渲染
 */

import TableColumn from './TableColumn.vue'

// ==================== Props 定义 ====================

const props = defineProps({
  // 列配置数组 - 支持多级嵌套
  columns: {
    type: Array,
    required: true,
    validator: (value) => {
      return Array.isArray(value) && value.length > 0
    }
  },
  // 表格数据数组
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // Element Plus 表格的其他属性
  tableProps: {
    type: Object,
    default: () => ({})
  }
})

// ==================== Emits 定义 ====================

const emit = defineEmits([
  'selection-change',
  'current-change',
  'sort-change',
  'filter-change',
  'row-click',
  'row-contextmenu',
  'row-dblclick',
  'cell-click',
  'cell-dblclick',
  'cell-contextmenu',
  'header-click',
  'header-contextmenu'
])

// ==================== 工具函数 ====================

/**
 * 生成列的唯一键值
 */
function getColumnKey(col) {
  return col.prop || col.label || Math.random().toString(36)
}

/**
 * 处理选择变化事件
 */
function handleSelectionChange(selection) {
  emit('selection-change', selection)
}

// ==================== 类型定义 ====================

/**
 * 列配置格式：
 * @property {String} label - 列标签（必填）
 * @property {String} [prop] - 数据字段名（叶子节点必填）
 * @property {String} [width] - 列宽度
 * @property {String} [align] - 对齐方式
 * @property {String} [slotName] - 自定义插槽名
 * @property {Array} [children] - 子列配置数组
 */
</script>
