<template>
  <el-dialog
    title="提交审核"
    :visible.sync="visible"
    class="work-submit"
    :before-close="beforeClose"
    width="45%"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="90px"
      class="work-submit-form"
    >
      <el-form-item label="名称:">
        {{ title }}
        <div>视频名称不可修改。</div>
      </el-form-item>
      <el-form-item label="描述:" prop="desc">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model.trim="form.desc"
          maxlength="50"
          show-word-limit
        >
        </el-input>
        <!-- <div>上限50个字符。</div> -->
      </el-form-item>
      <el-form-item label="标签:" prop="label">
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
      <div class="shiti">
        <div class="label">实体:</div>
        <div class="right">
          <el-form-item
            v-for="(e, i) in entityList"
            :key="e.id"
            :label="e.name"
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
              @focus="onFocus(e)"
              @visible-change="
                (visi) => {
                  visibleChange(visi, e);
                }
              "
              :loading="selectLoading"
            >
              <el-option
                v-for="item in arrList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>

      <!-- <el-form-item label="人物" prop="thing1">
        <el-select
          v-model="form.thing1"
          placeholder="请选择"
          filterable
          remote
          :remote-method="remoteMethod1"
        >
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
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
  productEntityList,
  productApplyAudit,
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
        desc: "",
        label: "",
        ...tempForm,
      },
      loading: false,
      rules: {
        desc: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        label: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        ...tempRule,
      },
      // 标签
      options: [],
      entityList: [],
      // 搜出来的实体列表
      arrList: [],
      selectLoading: false,
      // 一级实体select框的id
      selectID: "",
    };
  },
  mounted() {
    this._productTagList();
  },
  created() {
    this.asyncGetEntityList();
  },
  methods: {
    visibleChange(visi, e) {
      // console.log('visibleChange', visi, e)
      if (this.selectID == e.id) {
        return;
      }
      if (!visi) {
        this.arrList = [];
      }
    },
    async onFocus(e, query = "") {
      // console.log('onFocus', e.id, query, this.selectID)

      // selectid是已经选择的一级实体框id,如果当前的selectid和上一次的e.id一样
      // 那么就直接使用缓存的arrList,解决每次点击option之后,执行visibleChange方法会置空arrList
      if (this.selectID == e.id && query.length == 0) {
        return;
      }
      this.selectID = e.id;

      this.selectLoading = true;
      let res = await productEntityList({ id: e.id, name: query });
      this.selectLoading = false;
      if (res.status == 1) {
        this.arrList = res.element.map((c) => ({
          value: c.id,
          label: c.name,
        }));
      }
    },
    async asyncGetEntityList() {
      let { status, element } = await productEntityList();
      if (status == 1) {
        // element.forEach(async (e) => {
        //   let res = await productEntityList({ id: e.id, name: "" });
        //   if (res.status == 1) {
        //     e.data = res.element.map((c) => ({
        //       value: c.id,
        //       label: c.name,
        //     }));
        //     // e.option = res.element.map((c) => ({
        //     //   value: c.id,
        //     //   label: c.name,
        //     // }));
        //     e.option = [];
        //     e.search = false;
        //   }
        // });
        console.log(element, "element");
        this.entityList = element;
      }
    },
    remoteMethod: _.debounce(function (query, e) {
      if (query !== "") {
        this.onFocus(e, query);
      } else {
        this.selectID = "";
        this.arrList = [];
      }
    }, 600),
    async _productTagList() {
      let { status, element } = await productTagList();
      if (status == 1) {
        this.options = element.map((e) => ({
          value: e.key,
          label: e.name,
        }));
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
          this.loading = true;
          console.log(this.form, "form");
          const entity = Object.values(this.form)
            .filter((e) => Array.isArray(e))
            .flat();
          const params = {
            code: this.code,
            desc: this.form.desc,
            tag: [this.form.label],
            entity,
          };
          console.log(params);
          let { msg, status } = await productApplyAudit(params);
          if (status == 1) {
            this.$message({
              type: "success",
              message: msg,
            });
            this.beforeClose();
            this.$emit("_productGetList");
          } else {
            this.$message({
              type: "error",
              message: msg,
            });
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
    >.label {
      padding-top: 10px;
      width: 90px;
      padding-right: 12px;
      text-align: right;
    }
    .right {
      flex: 1;
    }
  }
}
</style>