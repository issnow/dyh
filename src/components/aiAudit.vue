<template>
  <div class="ai-audit">
    <div class="ai-audit-title">{{ title }}: {{ auditNote }}</div>
    <div class="ai-audit-content">
      <el-tooltip placement="top" v-for="item of audit" :key="item.frame_begin">
        <div slot="content">
          <div class="ai-audit-tip" style="display: flex">
            <div class="ai-audit-tip-title" style="width: 30px; text-align: right; margin-right: 5px;">时间:</div>
            <div class="ai-audit-tip-content">{{ item.frame_begin }} ~ {{ item.frame_end }}</div>
          </div>
          <div class="ai-audit-tip" style="display: flex" :key="suspect.category_name"
               v-for="suspect of item.suspects">
            <div class="ai-audit-tip-title"
                 style="width: 30px; text-align: right; margin-right: 5px;"
            >
              {{ suspect.category_name }}:
            </div>
            <div class="ai-audit-tip-content">{{ suspect.suspect_content }}</div>
          </div>
        </div>
        <div class="ai-audit-value"
             :key="item.frame_begin"
             :style="{width: (500 / duration) + '%', left: (item.frame_begin * 100 / duration) + '%', background: `#${item.suspects[0].color}`}"
        >
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "viewDetailVideoInfo",
  props: ['title', 'audit', 'duration', 'auditNote'],
};
</script>

<style scoped lang="scss">
@import "@css/var.scss";

.ai-audit {
  font-size: 14px;

  .ai-audit-title {

  }

  .ai-audit-content {
    width: 100%;
    height: 6px;
    background: #ebeef5;
    margin-top: 10px;
    border-radius: 4px;
    position: relative;

    .ai-audit-value {
      position: absolute;
      top: 0;
      left: 0;
      width: 10%;
      height: 6px;
      //background: $supRed;
      cursor: pointer;

      &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        //border-radius: 4px 0 0 4px;
      }

      &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        //border-radius: 0px 4px 4px 0;
      }
    }
  }

}
</style>
