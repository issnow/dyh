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
      <el-table-column prop="title" label="作品名称"></el-table-column>
      <el-table-column
        prop="media_type_title"
        label="类型"
        width="120"
      ></el-table-column>
      <el-table-column prop="resolution" label="分辨率" width="120">
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
      <el-table-column prop="wh_ratio" label="画幅" width="130">
        <template slot="header" slot-scope="scope">
          <el-select
            class="select-color"
            v-model="form.wh_ratio"
            placeholder="画幅比例"
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
      <el-table-column label="预览" width="160">
        <template slot-scope="scope">
          <videoPreview
            :isVideo="true"
            :source="scope.row.url"
            :bgImage="scope.row.cover_url"
            controlslist=""
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="video_size"
        label="大小（M）"
        width="120"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        prop="duration"
        label="时长（S）"
        width="120"
        sortable="custom"
      ></el-table-column>
      <el-table-column label="状态" prop="status_title" width="130">
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
        prop="created_at"
        label="创建时间"
        width="200"
        sortable="custom"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
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
// import submitDialog from "./submitDialog";
import _ from "lodash";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    submitDialog: () => import("./submitDialog.vue"),
    videoPreview,
  },
  computed: {
    ...mapGetters(["params2", "page2"]),
  },
  data() {
    return {
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
  }
}
.work-name {
  display: inline-block;
  width: 220px;
}
</style>