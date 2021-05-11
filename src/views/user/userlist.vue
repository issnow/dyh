<template>
  <div class="user-center">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="60px"
      class="user-center-search"
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

    <el-table class="mb20" border :data="tableData" style="width: 100%">
      <el-table-column prop="userID" label="用户ID" >
      </el-table-column>
      <el-table-column prop="name" label="昵称"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="role" label="角色"> </el-table-column>
      <el-table-column prop="phone" label="联系电话"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span class="color-text" :class="{isEnable: scope.row.status}">{{scope.row.status?'启用': '禁用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="organization" label="所属机构"> </el-table-column>

      <el-table-column label="操作" min-width="130">
        <template slot-scope="scope">
          <el-button @click="disabledRow(scope.row)" type="text" size="small"
            >禁用</el-button
          >
          <el-button  @click="resetPassword(scope.row)" type="text" size="small">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        keyword: "",
        status: "",
      },
      rules: {
        keyword: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
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
      tableData: [
        {
          userID: 123,
          name: "张三",
          email: "abc@moviebook.cn",
          role: "管理员",
          phone: "13812345678",
          status: true,
          organization: "南京大学",
        },
        {
          userID: 123,
          name: "张三",
          email: "abc@moviebook.cn",
          role: "管理员",
          phone: "13812345678",
          status: false,
          organization: "南京大学",
        },
      ],
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form, "form");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    disabledRow(row) {
      console.log(row);
    },
    resetPassword(row) {
      console.log(row);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@css/var.scss';
.user-center {
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
        content: '';
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