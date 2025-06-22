<template>
  <div class="table-demo-container">
    <!-- 普通表格示例 -->
    <section class="demo-section">
      <div class="section-header">
        <h3 class="section-title">普通表格示例</h3>
        <el-button type="primary" @click="handleSaveTableData">保存数据</el-button>
      </div>
      <MyTable :columns="simpleColumns" :data="simpleTableData">
        <!-- 自定义年龄列插槽 - 改为下拉选择框 -->
        <template #ageSlot="{ row, index }">
          <el-select 
            v-model="row.age" 
            size="small" 
            placeholder="请选择年龄"
            @change="handleAgeChange(row, index)"
          >
            <el-option
              v-for="age in ageOptions"
              :key="age"
              :label="`${age} 岁`"
              :value="age"
            />
          </el-select>
        </template>

        <!-- 自定义操作列插槽 -->
        <template #actionSlot="{ row, index }">
          <el-button size="small" type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </MyTable>
    </section>

    <!-- 嵌套表头示例 -->
    <section class="demo-section">
      <div class="section-header">
        <h3 class="section-title">嵌套表头示例</h3>
        <el-button type="primary" @click="handleSaveNestedTableData">保存数据</el-button>
      </div>
      <MyTable :columns="nestedColumns" :data="nestedTableData">
        <!-- 自定义姓名列插槽 - 可编辑输入框 -->
        <template #nameSlot="{ row, index }">
          <el-input
            v-model="row.name"
            size="small"
            placeholder="请输入姓名"
            @change="handleNameChange(row, index)"
          />
        </template>

        <!-- 自定义年龄列插槽 - 改为下拉选择框 -->
        <template #ageSlot="{ row, index }">
          <el-select 
            v-model="row.age" 
            size="small" 
            placeholder="请选择年龄"
            @change="handleAgeChange(row, index)"
          >
            <el-option
              v-for="age in ageOptions"
              :key="age"
              :label="`${age} 岁`"
              :value="age"
            />
          </el-select>
        </template>

        <!-- 自定义薪资列插槽 - 格式化显示 -->
        <template #salarySlot="{ row, index }">
          <span class="salary-text">¥{{ row.salary }}</span>
        </template>

        <!-- 自定义操作列插槽 -->
        <template #nestedActionSlot="{ row, index }">
          <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </MyTable>
    </section>

    <!-- 三级嵌套表头示例 -->
    <section class="demo-section">
      <div class="section-header">
        <h3 class="section-title">三级嵌套表头示例</h3>
        <el-button type="primary" @click="handleSaveThreeLevelTableData">保存数据</el-button>
      </div>
      <MyTable :columns="threeLevelColumns" :data="nestedTableData">
        <!-- 自定义姓名列插槽 -->
        <template #nameSlot="{ row, index }">
          <el-input
            v-model="row.name"
            size="small"
            placeholder="请输入姓名"
            @change="handleNameChange(row, index)"
          />
        </template>

        <!-- 自定义年龄列插槽 - 改为下拉选择框 -->
        <template #ageSlot="{ row, index }">
          <el-select 
            v-model="row.age" 
            size="small" 
            placeholder="请选择年龄"
            @change="handleAgeChange(row, index)"
          >
            <el-option
              v-for="age in ageOptions"
              :key="age"
              :label="`${age} 岁`"
              :value="age"
            />
          </el-select>
        </template>

        <!-- 自定义薪资列插槽 -->
        <template #salarySlot="{ row, index }">
          <span class="salary-text">¥{{ row.salary }}</span>
        </template>

        <!-- 自定义操作列插槽 -->
        <template #threeLevelActionSlot="{ row, index }">
          <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </MyTable>
    </section>

    <!-- 编辑弹框 -->
    <CommonDialog
      v-model:visible="editDialogVisible"
      title="编辑用户信息"
      width="800px"
      @confirm="handleEditConfirm"
      @close="handleEditClose"
    >
      <!-- 弹窗内容：嵌入通用表单 -->
      <CommonSearchForm
        ref="editFormRef"
        v-model="editFormData"
        :fields="editFormFields"
        @search="handleEditSearch"
        @reset="handleEditReset"
        :showBtn="false"
        :centered="true"
      />
    </CommonDialog>
  </div>
</template>

<script setup>
/**
 * 通用表格组件使用示例
 * 
 * @description
 * 这是一个完整的表格组件使用示例，展示了：
 * - 普通表格的使用方法
 * - 嵌套表头的配置方式
 * - 多级嵌套表头的实现
 * - 自定义插槽的使用
 * - 编辑弹框的集成
 * - 表单验证的处理
 * - 年龄字段下拉选择
 * - 表格数据保存功能
 * 
 * @features
 * - 支持普通表格和嵌套表头
 * - 支持任意层级的嵌套（二级、三级、四级...）
 * - 支持自定义插槽渲染
 * - 集成编辑弹框和表单验证
 * - 完整的 CRUD 操作示例
 * - 年龄字段使用下拉选择框
 * - 表格右上角保存按钮
 */

import MyTable from "./table.vue";
import CommonDialog from "../CommonDialog/dialog.vue";
import CommonSearchForm from "../CommonSearch/search.vue";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

// ==================== 常量定义 ====================

// 性别选项
const GENDER_OPTIONS = [
  { label: "男", value: "男" },
  { label: "女", value: "女" },
];

// 部门选项
const DEPARTMENT_OPTIONS = [
  { label: "技术部", value: "技术部" },
  { label: "产品部", value: "产品部" },
  { label: "设计部", value: "设计部" },
  { label: "运营部", value: "运营部" },
];

// 年龄选项
const ageOptions = ref([18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]);

// 表单验证规则
const VALIDATION_RULES = {
  required: (message) => [{ required: true, message, trigger: "blur" }],
  email: (message) => [
    { required: true, message, trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  number: (min, max, message) => [
    { required: true, message, trigger: "blur" },
    { type: "number", min, max, message: `请输入${min}-${max}之间的数字`, trigger: "blur" },
  ],
};

// ==================== 普通表格配置 ====================

const simpleColumns = [
  { label: "姓名", prop: "name" },
  { label: "年龄", prop: "age", slotName: "ageSlot" },
  { label: "操作", prop: "action", slotName: "actionSlot" },
];

const simpleTableData = ref([
  { name: "张三", age: 18 },
  { name: "李四", age: 22 },
  { name: "王五", age: 30 },
]);

// ==================== 嵌套表头配置 ====================

const nestedColumns = [
  {
    label: "基本信息",
    children: [
      { prop: "name", label: "姓名", slotName: "nameSlot" },
      { prop: "age", label: "年龄", slotName: "ageSlot" },
      { prop: "gender", label: "性别" },
    ],
  },
  {
    label: "联系信息",
    children: [
      { prop: "phone", label: "电话" },
      { prop: "email", label: "邮箱" },
    ],
  },
  {
    label: "工作信息",
    children: [
      { prop: "department", label: "部门" },
      { prop: "position", label: "职位" },
      { prop: "salary", label: "薪资", slotName: "salarySlot" },
    ],
  },
  {
    prop: "action",
    label: "操作",
    width: "200px",
    slotName: "nestedActionSlot",
  },
];

// ==================== 三级嵌套表头配置 ====================

const threeLevelColumns = [
  {
    label: "个人信息",
    children: [
      {
        label: "基本信息",
        children: [
          { prop: "name", label: "姓名", slotName: "nameSlot" },
          { prop: "age", label: "年龄", slotName: "ageSlot" },
          { prop: "gender", label: "性别" },
        ],
      },
      {
        label: "联系信息",
        children: [
          { prop: "phone", label: "电话" },
          { prop: "email", label: "邮箱" },
        ],
      },
    ],
  },
  {
    label: "工作信息",
    children: [
      {
        label: "职位信息",
        children: [
          { prop: "department", label: "部门" },
          { prop: "position", label: "职位" },
        ],
      },
      {
        label: "薪资信息",
        children: [
          { prop: "salary", label: "薪资", slotName: "salarySlot" },
        ],
      },
    ],
  },
  {
    prop: "action",
    label: "操作",
    width: "200px",
    slotName: "threeLevelActionSlot",
  },
];

// ==================== 表格数据 ====================

const nestedTableData = ref([
  {
    name: "张三",
    age: 28,
    gender: "男",
    phone: "13800138000",
    email: "zhangsan@example.com",
    department: "技术部",
    position: "前端工程师",
    salary: "15000",
  },
  {
    name: "李四",
    age: 32,
    gender: "女",
    phone: "13800138001",
    email: "lisi@example.com",
    department: "产品部",
    position: "产品经理",
    salary: "20000",
  },
  {
    name: "王五",
    age: 25,
    gender: "男",
    phone: "13800138002",
    email: "wangwu@example.com",
    department: "设计部",
    position: "UI设计师",
    salary: "12000",
  },
]);

// ==================== 编辑弹框相关 ====================

const editDialogVisible = ref(false);
const currentEditRow = ref(null);
const editFormData = reactive({});
const editFormRef = ref(null);

// 编辑表单字段配置
const editFormFields = [
  {
    label: "姓名",
    prop: "name",
    type: "input",
    attrs: { placeholder: "请输入姓名", clearable: true },
    rules: VALIDATION_RULES.required("请输入姓名"),
  },
  {
    label: "年龄",
    prop: "age",
    type: "select",
    options: ageOptions.value.map(age => ({ label: `${age} 岁`, value: age })),
    rules: VALIDATION_RULES.required("请选择年龄"),
  },
  {
    label: "性别",
    prop: "gender",
    type: "select",
    options: GENDER_OPTIONS,
    rules: VALIDATION_RULES.required("请选择性别"),
  },
  {
    label: "电话",
    prop: "phone",
    type: "input",
    attrs: { placeholder: "请输入电话", clearable: true },
    rules: VALIDATION_RULES.required("请输入电话"),
  },
  {
    label: "邮箱",
    prop: "email",
    type: "input",
    attrs: { placeholder: "请输入邮箱", clearable: true },
    rules: VALIDATION_RULES.email("请输入邮箱"),
  },
  {
    label: "部门",
    prop: "department",
    type: "select",
    options: DEPARTMENT_OPTIONS,
    rules: VALIDATION_RULES.required("请选择部门"),
  },
  {
    label: "职位",
    prop: "position",
    type: "input",
    attrs: { placeholder: "请输入职位", clearable: true },
    rules: VALIDATION_RULES.required("请输入职位"),
  },
  {
    label: "薪资",
    prop: "salary",
    type: "number",
    attrs: { placeholder: "请输入薪资", min: 0 },
    rules: VALIDATION_RULES.required("请输入薪资"),
  },
];

// ==================== 事件处理方法 ====================

/**
 * 处理编辑操作
 * @param {Object} row - 当前行数据
 */
function handleEdit(row) {
  currentEditRow.value = row;
  // 清空并填充编辑表单数据
  Object.keys(editFormData).forEach((key) => {
    editFormData[key] = undefined;
  });
  Object.assign(editFormData, { ...row });
  editDialogVisible.value = true;
}

/**
 * 处理删除操作
 * @param {Object} row - 当前行数据
 */
function handleDelete(row) {
  console.log(`删除用户: ${row.name}`);
  // TODO: 实现删除逻辑，如调用 API 或显示确认对话框
}

/**
 * 处理姓名输入变化
 * @param {Object} row - 当前行数据
 * @param {Number} index - 行索引
 */
function handleNameChange(row, index) {
  console.log(`姓名已修改: ${row.name}, 行索引: ${index}`);
  // TODO: 可以添加保存到后端的逻辑
}

/**
 * 处理年龄选择变化
 * @param {Object} row - 当前行数据
 * @param {Number} index - 行索引
 */
function handleAgeChange(row, index) {
  console.log(`年龄已修改: ${row.age}, 行索引: ${index}`);
  // TODO: 可以添加保存到后端的逻辑
}

// ==================== 保存数据方法 ====================

/**
 * 保存普通表格数据
 */
function handleSaveTableData() {
  console.log("保存普通表格数据:", simpleTableData.value);
  ElMessage.success("普通表格数据保存成功！");
  // TODO: 这里可以调用API保存数据到后端
}

/**
 * 保存嵌套表格数据
 */
function handleSaveNestedTableData() {
  console.log("保存嵌套表格数据:", nestedTableData.value);
  ElMessage.success("嵌套表格数据保存成功！");
  // TODO: 这里可以调用API保存数据到后端
}

/**
 * 保存三级嵌套表格数据
 */
function handleSaveThreeLevelTableData() {
  console.log("保存三级嵌套表格数据:", nestedTableData.value);
  ElMessage.success("三级嵌套表格数据保存成功！");
  // TODO: 这里可以调用API保存数据到后端
}

// ==================== 编辑弹框相关方法 ====================

/**
 * 处理编辑确认
 * 触发表单验证，验证通过后保存数据
 */
function handleEditConfirm() {
  if (editFormRef.value) {
    // 调用表单组件的验证方法
    editFormRef.value.handleSearch();
  } else {
    // 兜底逻辑：直接保存
    saveEditData();
  }
}

/**
 * 处理编辑弹框关闭
 */
function handleEditClose() {
  console.log("编辑弹框关闭");
  currentEditRow.value = null;
}

/**
 * 处理编辑表单搜索事件（验证通过后触发）
 * @param {Object} params - 表单数据
 */
function handleEditSearch(params) {
  console.log("编辑表单验证通过:", params);
  saveEditData();
}

/**
 * 处理编辑表单重置
 */
function handleEditReset() {
  console.log("编辑表单重置");
}

/**
 * 保存编辑数据
 */
function saveEditData() {
  console.log("保存编辑数据:", { ...editFormData });
  if (currentEditRow.value) {
    Object.assign(currentEditRow.value, { ...editFormData });
  }
  editDialogVisible.value = false;
  ElMessage.success("编辑数据保存成功！");
}
</script>

<style scoped>
.table-demo-container {
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  color: #333;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
}

.age-text {
  color: #409EFF;
  font-weight: 500;
}

.salary-text {
  color: #67C23A;
  font-weight: bold;
}
</style>
