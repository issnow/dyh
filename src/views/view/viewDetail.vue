<template>
    <div class="main-wrap">

      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">成品信息</div>
          <ul>
            <li>名称： 名字叫做大运河宣传视频</li>
            <li>描述： 内容内容内容</li>
            <li>标签： 项目标签项目标签</li>
            <li>实体： 项目标签项目标签项目实体</li>
          </ul>
          <div>
            <!-- 视频播放 -->
            <video src=""></video>
          </div>

        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">审核建议</div>
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-width="60px"
            :inline="true">
            <el-row>
                <el-form-item label="标签" prop="status">
                  <el-select v-model="form.label" placeholder="请选择">
                    <el-option
                      v-for="item in selectData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="一级实体" prop="status">
                  <el-select v-model="form.status" placeholder="请选择">
                    <el-option
                      v-for="item in selectData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="二级实体" prop="status">
                  <el-select v-model="form.status" placeholder="请选择">
                    <el-option
                      v-for="item in selectData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input v-model="form.describe"></el-input>
                </el-form-item>
                <el-form-item label="建议">
                  <el-input v-model="form.proposal"></el-input>
                </el-form-item>
              <el-col :span="2">
                <el-form-item>
                  <el-button type="primary" @click="submitForm('form')">审核通过</el-button>
                  <el-button type="denger" @click="submitForm('form')">审核未通过</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
    </el-row>

    <el-dialog
      title="提示"
      :visible.sync="isExamine"
      width="30%"
      :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isExamine = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>

    </div>
</template>

<script>
  // import {
  //   getData
  // } from '@api/main'
  export default {
    name: 'viewDetail',
    data() {
      return {
        isExamine: false,
        form: {
          label: "",
          entity1: "",
          entity2: "",
          describe: "",
          proposal: ""
        },
        rules: {
          label: [
            { required: true, message: "请选择标签", trigger: "change" },
          ],
          entity1: [
            { required: true, message: "请选择一级实体", trigger: "change" },
          ],
          entity2: [
            { required: true, message: "请选择二级实体", trigger: "change" },
          ],
          describe: [
            { required: true, message: "请输入描述", trigger: "blur" },
          ],
          proposal: [
            { required: true, message: "请输入建议", trigger: "blur" },
          ]
        },
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
      }
    },
    created() {
    },
    mounted() {
    },
    components: {
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            console.log("error submit!!");
            return false;
          }
          // 请求接口
          console.log(this.form, "form");
        });
      },

      onConfirm(){
        this.isExamine = false;
      }
      
    },
  }
</script>

<style lang="scss" scoped>
  .main-wrap{
    padding: 30px;
  }
  .work-name{
    display: inline-block;
    width: 220px;
  }
</style>