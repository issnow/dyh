<template>
  <el-dialog
    title="提交审核"
    :visible.sync="visible"
    class="work-submit"
    :before-close="beforeClose"
    width="45%"
    :close-on-click-modal="false"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="90px"
      class="work-submit-form"
    >
      <el-form-item label="名称:" prop="title">
        <el-input
          v-model.trim="form.title"
          placeholder="请输入名称"
          maxlength="50"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="描述:" prop="desc">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model.trim="form.desc"
          maxlength="200"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item label="精神文明:" prop="label">
        <el-select v-model="form.label" placeholder="请选择" multiple>
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div class="shiti">
        <div class="label">实体:</div>
        <div class="right">
          <el-form-item
            v-for="(e, i) in entityList"
            :key="i"
            :label="e.f_name + ':'"
            :prop="'thing' + i"
            label-width="60px"
          >
            <el-select
              v-model="form['thing' + i]"
              placeholder="请选择"
              filterable
              multiple
              remote
              :remote-method="
                (query) => {
                  remoteMethod(query, e);
                }
              "
              @visible-change="
                (visi) => {
                  visibleChange(visi, i);
                }
              "
              :loading="selectLoading"
            >
              <el-option
                v-for="item in e.s_name"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('form')" :loading="loading"
        >提 交</el-button
      >
      <el-button @click="beforeClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from "lodash";
import {
  productTagList,
  productApplyAudit,
  newAllEntity,
  newSearchEntity,
} from "@api/workManager";
export default {
  props: ["visible", "code", "title"],
  data() {
    let tempRule = {},
      tempForm = {};
    for (let i = 0; i < 20; i++) {
      tempRule["thing" + i] = {
        required: true,
        message: "请输入",
        trigger: "blur",
      };
      tempForm["thing" + i] = "";
    }
    return {
      form: {
        title: "",
        desc: "",
        label: "",
        ...tempForm,
      },
      loading: false,
      rules: {
        title: [{ required: true, message: "请输入", trigger: "blur" }],
        // desc: [
        //   { required: true, message: "请输入", trigger: "blur" },
        //   // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        label: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        // ...tempRule,
      },
      // 标签
      options: [],
      entityList: [],
      selectLoading: false,
      entityMap: null,
    };
  },
  mounted() {
    this._productTagList();
    this.asyncGetEntityList();
  },
  watch: {
    title: {
      handler(v) {
        this.form.title = this.title;
      },
      immediate: true,
    },
  },
  methods: {
    visibleChange(visi, i) {
      if (!visi) this.$refs.form.validateField(`thing${i}`);
    },
    async onFocus(e, query = "") {
      this.selectLoading = true;
      let res = await newSearchEntity({ f_name: e.f_name, s_name: query });
      this.selectLoading = false;
      if (res.status == 1) {
        e.s_name = res.element;
      }
    },
    async asyncGetEntityList() {
      let { status, element } = await newAllEntity();
      if (status == 1) {
        this.entityList = element;
        let arr = [];
        element.forEach((e, i) => {
          arr.push([`thing${i}`, e.f_name]);
        });
        this.entityMap = new Map(arr);
      }
    },
    remoteMethod: _.debounce(function (query, e) {
      if (query !== "") {
        this.onFocus(e, query);
      }
    }, 600),
    async _productTagList() {
      let { status, element } = await productTagList();
      if (status == 1) {
        this.options = element;
      }
    },
    resetFields() {
      this.$refs.form.resetFields();
    },
    beforeClose() {
      this.resetFields();
      this.$emit("hideDialog");
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.form, "form");
          const entity = Object.entries(this.form).filter(
            ([key, value]) => Array.isArray(value) && value.length && key.includes("thing")
          );
          for (let e of entity) {
            e.unshift(this.entityMap.get(e[0]));
            e.splice(1, 1);
          }

          if (entity.every((e) => e[1].length == 0)) {
            this.$message({
              type: "error",
              message: "请至少选择一个实体",
            });
            return;
          }
          this.loading = true;
          const params = {
            title: this.form.title,
            code: this.code,
            desc: this.form.desc,
            tag: this.form.label,
            entity,
          };
          let { msg, status } = await productApplyAudit(params);
          if (status == 1) {
            this.$message({
              type: "success",
              message: msg,
            });
            this.beforeClose();
            this.$emit("_productGetList");
          }
          this.loading = false;
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
.work-submit {
  .shiti {
    display: flex;
    > .label {
      padding-top: 10px;
      width: 90px;
      padding-right: 12px;
      text-align: right;
      &::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
    }
    .right {
      flex: 1;
    }
  }
}
</style>