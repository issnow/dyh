<template>
  <div class="user-list">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="60px"
      class="user-list-search"
      :inline="true"
    >
      <el-row>
        <el-col :span="7">
          <el-form-item label="搜索" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入关键字"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="状态" prop="state">
            <el-select v-model="form.state" placeholder="请选择">
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
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column prop="id" label="用户ID"> </el-table-column>
      <el-table-column prop="nickname" label="昵称"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="role" label="角色">
        <template slot-scope="scope">
          <span>
            {{ scope.row.type == 1 ? "创作者" : "管理员" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话"> </el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <span class="color-text" :class="{ isEnable: scope.row.state }">{{
            scope.row.state == 1 ? "启用" : "禁用"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="institutions" label="所属机构"> </el-table-column>

      <el-table-column label="操作" min-width="130">
        <template slot-scope="scope">
          <el-button @click="disabledRow(scope.row)" type="text" size="small"
            >{{scope.row.state == 1 ? "禁用" : "启用"}}</el-button
          >
          <el-button @click="resetPassword(scope.row)" type="text" size="small"
            >重置密码</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="page.pageSize"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="page.recordCount"
    >
      <span>第{{ page.pageNo }}/{{ page.pageCount }}页</span>
    </el-pagination>
  </div>
</template>

<script>
import { getTableData,setUserState,resetUserPassword } from "@api/user";
export default {
  data() {
    return {
      loading: false,
      form: {
        email: "",
        state: "",
      },
      rules: {
        email: [
          { required: true, message: "请输入关键字", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        state: [{ required: true, message: "请输入", trigger: "change" }],
      },
      selectData: [
        {
          value: 1,
          label: "启用",
        },
        {
          value: 2,
          label: "禁用",
        },
      ],
      tableData: [
        {
          code: "28a9905e27887fa90f434ef1ff250fdd",
          create_time: "2021-04-28 17:25:50",
          create_user: 3,
          email: null,
          headicon: null,
          id: 7,
          institutions: null,
          is_delete: 0,
          modify_time: "2021-05-07 14:51:38",
          modify_user: 3,
          name: "2",
          nickname: "1",
          phone: "181012856,77",
          state: 1,
          type: 1,
        }
      ],
      page: {
        pageNo: 1,
        pageSize: 10,
        // 共几条
        recordCount: 0,
        // 共几页
        pageCount: 0,
      },
    };
  },
  mounted() {
    this._getTableData();
  },
  methods: {
    async _getTableData() {
      this.loading = true
      console.log(this.form, "form");
      // const { email, state } = this.form;
      // const { pageNo, pageSize, recordCount, pageCount } = this.page;
      const params = {
        // ...this.page,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        map: {
          // email,
          // state,
          ...this.form
        },
      };
      // const p = {
      //   pageNo: 1,
      //   pageSize: 30,
      //   recordCount: 0,
      //   pageCount: 0,
      //   map: {
      //     email: "fang_xu@moviebook.com",
      //     state: 1,
      //   },
      // };
      console.log("params", params);
      let res = await getTableData(params);
      this.loading = false
      const {datas, fsp} = res
      const {pageNo,
        pageSize,
        recordCount,
        pageCount} = fsp
      this.page = {pageNo,
        pageSize,
        recordCount,
        pageCount,}
      this.tableData = datas

      console.log("res", res);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page = {...this.page, pageSize: val}
      this._getTableData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = {...this.page, pageNo: val}
      this._getTableData()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.form, "form");
          this._getTableData()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async disabledRow(row) {
      const params = {
        id: row.id,
        state: row.state == 1 ? 2:1
      }
      let {status, msg} = await setUserState(params)
      this.$message({
        message: msg,
      })
      if(status == 1) {
        
        this._getTableData()
      }

      console.log(row);
    },
    async resetPassword(row) {
      const {status, msg} = await resetUserPassword({id:row.id})
      this.$message(msg)
      if(status == 1) {
        this._getTableData()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";
.user-list {
  padding: 30px;
  .el-table {
    .color-text {
      color: $supRed;
      &.isEnable {
        color: $green;
        &:before {
          background-color: $green;
        }
      }
      &:before {
        content: "";
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: $supRed;
        transform: translateY(-3px);
        margin-right: 10px;
      }
    }
  }
}
</style>