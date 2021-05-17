<template>
  <div>
    <div class="main-wrap">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="60px"
        :inline="true"
      >
        <el-row>
          <el-col :span="7">
            <el-form-item label="搜索" prop="keyword">
              <el-input
                v-model="form.keyword"
                placeholder="请输入关键字"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option
                  v-for="item in selectData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')"
                >查询</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        v-loading="loading"
        class="mb20"
        :data="tableData"
        border
        style="width: 100%"
        :default-sort="{ prop: 'time', order: 'descending' }"
      >
        <el-table-column prop="name" label="成品名称"></el-table-column>
        <el-table-column
          prop="person"
          label="创作人"
          width="200"
        ></el-table-column>
        <el-table-column prop="type" label="类型" width="100"></el-table-column>
        <el-table-column
          prop="picture"
          label="画幅"
          width="100"
        ></el-table-column>
        <el-table-column prop="view" label="预览" width="120">
          <template slot-scope="scope">
            <videoPreview
              :isVideo='true'
              :source='getImg("movie.mp4")'
              :bgImage='getImg("8.jpg")'
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="size"
          label="大小（M）"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="duration"
          label="时长（S）"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="time"
          label="创作时间"
          width="200"
          sortable
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="text" @click="onReview">提交审核</el-button>
            <el-button type="text" @click="onGenerate">重新合成</el-button>
            <el-button type="text" @click="onDelete">删除</el-button>
            <el-button type="text" @click="onWatch">查看</el-button>
            <el-button type="text" @click="onEdit">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNo"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, slot, prev, pager, next, sizes, jumper"
        :total="page.recordCount"
      >
        <span>第{{ page.pageNo }}/{{ page.pageCount }}页</span>
      </el-pagination>

      <submitDialog
        :visible='submitDialogVisible'
        @hideDialog='submitDialogVisible=false'
      />
    </div>
  </div>
</template>

<script>
// import {
//   getData
// } from '@api/main'
import videoPreview from '@component/videoPreview'
import submitDialog from './submitDialog'
import { setActiveMenu } from './activeMenu'
export default {
  components: {
    submitDialog,
    videoPreview
  },
  data() {
    return {
      submitDialogVisible: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        // 共几条
        recordCount: 0,
        // 共几页
        pageCount: 0,
      },
      loading: false,
      form: {
        keyword: "",
        status: "",
      },
      rules: {
        keyword: [
          { required: true, message: "请输入作品名称关键字", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      selectData: [
        {
          value: "1",
          label: "合成中",
        },
        {
          value: "2",
          label: "合成失败",
        },
        {
          value: "3",
          label: "待审核",
        },
        {
          value: "4",
          label: "审核中",
        },
        {
          value: "5",
          label: "审核失败",
        },
        {
          value: "6",
          label: "待发布",
        },
        {
          value: "7",
          label: "已发布",
        },
      ],
      status: "",
      value: "",
      searchValue: "",
      tableData: [
        {
          name: "Name1Name1Name1",
          person: "abc@moviebook.cn",
          type: "上海",
          picture: "普陀区",
          view: "审核",
          size: 200333,
          duration: 111,
          status: "成功",
          time: "1",
        },
        {
          name: "Name1Name1Name1",
          person: "abc@moviebook.cn",
          type: "上海",
          picture: "普陀区",
          view: "审核",
          size: 200333,
          duration: 111,
          status: "成功",
          time: "2",
        },
        {
          name: "Name1Name1Name1",
          person: "abc@moviebook.cn",
          type: "上海",
          picture: "普陀区",
          view: "审核",
          size: 200333,
          duration: 111,
          status: "成功",
          time: "3",
        },
        {
          name: "Name1Name1Name1",
          person: "abc@moviebook.cn",
          type: "上海",
          picture: "普陀区",
          view: "审核",
          size: 200333,
          duration: 111,
          status: "成功",
          time: "4",
        },
        {
          name: "Name1Name1Name1",
          person: "abc@moviebook.cn",
          type: "上海",
          picture: "普陀区",
          view: "审核",
          size: 200333,
          duration: 111,
          status: "成功",
          time: "5",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    getImg(src) {
      if (src) {
        return require("@/assets/" + src);
      }
    },
    onReview() {
      this.submitDialogVisible = true
    },
    onGenerate() {},
    onDelete() {
      this.$confirm('请确认是否删除该成品?', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    onWatch() {
      // setActiveMenu('/workManager')
      this.$router.push({path:'/workDetail', query:{id:123}})
    },
    onEdit() {

    },
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
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrap {
  padding: 30px;
}
.work-name {
  display: inline-block;
  width: 220px;
}
</style>