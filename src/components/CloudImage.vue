<template>
  <img style="height:20vh" :src="url" alt="" />
</template>
<script>
import { storage } from '../firebase';
import { ref, getDownloadURL } from 'firebase/storage';

export default {
  props: {
    path: String,
  },
  data: () => {
    return {
      url: 'https://via.placeholder.com/140x100',
    };
  },
  mounted() {
    getDownloadURL(ref(storage,this.path)).then(
      (download_url) => (this.url = download_url)
    )
  }
};
</script>
