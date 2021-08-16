<template>
  <div class="work-detail">
    <div class="detail-main">
      <div class="work-detail-suggest">
        <div class="work-detail-base">
          <div class="header">基本信息:</div>
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
                {{ product.tag.toString() }}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">实体:</div>
              <div class="info-content">
                <el-tabs type="border-card" v-model="tabActive">
                  <el-tab-pane v-for="item of product.entity" :key="item.f_name" :label="item.f_name"
                               :name="item.f_name">
                    {{ item.s_name.toString() }}
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">描述:</div>
              <div class="info-content">{{ product.description }}</div>
            </div>
          </div>
        </div>
        <video-info v-if="product.media_type === 1" style="margin-top: 30px;" :product="product"></video-info>
        <audio-info v-if="product.media_type === 2" style="margin-top: 30px" :product="product"></audio-info>
        <pic-info v-if="product.media_type === 3" style="margin-top: 30px;" :product="product"></pic-info>
        <text-info v-if="product.media_type === 4" style="margin-top: 30px" :product="product"></text-info>
        <div class="work-detail-audit">
          <div class="header">审核结果:</div>
          <div class="content">
            <div class="info-item" v-if="product.upload_type === 1 && product.media_type !== 3">
              <div class="info-label">AI审核:</div>
              <div class="info-content">
                <ai-audit title="视频" :audit="task.ai.frame" :duration="product.duration"
                          :audit-note="auditNoteVideo"></ai-audit>
                <ai-audit style="margin-top: 5px;" title="字幕" :audit="task.ai.ocr"
                          :duration="product.duration" :audit-note="auditNoteOCR"></ai-audit>
                <ai-audit style="margin-top: 5px;" title="声音" :audit="task.ai.voice"
                          :duration="product.duration" :audit-note="auditNoteAudio"></ai-audit>
                <div class="ai-legend">
                  <div class="ai-legend-item">
                    <span>说明:</span>
                  </div>
                  <div class="ai-legend-item">
                    <i style="background: #facd91"></i>
                    <span>涉政</span>
                  </div>
                  <div class="ai-legend-item">
                    <i style="background: #ffff80"></i>
                    <span>涉黄</span>
                  </div>
                  <div class="ai-legend-item">
                    <i style="background: #ec808d"></i>
                    <span>涉暴</span>
                  </div>
                  <div class="ai-legend-item">
                    <i style="background: #c280ff"></i>
                    <span>其他</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">人工审核:</div>
              <div class="info-content">
                <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="audit_note"
                    maxlength="200"
                    show-word-limit
                    :readonly="task.audit_status !== 6"
                >
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="work-detail-info">
        <div class="header">预览:</div>
        <div class="content">
          <div class="preview-content">
            <div class="file-none" v-if="product.is_del === 1">
              <img class="icon" src="../../assets/file-none.png">
              <div style="color: #C0C4CC; margin-top: 30px;">作品违规，文件已被管理员删除！</div>
            </div>
            <video class="video" v-else-if="product.media_type === 1" :src="product.trans_url || product.url"
                   controls controlslist="nodownload" :disablePictureInPicture="true"></video>
            <audio class="audio" v-else-if="product.media_type === 2" :src="product.trans_url || product.url"
                   controls controlslist="nodownload"></audio>
            <img v-else-if="product.media_type === 3" :src="product.trans_url || product.url">
            <pdf-view :url="product.trans_url || product.url" v-else-if="product.media_type === 4"></pdf-view>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button v-if="task.audit_status === 6" type="primary" @click="submitForm(1)" :loading="loading"
      >审核通过
      </el-button>
      <el-button v-if="task.audit_status === 6" type="danger" @click="submitForm(2)">审核驳回</el-button>
      <el-button @click="back">返 回</el-button>
    </div>

  </div>
</template>

<script>
import videoPlay from "./videoPlay";
import videoInfo from './viewDetailVideoInfo';
import picInfo from './viewDetailPicInfo';
import audioInfo from './viewDetailAudioInfo';
import textInfo from './viewDetailTextInfo';
import aiAudit from '@/components/aiAudit';
import pdfView from '@/components/pdfView';
// import player from "@component/m3u8/player";

import {
  getAuditDetail,
  auditTask,
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
    pdfView,
    // player
  },
  data() {
    return {
      loading: false,
      code: '',
      // audit_status: '',   // 审核状态
      audit_note: '',   //审核内容
      product: {
        tag: [],
      },
      task: {},

      entityList: [],
      tagName: '',

      // 实体Tabs Action
      tabActive: '',
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

    // 提交审核 1-通过; 2-驳回
    async submitForm(val) {
      if (val === 2 && this.audit_note === '') {
        this.$message({
          type: 'error',
          message: '审核驳回必须填写人工审核内容',
        });
        return;
      }

      const confirmTip = {
        1: {
          title: '审核通过',
          message: '确认该作品相关信息符合规范，审核通过?',
        },
        2: {
          title: '审核驳回',
          message: '确认该作品相关信息不符合规范，审核驳回?',
        },
      };

      const confirmValue = await this.$confirm(confirmTip[val].message, confirmTip[val].title, {
        confirmButtonText: "提交",
        cancelButtonText: "取消",
        type: "warning",
      }).catch(() => {
      });

      if (confirmValue) {
        const params = {
          code: this.$route.query.code,
          audit_status: val,
          audit_note: this.audit_note,
        };

        this.loading = true;
        const result = await auditTask(params);
        this.loading = false;
        if (result.status === 1) {
          this.$message({
            type: "success",
            message: '审核成功',
          });
          this.$router.back();
        }
      }
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
          this.tabActive = (this.product.entity.length > 0) ? this.product.entity[0].f_name : '';

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

    // 返回
    back() {
      // if(this.$refs.mPlayer){
      //   this.$refs.mPlayer.close();
      // }
      this.$router.push('/viewList');
    },

  },
  computed: {
    // 视频AI分析描述
    auditNoteVideo: function () {
      if (this.task.ai_fail === 1) {
        return this.task.ai_audit_note;
      }
      if (this.task.ai.frame) {
        return '';
      }
      return '已通过';
    },
    // 视频AI分析描述
    auditNoteOCR: function () {
      if (this.task.ai_fail === 1) {
        return this.task.ai_audit_note;
      }
      if (this.task.ai.ocr) {
        return '';
      }
      return '已通过';
    },
    auditNoteAudio: function () {
      if (this.task.ai_fail === 1) {
        return this.task.ai_audit_note;
      }
      if (this.task.ai.voice) {
        return '';
      }
      return '已通过';
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@css/var.scss";

.work-detail {
  box-sizing: border-box;
  width: 100%;

  .detail-main {
    display: flex;
    padding: 20px 30px;
  }


  // 左边信息
  .work-detail-suggest {
    width: 50%;
    //height: 100%;
    padding-right: 30px;
    border-right: 1px dashed $dark;

    .work-detail-base {
      .header {
        font-size: 16px;
        font-weight: 600;
        width: 100%;
        border-bottom: 1px solid #E4E7ED;
        padding-bottom: 10px;
      }

      .content {
        margin-top: 20px;

        > .info-item {
          margin-top: 20px;
        }


      }
    }

    // 审核信息
    .work-detail-audit {
      margin-top: 30px;

      .header {
        font-size: 16px;
        font-weight: 600;
        width: 100%;
        border-bottom: 1px solid #E4E7ED;
        padding-bottom: 10px;
      }

      .content {
        margin-top: 20px;

        > .info-item {
          margin-top: 20px;
          width: 100%;
        }

        .ai-legend {
          display: flex;
          align-items: center;
          width: 100%;
          height: 40px;
          font-size: 14px;

          .ai-legend-item {
            margin-right: 20px;

            i {
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              border: 1px solid #ccc;
              margin-right: 5px;

            }
          }

        }
      }


    }

    .info-item {
      width: 100%;
      font-size: 14px;
      display: flex;
      align-items: first;

      .info-label {
        width: 100px;
        text-align: right;
        padding-right: 12px;
      }

      .info-content {
        flex: 1;
      }
    }

  }

  // 右边预览
  .work-detail-info {
    position: relative;
    width: 50%;

    .header {
      font-size: 16px;
      font-weight: 600;
      width: 100%;
      height: 40px;
      padding-left: 40px;


    }

    .content {
      width: 100%;
      height: calc(100% - 40px);
      padding-left: 40px;
      padding-top: 20px;
      padding-bottom: 20px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .audio {
        width: 100%;
      }

      .video {
        width: 100%;
        max-height: 100%;
        background: #000000;

        //width: 44vw;
        //height: 24.75vw;
        display: block;

        &:focus {
          outline: none;
        }


      }

      img {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
        display: block;
      }

      .preview-content {
        background: #F4F7FA;
        border: 1px solid #C1C1C1;
        width: 44vw;
        height: 24.75vw;
        border-radius: 8px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .file-none {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        //background: #F4F7FA;
        //border: 1px solid #C1C1C1;
        //width: 44vw;
        //height: 24.75vw;
        //border-radius: 8px;

        .icon {
          width: 100px;
          height: auto;

        }

      }

    }


  }

  .footer {
    height: 40px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-right: 50px;
  }

}
</style>
