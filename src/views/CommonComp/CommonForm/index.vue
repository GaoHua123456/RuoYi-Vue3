<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <CommonSearchForm v-model="queryParams" :fields="searchFields" @search="handleSearch" @reset="handleReset" />

    <!-- 操作按钮栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:post:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['system:post:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:post:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:post:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 数据表格 - 暂时使用原生el-table -->
    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="岗位编号" align="center" prop="postId" />
      <el-table-column label="岗位编码" align="center" prop="postCode" />
      <el-table-column label="岗位名称" align="center" prop="postName" />
      <el-table-column label="岗位排序" align="center" prop="postSort" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:post:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:post:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改岗位对话框 -->
    <CommonDialog v-model:visible="open" :title="title" width="500px" @confirm="submitForm" @close="cancel">
      <!-- 弹窗内容：嵌入通用表单 -->
      <CommonSearchForm ref="formRef" v-model="form" :fields="formFields" :showBtn="false" :inline="false" :centered="true" />
    </CommonDialog>
  </div>
</template>

<script setup name="CommonForm">
  import { ref, reactive, getCurrentInstance } from "vue";
  import { listPost, addPost, delPost, getPost, updatePost } from "@/api/system/post";
  import { parseTime } from "@/utils/ruoyi";
  import MyTable from "../CommonTable/table.vue";
  import CommonDialog from "../CommonDialog/dialog.vue";
  import CommonSearchForm from "../CommonSearch/search.vue";
  import { searchFields, tableColumns, formFields, defaultQueryParams, defaultFormData } from "./option.js";

  const { proxy } = getCurrentInstance();
  const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

  // 响应式数据
  const postList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
  const formRef = ref(null);

  // 查询参数
  const queryParams = reactive({ ...defaultQueryParams });

  // 表单数据
  const form = reactive({ ...defaultFormData });

  /** 查询岗位列表 */
  function getList() {
    loading.value = true;
    listPost(queryParams)
      .then((response) => {
        postList.value = response.rows;
        total.value = response.total;
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  }

  /** 搜索按钮操作 */
  function handleSearch(params) {
    queryParams.pageNum = 1;
    Object.assign(queryParams, params);
    getList();
  }

  /** 重置按钮操作 */
  function handleReset() {
    Object.keys(queryParams).forEach((key) => {
      if (key !== "pageNum" && key !== "pageSize") {
        queryParams[key] = undefined;
      }
    });
    handleSearch(queryParams);
  }

  /** 多选框选中数据 */
  function handleSelectionChange(selection) {
    ids.value = selection.map((item) => item.postId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加岗位";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const postId = row.postId || ids.value;
    getPost(postId).then((response) => {
      Object.assign(form, response.data);
      open.value = true;
      title.value = "修改岗位";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    formRef.value?.formRef?.validate((valid) => {
      if (valid) {
        if (form.postId != undefined) {
          updatePost(form).then((response) => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addPost(form).then((response) => {
            proxy.$modal.msgSuccess("新增成功");
            open.value = false;
            getList();
          });
        }
      }
    });
  }

  /** 取消按钮 */
  function cancel() {
    open.value = false;
    reset();
  }

  /** 表单重置 */
  function reset() {
    Object.assign(form, defaultFormData);
    formRef.value?.formRef?.resetFields();
  }

  /** 删除按钮操作 */
  function handleDelete(row) {
    const postIds = row.postId || ids.value;
    proxy.$modal
      .confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？')
      .then(function () {
        return delPost(postIds);
      })
      .then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
      })
      .catch(() => {});
  }

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download(
      "system/post/export",
      {
        ...queryParams,
      },
      `post_${new Date().getTime()}.xlsx`
    );
  }

  // 初始化
  getList();
</script>

<style scoped>
  .app-container {
    padding: 16px;
  }

  .mb8 {
    margin-bottom: 8px;
  }
</style>
