<template>
  <video
    :src="src"
    controls
    preload
  >

  </video>
</template>

<script>
export default {
  props: ['src']
}
</script>

<style lang="scss" scoped>
video {
  width: 100%;
  height: 100%;
}
</style>