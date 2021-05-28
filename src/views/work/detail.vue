<template>
  <div class="work-detail">
    <div class="work-detail-suggest">
      <div class="title">审核结果:</div>
      <ul class="list">
        <li>
          <div class="label">AI审核:</div>
          <div class="content">{{'黄暴政审核未通过'}}</div>
        </li>
        <li>
          <div class="label">人工审核意见:</div>
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
            v-show="isEdit"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model.trim="form.title"
            maxlength="20"
            show-word-limit
          >
          </el-input>
          <span v-show="!isEdit">{{ viewInfo.title }}</span>
          <!-- <div class="tip">上限20个字符。</div> -->
        </el-form-item>
        <el-form-item label="标签:" prop="tag">
          <el-select v-show="isEdit" v-model="form.tag" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
          <span v-show="!isEdit">{{ viewInfo.tag_names_str }}</span>
        </el-form-item>

        <div class="shiti">
          <div class="label">实体:</div>
          <div class="right">
            <el-form-item
              v-show="isEdit"
              v-for="e in entityList"
              :key="e.name"
              :label="e.name"
              :prop="'thing' + e.id"
              label-width="60px"
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
            <el-form-item
              v-show="!isEdit"
              v-for="(e, i) in viewInfo.entities"
              :key="i"
              :label="e.ftext"
              label-width="60px"
            >
              {{ e.text.reduce((p, n) => p + "," + n) }}
            </el-form-item>
          </div>
        </div>

        <el-form-item label="描述:" prop="description">
          <el-input
            v-show="isEdit"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model.trim="form.description"
            maxlength="50"
            show-word-limit
          >
          </el-input>
          <!-- <div class="tip">上限50个字符。</div> -->
          <span v-show="!isEdit">{{ viewInfo.description }}</span>
        </el-form-item>
      </el-form>
      <div class="foot-btn">
        <el-button v-show="isEdit" type="primary" @click="submitForm('form')"
          >提 交</el-button
        >
        <el-button v-show="!isEdit" :loading='editLoading' type="primary" @click="onEdit"
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
      // 查看
      viewInfo: {
        title: "",
        tag_names_str: "",
        description: "",
        entities: [],
      },
      rules:
        this.$route.params.isEdit === "1"
          ? {
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
            }
          : {},
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
      editLoading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    onEdit() {
      this.isEdit = true;
      let tempRule = {};
      for (let i = 1; i < 20; i++) {
        tempRule["thing" + i] = {
          required: true,
          message: "请输入",
          trigger: "blur",
        };
      }
      this.rules = {
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
        description: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        ...tempRule,
      };
      this.viewInfo.entities.forEach(async (c) => {
        let res = await productEntityList({ id: c.fid, name: "" });
        this.form["thing" + c.fid] = c.sid;
        if (res.status == 1) {
          this.arrList = res.element.map((d) => ({
            value: d.id,
            label: d.name,
          }));
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
        this.$refs.form.validate()
      });
    },
    visibleChange(visi, e) {
      this.$refs.form.validate()
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
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    async asyncGetEntityList() {
      let { status, element, msg } = await productEntityList();
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
      } else {
        this.$message({
          type: "error",
          message: msg,
        });
      }
    },
    async _productTagList() {
      let { status, element, msg } = await productTagList();
      if (status == 1) {
        this.options = element;
      } else {
        this.$message({
          type: "error",
          message: msg,
        });
      }
    },
    async init() {
      this.editLoading = true
      const p = {
        code: this.$route.params.code,
      };
      let { status, element, msg } = await productDetail(p);
      this.editLoading = false
      console.log(element, "element");
      if (status == 1) {
        const { description, entities, tag_ids, url, title,tag_names_str } = element.product;
        const { audit_note, audit_status, audit_status_title } = element.task;
        this.form = {
          ...this.form,
          tag: tag_ids[0] / 1,
          description,
          title,
        };
        this.viewInfo.title = title;
        this.viewInfo.tag_names_str = tag_names_str;
        this.viewInfo.entities = entities;
        this.viewInfo.description = description;
        if (this.isEdit) {
          entities.forEach(async (c) => {
            let res = await productEntityList({ id: c.fid, name: "" });
            this.form["thing" + c.fid] = c.sid;
            if (res.status == 1) {
              this.arrList = res.element.map((d) => ({
                value: d.id,
                label: d.name,
              }));
            }
          });
        }
        this.url = url;
        this.task = {
          audit_note,
        };
      } else {
        this.$message({
          type: "error",
          message: msg,
        });
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
              console.log(params, 'params')
              // return
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
    .shiti {
      display: flex;
      > .label {
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
}
</style>
