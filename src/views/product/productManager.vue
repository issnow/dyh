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
              icon="el-icon-delete"
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
      <el-table-column prop="type" label="类型" width="120"></el-table-column>
      <el-table-column label="预览" width="160">
        <template slot-scope="scope">
          <videoPreview
            v-if="scope.row.type == 1"
            :isVideo="true"
            :source="getImg('product/demo2.mp4')"
            :bgImage="getImg('product/7.jpg')"
          />
          <videoPreview
            v-if="scope.row.type == 2"
            :isAudio="true"
            source="http://mp.333ttt.com/mp3music/28458239.mp3"
          />
          <imagePreview
            v-if="scope.row.type == 3"
            :src="getImg('product/girl01.jpeg')"
            :list="[getImg('product/girl01.jpeg')]"
          />
          <pdfPreview v-if="scope.row.type == 4" />
        </template>
      </el-table-column>
      <el-table-column
        prop="video_size"
        label="大小（M）"
        width="120"
        sortable="custom"
      ></el-table-column>
      <el-table-column label="状态" prop="status" width="130"></el-table-column>

      <!-- <el-table-column label="状态" prop="status_title" width="130">
        <template slot="header" scope="scope">
          <el-select
            class="select-color"
            v-model="form.status"
            placeholder="请选择"
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
            v-if="scope.row.status == 6"
            class="item"
            effect="dark"
            :content="scope.row.audit_note"
            placement="top"
          >
            <span>{{ scope.row.status_title }}</span>
          </el-tooltip>
          <span v-else>{{ scope.row.status_title }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="created_at"
        label="创作时间"
        width="200"
        sortable="custom"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <!-- scope.row.status -->
          <el-button
            type="text"
            class="del-red"
            @click="onDelete(scope.row.code)"
            >删除</el-button
          >
          <!-- v-if="[2].includes(scope.row.status)" -->
          <el-button type="text" @click="onTranscoding(scope.row.id)"
            >重新转码</el-button
          >
          <el-button type="text" @click="onReview(scope.row)"
            >提交审核</el-button
          >
          <el-button type="text" @click="onWatch(scope.row.id)">查看</el-button>
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
import { getList, del, applyAudit } from "@api/product";
export default {
  components: {
    videoPreview,
    submitDialog,
    uploadProduct,
    audioPreview,
    imagePreview,
    pdfPreview,
  },
  data() {
    return {
      loading: false,
      form: {
        title: "",
        status: "",
        type: "",
      },
      listParams: {
        order: "1",
      },
      rules: {
        title: [
          { required: true, message: "请输入作品名称关键字", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      multipleSelection: [],
      tableData: [
        {
          code: 1,
          title: "1",
          // 1视频,2音频,3图片,4pdf
          type: 1,
          url: "",
          cover_url: "",
          video_size: 100,
          status: 1,
          create_at: 2021,
        },
        {
          code: 1,
          title: "1",
          // 1视频,2音频,3图片,4pdf
          type: 2,
          url: "",
          cover_url: "",
          video_size: 100,
          status: 1,
          create_at: 2021,
        },
        {
          code: 1,
          title: "1",
          // 1视频,2音频,3图片,4pdf
          type: 3,
          url: "",
          cover_url: "",
          video_size: 100,
          status: 1,
          create_at: 2021,
        },
      ],
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
    };
  },
  methods: {
    getImg(src) {
      if (src) {
        return require("@/assets/" + src);
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
      console.log(params, "params");
      let { status, datas, fsp, msg } = await getList(params);
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
        console.log(this.form, "form");
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
            // let len = this.tableData.length;
            // let { status, msg } = await productDel({
            //   code: this.multipleSelection.map((e) => e.code),
            // });
            // if (status == 1) {
            //   if (len == 1 && this.page.pageNo > 1) {
            //     this.page.pageNo--;
            //   }
            //   this.$message({
            //     type: "success",
            //     message: msg,
            //   });
            //   this._productGetList();
            // }
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
    sortChange() {},
    onDelete(code) {
      this.$confirm("请确认是否删除该成品?", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // let len = this.tableData.length;
          // let { status, msg } = await productDel({
          //   code: [code],
          // });
          // if (status == 1) {
          //   if (len == 1 && this.page.pageNo > 1) {
          //     this.page.pageNo--;
          //   }
          //   this.$message({
          //     type: "success",
          //     message: msg,
          //   });
          //   this._productGetList();
          // }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    onTranscoding() {},
    onReview({ code, title }) {
      this.code = code;
      this.submitDialogVisible = true;
      this.title = title;
    },
    onWatch() {},
    handleSizeChange(val) {
      this.page = { ...this.page, pageSize: val };
      this._productGetList();
    },
    handleCurrentChange(val) {
      this.page = { ...this.page, pageNo: val };
      this._productGetList();
    },
    uploadProduct() {},
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
</style>