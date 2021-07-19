<template>
  <div>
    <div class="main-wrap">
      <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="60px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="搜索" prop="title">
              <el-input v-model="form.title" placeholder="请输入关键字">
                <el-button slot="append" icon="el-icon-search" @click="searchProject"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="text-center">
            <!-- <el-button type="primary" @click="searchProject">查询</el-button> -->
            <el-button type="primary" @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table
          v-loading='loading'
          class="mb20"
          :data="tableData"
          border
          style="width: 100%"
          :default-sort="{prop: 'time', order: 'descending'}"
      >
        <el-table-column prop="title" label="成品名称"></el-table-column>
        <el-table-column prop="media_type_title">
          <template slot="header" scope="scope">
            <el-select
                class="select-color"
                v-model="form.media_type"
                placeholder="类型"
                clearable
                @change="filterSelect($event, 'media_type')"
            >
              <el-option
                  v-for="item in mediaTypeList"
                  :key="item.key"
                  :value="item.key"
                  :label="item.name"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="upload_type" label="来源"></el-table-column>
        <el-table-column prop="name" label="创作人" width="200"></el-table-column>
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
                  v-for="item in sizeList"
                  :key="item.key"
                  :value="item.key"
                  :label="item.name"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="wh_ratio" label="画幅" width="140">
          <template slot="header" scope="scope">
            <el-select
                class="select-color"
                v-model="form.wh_ratio"
                placeholder="画幅比例"
                clearable
                @change="filterSelect($event, 'wh_ratio')"
            >
              <el-option
                  v-for="item in scaleList"
                  :key="item.key"
                  :value="item.key"
                  :label="item.name"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="view" label="预览" width="120"></el-table-column> -->
        <el-table-column prop="video_size" label="大小（M）" width="120" sortable></el-table-column>
        <el-table-column prop="duration" label="时长（S）" width="120" sortable></el-table-column>
        <el-table-column prop="status_title" label="状态" width="150">
          <template slot="header" scope="scope">
            <el-select
                class="select-color"
                v-model="form.status"
                placeholder="状态"
                clearable
                @change="filterSelect($event, 'status')"
            >
              <el-option
                  v-for="item in statusList"
                  :key="item.key"
                  :value="item.key"
                  :label="item.name"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="合成时间" width="200" sortable></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="onWatch(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          background
          :hide-on-single-page='true'
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :current-page="page.pageNo"
          :page-size="page.pageSize"
          layout="total, slot, prev, pager, next, sizes, jumper"
          :total="page.recordCount">
        <span>第{{ page.pageNo }}/{{ page.pageCount }}页</span>
      </el-pagination>
    </div>
  </div>
</template>

<script>

import videoPreview from "@component/videoPreview";
import audioPreview from "@component/audioPreview";
import imagePreview from "@component/imagePreview";
import pdfPreview from "@component/pdfPreview";

import {
  getChoicesList,
  getList,
} from "@api/project";
import submitDialog from '../work/submitDialog';
import uploadProduct from '../product/uploadProduct';

export default {
  components: {
    videoPreview,
    audioPreview,
    imagePreview,
    pdfPreview,
  },
  data() {
    return {
      loading: false,
      form: {
        title: '',
        status: '',
        wh_ratio: '',
        resolution: '',
        media_type: '',
      },
      rules: {
        title: [
          {required: false, message: "请输入成品品名称关键字", trigger: "blur"},
        ],
      },
      // 111
      scaleList: [], //画幅比例列表
      sizeList: [],  //分辨率列表
      statusList: [],  //状态列表
      mediaTypeList: [], // 类型列表


      page: {
        pageNo: 1,
        pageSize: 10,
        recordCount: 0,
        pageCount: 0,
      },
      tableData: [],
    };
  },
  created() {
  },
  mounted() {
    this.getChoicesList();
    this.getList();
  },
  methods: {
    // 获取画幅，分辨率，状态列表
    getChoicesList() {
      getChoicesList({type: 5}).then(res => {
        if (res.status == 1) {
          this.scaleList = res.element.wh_ratio;
          this.sizeList = res.element.resolution;
          this.statusList = res.element.status;
          this.mediaTypeList = res.element.media_type;
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

    // 搜索列表
    searchProject() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.getList();
      });
    },

    // 清空搜索条件
    resetSearch() {
      this.$refs.form.resetFields();
      this.getList();
    },

    onWatch(data) {
      this.$router.push({
        path: '/viewDetail',
        query: {code: data.product_code},
      });
    },

    // 筛选列表
    filterSelect(value, type) {
      console.log(value, type, '1111');
      switch (type) {
        case "wh_ratio":
          this.form.wh_ratio = value;
          break;
        case "resolution":
          this.form.resolution = value;
          break;
        case "status":
          this.form.status = value;
          break;
        case "media_type":
          this.form.media_type = value;
          break;

      }
      this.page.pageNo = 1;
      this.page.pageSize = 10;

      this.getList();
    },

    // 获取审核列表
    getList() {
      this.loading = true;
      const params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        title: this.form.title,
        wh_ratio: this.form.wh_ratio,
        resolution: this.form.resolution,
        status: this.form.status,
        media_type: this.form.media_type,
      };

      getList(params).then(res => {
        if (res.status == 1) {
          this.loading = false;
          const {
            pageNo,
            pageSize,
            recordCount,
            pageCount,
          } = res.fsp;
          this.page = {
            pageNo,
            pageSize,
            recordCount,
            pageCount,
          };
          this.tableData = res.datas;
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
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.pageNo = val;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrap {
  padding: 30px;
}

.work-name {
  display: inline-block;
  width: 220px;
}
</style>
