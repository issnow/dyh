<template>
  <div>
    <div class="main-wrap">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="60px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="搜索" prop="title">
              <el-input v-model="form.title" placeholder="请输入关键字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option
                  v-for="item in statusList"
                  :key="item.key"
                  :value="item.name">
                  {{item.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="searchProject">查询</el-button>
            <el-button type="primary" @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table 
        v-loading='loading' 
        class="mb20" 
        :data="tableData" 
        border 
        style="width: 100%"
        :default-sort = "{prop: 'time', order: 'descending'}"
        >
        <el-table-column prop="title" label="成品名称"></el-table-column>
        <el-table-column prop="name" label="创作人" width="200"></el-table-column>
        <el-table-column prop="type" label="类型" width="100">视频</el-table-column>
        <el-table-column prop="resolution" label="分辨率" width="100"></el-table-column>
        <el-table-column prop="wh_ratio" label="画幅" width="80"></el-table-column>
        <!-- <el-table-column prop="view" label="预览" width="120"></el-table-column> -->
        <el-table-column prop="video_size" label="大小（M）" width="100"></el-table-column>
        <el-table-column prop="duration" label="时长（S）" width="100"></el-table-column>
        <el-table-column prop="status_title" label="状态" width="150"></el-table-column>
        <el-table-column prop="created_at" label="合成时间" width="200" sortable></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="onWatch(scope.row)">查看</el-button>
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
    </div>
  </div>
</template>

<script>
  import { 
    getChoicesList,
    getList
  } from "@api/project";

  export default {
    data() {
      return {
        loading: false,
        form: {
          title: '',
          status: '',
        },
        rules: {
          title: [
            { required: false, message: "请输入成品品名称关键字", trigger: "blur" },
          ],
          status: [
            { required: false, message: "请选择状态", trigger: "change" },
          ],
        },
        // 111
        scaleList: [], //画幅比例列表
        sizeList: [],  //分辨率列表
        statusList: [],  //状态列表

        page: {
          pageNo: 1,
          pageSize: 10,
          recordCount: 0,
          pageCount: 0
        },
        tableData: []
      }
    },
    created() {
    },
    mounted() {
      this.getChoicesList();
      this.getList();
    },
    components: {
    },
    methods: {
      // 获取画幅，分辨率，状态列表
      getChoicesList(){
        getChoicesList({type: 1}).then(res => {
          if (res.status == 1) {
            this.scaleList = res.element.wh_ratio;
            this.sizeList = res.element.resolution;
            this.statusList = res.element.status;
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
        this.getList();
      },

      // 清空搜索条件
      resetSearch(){
        this.form.title = '';
        this.form.status = '';
        this.getList();
      },

      onWatch(data){
        this.$router.push({
          path:'/viewDetail', 
          query: {code: data.product_code}
        })
      },
      // 获取审核列表
      getList(){
        this.loading = true;
        const params = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          title: this.form.title,
          status: this.form.status
        };

        getList(params).then(res => {
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
        this.getList();
      },
      handleCurrentChange(val) {
        this.page.pageNo = val;
        this.getList();
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