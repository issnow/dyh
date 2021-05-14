<template>
    <div class="main-wrap">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="60px"
        :inline="true">
        <el-row>
          <el-col :span="7">
            <el-form-item label="搜索" prop="keyword">
              <el-input v-model="form.keyword" placeholder="请输入关键字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option
                  v-for="item in selectData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table 
        v-loading='loading'
        class="mb20"
        :data="tableData"
        border
        style="width: 100%"
        :default-sort = "{prop: 'zip', order: 'descending'}"
        >
        <el-table-column prop="date" label="作品名称"></el-table-column>
        <el-table-column prop="name" label="创作人" width="200"></el-table-column>
        <el-table-column prop="province" label="类型" width="100"></el-table-column>
        <el-table-column prop="city" label="联系人" width="100"></el-table-column>
        <el-table-column prop="address" label="状态" width="120"></el-table-column>
        <el-table-column prop="zip" label="创作时间" width="200" sortable></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
              <!-- 视频组件 -->
                <!-- <preview
                  :bgImage="scope.row.small_preview_path"
                  :source="scope.row.address_original"
                /> -->
            <el-button type="text" @click="onReview">提交审核</el-button>
            <el-button type="text" @click="onEdit">编辑</el-button>
            <el-button type="text" @click="omDelete">删除</el-button>
            <el-button type="text" @click="onDownload">下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="50">
      </el-pagination>

      <!-- 提交审核 -->
      <el-dialog title="提交审核" :visible="isShow" :before-close="handleClose">
        <el-form :model="viiewForm" label-width="100px" :rules="viiewFormRules" ref="viiewForm">
          <el-form-item label="名称">
            <el-input v-model="viiewForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="viiewForm.desc" autocomplete="off" placeholder="请输入0-20个字符的描述"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="viiewForm.label" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实体">
            <el-select v-model="viiewForm.entity1" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-select v-model="viiewForm.entity2" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实体">
            <el-cascader
              v-model="viiewForm.entity3"
              :options="options"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="onConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  // import {
  //   getData
  // } from '@api/main'
  export default {
    data() {
      return {
        options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }],
        loading: false,
        form: {
          keyword: "",
          status: "",
        },
        rules: {
          keyword: [
            { required: true, message: "请输入作品名称关键字", trigger: "blur" },
          ],
          status: [
            { required: true, message: "请选择状态", trigger: "change" },
          ],
        },
        viiewFormRules: {
          name: [
            { required: false, message: "作品名称关键字", trigger: "blur" },
          ],
          desc: [
            { required: true, message: "请填写描述", trigger: "blur" },
          ],
          label: [
            { required: true, message: "请选择标签", trigger: "change" },
          ],
          entity1: [
            { required: true, message: "请选择实体", trigger: "change" },
          ],
          entity2: [
            { required: true, message: "请选择实体", trigger: "change" },
          ],
          // entity3: [
          //   { required: true, message: "请选择实体", trigger: "change" },
          // ],
        },
        isShow: false,
        viiewForm: {
          name: '',
          desc: '',
          label: '',
          entity1: '',
          entity2: '',
          entity3: []
        },
        selectData: [{
          value: '1',
          label: '合成中'
        }, {
          value: '2',
          label: '合成失败'
        }, {
          value: '3',
          label: '待审核'
        }, {
          value: '4',
          label: '审核中'
        }, {
          value: '5',
          label: '审核失败'
        }, {
          value: '6',
          label: '待发布'
        }, {
          value: '7',
          label: '已发布'
        }],
        status: '',
        value: '',
        searchValue: '',
        currentPage: 5,
        tableData: [{
          date: 'Name1Name1Name1',
          name: 'abc@moviebook.cn',
          province: '上海',
          city: '普陀区',
          address: '审核',
          zip: 1
        }, {
          date: 'Name1Name1Name1Name1Name1',
          name: 'abc@moviebook.cn',
          province: '上海',
          city: '普陀区',
          address: '审核',
          zip: 2
        }, {
          date: 'Name1Name1',
          name: 'abc@moviebook.cn',
          province: '上海',
          city: '普陀区',
          address: '审核',
          zip: 3
        }, {
          date: 'Name1Name1Name1Name1Name1',
          name: 'abc@moviebook.cn',
          province: '上海',
          city: '普陀区',
          address: '审核未通过',
          zip: 4
        }, {
          date: 'Name1Name1',
          name: 'abc@moviebook.cn',
          province: '上海',
          city: '普陀区',
          address: '审核未通过',
          zip: 5
        }]
      }
    },
    created() {
    },
    mounted() {
    },
    components: {
    },
    methods: {
      handleClose() {
        this.isShow = false;
      },
      // 级联选择器
      handleChange(value) {
        console.log(value);
      },

      // 提交审核表单
      onConfirm(){
        this.$refs['viiewForm'].validate((valid) => {
          if (!valid) {
            alert("false!");
            return false;
          }
          // 111
            console.log("error submit!!");
        });
      },

      onReview(){
        this.isShow = true;
      },
      onEdit(){},
      omDelete(){},
      onDownload(){},
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            console.log("error submit!!");
            return false;
          }
          // 请求接口
          console.log(this.form, "form");
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
  }
</script>

<style lang="scss" scoped>
  .main-wrap{
    padding: 30px;
  }
  .work-name{
    display: inline-block;
    width: 220px;
  }
</style>