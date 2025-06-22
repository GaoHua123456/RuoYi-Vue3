<template>
  <el-form
    :model="formModel"
    ref="formRef"
    :inline="inline"
    label-width="auto"
    :class="{ 'search-form': centered }"
    :rules="formRules"
  >
    <!-- 动态渲染表单项 -->
    <template v-for="item in fields" :key="item.prop">
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        v-if="!item.hidden"
        :rules="item.rules"
      >
        <!-- 根据字段类型渲染对应的表单组件 -->
        <component
          :is="getComponentType(item.type)"
          v-model="formModel[item.prop]"
          v-bind="item.attrs"
          :style="item.width ? `width: ${item.width}` : 'width: 240px'"
        >
          <!-- select 类型 -->
          <template v-if="item.type === 'select'">
            <el-option
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </template>

          <!-- radio 类型 -->
          <template v-if="item.type === 'radio'">
            <el-radio
              v-for="opt in item.options"
              :key="opt.value"
              :label="opt.value"
            >
              {{ opt.label }}
            </el-radio>
          </template>
        </component>
      </el-form-item>
    </template>

    <!-- 操作按钮 -->
    <el-form-item v-if="showBtn">
      <el-button type="primary" icon="Search" @click="handleSearch">
        搜索
      </el-button>
      <el-button icon="Refresh" @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
  import { ref, reactive, toRaw, watch, watchEffect } from "vue";

  const props = defineProps({
    modelValue: Object, // v-model 绑定值
    fields: Array, // 字段配置
    defaultValues: Object, // 初始默认值（非必填）
    showBtn: {
      // 是否展示按钮
      type: Boolean,
      default: true,
    },
    inline: {
      // 是否为行内
      type: Boolean,
      default: true,
    },
    centered: {
      // 是否表单内容居中
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["update:modelValue", "search", "reset"]);

  const formRef = ref(null);
  const formModel = reactive({ ...(props.defaultValues || {}) });

  // 监听 modelValue 变化，同步到 formModel
  watchEffect(() => {
    if (props.modelValue) {
      Object.keys(props.modelValue).forEach(key => {
        if (props.modelValue[key] !== undefined) {
          formModel[key] = props.modelValue[key];
        }
      });
    }
  });

  // 监听 formModel 变化，同步到父组件
  watch(formModel, (newVal) => {
    emit("update:modelValue", toRaw(newVal));
  }, { deep: true });

  // 提取所有字段中的校验规则，统一传给 el-form
  const formRules = {};
  props.fields?.forEach((field) => {
    if (field.rules) {
      formRules[field.prop] = field.rules;
    }
  });

  // 映射字段类型到组件
  const getComponentType = (type) => {
    const map = {
      input: "el-input",
      select: "el-select",
      "date-range": "el-date-picker",
      number: "el-input-number",
      radio: "el-radio-group",
      textarea: "el-input",
      switch: "el-switch",
      checkbox: "el-checkbox-group",
    };
    return map[type] || "el-input";
  };

  // 搜索前进行校验
  const handleSearch = () => {
    formRef.value?.validate?.((valid) => {
      if (valid) {
        emit("search", toRaw(formModel));
      }
    });
  };

  // 重置表单
  const handleReset = () => {
    Object.keys(formModel).forEach((key) => (formModel[key] = undefined));
    emit("reset");
    emit("search", toRaw(formModel));
  };

  // 暴露方法和属性给父组件
  defineExpose({
    formRef,
    handleSearch,
    handleReset,
    formModel,
  });
</script>

<style scoped>
  /* 表单内容居中 */
  .search-form {
    margin-bottom: 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
