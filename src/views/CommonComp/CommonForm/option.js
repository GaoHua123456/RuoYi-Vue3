/**
 * CommonForm 组件配置文件
 * 岗位管理页面的字段配置
 */

// 搜索字段配置
export const searchFields = [
  {
    label: "岗位编码",
    prop: "postCode",
    type: "input",
    attrs: { placeholder: "请输入岗位编码", clearable: true }
  },
  {
    label: "岗位名称",
    prop: "postName",
    type: "input",
    attrs: { placeholder: "请输入岗位名称", clearable: true }
  },
  {
    label: "状态",
    prop: "status",
    type: "select",
    options: [
      { label: "正常", value: "0" },
      { label: "停用", value: "1" }
    ],
    attrs: { placeholder: "岗位状态", clearable: true }
  }
];

// 表格列配置
export const tableColumns = [
  { type: "selection", width: "55", align: "center" },
  { label: "岗位编号", prop: "postId", align: "center" },
  { label: "岗位编码", prop: "postCode", align: "center" },
  { label: "岗位名称", prop: "postName", align: "center" },
  { label: "岗位排序", prop: "postSort", align: "center" },
  { 
    label: "状态", 
    prop: "status", 
    align: "center",
    slotName: "statusSlot"
  },
  { 
    label: "创建时间", 
    prop: "createTime", 
    align: "center", 
    width: "180",
    slotName: "createTimeSlot"
  },
  { 
    label: "操作", 
    width: "180", 
    align: "center", 
    slotName: "actionSlot"
  }
];

// 表单字段配置
export const formFields = [
  {
    label: "岗位名称",
    prop: "postName",
    type: "input",
    attrs: { placeholder: "请输入岗位名称" },
    rules: [{ required: true, message: "岗位名称不能为空", trigger: "blur" }]
  },
  {
    label: "岗位编码",
    prop: "postCode",
    type: "input",
    attrs: { placeholder: "请输入编码名称" },
    rules: [{ required: true, message: "岗位编码不能为空", trigger: "blur" }]
  },
  {
    label: "岗位顺序",
    prop: "postSort",
    type: "number",
    attrs: { "controls-position": "right", min: 0 },
    rules: [{ required: true, message: "岗位顺序不能为空", trigger: "blur" }]
  },
  {
    label: "岗位状态",
    prop: "status",
    type: "radio",
    options: [
      { label: "正常", value: "0" },
      { label: "停用", value: "1" }
    ]
  },
  {
    label: "备注",
    prop: "remark",
    type: "textarea",
    attrs: { placeholder: "请输入内容", rows: 3 }
  }
];

// 默认查询参数
export const defaultQueryParams = {
  pageNum: 1,
  pageSize: 10,
  postCode: undefined,
  postName: undefined,
  status: undefined
};

// 默认表单数据
export const defaultFormData = {
  postId: undefined,
  postCode: undefined,
  postName: undefined,
  postSort: 0,
  status: "0",
  remark: undefined
}; 