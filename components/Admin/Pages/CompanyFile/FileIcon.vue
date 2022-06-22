<template>
  <div class="file-icon">
    <img v-if="matchingIcon" :src="matchingIcon.source" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type matchingIcon = {
  type: String;
  source: String;
};

export default Vue.extend({
  props: {
    fileType: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      imageFiles: [
        {
          type: 'directory',
          source: '/icon/icon_folder_dark.svg',
        },
        {
          type: 'pdf',
          source: '/icon/icon_pdf.svg',
        },
        {
          type: 'xls',
          source: '/icon/icon_xls.svg',
        },
        {
          type: 'xlsx',
          source: '/icon/icon_xls.svg',
        },
        {
          type: 'zip',
          source: '/icon/icon_zip.svg',
        },
        {
          type: 'doc',
          source: '/icon/icon_doc.svg',
        },
        {
          type: 'docx',
          source: '/icon/icon_doc.svg',
        },
        {
          type: 'ppt',
          source: '/icon/icon_ppt.svg',
        },
        {
          type: 'pptx',
          source: '/icon/icon_ppt.svg',
        },
        {
          type: 'txt',
          source: '/icon/icon_txt.svg',
        },
        {
          type: 'jpg',
          source: '/icon/icon_image_file.svg',
        },
        {
          type: 'png',
          source: '/icon/icon_image_file.svg',
        },
        {
          type: 'gif',
          source: '/icon/icon_image_file.svg',
        },
        {
          type: 'jpeg',
          source: '/icon/icon_image_file.svg',
        },
        {
          type: 'heic',
          source: '/icon/icon_image_file.svg',
        },
        {
          type: '',
          source: '/icon/icon_other_file.svg',
        },
      ],
    };
  },
  computed: {
    matchingIcon(): matchingIcon {
      const matchingIcon = this.imageFiles.find(
        (e: matchingIcon) => e.type === this.fileType
      );
      // タイプがヒットしなかったら、「その他」の値を返す
      return matchingIcon || this.imageFiles[this.imageFiles.length - 1];
    },
  },
});
</script>

<style lang="scss" scoped>
.file-icon {
  margin: 0 10px 0 0;
}

.file-icon > img {
  width: 24px;
  height: 18px;
}
</style>
