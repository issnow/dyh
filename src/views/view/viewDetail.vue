<template>
  <div class="work-detail">
    <div class="work-detail-suggest">
      <div class="title">成品信息:</div>
      <ul class="list">
        <li>
          <div class="label">名称:</div>
          <div class="content">{{product.title}}</div>
        </li>
        <li>
          <div class="label">描述:</div>
          <div class="content">{{product.description}}</div>
        </li>
        <li>
          <div class="label">标签:</div>
          <div class="content">
            {{tagIds}}
            <span>
            {{tagName}}
            </span>
          </div>
        </li>
        <li>
          <div class="label">一级实体:</div>
          <div class="content">显示成品描述的内容</div>
        </li>
        <li>
          <div class="label">二级实体:</div>
          <div class="content">显示成品描述的内容</div>
        </li>
      </ul>
      <div class="video-play-area">
        <videoPlay :src='product.url'></videoPlay>
      </div>
    </div>
    <div class="work-detail-info">
      <div class="title">审核建议:</div>
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="90px"
        class="info-form"
      >
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

        <el-form-item label="一级实体:" prop="thing">
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
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input
            type="text"
            placeholder="请输入内容"
            v-model="form.description"
          >
          </el-input>
          <!-- <div class="tip">上限50个字符。</div> -->
        </el-form-item>
        <el-form-item label="建议:" prop="audit_note">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.audit_note"
            maxlength="50"
            show-word-limit
          >
          </el-input>
          <!-- <div class="tip">上限50个字符。</div> -->
        </el-form-item>
      </el-form>
      <div class="foot-btn">
        <el-button type="primary" @click="submitForm(1)" :loading="loading"
          >审核通过</el-button
        >
        <el-button @click="submitForm(2)">审核未通过</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import videoPlay from "./videoPlay";
import { 
  getAuditDetail,
  getAudit,
  getTagList,
  getEntityList
} from "@api/project";

export default {
  components: {
    videoPlay,
  },
  data() {
    return {
      loading: false,
      form: {
        code: this.$route.query.code,
        audit_note: "",
        audit_status: '',
        // name: "",
        // label: "选项1",
        // thing: "",
        // thing2: "",
      },
      rules: {
        name: [
          { required: false, message: "请输入", trigger: "blur" }
        ],
        label: [
          { required: false, message: "请输入", trigger: "blur" }
        ],
        thing: [
          { required: false, message: "请输入", trigger: "blur" }
        ],
        thing2: [
          { required: false, message: "请输入", trigger: "blur" }
        ],
        description: [
          { required: false, message: "请输入", trigger: "blur" }
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
      product: {},
      task: {},
      tagIds: [],
      tagList: [],
      entityList: [],
      tagName: [],
      entityName: []
    };
  },
  created(){
    this.getTagList();
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
    // 获取标签列表
    getTagList(){
      getTagList().then(res => {
        if(res.status == 1){
          this.tagList = res.element;
          this.product.tag_ids;
        }else{
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      }).catch(error => {
        console.log(error);
      })
    },
    // 提交审核
    submitForm(val) {
      this.form.audit_status = val;
      this.loading = true;

      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.form
          }
          this.$confirm("确认该作品相关信息符合规范，审核通过?", "审核确认", {
            confirmButtonText: "提交",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            getAudit(params).then(res => {
              if(res.status == 1){
                this.loading = false;
                this.$message({
                  type: "success",
                  message: res.msg
                });
              }else{
                this.$message({
                  type: "error",
                  message: res.msg
                })
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
    getAuditDetail(){
      const params = {
        code: this.$route.query.code
      };

      getAuditDetail(params).then(res => {
        if(res.status == 1){
          this.product = res.element && res.element.product;
          this.task = res.element && res.element.task;

          this.tagIds = this.product.tag_ids;
          const tagList = this.product.tag_ids;
          for(let i = 0, len = this.tagList; i < len; i++){
            for(let j = 0, length = tagList; j < length; j++){
              if(this.tagList[i] == Number(tagList[j])){
                this.tagName.push(this.tagList[i].name);
                console.log(this.tagName, 'this.tagName')
              }

            }
          }
          // console.log(this.product , this.task, 'result');
        }else{
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      }).catch(error => {
        console.log(error);
      })
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
      width: 100%;
      text-align: center;
    }
  }
}
</style>