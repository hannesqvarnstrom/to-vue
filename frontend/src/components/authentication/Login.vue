<template>
  <h1>Login</h1>
  <p v-if="storeError" class="error">{{ storeError }}</p>
  <form @submit="doSubmit">
    <div v-if="invalid">
      <p>Please correct the following error(s):</p>
      <ul>
        <li class="error" v-for="error in errorsTrimmed" :key="error">
          {{ error }}
        </li>
      </ul>
    </div>

    <div>
      <label for="email">Email address</label
      ><input v-model="email" type="email" id="email" required />
    </div>
    <div>
      <label for="password">Password</label
      ><input type="password" v-model="password" id="password" />
    </div>
    <button type="submit" @click="doSubmit">Submit</button>
  </form>
  <p v-if="invalid">
    Something is invalid in the form! Check for error messages above
  </p>
</template>

<script lang="ts">
import store from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login",
  data() {
    return {
      errors: [""],
      invalid: false,
      email: "",
      password: "",
    };
  },
  props: {},
  methods: {
    doSubmit(e: Event) {
      this.errors = [];
      e.preventDefault();

      if (this.password.length < 6) {
        this.errors.push("Password is too short!");
        this.invalid = true;
      }

      if (this.invalid) {
        return;
      }

      this.invalid = false;
      store.dispatch("login", {
        email: this.email,
        password: this.password,
      });
    },
  },
  computed: {
    storeError(): string | null {
      return store.state.error;
    },
    errorsTrimmed(): string[] {
      return this.errors.filter((i) => i.trim());
    },
  },
});
</script>