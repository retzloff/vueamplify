<template>
  <div id="app">
    <amplify-authenticator>
      <h1>Vue ➕ Amplify</h1>
      <section class="actions">
        <button class="actions__button" @click="logAuth">Log</button>
        <button class="actions__button" @click="doGet()">Test GET</button>
        <button class="actions__button" @click="doGet(true)">
          Test GET + query
        </button>
        <button class="actions__button" @click="doPost()">Test POST</button>
        <button class="actions__button" @click="doPost(true)">
          Test POST + body
        </button>
      </section>

      <amplify-sign-out></amplify-sign-out>
    </amplify-authenticator>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars, no-debugger */
import { API, Auth } from "aws-amplify";

const apiName = "vueAmpAPI";
const path = "/greet";
const options = {
  headers: {
    Authorization: null,
    "Content-Type": "application/json",
  },
};

export default {
  name: "App",
  components: {},
  data() {
    return {
      postWithBody: false,
    };
  },

  methods: {
    async logAuth() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const session = await Auth.currentSession();

        console.group("logAuth");
        console.log("User: ", user);
        console.log("Session: ", session);
        console.groupEnd();
      } catch (error) {
        console.error(error);
      }
    },

    async doGet(withQuery = false) {
      const getOptions = { ...options };

      const getPath = withQuery ? `${path}?name=J_Bezos` : path;

      try {
        const session = await Auth.currentSession();
        getOptions.headers.Authorization = session.getIdToken().getJwtToken();

        const data = await API.get(apiName, getPath, getOptions);
        console.group("doGet");
        console.log(data);
        console.groupEnd();
      } catch (error) {
        console.error(error);
      }
    },

    async doPost(withBody = false) {
      const postOptions = { ...options };

      if (withBody) {
        postOptions.body = { name: "Jeffrey B" };
      }

      const session = await Auth.currentSession();
      postOptions.headers.Authorization = session.getIdToken().getJwtToken();

      const data = await API.post(apiName, path, postOptions);
      console.group("doPost");
      console.log(data);
      console.groupEnd();
    },
  },
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
  background: #ff9900;
  border: none;
  cursor: pointer;
}

.actions__button:hover {
  opacity: 0.8;
}

.actions__button[disabled] {
  color: hsla(0, 0%, 100%, 0.8);
  cursor: not-allowed;
}
</style>
