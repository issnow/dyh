<template>
  <div class="work-detail">
    <div class="work-detail-suggest">
      <div class="title">审核建议:</div>
      <ul class="list">
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
          <div class="content">显示成品描述的内容</div>
        </li>
      </ul>
      <div class="video-play-area">
        <videoPlay :src='getImg("movie.mp4")'></videoPlay>
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
      >
        <el-form-item label="名称:" prop="name">
          <el-input
            type="textarea"
            :rows="1"
            placeholder="请输入内容"
            v-model="form.name"
            maxlength="20"
          >
          </el-input>
          <div class="tip">上限20个字符。</div>
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
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.description"
            maxlength="50"
          >
          </el-input>
          <div class="tip">上限50个字符。</div>
        </el-form-item>
      </el-form>
      <div class="foot-btn">
        <el-button type="primary" @click="submitForm('form')" :loading="loading"
          >提 交</el-button
        >
        <el-button @click="onCancel">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import videoPlay from "./videoPlay";
export default {
  components: {
    videoPlay,
  },
  data() {
    return {
      loading: false,
      // query: {}
      form: {
        description: "",
        name: "",
        label: "选项1",
        thing: "",
        thing2: "",
      },
      rules: {
        name: [
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
        description: [
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
    getImg(src) {
      if (src) {
        return require("@/assets/" + src);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.form);
          this.loading = true;

          this.$confirm("确认提交更新该作品的基本信息?", "提交确认", {
            confirmButtonText: "提交",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
          setTimeout(() => {
            this.loading = false;
          }, 2000);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onCancel() {
      this.$router.push('/workManager')
      this.$refs.form.resetFields()
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