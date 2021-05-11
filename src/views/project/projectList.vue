<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">作品管理</el-breadcrumb-item>
      <el-breadcrumb-item>成品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-row class="mt20 mb20">
        <el-col :span="6">
          搜索：<el-input placeholder="请输入作品名称关键字" v-model="searchValue" class="work-name"></el-input>
        </el-col>
        <el-col :span="6">
        状态：
        <el-select v-model="status" placeholder="请选择">
          <el-option
            v-for="item in selectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary">查询</el-button>
        </el-col>
      </el-row>

      <el-table
        class="mb20"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="date"
          label="作品名称">
        </el-table-column>
        <el-table-column
          prop="name"
          label="创作人"
          width="200">
        </el-table-column>
        <el-table-column
          prop="province"
          label="状态"
          width="100">
        </el-table-column>
        <el-table-column
          prop="city"
          label="联系人"
          width="100">
        </el-table-column>
        <el-table-column
          prop="address"
          label="状态"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="创作时间"
          width="200">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text">提交审核</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
            <el-button type="text">下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="50">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  // import {
  //   getData
  // } from '@api/main'
  export default {
    data() {
      return {
        selectData: [{
          value: '1',
          label: '合成中'
        }, {
          value: '2',
          label: '合成失败'
        }, {
          value: '3',
          label: '待审核'
        }, {
          value: '4',
          label: '审核中'
        }, {
          value: '5',
          label: '审核失败'
        }, {
          value: '6',
          label: '待发布'
        }, {
          value: '7',
          label: '已发布'
        }],
        status: '',
        value: '',
        searchValue: '',
        currentPage: 5,
        tableData: [{
          date: 'Name1Name1Name1',
          name: 'abc@moviebook.cn',
          province: '上海',
          city: '普陀区',
          address: '审核',
          zip: 200333
        }, {
          date: 'Name1Name1Name1Name1Name1',
          name: 'abc@moviebook.cn',
          province: '上海',
          city: '普陀区',
          address: '审核',
          zip: 200333
        }, {
          date: 'Name1Name1',
          name: 'abc@moviebook.cn',
          province: '上海',
          city: '普陀区',
          address: '审核',
          zip: 200333
        }, {
          date: 'Name1Name1Name1Name1Name1',
          name: 'abc@moviebook.cn',
          province: '上海',
          city: '普陀区',
          address: '审核未通过',
          zip: 200333
        }, {
          date: 'Name1Name1',
          name: 'abc@moviebook.cn',
          province: '上海',
          city: '普陀区',
          address: '审核未通过',
          zip: 200333
        }]
      }
    },
    created() {
    },
    mounted() {
    },
    components: {
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
  }
</script>

<style lang="scss" scoped>
  .work-name{
    display: inline-block;
    width: 220px;
  }
</style>