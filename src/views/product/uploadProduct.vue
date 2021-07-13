<template>
  <el-dialog
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules" label-width="90px" ref="form">
      <el-form-item label="名称:" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="输出设置:" prop="video">
        <el-select v-model="form.video" placeholder="请选择">
          <el-option
            :label="e.label"
            :value="e.value"
            v-for="(e, i) in list"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('form')">提 交</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      list: [
        {
          label: "480p",
          value: 1,
        },
        {
          label: "720p",
          value: 2,
        },
        {
          label: "1080p",
          value: 3,
        },
      ],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入作品名称关键字", trigger: "blur" },
        ],
        video: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  methods: {
    resetFields() {
      this.$refs.form.resetFields();
    },
    handleClose(done) {
      this.resetFields();
      this.$emit("hideDialog");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
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
</style>