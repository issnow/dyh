<template>
  <div class="main-wrap">
    <el-form :model="form" :rules="rules" ref="form">
      <el-row>
        <el-col :span="5">
          <el-form-item>
            <el-button icon="el-icon-delete" @click="selectDelete"
              >批量删除</el-button
            >
          </el-form-item>
        </el-col>
        <el-col :span="6" offset="13">
          <el-form-item prop="title" label-width="60px">
            <el-input
              v-model.trim="form.title"
              placeholder="请输入关键字搜索"
              @keyup.enter.native="handleSubmitForm('form')"
              clearable
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
      <el-table-column type="selection" width="35" :resizable="false">
      </el-table-column>
      <el-table-column
        prop="title"
        label="作品名称"
        min-width="300"
        :resizable="false"
      ></el-table-column>
      <el-table-column
        :resizable="false"
        prop="media_type_title"
        label="类型"
        width="100"
      ></el-table-column>
      <el-table-column
        :resizable="false"
        prop="resolution"
        label="分辨率"
        width="110"
        align="right"
        header-align="left"
      >
        <template slot="header" scope="scope">
          <el-select
            class="select-color"
            v-model="form.resolution"
            placeholder="分辨率"
            clearable
            @change="filterSelect($event, 'resolution')"
          >
            <el-option
              v-for="e in filterResolution"
              :key="e.key"
              :value="e.key"
              :label="e.name"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        prop="wh_ratio"
        label="画幅"
        width="100"
        align="right"
        header-align="left"
      >
        <template slot="header" slot-scope="scope">
          <el-select
            class="select-color"
            v-model="form.wh_ratio"
            placeholder="画幅"
            clearable
            @change="filterSelect($event, 'wh_ratio')"
          >
            <el-option
              v-for="item in filterWh_ratio"
              :key="item.key"
              :value="item.key"
              :label="item.name"
            >
              <!-- {{item.name}} -->
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        label="预览"
        width="100"
        class-name="td-center"
      >
        <template slot-scope="scope">
          <del-preview v-if="scope.row.is_del === 1"></del-preview>
          <videoPreview
            v-else-if="scope.row.media_type == 1"
            :isVideo="true"
            :source="scope.row.url"
            :bgImage="scope.row.cover_url"
            controlslist=""
          />
          <audioPreview
            v-else-if="scope.row.media_type == 2"
            :source="scope.row.url"
          />
          <imagePreview
            v-else-if="scope.row.media_type == 3"
            :src="scope.row.url"
            :list="[scope.row.url]"
            :styleObj="{ height: '48px', width: '86px' }"
            fit="cover"
          />
          <i
            class="iconfont icon-ziyuan1662"
            v-else-if="scope.row.media_type == 4"
            @click="onpdfPre(scope.row.url)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        :resizable="false"
        prop="video_size"
        label="大小"
        width="100"
        sortable="custom"
        align="right"
        header-align="left"
      ></el-table-column>
      <el-table-column
        :resizable="false"
        prop="duration"
        label="时长（S）"
        width="120"
        sortable="custom"
        align="right"
        header-align="left"
      ></el-table-column>
      <el-table-column
        :resizable="false"
        label="状态"
        prop="status_title"
        width="100"
      >
        <template slot="header" scope="scope">
          <el-select
            class="select-color"
            v-model="form.status"
            placeholder="状态"
            clearable
            @change="filterSelect($event, 'status')"
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
        :resizable="false"
        prop="created_at"
        label="创建时间"
        width="180"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        :resizable="false"
        fixed="right"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            v-if="[2].includes(scope.row.status)"
            type="text"
            @click="onGenerate(scope.row.id)"
            >重新合成</el-button
          >
          <el-button
            v-if="[3].includes(scope.row.status)"
            type="text"
            @click="onReview(scope.row)"
            >提交审核</el-button
          >
          <el-button
            v-if="![1, 2, 3].includes(scope.row.status)"
            type="text"
            @click="onWatch(scope.row.code)"
            >查看</el-button
          >
          <el-button type="text" @click="downloadFile(scope.row)"
            >下载</el-button
          >
          <el-button
            v-if="[1, 2, 3, 6, 7, 5].includes(scope.row.status)"
            type="text"
            @click="onDelete(scope.row.code)"
            class="del-red"
            >删除</el-button
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

    <pdfPreview
      :src="pdfsrc"
      :visible="pdfVisible"
      @handleClose="pdfVisible = false"
    />
  </div>
</template>

<script>
import {
  productGetList,
  productChoicesList,
  productDel,
  againExportProduct,
} from "@api/workManager";
import videoPreview from "@component/videoPreview";
import audioPreview from "@component/audioPreview";
import imagePreview from "@component/imagePreview";
import pdfPreview from "@component/pdfPreview";

// import submitDialog from "./submitDialog";
import _ from "lodash";
import { mapGetters, mapMutations } from "vuex";
import delPreview from "@component/delPreview";
import { download } from "@api/product";

export default {
  components: {
    submitDialog: () => import("./submitDialog.vue"),
    videoPreview,
    delPreview,
    audioPreview,
    imagePreview,
    pdfPreview,
  },
  computed: {
    ...mapGetters(["params2", "page2"]),
  },
  data() {
    return {
      pdfVisible: false,
      pdfsrc: "",
      submitDialogVisible: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        // 共几条
        recordCount: 0,
        // 共几页
        pageCount: 0,
      },
      listParams: {
        // wh_ratio: "",
        // resolution: "",
        order: "1",
      },
      loading: false,
      form: {
        title: "",
        status: "",
        wh_ratio: "",
        resolution: "",
      },
      rules: {
        title: [
          { required: false, message: "请输入作品名称关键字", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      // 状态
      selectData: [],
      status: "",
      value: "",
      searchValue: "",
      tableData: [],
      multipleSelection: [],
      filterResolution: [],
      filterWh_ratio: [],
      // 提交审核code
      code: "",
      title: "",
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
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  mounted() {
    if (this.params2) this.init();
    this._productChoicesList();
    this._productGetList();
  },
  beforeRouteLeave(to, from, next) {
    if (to.path.includes("workDetail")) {
      this["workManager/setP2"](this.copyParams);
    } else {
      this["workManager/resetP2"]();
    }
    next();
  },
  methods: {
    ...mapMutations([
      "workManager/setP2",
      "workManager/resetP2",
      "workManager/setPage2",
    ]),
    downloadFile(row) {
      this.$message({
        message: "开始下载",
        type: "success",
      });
      download(row.url, row);
    },
    init() {
      this.form = {
        title: this.params2.title,
        status: this.params2.status,
        wh_ratio: this.params2.wh_ratio,
        resolution: this.params2.resolution,
      };
      // this.listParams = {
      //   order: this.params2.order,
      // };
      this.page = this.page2;
    },
    clear() {
      this.$refs.form.resetFields();
      this._productGetList();
    },
    onpdfPre(url) {
      this.pdfsrc = url;
      this.pdfVisible = true;
    },
    // 筛选列表
    filterSelect(value, type) {
      switch (type) {
        case "wh_ratio":
          this.form.wh_ratio = value;
          break;
        case "resolution":
          this.form.resolution = value;
        case "status":
          this.form.status = value;
          break;
      }
      this.page.pageNo = 1;
      this.page.pageSize = 10;
      this._productGetList();
    },
    sortChange({ order, prop }) {
      console.log(arguments, "arguments");
      if (order == "ascending") {
        switch (prop) {
          case "duration":
            this.listParams.order = 22;
            break;
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
          case "duration":
            this.listParams.order = 21;
            break;
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
    async _productChoicesList() {
      const { status, element, msg } = await productChoicesList({ type: 1 });
      if (status == 1) {
        this.selectData = element.status;
        this.filterResolution = element.resolution;
        this.filterWh_ratio = element.wh_ratio;

        // console.log(this.selectData, "selectData");
        // console.log(this.filterResolution, "filterResolution");
        // console.log(this.filterWh_ratio, "filterWh_ratio");
      }
    },
    async _productGetList() {
      this.loading = true;
      const params = {
        ...this.form,
        ...this.listParams,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      };
      this.copyParams = params;
      // console.log(params, "params");
      let { status, datas, fsp, msg } = await productGetList(
        this.params2 ? this.params2 : params
      );
      this["workManager/resetP2"]();
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
        this["workManager/setPage2"](this.page);
      }
    },
    selectDelete() {
      console.log("multipleSelection", this.multipleSelection);
      if (this.multipleSelection.length > 0) {
        this.$confirm("请确认是否删除该成品?", "删除确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            let len = this.tableData.length;
            let { status, msg } = await productDel({
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
      console.log(val, "val");
      this.multipleSelection = val;
    },
    onReview({ code, title }) {
      this.code = code;
      this.submitDialogVisible = true;
      this.title = title;
    },
    async onGenerate(id) {
      let { status, msg } = await againExportProduct({
        id,
      });
      if (status == 1) {
        this.$message({
          type: "success",
          message: msg,
        });
        this._productGetList();
      }
    },
    onDelete(code) {
      this.$confirm("请确认是否删除该作品?", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let len = this.tableData.length;
          let { status, msg } = await productDel({
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
    onWatch(code) {
      this.$router.push({ path: `/workDetail/${code}/0` });
    },
    // onEdit(code) {
    //   this.$router.push({ path: `/workDetail/${code}/1` });
    // },
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page = { ...this.page, pageSize: val };
      this._productGetList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = { ...this.page, pageNo: val };
      this._productGetList();
    },
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
      .cell {
        line-height: 0;
        height: 48px;
      }
    }
  }
  .icon-ziyuan1662 {
    margin-left: calc(50% - 14px);
    line-height: 48px;
    font-size: 35px;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.el-image-viewer__wrapper .el-image-viewer__canvas .el-image-viewer__img {
  max-height: 80% !important;
  max-width: 80% !important;
}
</style>