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
            <div class="info-content" style="display: grid; grid-template-columns: repeat(7, 1fr);">
              <div v-for="item in product.tag" :key="item" type="info" size="mini" style="width: 60px;">
                {{item }}
              </div>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">实体:</div>
            <div class="info-content">
              <div class="entity" v-for="item of product.entity" :key="item.f_name" style="margin-top: 10px;">
                <div class="entity-item" style="display: flex;">
                  <el-tag type="info" size="mini" style="margin-right: 5px;">{{ item.f_name }}</el-tag>
                  <div>
                    <span v-for="name of item.s_name" :key="name" style="margin-right: 5px;">{{ name }}</span>
                  </div>
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
          <div class="info-item" v-if="task.ai && task.ai.length > 0">
            <div class="info-label">AI审核:</div>
            <div class="info-content">
              <ai-audit title="视频" :audit="task.ai.frame" :duration="product.duration"></ai-audit>
              <ai-audit style="margin-top: 5px;" title="字幕" :audit="task.ai.ocr"
                        :duration="product.duration"></ai-audit>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">人工审核:</div>
            <div class="info-content">
              <el-input
                  type="textarea"
                  :rows="6"
                  placeholder="请输入内容"
                  v-model="audit_note"
                  maxlength="200"
                  show-word-limit
              >
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="work-detail-info">
      <div class="content">
        <!-- <player
          v-if="!!product.trans_url && product.media_type === 1"
          :src="product.trans_url"
          :bgImage="product.cover_url"
          ref="mPlayer"
        /> -->
        <video class="video" v-if="product.media_type === 1" :src="product.url" controls></video>

        <audio class="audio"  v-if="product.media_type === 2" :src="product.url" controls></audio>
        <img v-if="product.media_type === 3" :src="product.url">
        <pdf-view :url="product.url" v-if="product.media_type === 4"></pdf-view>
      </div>
      <div class="footer">
        <el-button v-if="task.audit_status === 6" type="primary" @click="submitForm(1)" :loading="loading"
        >审核通过
        </el-button>
        <el-button v-if="task.audit_status === 6" type="danger" @click="submitForm(2)">审核驳回</el-button>
        <el-button @click="back">返 回</el-button>
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

    // 返回
    back() {
      // if(this.$refs.mPlayer){
      //   this.$refs.mPlayer.close();
      // }
      this.$router.push('/viewList');
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


  .work-detail-suggest {
    width: 50%;
    height: 100%;
    padding-right: 30px;
    border-right: 1px dashed $dark;
    overflow: auto;

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

  }

  .work-detail-info {
    position: relative;
    //padding-left: 40px;
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .content {
      height: calc(100% - 100px);
      width: 100%;
      padding-left: 40px;
      position: relative;

      .audio{
        width: 100%;
        height: 50%;
      }
      .video{
        width: 100%;
        height: 100%;
        display: block;

        &:focus {
          outline: none;
        }
      }

    }

    .footer {
      height: 40px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }


  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: top;
    display: block;
  }
}
</style>
