<template>
  <div class="user-center">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="90px"
      class="user-center-form"
    >
      <div class="user-id">
        <i class="el-icon-user"></i>
        <el-form-item label="用户ID:">12312313</el-form-item>
      </div>
      <div class="name">
        <i class="el-icon-user"></i>
        <el-form-item label="昵称:" prop="name">
          <el-input
            v-if="isEdit"
            placeholder="请输入"
            v-model="form.name"
          ></el-input>
          <span v-else>张三</span>
        </el-form-item>
      </div>
      <div class="email">
        <i class="el-icon-user"></i>
        <el-form-item label="邮箱:" prop="email">
          <el-input
            v-if="isEdit"
            placeholder="请输入"
            v-model="form.email"
          ></el-input>
          <span v-else>h5_cheng@163.com</span>
        </el-form-item>
      </div>
      <div class="user-id">
        <i class="el-icon-user"></i>
        <el-form-item label="角色:">管理员/创作</el-form-item>
      </div>
      <div class="phone">
        <i class="el-icon-user"></i>
        <el-form-item label="联系方式:" prop="phone">
          <el-input
            v-if="isEdit"
            placeholder="请输入"
            v-model="form.phone"
          ></el-input>
          <span v-else>13812345678</span>
        </el-form-item>
      </div>
      <div class="user-id">
        <i class="el-icon-user"></i>
        <el-form-item label="所属机构:">南京大学</el-form-item>
      </div>
      <div class="phone">
        <i class="el-icon-user"></i>
        <el-form-item label="当前密码:">123123123</el-form-item>
        <el-button type="text" style="margin-left: 50px" @click="changePassword"
          >修改</el-button
        >
      </div>
      <el-form-item label-width="20px">
        <el-button type="primary" @click="submitForm('form')">编辑</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 修改密码啊 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="pwdform" label-width="100px" :rules="pwdRules" ref="pwdform" class="change-pwd-form">
        <el-form-item label="当前密码:" prop='curPassword'>
          <el-input v-model="pwdform.curPassword"></el-input>
          <span>输入提示：请输入包含数字、字母、符号8位密码</span>
        </el-form-item>
        <el-form-item label="新密码:" prop='newPassword'>
          <el-input v-model="pwdform.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop='confirmPassword'>
          <el-input v-model="pwdform.confirmPassword"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onOK('pwdform')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
      },
      pwdRules: {
        curPassword: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      // if isEdit == false rules = {}-->解决红色必填按钮
      isEdit: true,
      dialogFormVisible: true,
      pwdform: {
        curPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    };
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onOK(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
    changePassword() {},
  },
};
</script>

<style lang="scss" scoped>
.user-center {
  padding: 50px 100px;
  &-form {
    > div {
      display: flex;
      margin-bottom: 24px;
      align-items: center;
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>