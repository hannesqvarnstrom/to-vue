<template>
  <div class="home">
    <div v-if="currentUser !== null">
      Logged in!
      {{ currentUser }}
      <button @click="getOwnData">Test it out!</button>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  components: {},
  computed: {
    currentUser() {
      return store.state.currentUser;
    },
  },
  methods: {
    getOwnData(e: Event) {
      store.dispatch("getOwnData");
    },
    logout() {
      store.dispatch("logout");
    },
  },
});
</script>
