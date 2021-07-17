<template>
  <div class="pdf-view">
    <div class="content">
      <pdf
          class="pdf"
          v-for="i in numPages"
          :key="i"
          :page="i"
          :src="src"
          ref="pdf"
          @link-clicked="linkNumber"
      ></pdf>
    </div>
    <el-button icon="el-icon-download" class="download" @click="download"></el-button>
  </div>
</template>

<script>
import pdf from 'vue-pdf';


export default {
  name: "pdfView",
  components: {
    pdf,
  },
  props: {
    url: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      src: null,
      numPages: 0,
    };
  },
  mounted() {
  },
  watch: {
    url(val) {
      console.log('url', val);
      this.loadPdf(val);
    },
  },
  methods: {
    loadPdf(url) {
      this.src = pdf.createLoadingTask(url);
      this.src.promise.then(pdf => {
        this.numPages = pdf.numPages;
      });
    },
    linkNumber(number) {
      console.log('number', number);
      const index = number - 1;
      const pdfs = this.$refs['pdf'];
      const pdf = pdfs[index];
      pdf.$el.scrollIntoView({
        behavior: "smooth",
      });
    },
    download() {
      window.open(this.url + '?response-content-type=application/octet-stream');
    },
  },


};
</script>

<style scoped lang="scss">
.pdf-view {
  width: 100%;
  height: 100%;
  background: #E6E6E6;
  position: relative;

  .download {
    position: absolute;
    top: 30px;
    right: 30px;
  }

  .content {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: #E6E6E6;
  }

  .pdf {
    margin: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)

  }


}
</style>
