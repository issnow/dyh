<template>
    <div class="main-wrap">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="60px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="搜索" prop="keyword">
              <el-input v-model="form.keyword" placeholder="请输入项目名称关键字"><el-button slot="append" icon="el-icon-search"></el-button></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
              <el-button type="primary" @click="resetSearch">重置</el-button>
          </el-col>

          <el-col :span="12" class="text-right">
            <el-button type="primary" icon="el-icon-plus" @click="isShow = true">创建项目</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="deleteProject">批量删除</el-button>
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
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="date" label="项目名称"></el-table-column>
        <el-table-column prop="name" label="类型" width="100"></el-table-column>
        <el-table-column prop="province" label="分辨率" width="100"></el-table-column>
        <el-table-column prop="city" label="画幅" width="100"></el-table-column>
        <!-- <el-table-column prop="address" label="大小（M）" width="120"></el-table-column> -->
        <!-- <el-table-column prop="zip" label="时长（S）" width="200" sortable></el-table-column> -->
        <el-table-column prop="zip" label="创建时间" width="200" sortable></el-table-column>
        <el-table-column prop="zip" label="更新时间" width="200" sortable></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="onEdit">编辑</el-button>
            <el-button type="text" @click="omDelete(scope)">删除</el-button>
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

      <!-- 删除提示 -->
      <el-dialog
        title="删除确认"
        :visible="isDelete"
        width="30%"
        :before-close="handleClose">
        <span>请确认是否删除该项目？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDelete = false">取 消</el-button>
          <el-button type="primary" @click="deleteProject">确 认</el-button>
        </span>
      </el-dialog>

      <!-- 创建项目 -->
      <el-dialog 
        title="创建项目"
        :visible="isShow"
        :before-close="handleClose"
        class="creat-dialog"
        width="30%">
        <el-form :model="creatForm" label-width="80px" :rules="creatFormRules" ref="creatForm">
          <el-form-item label="项目名称" prop="name">
            <el-input 
              v-model="creatForm.name"
              placeholder="请输入项目名称"
              maxlength="10"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="画幅比例" prop="scale">
            <el-select v-model="creatForm.scale" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分辨率" prop="size">
            <el-select v-model="creatForm.size" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="onConfirm('creatForm')">确 认</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import { 
    getChoicesList,
    createProject,
    delProject,
    getProjectList 
  } from "@api/project";

  export default {
    data() {
      return {
        loading: false,
        form: {
          keyword: ""
        },
        rules: {
          keyword: [
            { required: true, message: "请输入作品名称关键字", trigger: "blur" },
          ],
          status: [
            { required: true, message: "请选择状态", trigger: "change" },
          ],
        },
        creatFormRules: {
          name: [
            { required: true, message: "请输入项目名称", trigger: "blur" },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          scale: [
            { required: true, message: "请选择画幅比例", trigger: "change" }
          ],
          size: [
            { required: true, message: "请选择分辨率", trigger: "change" }
          ]
        },
        isShow: false,   
        isDelete: false, //删除弹窗
        creatForm: {
          name: '',
          scale: '',
          size: ''
        },
        scaleList: [], //画幅比例列表
        sizeList: [],  //分辨率列表
        statusList: [], //状态列表
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
        currentPage: 5,
        page: {
          pageNo: 1,
          pageSize: 30,
          // map: {
          //   resolution: 540,
          //   wh_ratio: 16:9
          // }
        },
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
        this.isDelete = false;
      },
      
      // 删除项目
      deleteProject(){
        this.isDelete = true;

        delProject().then(res => {
          if (res.status == 1) {
             this.$message({
              type: "success",
              message: res.msg
            })
            this.getChoicesList();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            })
          }
        }).catch(error => {
          console.log(error);
        })
      },
      
      // 获取画幅，分辨率列表
      getChoicesList(){
        getChoicesList().then(res => {
          if (res.status == 1) {
            this.scaleList = res.resolution;
            this.sizeList = res.wh_ratio;
            this.statusList = res.status;
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        }).catch(error => {
          console.log(error);
        })
      },
      // 选中项目
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val, 'valvalval');
        this.getChoicesList();
      },
      // 清空搜索条件
      resetSearch(){
        this.getChoicesList();
      },

      // 创建项目
      addProject(){
        this.$refs['creatForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          let params = {
            title: this.creatForm.name,
            resolution: this.creatForm.scale,
            wh_ratio: this.creatForm.size
          }
          createProject(params).then(res => {
            if(res.status == 1){
              this.$message({
                type: "success",
                message: res.msg
              });
              this.tableData = res.data.xx;
            }else{
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          }).catch(error => {
            console.log(error);
          })
        });
      },

      onReview(){
        this.isShow = true;
      },
      
      // 获取项目列表
      getProjectList(){
        const params = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          map: {
            // search
            ...this.form
          },
        };
        getProjectList().then(res => {
          if(res.status == 1){
            const {pageNo,
              pageSize,
              recordCount,
              pageCount} = res.fsp
            this.page = {
              pageNo,
              pageSize,
              // recordCount,
              // pageCount,
            }
            this.tableData = res.datas
          }else{
            this.$message({
              type: "error",
              message: res.msg
            })
          }
        }).catch(error => {
          console.log(error);
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.getProjectList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.getProjectList();
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
  .creat-dialog {
    .el-select {
        width: 100%;
      }
  }
 
</style>