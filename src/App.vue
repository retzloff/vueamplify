<template>
  <div id="app">
    <amplify-authenticator>
      <h1>Vue ➕ Amplify</h1>
      <section class="actions">
        <button class="actions__button" @click="logAuth">Log</button>
        <button class="actions__button" disabled>Test GET</button>
        <button class="actions__button" disabled>Test POST</button>
        <button class="actions__button" disabled>Test GET + query</button>
        <button class="actions__button" disabled>Test Step Function</button>
      </section>
      <amplify-sign-out></amplify-sign-out>
    </amplify-authenticator>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { Auth } from "aws-amplify";

export default {
  name: "App",
  components: {},
  data() {
    return {};
  },

  methods: {
    async logAuth() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const session = await Auth.currentSession();

        console.dir("User", user);
        console.dir("Session", session);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin: 12px 0;
}

.actions__button {
  padding: 8px;
  border-radius: 2px;
  color: #253746;
  font-size: 14px;
  font-weight: 300;
  background: #ff9900;
  border: none;
  cursor: pointer;
}

.actions__button:hover {
  opacity: 0.8;
}

.actions__button[disabled] {
  color: hsla(0, 0%, 100%, 0.8);
}
</style>
