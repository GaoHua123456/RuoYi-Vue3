<template>
  <!-- 有子列的情况：递归渲染嵌套表头 -->
  <el-table-column
    v-if="column.children && column.children.length > 0"
    :label="column.label"
    :width="column.width || 'auto'"
    :align="column.align || 'center'"
  >
    <!-- 递归渲染子列 -->
    <template v-for="childColumn in column.children" :key="childColumn.prop || childColumn.label">
      <TableColumn :column="childColumn">
        <!-- 传递所有插槽 -->
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </TableColumn>
    </template>
  </el-table-column>
  
  <!-- 没有子列的情况：渲染普通列 -->
  <el-table-column
    v-else
    :type="column.type"
    :label="column.label"
    :prop="column.prop"
    :width="column.width || 'auto'"
    :align="column.align || 'center'"
  >
    <template #default="scope">
      <!-- 使用自定义插槽渲染 -->
      <template v-if="column.slotName && $slots[column.slotName]">
        <slot :name="column.slotName" :row="scope.row" :index="scope.$index" />
      </template>
      <!-- 直接显示数据 -->
      <template v-else-if="column.prop">
        {{ scope.row[column.prop] }}
      </template>
    </template>
  </el-table-column>
</template>

<script setup>
/**
 * 表格列组件
 * 递归渲染多级嵌套表头
 * 
 * @description
 * - 支持任意层级的嵌套表头
 * - 自动处理自定义插槽
 * - 递归调用自身处理子列
 * - 支持特殊类型列（如selection）
 */

defineProps({
  // 列配置对象
  column: {
    type: Object,
    required: true,
    // 列配置格式：
    // {
    //   type: 'selection',           // 可选，特殊类型（如selection）
    //   label: '列标签',
    //   prop: '数据字段名',           // 可选，叶子节点需要
    //   width: '列宽度',              // 可选
    //   align: '对齐方式',            // 可选
    //   slotName: '插槽名',           // 可选
    //   children: [子列配置数组]      // 可选，有子列时递归渲染
    // }
  },
});
</script> 