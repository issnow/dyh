<template>
    <div class="main-wrap">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="60px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="搜索" prop="title">
              <el-input v-model="form.title" placeholder="请输入项目名称关键字">
                <el-button slot="append" icon="el-icon-search" @click="searchProject"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
              <el-button type="primary" @click="resetSearch">重置</el-button>
          </el-col>

          <el-col :span="12" class="text-right">
            <el-button type="primary" icon="el-icon-plus" @click="isShow = true">创建项目</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="omDeletes">批量删除</el-button>
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
        @select="handleSelectionChange"
        >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="项目名称"></el-table-column>
        <!-- <el-table-column prop="name" label="类型" width="100"></el-table-column> -->
        <el-table-column prop="resolution" label="分辨率" width="120">
          <template slot="header" scope="scope">
              <el-select
                  v-model="form.resolution"
                  placeholder="分辨率"
                  @change="filterSelect($event, 'resolution')"
              >
                  <el-option
                    v-for="item in sizeList"
                    :key="item.key"
                    :value="item.name">
                    {{item.name}}
                  </el-option>
              </el-select>
            </template>
        </el-table-column>
        <el-table-column prop="wh_ratio" label="画幅" width="130">
          <template slot="header" slot-scope="scope">
            <el-select
                v-model="form.wh_ratio"
                placeholder="画幅比例"
                @change="filterSelect($event, 'wh_ratio')"
            >
                <el-option
                  v-for="item in scaleList"
                  :key="item.key"
                  :value="item.name">
                  {{item.name}}
                </el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="大小（M）" width="120"></el-table-column> -->
        <!-- <el-table-column prop="zip" label="时长（S）" width="200" sortable></el-table-column> -->
        <el-table-column prop="created_at" label="创建时间" width="200" sortable></el-table-column>
        <el-table-column prop="updated_at" label="更新时间" width="200" sortable></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="onEdit">编辑</el-button>
            <el-button type="text" @click="omDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :current-page="page.pageNo"
        :page-size="page.pageSize"
        layout="total, slot, prev, pager, next, sizes, jumper"
        :total="page.recordCount">
        <span>第{{ page.pageNo }}/{{ page.pageCount }}页</span>
      </el-pagination>

      <!-- 创建项目 -->
      <el-dialog 
        title="创建项目"
        :visible="isShow"
        :before-close="handleClose"
        class="creat-dialog"
        width="30%">
        <el-form :model="creatForm" label-width="80px" :rules="creatFormRules" ref="creatForm">
          <el-form-item label="项目名称" prop="title">
            <el-input 
              v-model="creatForm.title"
              placeholder="请输入项目名称"
              maxlength="10"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="画幅比例" prop="scale">
            <el-select v-model="creatForm.wh_ratio" placeholder="请选择画幅比例">
              <el-option
                v-for="item in scaleList"
                :key="item.key"
                :value="item.name">
                {{item.name}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分辨率" prop="size">
            <el-select v-model="creatForm.resolution" placeholder="请选择分辨率">
              <el-option
                v-for="item in sizeList"
                :key="item.key"
                :value="item.name">
                {{item.name}}
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="addProject('creatForm')">确 认</el-button>
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
          title: '',
          wh_ratio: '',
          resolution: ''
        },
        rules: {
          title: [
            { required: true, message: "请输入项目名称关键字", trigger: "blur" },
          ]
        },
        creatFormRules: {
          title: [
            { required: true, message: "请输入项目名称", trigger: "blur" },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
          wh_ratio: [
            { required: true, message: "请选择画幅比例", trigger: "change" }
          ],
          resolution: [
            { required: true, message: "请选择分辨率", trigger: "change" }
          ]
        },
        isShow: false,   
        isDelete: false, //删除弹窗
        creatForm: {
          title: '',
          wh_ratio: '16:9',
          resolution: '540'
        },
        scaleList: [], //画幅比例列表
        sizeList: [],  //分辨率列表
        
        page: {
          pageNo: 1,
          pageSize: 10,
          recordCount: 0,
          pageCount: 0
        },
        projectId: '',
        tableData: []
      }
    },
    created() {
    },
    mounted() {
      this.getChoicesList();
      this.getProjectList();
    },
    components: {
    },
    methods: {
      handleClose() {
        this.isShow = false;
        this.isDelete = false;
      },

      // 创建项目
      addProject(){
        this.$refs['creatForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          let params = {
            title: this.creatForm.title,
            resolution: this.creatForm.resolution,
            wh_ratio: this.creatForm.wh_ratio
          }
          createProject(params).then(res => {
            if(res.status == 1){
              this.$message({
                type: "success",
                message: res.msg
              });
              this.isShow = false;
              this.getProjectList();
              this.$refs.creatForm.resetFields();
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

      // 获取画幅，分辨率列表
      getChoicesList(){
        getChoicesList({type: 2}).then(res => {
          if (res.status == 1) {
            this.scaleList = res.element.wh_ratio;
            this.sizeList = res.element.resolution;
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
      
      // 搜索列表
      searchProject(){
        this.getProjectList();
      },

      // 清空搜索条件
      resetSearch(){
        this.form.title = '';
        this.getProjectList();
      },
      onEdit(){
      },

      // 选中项目
      handleSelectionChange(val) {
        const projectIds = val.map(e => e.id);
        this.projectId = projectIds.toString();
      },
      // 批量删除
      omDeletes(){
        const params = {
          projectId: this.projectId
        };
        
        this.$confirm('请确认是否删除该项目?', '删除确认', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delProject(params);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      },

      // 单个删除
      omDelete(row){
        const params = {
          projectId: row.id
        };
        
        this.$confirm('请确认是否删除该项目?', '删除确认', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delProject(params);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

      },
      delProject(data){
        delProject(data).then(res => {
          if(res.status == 1){
            this.getProjectList();
            this.$message({
              type: "success",
              message: res.msg
            });
          }else{
            this.$message({
              type: "error",
              message: res.msg
            })
          }
        });
      },
      
      // 筛选列表
      filterSelect(value, type) {
          console.log(type);
          switch (type) {
            case "aaa":
              this.form.wh_ratio = value;
              break;
            case "bbb":
              this.form.resolution = value;
              break;
          }
          this.page.pageNo = 1;
          this.page.pageSize = 10;
          
          this.getProjectList();
      },
      
      // 获取项目列表
      getProjectList(){
        this.loading = true;
        const params = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          map: {
            ...this.form
          },
        };
        console.log("params", params);

        getProjectList(params).then(res => {
          if(res.status == 1){
            this.loading = false;
            const {pageNo,
              pageSize,
              recordCount,
              pageCount} = res.fsp
            this.page = {
              pageNo,
              pageSize,
              recordCount,
              pageCount
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
        this.page.pageSize = val;
        this.getProjectList();
      },
      handleCurrentChange(val) {
        this.page.pageNo = val;
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