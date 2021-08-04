<template>
  <div class="work-detail-wrap">
    <div class="work-detail">
      <div class="work-detail-info">
        <div class="title" v-if="hideTask">审核结果:</div>
        <ul class="list" v-if="hideTask">
          <li v-if="!isProductDetail">
            <div class="label">AI审核:</div>
            <div class="content">
              <template class="ai_note" v-if="!task.ai">
                {{ task.ai_note }}
              </template>
              <template v-else>
                <div class="item" v-for="(e, i) in checkList" :key="i">
                  <div class="label">{{ e.title }}:</div>
                  <bar :item="e.list"></bar>
                </div>
                <div class="item circel">
                  <div class="label">说明:</div>
                  <div style="font-size: 13px" class="btn-group">
                    <i></i>
                    <el-button type="text" size="mini">涉政</el-button>
                    <i></i>
                    <el-button type="text" size="mini">涉黄</el-button>
                    <i></i>
                    <el-button type="text" size="mini">涉暴</el-button>
                    <i></i>
                    <el-button type="text" size="mini">其他</el-button>
                  </div>
                </div>
              </template>
            </div>
          </li>
          <li>
            <div class="label">人工审核意见:</div>
            <div class="content">{{ task.manual }}</div>
          </li>
        </ul>

        <div class="title">{{ isProductDetail ? "成" : "作" }}品信息:</div>
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="100px"
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
              maxlength="50"
              show-word-limit
            >
            </el-input>
            <span v-show="!isEdit">{{ viewInfo.title }}</span>
          </el-form-item>
          <el-form-item label="类型:" v-if="isProductDetail">
            <span>{{ viewInfo.media_type_title }}</span>
          </el-form-item>
          <el-form-item label="精神文明:" prop="tag">
            <el-select
              v-show="isEdit"
              v-model="form.tag"
              placeholder="请选择"
              multiple
            >
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <span v-show="!isEdit">{{ viewInfo.tag.join(",") }}</span>
          </el-form-item>

          <div class="shiti">
            <div
              class="label"
              :class="{ require: isEdit }"
              style="font-size: 14px; color: #606266"
            >
              实体:
            </div>
            <div class="right">
              <el-form-item
                v-show="isEdit"
                v-for="(e, i) in entityList"
                :key="e.f_name"
                :label="e.f_name + ':'"
                :prop="'thing' + i"
                label-width="60px"
              >
                <el-select
                  v-model="form['thing' + i]"
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
                  @visible-change="
                    (visi) => {
                      visibleChange(visi, i);
                    }
                  "
                  :loading="loading"
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
              <el-form-item
                v-show="!isEdit"
                v-for="(e, i) in viewInfo.entity"
                :key="i"
                :label="e.f_name + ':'"
                label-width="60px"
              >
                {{
                  e.s_name.length
                    ? e.s_name.reduce((p, n) => p + "," + n)
                    : null
                }}
              </el-form-item>
            </div>
          </div>

          <el-form-item label="描述:" prop="description" class="desc-item">
            <el-input
              v-show="isEdit"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model.trim="form.description"
              maxlength="200"
              show-word-limit
            >
            </el-input>
            <span v-show="!isEdit" class="desc">{{
              viewInfo.description
            }}</span>
          </el-form-item>
        </el-form>
        <div
          class="info-list"
          :class="{ product: isProductDetail }"
          v-if="viewInfo.media_type == 1"
        >
          <div class="title">视频信息:</div>
          <div><span>格式:</span>{{ viewInfo.video_format }}</div>
          <div><span>大小:</span>{{ viewInfo.video_size }}</div>
          <div v-if="isProductDetail">
            <span>创建时间:</span>{{ viewInfo.created_at }}
          </div>
          <div v-if="isProductDetail">
            <span>更新时间:</span>{{ viewInfo.updated_at }}
          </div>
          <div v-if="!isProductDetail">
            <span>画幅:</span>{{ viewInfo.wh_ratio }}
          </div>
          <div v-if="!isProductDetail">
            <span>时长:</span>{{ viewInfo.duration }}
          </div>
          <div v-if="!isProductDetail">
            <span>分辨率:</span>{{ viewInfo.resolution }}
          </div>
        </div>
      </div>

      <div class="work-detail-suggest">
        <div
          v-if="viewInfo.is_del === 1"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
        >
          <i
            class="iconfont icon-file-delete-fill"
            style="color: #8e8f93; font-size: 120px"
          ></i>
          <div style="color: #c0c4cc; margin-top: 30px">
            作品违规，文件已被管理员删除！
          </div>
        </div>
        <div class="video-play-area" v-else-if="viewInfo.media_type == 1">
          <videoPlay
            :src="isProductDetail ? viewInfo.trans_url : viewInfo.url"
          ></videoPlay>
        </div>
        <div class="picture-area" v-else-if="viewInfo.media_type == 3">
          <imagePreview
            :src="viewInfo.url"
            :list="[viewInfo.url]"
            :styleObj="{ maxHeight: '400px' }"
          />
          <itemInfo :viewInfo="viewInfo" title="图片信息" />
        </div>
        <div class="mp3-area" v-else-if="viewInfo.media_type == 2">
          <audio
            :src="isProductDetail ? viewInfo.trans_url : viewInfo.url"
            controls
            preload
            controlslist="nodownload"
          ></audio>
          <itemInfo :viewInfo="viewInfo" title="音频信息" />
        </div>
        <div class="pdf-area" v-else-if="viewInfo.media_type == 4">
          <div class="pdf-wrap">
            <pdfView :url="viewInfo.url" />
          </div>
          <itemInfo :viewInfo="viewInfo" title="文本信息" />
        </div>
      </div>
    </div>
    <div class="foot-btn">
      <el-button v-show="isEdit" type="primary" @click="submitForm('form')"
        >提交审核</el-button
      >
      <el-button
        v-show="!isEdit && viewInfo.status == 7"
        :loading="editLoading"
        type="primary"
        @click="onEdit"
        >编 辑</el-button
      >
      <el-button @click="onCancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  productDetail,
  productTagList,
  productEdit,
  newAllEntity,
  newSearchEntity,
} from "@api/workManager";
import imagePreview from "@component/imagePreview";
import pdfView from "@component/pdfView";
import _ from "lodash";
import videoPlay from "./videoPlay";
import bar from "./bar";
import itemInfo from "./itemInfo.vue";
// import player from "@component/m3u8/player";
export default {
  components: {
    videoPlay,
    bar,
    imagePreview,
    itemInfo,
    pdfView,
    // player,
  },
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
        description: "",
        title: "",
        tag: [],
        ...tempForm,
      },
      // 查看
      viewInfo: {
        title: "",
        tag: [],
        description: "",
        entity: [],
      },
      rules:
        this.$route.params.isEdit === "1"
          ? {
              title: [{ required: true, message: "请输入", trigger: "blur" }],
              tag: [{ required: false, message: "请输入", trigger: "blur" }],
              ...tempRule,
            }
          : {},
      // 标签
      options: [],
      data: {},
      isEdit: this.$route.params.isEdit === "1",
      entityList: [],
      // task审核
      task: {},
      loading: false,
      // 一级实体select框的id
      selectID: "",
      editLoading: false,
      hideTask: false,
      checkList: [],
      entityMap: null,
      keyValueMap: null,
      // 区分成品还是作品,true是成品详情
      isProductDetail: this.$route.path.includes("productDetail"),
    };
  },
  mounted() {
    this.init();
    this.asyncGetEntityList();
    this._productTagList();
  },
  methods: {
    onEdit() {
      this.isEdit = true;
      let tempRule = {};
      for (let i = 0; i < 20; i++) {
        tempRule["thing" + i] = {
          required: true,
          message: "请输入",
          trigger: "blur",
        };
      }
      this.rules = {
        title: [{ required: true, message: "请输入", trigger: "blur" }],
        tag: [{ required: false, message: "请输入", trigger: "blur" }],
        // ...tempRule,
      };
      let obj = {};
      this.viewInfo.entity.forEach((e) => {
        obj[this.entityMap.get(e.f_name)] = e.s_name;
      });
      this.form = { ...this.form, ...obj };
    },
    visibleChange(visi, e) {
      if (!visi) this.$refs.form.validateField(`thing${e}`);
    },
    remoteMethod: _.debounce(function (query, e) {
      if (query !== "") {
        this.onFocus(e, query);
      }
    }, 600),
    async onFocus(e, query = "") {
      this.loading = true;
      let res = await newSearchEntity({ f_name: e.f_name, s_name: query });
      this.loading = false;
      if (res.status == 1) {
        e.s_name = res.element;
      }
    },
    async asyncGetEntityList() {
      let { status, element, msg } = await newAllEntity();
      if (status == 1) {
        let arr = [],
          arr2 = [];
        this.entityList = element;
        element.forEach((e, i) => {
          arr.push([e.f_name, "thing" + i]);
          arr2.push(["thing" + i, e.f_name]);
        });
        this.entityMap = new Map(arr);
        this.keyValueMap = new Map(arr2);
      }
    },
    async _productTagList() {
      let { status, element, msg } = await productTagList();
      if (status == 1) {
        this.options = element;
      }
    },
    formatList(obj, duration) {
      let arr = [];
      Object.entries(obj).forEach(([key, value], i) => {
        console.log(key, value, i);
        arr[i] = {
          title:
            key == "frame"
              ? "视频"
              : key == "ocr"
              ? "字幕"
              : key == "voice"
              ? "音频"
              : "",
          list: (function () {
            let arr = [];

            value.forEach((e) => {
              e.suspects.forEach((c) => {
                arr.push({
                  left: ((e.frame_begin / duration) * 100).toFixed(2) + "%",
                  width:
                    (((e.frame_end - e.frame_begin) / duration) * 100).toFixed(
                      2
                    ) + "%",
                  backgroundColor: `#${c.color}`,
                  text: c.category_name + ":" + c.suspect_content,
                });
              });
            });
            console.log(arr, "arr");
            return arr;
          })(),
        };
      });

      return arr;
    },
    async init() {
      this.editLoading = true;
      const p = {
        code: this.$route.params.code,
      };
      let { status, element, msg } = await productDetail(p);
      this.editLoading = false;
      console.log(element, "element");
      if (status == 1) {
        const { description, url, title, tag, duration } = element.product;
        this.hideTask = !!element.task;
        // const { audit_note, audit_status, audit_status_title } = element.task;
        this.task = {
          manual: element?.task?.manual,
          ai: element?.task?.ai,
          ai_note: element?.task?.ai_note,
        };
        if (element?.task?.ai) {
          this.checkList = this.formatList(element?.task?.ai, duration);
        }
        this.form = {
          ...this.form,
          tag,
          description,
          title,
        };
        this.viewInfo = element.product;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log("form---", this.form);

          this.$confirm("确认提交更新该作品的基本信息?", "提交确认", {
            confirmButtonText: "提交",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              const entity = [];
              for (let key in this.form) {
                let v = this.form[key];
                if (key.includes("thing") && Array.isArray(v)) {
                  let cur = {
                    f_name: this.keyValueMap.get(key),
                    s_name: v,
                  };
                  entity.push(cur);
                }
              }
              if (entity.every((e) => e.s_name.length == 0)) {
                this.$message({
                  type: "error",
                  message: "请至少选择一个实体",
                });
                return;
              }
              let params = {
                title: this.form.title,
                code: this.$route.params.code,
                desc: this.form.description,
                tag: this.form.tag,
                entity,
              };
              let { msg, status } = await productEdit(params);
              if (status == 1) {
                this.$message({
                  type: "success",
                  message: msg,
                });
                this.onCancel();
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
      // if(this.$refs.mPlayer){
      //   this.$refs.mPlayer.close();
      // }

      this.$router.push(
        this.isProductDetail ? "/productManager" : "/workManager"
      );
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";
.work-detail-wrap {
  padding-bottom: 30px;
  .work-detail {
    display: flex;
    padding: 50px 30px 0px;
    // min-height: 660px;
    .title {
      font-size: 16px;
      color: $deepDark;
      font-weight: 600;
    }
    &-suggest {
      // display: flex;
      // justify-content: center;
      padding-top: 34px;
      width: 60%;

      .video-play-area {
        margin-left: 30px;
        width: 44vw;
        height: 24.75vw;
        background-color: #000;
      }
      .pdf-area {
        height: 100%;
        .pdf-wrap {
          height: calc(100vh - 370px);
        }
      }
      .mp3-area {
        audio {
          margin-left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    &-info {
      position: relative;
      padding-right: 40px;
      width: 50%;
      border-right: 1px dashed $dark;
      .info-form {
        ::v-deep .el-form-item.desc-item {
          .el-form-item__content,
          .el-form-item__label {
            line-height: 30px;
            .desc {
              word-break: break-all;
            }
          }
        }
      }
      .info-list {
        margin-bottom: 10px;
        div:not(.title) {
          display: inline-block;
          width: 30%;
          margin-bottom: 14px;
          font-size: 14px;
          span {
            display: inline-block;
            width: 100px;
            text-align: right;
            padding-right: 12px;
          }
        }
        &.product div:not(.title) {
          width: 50%;
        }
      }
      .list {
        padding-left: 0;
        li {
          font-size: 14px;
          display: flex;
          margin-bottom: 20px;
          > div.label {
            font-size: 14px;
          }
          .label {
            width: 100px;
            text-align: right;
            padding-right: 12px;
            color: $dark;
            font-size: 13px;
          }
          .content {
            flex: 1;
            color: $gray;
            word-break: break-all;
            .item {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
              .label {
                width: 60px;
              }
            }
            .circel {
              div.btn-group {
                i {
                  display: inline-block;
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  border: 1px solid #ccc;
                  margin-right: 20px;
                  margin-left: 15px;
                  &:nth-of-type(1) {
                    background-color: #facd91;
                  }
                  &:nth-of-type(2) {
                    background-color: #ffff80;
                  }
                  &:nth-of-type(3) {
                    background-color: #ec808d;
                  }
                  &:nth-of-type(4) {
                    background-color: #c280ff;
                  }
                }
              }
            }
          }
        }
      }
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
          width: 100px;
          padding-right: 12px;
          text-align: right;
          &.require::before {
            content: "*";
            color: #f56c6c;
            margin-right: 4px;
          }
        }
        .right {
          flex: 1;
        }
        ::v-deep .el-form-item__label {
          margin-right: 12px;
          padding-right: 0;
          text-align: center;
          background-color: #f4f4f5;
          color: #909399;
          border-radius: 4px;
          border: 1px splid #e9e9eb;
        }
      }
    }
  }
  .foot-btn {
    text-align: right;
    // padding-top: 50px;
    padding-right: 50px;
  }
}
</style>