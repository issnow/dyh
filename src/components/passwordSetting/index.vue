<template>
  <el-dialog  title="修改密码" :visible.sync="visible" class="password-dialog"
    @close="$emit('hideDialog')"
  >
    <el-form
      :model="pwdform"
      label-width="100px"
      :rules="pwdRules"
      ref="pwdform"
      class="change-pwd-form"
    >
      <el-form-item label="当前密码:" prop="curPassword">
        <el-input v-model="pwdform.curPassword"></el-input>
        <span>输入提示：请输入包含数字、字母、符号8位密码</span>
      </el-form-item>
      <el-form-item label="新密码:" prop="newPassword">
        <el-input v-model="pwdform.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码:" prop="confirmPassword">
        <el-input v-model="pwdform.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('hideDialog')">取 消</el-button>
      <el-button type="primary" @click="onOK('pwdform')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      pwdform: {
        curPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      pwdRules: {
        curPassword: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onOK(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert("submit!");
          this.$emit("hideDialog");
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