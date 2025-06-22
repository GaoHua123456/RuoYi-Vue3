// 搜索字段
export const searchFields = [
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
      rangeSeparator: "-",
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期",
      clearable: true,
    },
  },
];

// 初始搜索参数对象
export const defaultQueryParams = {
  roleName: "",
  roleKey: "",
  status: "",
  dateRange: [],
};
