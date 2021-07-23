<template>
  <div class="main-wrap">
    <el-form :model="form" :rules="rules" ref="form" label-width="60px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="搜索" prop="title">
            <el-input
              v-model.trim="form.title"
              placeholder="请输入关键字"
              @keyup.enter.native="handleSubmitForm('form')"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSubmitForm('form')"
                :loading="loading"
              ></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="text-center">
          <el-button type="primary" @click="clear" :loading="loading"
            >重置</el-button
          >
        </el-col>
        <el-col :span="14" class="text-right">
          <el-form-item>
            <el-button
              icon="el-icon-delete"
              type="primary"
              @click="selectDelete"
              >批量删除</el-button
            >
            <el-button
              icon="el-icon-upload2"
              type="primary"
              @click="uploadProducVisible = true"
              >上传成品</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="loading"
      class="mb20"
      :data="tableData"
      border
      style="width: 100%"
      :default-sort="{ prop: 'time', order: 'descending' }"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      empty-text="无相关数据"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="title" label="成品名称"></el-table-column>
      <el-table-column
        prop="media_type_title"
        label="类型"
        width="120"
      ></el-table-column>
      <el-table-column label="预览" width="160" class-name="td-center">
        <template slot-scope="scope">
          <videoPreview
            v-if="scope.row.media_type == 1"
            :isVideo="true"
            :source="scope.row.url"
            :bgImage="scope.row.cover_url"
          />
          <!-- <m3u8
            :bgImage="scope.row.cover_url"
            v-if="scope.row.media_type == 1 && !!scope.row.trans_url"
            :src="scope.row.trans_url"
          /> -->
          <audioPreview
            v-if="scope.row.media_type == 2"
            :source="scope.row.url"
          />
          <imagePreview
            v-if="scope.row.media_type == 3"
            :src="scope.row.url"
            :list="[scope.row.url]"
            :styleObj="{ width: '84px' }"
          />
          <i
            class="iconfont icon-ziyuan1662"
            v-if="scope.row.media_type == 4"
            @click="onpdfPre(scope.row.url)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="video_size"
        label="大小（M）"
        width="120"
        sortable="custom"
      ></el-table-column>
      <el-table-column label="状态" prop="status" width="130" class="td">
        <template slot="header" scope="scope">
          <el-select
            class="select-color"
            v-model="form.status"
            placeholder="状态"
            clearable
            @change="filterSelect"
          >
            <el-option
              v-for="item in selectData"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </template>
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.status == 7"
            class="item"
            effect="dark"
            :content="scope.row.audit_note"
            placement="top"
          >
            <span>{{ scope.row.status_title }}</span>
          </el-tooltip>
          <span v-else>{{ scope.row.status_title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创作时间"
        width="200"
        sortable="custom"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="[11, 12, 13, 3, 7, 8].includes(scope.row.status)"
            type="text"
            class="del-red"
            @click="onDelete(scope.row.code)"
            >删除</el-button
          >
          <el-button
            v-if="[13].includes(scope.row.status)"
            type="text"
            @click="onTranscoding(scope.row.code)"
            >重新转码</el-button
          >
          <el-button
            v-if="[3].includes(scope.row.status)"
            type="text"
            @click="onReview(scope.row)"
            >提交审核</el-button
          >
          <el-button
            v-if="[4, 7, 8].includes(scope.row.status)"
            type="text"
            @click="onWatch(scope.row.code)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :hide-on-single-page="true"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNo"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="page.pageSize"
      layout="total, slot, prev, pager, next, sizes, jumper"
      :total="page.recordCount"
    >
      <span>第{{ page.pageNo }}/{{ page.pageCount }}页</span>
    </el-pagination>

    <submitDialog
      :code="code"
      :visible="submitDialogVisible"
      :title="title"
      @hideDialog="submitDialogVisible = false"
      @_productGetList="_productGetList"
    />

    <uploadProduct
      :visible="uploadProducVisible"
      @hideDialog="uploadProducVisible = false"
      :wh_ratio="wh_ratio"
      :resolution="resolution"
      :media_type="media_type"
      @_productGetList="_productGetList"
    />

    <pdfPreview
      :src="pdfsrc"
      :visible="pdfVisible"
      @handleClose="pdfVisible = false"
    />
  </div>
</template>

<script>
import videoPreview from "@component/videoPreview";
import audioPreview from "@component/audioPreview";
import imagePreview from "@component/imagePreview";
import pdfPreview from "@component/pdfPreview";
import submitDialog from "../work/submitDialog.vue";
import uploadProduct from "./uploadProduct.vue";
import { getList, del, applyAudit, reTranscode } from "@api/product";
import { productChoicesList } from "@api/workManager";
import { mapGetters, mapMutations } from "vuex";
// import m3u8 from "@component/m3u8/index";
export default {
  components: {
    videoPreview,
    submitDialog,
    uploadProduct,
    audioPreview,
    imagePreview,
    pdfPreview,
    // m3u8,
  },
  computed: {
    ...mapGetters(["params1", "page1"]),
  },
  data() {
    return {
      pdfVisible: false,
      pdfsrc: "",
      loading: false,
      form: {
        title: "",
        status: "",
      },
      listParams: {
        order: "1",
      },
      rules: {
        title: [
          { required: false, message: "请输入作品名称关键字", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      multipleSelection: [],
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        // 共几条
        recordCount: 0,
        // 共几页
        pageCount: 0,
      },
      // 提交审核code
      code: "",
      title: "",
      submitDialogVisible: false,
      uploadProducVisible: false,
      selectData: [],
      wh_ratio: [],
      resolution: [],
      media_type: [],
      copyParams: {},
    };
  },
  watch: {
    listParams: {
      handler(value) {
        this._productGetList();
      },
      deep: true,
    },
  },
  mounted() {
    if (this.params1) this.init();
    this._productGetList();
    this._productChoicesList();
  },
  methods: {
    ...mapMutations([
      "workManager/setP1",
      "workManager/resetP1",
      "workManager/setPage1",
    ]),
    init() {
      this.form = {
        title: this.params1.title,
        status: this.params1.status,
      };
      this.page = this.page1;
    },
    async _productChoicesList() {
      const { status, element, msg } = await productChoicesList({ type: 6 });
      if (status == 1) {
        this.selectData = element.status;
        this.wh_ratio = element.wh_ratio;
        this.resolution = element.resolution;
        this.media_type = element.media_type;
      }
    },
    // 筛选列表
    filterSelect(value) {
      this.form.status = value;
      this.page.pageNo = 1;
      this.page.pageSize = 10;
      this._productGetList();
    },
    onpdfPre(url) {
      this.pdfsrc = url;
      this.pdfVisible = true;
    },
    async _productGetList() {
      console.log(this.params1, "----------p2");
      this.loading = true;
      const params = {
        ...this.form,
        ...this.listParams,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      };
      this.copyParams = params;
      // console.log(params, "params");
      let { status, datas, fsp, msg } = await getList(
        this.params1 ? this.params1 : params
      );
      this["workManager/resetP1"]();
      this.loading = false;
      if (status == 1) {
        this.tableData = datas;
        this.page = {
          pageNo: fsp.pageNo,
          pageSize: fsp.pageSize,
          // 共几条
          recordCount: fsp.recordCount,
          // 共几页
          pageCount: fsp.pageCount,
        };
        this["workManager/setPage1"](this.page);
      }
    },
    clear() {
      this.$refs.form.resetFields();
      this._productGetList();
    },
    handleSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        }
        // 请求接口
        this._productGetList();
      });
    },
    selectDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm("请确认是否删除该成品?", "删除确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            let len = this.tableData.length;
            let { status, msg } = await del({
              code: this.multipleSelection.map((e) => e.code),
            });
            if (status == 1) {
              if (len == 1 && this.page.pageNo > 1) {
                this.page.pageNo--;
              }
              this.$message({
                type: "success",
                message: msg,
              });
              this._productGetList();
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$message({
          type: "info",
          message: "请先勾选",
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sortChange({ order, prop }) {
      console.log(arguments, "arguments");
      if (order == "ascending") {
        switch (prop) {
          case "video_size":
            this.listParams.order = 12;
            break;
          case "created_at":
            this.listParams.order = 2;
            break;
        }
        // 升序
      } else {
        switch (prop) {
          case "video_size":
            this.listParams.order = 11;
            break;
          case "created_at":
            this.listParams.order = 1;
            break;
        }
        // 降序
      }
    },
    onDelete(code) {
      this.$confirm("请确认是否删除该成品?", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let len = this.tableData.length;
          let { status, msg } = await del({
            code: [code],
          });
          if (status == 1) {
            if (len == 1 && this.page.pageNo > 1) {
              this.page.pageNo--;
            }
            this.$message({
              type: "success",
              message: msg,
            });
            this._productGetList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async onTranscoding(code) {
      let p = {
        code,
      };
      let { status, msg } = await reTranscode(p);
      if (status == 1) {
        this.$message({
          type: "success",
          message: msg,
        });
        this._productGetList();
      }
    },
    onReview({ code, title }) {
      this.code = code;
      this.submitDialogVisible = true;
      this.title = title;
    },
    onWatch(code) {
      this.$router.push({ path: `/productDetail/${code}/0` });
    },
    handleSizeChange(val) {
      this.page = { ...this.page, pageSize: val };
      this._productGetList();
    },
    handleCurrentChange(val) {
      this.page = { ...this.page, pageNo: val };
      this._productGetList();
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.path.includes("productDetail")) {
      this["workManager/setP1"](this.copyParams);
    } else {
      this["workManager/resetP1"]();
    }
    next();
  },
};
</script>

<style lang="scss" scoped>
.main-wrap {
  padding: 30px;
  ::v-deep .el-table {
    .del-red span {
      color: #f56c6c;
    }
    tbody .td-center {
      padding: 0;
      .cell {
        padding: 14px 0 12px;
      }
    }
  }
  .icon-ziyuan1662 {
    margin-left: calc(50% - 14px);
    font-size: 35px;
    cursor: pointer;
  }
}
</style>