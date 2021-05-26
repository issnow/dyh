<template>
  <div class="work-detail">
    <div class="work-detail-suggest">
      <div class="title">审核建议:</div>
      <ul class="list">
        <li>
          <div class="label">AI审核:</div>
          <div class="content">黄暴政审核未通过</div>
        </li>
        <li>
          <div class="label">描述:</div>
          <div class="content">显示成品描述的内容</div>
        </li>
        <li>
          <div class="label">标签:</div>
          <div class="content">显示成品描述的内容</div>
        </li>
        <li>
          <div class="label">一级实体:</div>
          <div class="content">显示成品描述的内容</div>
        </li>
        <li>
          <div class="label">二级实体:</div>
          <div class="content">显示成品描述的内容</div>
        </li>
        <li>
          <div class="label">建议:</div>
          <div class="content">{{ task.audit_note }}</div>
        </li>
      </ul>
      <div class="video-play-area">
        <videoPlay :src="url"></videoPlay>
      </div>
    </div>

    <div class="work-detail-info">
      <div class="title">成品信息:</div>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="90px"
        class="info-form"
        :disabled="!isEdit"
      >
        <el-form-item label="名称:" prop="title">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.title"
            maxlength="20"
            show-word-limit
          >
          </el-input>
          <!-- <div class="tip">上限20个字符。</div> -->
        </el-form-item>
        <el-form-item label="标签:" prop="tag">
          <el-select v-model="form.tag" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="一级实体:" prop="thing">
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

        <el-form-item label="二级实体:" prop="thing2">
          <el-select v-model="form.thing2" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item
          v-for="e in entityList"
          :key="e.id"
          :label="e.name"
          :prop="'thing' + e.id"
        >
          <el-select
            v-model="form['thing' + e.id]"
            placeholder="请选择"
            filterable
            multiple
            ref="search"
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
            :loading="loading"
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
        <el-form-item label="描述:" prop="description">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.description"
            maxlength="50"
            show-word-limit
          >
          </el-input>
          <!-- <div class="tip">上限50个字符。</div> -->
        </el-form-item>
      </el-form>
      <div class="foot-btn">
        <el-button v-if="isEdit" type="primary" @click="submitForm('form')"
          >提 交</el-button
        >
        <el-button v-if="!isEdit" type="primary" @click="onEdit"
          >编 辑</el-button
        >
        <el-button @click="onCancel">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  productDetail,
  productEntityList,
  productTagList,
  productEdit,
} from "@api/workManager";
import _ from "lodash";
import videoPlay from "./videoPlay";
export default {
  components: {
    videoPlay,
  },
  created() {
    this.asyncGetEntityList();
    this._productTagList();
  },
  data() {
    let tempRule = {},
      tempForm = {};
    for (let i = 1; i < 20; i++) {
      tempRule["thing" + i] = {
        required: true,
        message: "请输入",
        trigger: "blur",
      };
      tempForm["thing" + i] = "";
    }
    return {
      form: {
        description: "",
        title: "",
        tag: "",
        // thing: "",
        // thing2: "",
        ...tempForm,
      },
      rules: {
        title: [
          { required: true, message: "请输入1", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        tag: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        // thing: [
        //   { required: true, message: "请输入", trigger: "blur" },
        //   // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        // thing2: [
        //   { required: true, message: "请输入", trigger: "blur" },
        //   // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        // ],
        description: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        ...tempRule,
      },
      // 标签
      options: [],
      data: {},
      isEdit: this.$route.params.isEdit === "1",
      entityList: [],
      // 搜出来的实体列表
      arrList: [],
      url: "",
      // task审核
      task: {},
      loading: false,
      // 一级实体select框的id
      selectID: "",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    onEdit() {
      this.isEdit = true;
    },
    visibleChange(visi, e) {
      if (this.selectID == e.id) {
        return;
      }
      if (!visi) {
        this.arrList = [];
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
    async onFocus(e, query = "") {
      if (this.selectID == e.id && query.length == 0) {
        return;
      }
      this.selectID = e.id;

      this.loading = true;
      let res = await productEntityList({ id: e.id, name: query });
      this.loading = false;
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
        this.entityList = element;
      }
    },
    async _productTagList() {
      let { status, element } = await productTagList();
      if (status == 1) {
        this.options = element.map((e) => ({
          value: e.key,
          label: e.name,
        }));
      }
    },
    async init() {
      const p = {
        code: this.$route.params.code,
      };
      let { status, element } = await productDetail(p);
      console.log(element, "444");
      if (status == 1) {
        const { description, entities, tag_ids, url } = element.product;
        const { audit_note, audit_status, audit_status_title } = element.task;
        this.form = {
          ...this.form,
          tag: tag_ids[0] / 1,
          description,
          // title: ''
        };
        entities.forEach(async (c) => {
          this.form["thing" + c.fid] = c.sid;
          let res = await productEntityList({ id: c.fid, name: "" });
          if (res.status == 1) {
            this.arrList = res.element.map((d) => ({
              value: d.id,
              label: d.name,
            }));
          }
        });
        this.url = url;
        this.task = {
          audit_note,
        };
      }
    },
    // getImg(src) {
    //   if (src) {
    //     return require("@/assets/" + src);
    //   }
    // },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // console.log(this.form);

          this.$confirm("确认提交更新该作品的基本信息?", "提交确认", {
            confirmButtonText: "提交",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              const entity = Object.values(this.form)
                .filter((e) => Array.isArray(e))
                .flat();
              let params = {
                code: this.$route.params.code,
                desc: this.form.description,
                tag: [this.form.tag],
                entity,
              };
              // console.log(params, 'params')
              let { msg, status } = await productEdit(params);
              if (status == 1) {
                this.$message({
                  type: "success",
                  message: msg,
                });
              } else {
                this.$message({
                  type: "error",
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onCancel() {
      this.$router.push("/workManager");
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";
.work-detail {
  display: flex;
  padding: 50px 30px;
  .title {
    font-size: 16px;
    color: $deepDark;
    font-weight: 600;
  }
  &-suggest {
    width: 60%;
    padding-right: 30px;
    border-right: 1px dashed $dark;
    .list {
      li {
        font-size: 14px;
        display: flex;
        margin-bottom: 20px;
        .label {
          width: 100px;
          text-align: right;
          margin-right: 10px;
          color: $dark;
        }
        .content {
          flex: 1;
          color: $gray;
        }
      }
    }
    .video-play-area {
      width: 44vw;
      height: 24.75vw;
      background-color: #000;
    }
  }
  &-info {
    position: relative;
    padding-left: 40px;
    width: 40%;
    .title {
      margin-bottom: 16px;
    }
    .tip {
      color: $gray;
    }
    .foot-btn {
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
