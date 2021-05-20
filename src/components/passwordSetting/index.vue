<template>
  <el-dialog
    title="修改密码"
    :visible.sync="visible"
    class="password-dialog"
    :before-close="onCancel"
    width="33%"
  >
    <el-form
      :model="pwdform"
      label-width="100px"
      :rules="pwdRules"
      ref="pwdform"
      class="change-pwd-form"
    >
      <el-form-item label="当前密码:" prop="oldpassword">
        <el-input v-model="pwdform.oldpassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码:" prop="newpassword">
        <el-input v-model="pwdform.newpassword" type="password"></el-input>
        <span>输入提示：请输入包含数字、字母8位密码</span>
      </el-form-item>
      <el-form-item label="确认新密码:" prop="confirmPassword">
        <el-input v-model="pwdform.confirmPassword" type="password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onOK('pwdform')" :loading="loading"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { saveOwnPassword } from "@api/user";
export default {
  props: ["visible"],
  data() {
    const reg = /^(?=.*?[0-9])(?=.*?[a-zA-Z])[0-9a-zA-Z]{8,16}$/
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入包含数字、字母8位密码"));
      } else {
        if (this.pwdform.confirmPassword !== "") {
          this.$refs.pwdform.validateField("confirmPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pwdform.newpassword) {
        callback(new Error("两次输入密码不一致!"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入包含数字、字母8位密码"));
      } else {
        callback();
      }
    };
    return {
      pwdform: {
        oldpassword: "",
        newpassword: "",
        confirmPassword: "",
      },
      pwdRules: {
        oldpassword: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        newpassword: [
          { validator: validatePass, trigger: "blur" },
          // { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      loading: false,
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onCancel() {
      this.resetForm('pwdform')
      this.$emit('hideDialog')
    },
    onOK(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          // alert("submit!");
          console.log(this.pwdform);
          const { oldpassword, newpassword } = this.pwdform;
          let { status, msg } = await saveOwnPassword({
            oldpassword,
            newpassword,
          });
          this.loading = false;
          if (status == 1) {
            this.$message({
              type: "success",
              message: msg,
            });
            this.onCancel()
          }else {
            this.$message({
              type: 'error',
              message: msg
            })
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.password-dialog {
}
</style>