<template>
  <div class="view-list">
    <div class="main-wrap">
      <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="60px">
        <el-row>
          <el-col :span="18" style="height: 20px;"></el-col>
          <el-col :span="6">
            <el-form-item label="" prop="title">
              <el-input v-model="form.title" placeholder="请输入关键字进行搜索" @keydown.enter.native="searchProject"
                        :autofocus="true">
                <el-button slot="append" icon="el-icon-search" @click="searchProject"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="2" class="text-center">-->
          <!--            &lt;!&ndash; <el-button type="primary" @click="searchProject">查询</el-button> &ndash;&gt;-->
          <!--&lt;!&ndash;            <el-button type="primary" @click="resetSearch">重置</el-button>&ndash;&gt;-->
          <!--          </el-col>-->
        </el-row>
      </el-form>

      <el-table
          v-loading='loading'
          class="mb20"
          :data="tableData"
          border
          style="width: 100%"
          empty-text="无相关数据"
          :default-sort="{prop: 'time', order: 'descending'}"
      >
        <el-table-column prop="title" label="成品名称" min-width="200">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.title" placement="top" effect="light">
              <span class="table-column-text">{{ scope.row.title }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="media_type_title" width="100">
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
        <el-table-column prop="upload_type" label="来源" width="100">
          <template slot="header" scope="scope">
            <el-select
                class="select-color"
                v-model="form.upload_type"
                placeholder="来源"
                clearable
                @change="filterSelect($event, 'upload_type')"
            >
              <el-option
                  v-for="item in uploadTypeList"
                  :key="item.key"
                  :value="item.key"
                  :label="item.name"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="创作人" width="100">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.name" placement="top" effect="light">
              <span class="table-column-text">{{ scope.row.name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="resolution" label="分辨率" width="120" align="right">
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
        <el-table-column prop="wh_ratio" label="画幅" width="100" align="right">
          <template slot="header" scope="scope">
            <el-select
                class="select-color"
                v-model="form.wh_ratio"
                placeholder="画幅"
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
        <el-table-column prop="view" label="预览" width="100" class-name="td-center">
          <template slot-scope="scope">
            <del-preview v-if="scope.row.is_del === 1"></del-preview>
            <videoPreview
                v-else-if="scope.row.media_type == 1"
                :isVideo="true"
                :source="scope.row.trans_url || scope.row.url"
                :bgImage="scope.row.cover_url"
            />
            <audioPreview
                v-else-if="scope.row.media_type == 2"
                :source="scope.row.trans_url || scope.row.url"
            />
            <imagePreview
                v-else-if="scope.row.media_type == 3"
                :src="scope.row.url"
                :list="[scope.row.url]"
                :styleObj="{  height: '48px', width: '86px' }"
                fit="cover"
            />
            <i
                class="iconfont icon-ziyuan1662"
                v-else-if="scope.row.media_type == 4"
                @click="onpdfPre(scope.row.url)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column prop="video_size" label="大小" width="100" align="right" sortable></el-table-column>
        <el-table-column prop="duration" label="时长（S）" width="120" align="right" sortable></el-table-column>
        <el-table-column prop="status_title" label="状态" width="140">
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
          <template scope="scope" slot="">
            <el-tooltip v-if="scope.row.status === 7" :content="scope.row.audit_note" placement="top">
              <span>{{ scope.row.status_title }}</span>
            </el-tooltip>
            <span v-else>{{ scope.row.status_title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" align="right" sortable></el-table-column>
        <el-table-column fixed="right" label="操作" :width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="onWatch(scope.row)" v-if="scope.row.status === 6">审核</el-button>
            <el-button type="text" @click="onWatch(scope.row)" v-else>查看</el-button>
            <el-button type="text" @click="download(scope.row)" v-if="scope.row.is_del === 0">下载</el-button>
            <el-button :underline="false" type="text" v-if="scope.row.status === 7 && scope.row.is_del === 0"
                       @click="delTask(scope.row)" style="color: #ff7171;">删除文件
            </el-button>
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
import delPreview from '../../components/delPreview';
// import m3u8 from "@component/m3u8/index";

import {
  getChoicesList,
  getList,
  delTask,
} from "@api/project";
import {download} from '../../api/main';


export default {
  components: {
    videoPreview,
    audioPreview,
    imagePreview,
    pdfPreview,
    delPreview,
    // m3u8
  },
  data() {
    return {
      loading: false,
      form: {
        title: '',
        status: 6,
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
      uploadTypeList: [], // 来源列表


      page: {
        pageNo: 1,
        pageSize: 10,
        recordCount: 0,
        pageCount: 0,
      },
      tableData: [],
      test: '',
    };
  },
  watch: {
    $route(val, oldValue) {
      // 为了从详情也回来能带上之前选择的条件
      sessionStorage.setItem('oldPage', oldValue.path);
    },
  },
  created() {
    // 为了从详情也回来能带上之前选择的条件
    if (sessionStorage.getItem('oldPage') &&
        sessionStorage.getItem('oldPage') === '/viewDetail' &&
        sessionStorage.getItem('viewList')
    ) {
      const para = JSON.parse(sessionStorage.getItem('viewList'));
      this.form = Object.assign(this.form, {
        title: para.title,
        status: para.status,
        wh_ratio: para.wh_ratio,
        resolution: para.resolution,
        media_type: para.media_type,
      });
      this.page = Object.assign(this.page, {
        pageNo: para.pageNo,
        pageSize: para.PageSize,
      });
    }
  },
  mounted() {
    console.log(this);
    console.log('mounted');
    console.log('mounted-form', this.form);
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
          this.uploadTypeList = res.element.upload_type;
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
        case 'upload_type':
          this.form.upload_type = value;
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
        upload_type: this.form.upload_type,
      };

      sessionStorage.setItem('viewList', JSON.stringify(params));


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

    // 物理删除作品/成品
    async delTask(row) {
      const confirm = await this.$confirm('请确认是否删除本任务物理文件？?', '删除文件').catch(() => {
      });
      if (!confirm) {
        return;
      }

      const result = await delTask({code: row.product_code});
      if (result.status !== 1) {
        this.$message({
          type: "error",
          message: result.msg,
        });
        return;
      }
      this.$message({
        type: 'success',
        message: '文件删除成功',
      });

      this.getList();

    },

    // 下载文件
    download(row) {
      download(row.url, row.title);
      // window.open(row.url);
    },
  },
};
</script>

<style lang="scss" scoped>
.view-list {
  width: 100%;
  position: relative;

  .main-wrap {
    padding: 30px;

    ::v-deep .el-table {
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
}


.work-name {
  display: inline-block;
  width: 220px;
}
</style>
