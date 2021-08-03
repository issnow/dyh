<template>
  <div class="user-list">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="60px"
      class="user-list-search"
    >
      <el-row>
        <el-col :span="14">
          <el-form-item label="搜索" prop="email">
            <el-input
              v-model.trim="form.email"
              placeholder="请输入关键字"
              @keydown.enter.native="submitForm('form')"
              :autofocus="true"
              clearable
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="submitForm('form')"
                :loading="loading"
              ></el-button>
            </el-input>
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
      <el-table-column :resizable="false" prop="id" label="用户ID">
      </el-table-column>
      <el-table-column :resizable="false" prop="nickname" label="昵称">
      </el-table-column>
      <el-table-column :resizable="false" prop="email" label="邮箱">
      </el-table-column>
      <el-table-column :resizable="false" prop="role" label="角色">
        <template slot-scope="scope">
          <span>
            {{ scope.row.type == 1 ? "创作者" : "管理员" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :resizable="false" prop="phone" label="联系电话">
      </el-table-column>
      <el-table-column :resizable="false" prop="state" label="状态" width="120">
        <template slot="header" scope="scope">
          <el-select
            class="select-color"
            v-model="form.state"
            placeholder="状态"
            clearable
            @change="filterSelect"
          >
            <el-option
              v-for="item in selectData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <template slot-scope="scope">
          <span
            class="color-text"
            :class="{ isEnable: scope.row.state == 1 }"
            >{{ scope.row.state == 1 ? "启用" : "禁用" }}</span
          >
        </template>
      </el-table-column>
      <el-table-column :resizable="false" prop="institutions" label="所属机构">
      </el-table-column>

      <el-table-column :resizable="false" label="操作" min-width="130">
        <template slot-scope="scope">
          <el-button @click="disabledRow(scope.row)" type="text" size="small">{{
            scope.row.state == 1 ? "禁用" : "启用"
          }}</el-button>
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
      :page-sizes="[5, 10, 15, 20]"
      :page-size="page.pageSize"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="page.recordCount"
      class="common-pagination"
      :hide-on-single-page="true"
    >
      <span>第{{ page.pageNo }}/{{ page.pageCount }}页</span>
    </el-pagination>
  </div>
</template>

<script>
import { getTableData, setUserState, resetUserPassword } from "@api/user";
import ee from "@/config/event";
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
          { required: false, message: "请输入关键字", trigger: "blur" },
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
      tableData: [],
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
    ee.on("getTableData", this._getTableData);
  },
  beforeDestroy() {
    ee.removeListener("getTableData", this._getTableData);
  },
  methods: {
    filterSelect(v) {
      this.form.state = v;
      this._getTableData();
    },
    clear() {
      this.$refs.form.resetFields();
      this._getTableData();
    },
    async _getTableData() {
      this.loading = true;
      const params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        map: {
          ...this.form,
        },
      };
      console.log("params", params);
      let { datas, fsp, msg, status } = await getTableData(params);
      this.loading = false;
      if (status == 1) {
        const { pageNo, pageSize, recordCount, pageCount } = fsp;
        this.page = { pageNo, pageSize, recordCount, pageCount };
        this.tableData = datas;
      }

      // console.log("res", res);
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page = { ...this.page, pageSize: val };
      this._getTableData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = { ...this.page, pageNo: val };
      this._getTableData();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this._getTableData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    disabledRow(row) {
      this.$confirm(`确定${row.state == 1 ? "禁用" : "启用"}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const params = {
            id: row.id,
            state: row.state == 1 ? 2 : 1,
          };
          let { status, msg } = await setUserState(params);

          if (status == 1) {
            this._getTableData();
            this.$message({
              type: "success",
              message: msg,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    resetPassword(row) {
      this.$confirm("确定重置密码吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { status, msg } = await resetUserPassword({ id: row.id });
          if (status == 1) {
            this._getTableData();
            this.$message({
              type: "success",
              message: msg,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
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
      }
    }
  }
}
</style>
