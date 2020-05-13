<template>
  <div id="app">
    <amplify-authenticator>
      <amplify-sign-up
        slot="sign-up"
        :form-fields.prop="formFields"
      ></amplify-sign-up>
      <header>
        <div>
          <amplify-sign-out></amplify-sign-out>
        </div>
        <h1>Vue ➕ Amplify</h1>
      </header>
      <section class="actions">
        <b-button @click="logAuth">Log</b-button>
        <b-button @click="doGet()">Test GET</b-button>
        <b-button @click="doGet(true)">
          Test GET + query
        </b-button>
        <b-button @click="doPost()">Test POST</b-button>
        <b-button @click="doPost(true)">
          Test POST + body
        </b-button>
      </section>
      <section v-if="results" class="viewer">
        <vue-json-pretty
          :showLength="true"
          :highlightMouseoverNode="true"
          :data="results"
        >
        </vue-json-pretty>
      </section>
    </amplify-authenticator>
  </div>
</template>

<script>
import { API, Auth } from "aws-amplify";
import VueJsonPretty from "vue-json-pretty";

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

  components: {
    VueJsonPretty,
  },

  data() {
    return {
      postWithBody: false,
      results: null,

      formFields: [
        {
          type: "username",
          placeholder: "Username",
          required: true,
        },
        {
          type: "password",
          placeholder: "Password",
          required: true,
        },
        {
          type: "email",
          placeholder: "Email Address",
          required: true,
        },
      ],
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
        this.results = { user, session };
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
        this.results = data;
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
      this.results = data;
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
  margin: 22px 12px 0 12px;
}

header > div {
  position: absolute;
  top: 22px;
  right: 12px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin: 12px 0;
}

.viewer {
  width: 90%;
  margin: 22px auto;
  padding: 22px;
  text-align: left;
  border: solid 2px rgb(90, 98, 104);
  border-radius: 5px;
  background-color: rgba(112, 128, 144, 0.144);
  font-weight: 800;
}
</style>
