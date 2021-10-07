<template>
  <h1>Register</h1>
  <p v-if="storeError" class="error">{{ storeError }}</p>
  <form>
    <div v-if="invalid">
      <p>Please correct the following error(s):</p>
      <ul>
        <li class="error" v-for="error in errorsTrimmed" :key="error">
          {{ error }}
        </li>
      </ul>
    </div>
    <div>
      <label for="username">Username</label
      ><input type="text" id="username" v-model="username" required />
    </div>
    <div>
      <label for="email">Email address</label
      ><input v-model="email" type="email" id="email" required />
    </div>
    <div>
      <label for="password">Password</label
      ><input type="password" v-model="password" id="password" />
    </div>
    <div>
      <label for="confirmPassword">Confirm password</label
      ><input type="password" v-model="confirmPassword" id="confirmPassword" />
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
  name: "Register",
  data() {
    return {
      requestError: store.state.error,
      errors: [""],
      email: "test1@gmail.com",
      username: "test1",
      password: "password",
      confirmPassword: "password",
      invalid: false,
      status: store.state.status,
    };
  },
  props: {},
  methods: {
    doSubmit(e: Event) {
      this.errors = [];
      e.preventDefault();

      if (this.password !== this.confirmPassword) {
        this.errors.push("Passwords do not match!");
        this.invalid = true;
      }
      if (this.password.length < 6) {
        this.errors.push("Password is too short (minimum characters are 6).");
        this.invalid = true;
      }

      if (this.invalid) {
        return;
      }
      this.invalid = false;
      store.dispatch("register", {
        email: this.email,
        password: this.password,
        username: this.username,
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

<style scoped>
.error {
  background-color: rgb(216, 86, 86);
  padding: 1em;
  color: white;
}
</style>