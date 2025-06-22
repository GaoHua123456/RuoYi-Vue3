<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :destroy-on-close="destroyOnClose"
    :append-to-body="true"
    @close="handleClose"
  >
    <!-- 内容插槽 -->
    <slot />

    <!-- 底部按钮插槽（可选） -->
    <template #footer>
      <slot name="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
  import { defineProps, defineEmits } from "vue";

  const props = defineProps({
    visible: Boolean,
    title: {
      type: String,
      default: "提示",
    },
    width: {
      type: String,
      default: "500px",
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    destroyOnClose: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(["update:visible", "confirm", "close"]);

  const handleClose = () => {
    emit("update:visible", false);
    emit("close");
  };

  const handleConfirm = () => {
    emit("confirm");
  };
</script>

<style scoped></style>
