<template>
  <div class="work-detail">
    <div class="work-detail-suggest">
      <div class="work-detail-base">
        <div class="header">成品信息:</div>
        <div class="content">
          <div class="info-item">
            <div class="info-label">名称:</div>
            <div class="info-content">{{ product.title }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">类型:</div>
            <div class="info-content">{{ product.media_type_title }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">精神文明:</div>
            <div class="info-content">
              <el-tag v-for="item in product.tag" :key="item" type="info" size="mini" style="margin-right: 5px;">{{
                  item
                }}
              </el-tag>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">实体:</div>
            <div class="info-content">
              <div class="entity" v-for="item of product.entity" :key="item.f_name" style="margin-top: 10px;">
                <div class="entity-item">
                  <el-tag type="info" size="mini">{{ item.f_name }}</el-tag>
                  <span v-for="name of item.s_name" :key="name" style="margin-left: 10px;">{{ name }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">描述:</div>
            <div class="info-content">{{ product.description }}</div>
          </div>
        </div>
      </div>
      <video-info v-if="product.media_type === 1" style="margin-top: 20px;" :product="product"></video-info>
      <audio-info v-if="product.media_type === 2" style="margin-top: 20px" :product="product"></audio-info>
      <pic-info v-if="product.media_type === 3" style="margin-top: 20px;" :product="product"></pic-info>
      <text-info v-if="product.media_type === 4" style="margin-top: 20px" :product="product"></text-info>
      <div class="work-detail-audit">
        <div class="header">审核结果:</div>
        <div class="content">
          <div class="info-item">
            <div class="info-label">AI审核:</div>
            <div class="info-content">
              <div v-if="!task.ai">无</div>
              <ai-audit v-if="task.ai" title="视频" :audit="task.ai.frame" :duration="product.duration"></ai-audit>
              <ai-audit v-if="task.ai" style="margin-top: 5px;" title="字幕" :audit="task.ai.ocr"
                        :duration="product.duration"></ai-audit>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">人工审核:</div>
            <div class="info-content">
              <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="audit_note"
                  maxlength="50"
                  show-word-limit
              >
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="work-detail-info">
      <video :src="product.url" controls></video>
      <!--      <div class="title">审核建议:</div>-->
      <!--      <el-form-->
      <!--          :model="form"-->
      <!--          :rules="rules"-->
      <!--          ref="form"-->
      <!--          label-width="90px"-->
      <!--          class="info-form"-->
      <!--      >-->
      <!--        <el-form-item label="建议:" prop="audit_note">-->
<!--                <el-input-->
<!--                    type="textarea"-->
<!--                    :rows="3"-->
<!--                    placeholder="请输入内容"-->
<!--                    v-model="form.audit_note"-->
<!--                    maxlength="50"-->
<!--                    show-word-limit-->
<!--                >-->
<!--                </el-input>-->
                <!-- <div class="tip">上限50个字符。</div> -->
<!--              </el-form-item>-->
      <!--      </el-form>-->
      <div class="foot-btn">
        <el-button type="primary" @click="submitForm(1)" :loading="loading"
        >审核通过
        </el-button
        >
        <el-button @click="submitForm(2)">审核驳回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import videoPlay from "./videoPlay";
import videoInfo from './viewDetailVideoInfo';
import picInfo from './viewDetailPicInfo';
import audioInfo from './viewDetailAudioInfo';
import textInfo from './viewDetailTextInfo';
import aiAudit from './aiAudit';

import {
  getAuditDetail,
  getAudit,
  getTagList,
  getEntityList,
} from "@api/project";

export default {
  components: {
    videoPlay,
    videoInfo,
    picInfo,
    audioInfo,
    textInfo,
    aiAudit,
  },
  data() {
    return {
      loading: false,
      code: '',
      audit_status: '',
      audit_note: '',
      rules: {
        description: [
          {required: false, message: "请输入", trigger: "blur"},
        ],
      },

      product: {},
      task: {},

      entityList: [],
      tagName: '',
    };
  },
  created() {
  },
  mounted() {
    this.getAuditDetail();
  },
  methods: {
    getImg(src) {
      if (src) {
        return require("@/assets/" + src);
      }
    },

    // 提交审核
    submitForm(val) {
      this.form.audit_status = val;
      this.loading = true;

      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.form,
          };
          this.$confirm("确认该作品相关信息符合规范，审核通过?", "审核确认", {
            confirmButtonText: "提交",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            getAudit(params).then(res => {
              if (res.status == 1) {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: res.msg,
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.msg,
                });
              }
            }).catch(error => {
              console.log(error);
            });

          }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
        } else {
          return false;
        }
      });
    },

    // 获取审核列表
    getAuditDetail() {
      const params = {
        code: this.$route.query.code,
      };

      getAuditDetail(params).then(res => {
        if (res.status == 1) {
          this.product = res.element && res.element.product;
          this.task = res.element && res.element.task;

          this.tagName = this.product.tag_names_str;
          this.entityList = this.product.entities;
          this.audit_note = this.task.audit_note;

          console.log('task', this.task);
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      }).catch(error => {
        console.log(error);
      });
    },

  },
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";

.work-detail {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px 30px;


  .title {
    font-size: 16px;
    color: $deepDark;
    font-weight: 600;
  }

  .work-detail-base {
    .header {
      font-size: 14px;
      font-weight: 600;
      width: 60px;
      text-align: right;
    }

    .content {
      margin-top: 10px;

      > .info-item {
        margin-top: 10px;
      }
    }
  }

  .work-detail-audit {
    margin-top: 20px;

    .header {
      font-size: 14px;
      font-weight: 600;
      width: 60px;
      text-align: right;
    }

    .content {
      margin-top: 10px;

      > .info-item {
        margin-top: 10px;
        width: 100%;
      }
    }


  }

  .info-item {
    width: 100%;
    font-size: 14px;
    display: flex;
    align-items: center;

    .info-label {
      width: 60px;
      text-align: right;
      margin-right: 10px;
    }

    .info-content {
      flex: 1;
    }
  }

  &-suggest {
    width: 50%;
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
    }
  }

  &-info {
    position: relative;
    padding-left: 40px;
    width: 60%;

    .title {
      margin-bottom: 16px;
    }

    .tip {
      color: $gray;
    }

    .foot-btn {
      position: absolute;
      bottom: 0;
      text-align: center;
    }
  }

  video {
    width: 100%;
    display: block;
  }
}
</style>
