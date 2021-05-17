<template>
  <el-dialog
    title="提交审核"
    :visible.sync="visible"
    class="work-submit"
    :before-close="
      () => {
        $emit('hideDialog');
      }
    "
    width="33%"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="90px"
      class="work-submit-form"
    >
      <el-form-item label="名称:">
        大运河夫子庙视频
        <div>视频名称不可修改。</div>
      </el-form-item>
      <el-form-item label="描述" prop="textarea">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.textarea"
          maxlength="50"
        >
        </el-input>
        <div>上限50个字符。</div>
      </el-form-item>
      <el-form-item label="标签" prop="label">
        <el-select v-model="form.label" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="实体" prop="thing">
            <el-select v-model="form.thing" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="10">
          <el-form-item prop="ting2">
            <el-select v-model="form.thing2" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

        </el-col>
      </el-row>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('form')" :loading='loading'>提 交</el-button>
      <el-button @click="$emit('hideDialog')">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible'],
  data() {
    return {
      form: {
        textarea: "",
        label: '选项1',
        thing: '',
        thing2: ''
      },
      loading: false,
      rules: {
        textarea: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        label: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        thing: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        thing2: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.form)
          this.loading = true

          setTimeout(() => {
            this.loading = false
          }, 2000);
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