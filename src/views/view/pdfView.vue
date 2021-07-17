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
      console.log('src', this.src);
      // console.log('pdf', this.pdf);

    },
    linkNumber(number){
      console.log('number', number);
      const index = number - 1;
      const pdfs = this.$refs['pdf'];
      const pdf = pdfs[index]

      // pdf[number - 1].scrollIntoView();
      console.log('pdf', pdf);

    }
  },


};
</script>

<style scoped lang="scss">
.pdf-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #E6E6E6;


  .pdf{
    margin: 10px;
  }

  .content {
    flex: 1;
    //height: 300px;
    //width: 400px;
    overflow: auto;
    background: #E6E6E6;
  }

  .pager {
    height: 50px;
  }
}
</style>
