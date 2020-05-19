<template>
  <div id="app">
    <amplify-authenticator>
      <amplify-sign-up slot="sign-up" :form-fields.prop="formFields"></amplify-sign-up>
      <header>
        <div>
          <amplify-sign-out></amplify-sign-out>
        </div>
        <h1>Vue ➕ Amplify</h1>
      </header>
      <div class="main">
        <div class="main__actions">
          <b-button block class="text-left" @click="logAuth">Log</b-button>
          <b-button block class="text-left" @click="doGet()">Test GET</b-button>
          <b-button block class="text-left" @click="doGet(true)">Test GET + query</b-button>
          <b-button block class="text-left" @click="doPost()">Test POST</b-button>
          <b-button block class="text-left" @click="doPost(true)">Test POST + body</b-button>
          <div class="upload_area">
            <b-button block class="text-left" @click="listFiles">Uploads</b-button>
            <div class="upload_area__file">
              <input type="file" @change="selectFile" />
              <b-button variant="light" :disabled="!selectedFile" @click="upload">Upload</b-button>
            </div>
          </div>
        </div>
        <div class="main__viewer" v-if="viewerMode != viewerModes.hide">
          <vue-json-pretty
            v-if="viewerMode === viewerModes.json"
            :showLength="true"
            :deep="2"
            :highlightMouseoverNode="true"
            :data="results"
          ></vue-json-pretty>
          <div v-if="viewerMode === viewerModes.files">
            <h1>Files</h1>
            <ul class="imagelist">
              <li class="imagelist__item" v-for="file in fileInfos" :key="file.eTag">
                <a href="#" @click="getFile(file.key)">{{ file.key }}</a>
              </li>
            </ul>
          </div>
          <div class="main__viewer--image" v-if="viewerMode === viewerModes.image">
            <img :src="imageUrl" />
          </div>
        </div>
      </div>
    </amplify-authenticator>
  </div>
</template>

<script>
/* eslint-disable */
import { API, Auth, Storage } from "aws-amplify";
import VueJsonPretty from "vue-json-pretty";

const apiName = "vueAmpAPI";
const path = "/greet";
const options = {
  headers: {
    Authorization: null,
    "Content-Type": "application/json"
  }
};

export default {
  name: "App",

  components: {
    VueJsonPretty
  },

  data() {
    return {
      postWithBody: false,

      results: null,
      viewerMode: 0,
      viewerModes: {
        hide: 0,
        json: 1,
        files: 2,
        image: 3
      },

      imageUrl: null,

      selectedFile: null,
      currentFile: null,
      progress: 0,
      message: 0,
      fileInfos: [],

      formFields: [
        {
          type: "username",
          placeholder: "Username",
          required: true
        },
        {
          type: "password",
          placeholder: "Password",
          required: true
        },
        {
          type: "email",
          placeholder: "Email Address",
          required: true
        }
      ]
    };
  },

  methods: {
    async logAuth() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const session = await Auth.currentSession();

        this.results = { user, session };
        this.viewerMode = this.viewerModes.json;

        console.groupEnd();
      } catch (error) {
        console.error(error);
      }
    },

    async doGet(withQuery = false) {
      const getOptions = { ...options };

      const getPath = withQuery ? `${path}?name=J_Bezos` : path;

      try {
        // const session = await Auth.currentSession();
        // getOptions.headers.Authorization = session.getIdToken().getJwtToken();

        const data = await API.get(apiName, getPath, getOptions);
        this.results = data;
        this.viewerMode = this.viewerModes.json;
      } catch (err) {
        console.error(err);
      }
    },

    async doPost(withBody = false) {
      const postOptions = { ...options };

      if (withBody) {
        postOptions.body = { name: "Jeffrey B" };
      }

      // const session = await Auth.currentSession();
      // postOptions.headers.Authorization = session.getIdToken().getJwtToken();

      const data = await API.post(apiName, path, postOptions);
      this.results = data;
      this.viewerMode = this.viewerModes.json;
    },

    selectFile(e) {
      this.selectedFile = e.target.files[0];
      console.log(this.selectedFile);
    },

    async getFile(key) {
      /**
       * Get a presigned URL of the file or the object data when download:true
       *
       * @param {string} key - key of the object
       * @param {Object} [config] - { level : private|protected|public, download: true|false }
       * @return - A promise resolves to either a presigned url or the object
       */
      // const [result] = await Promise.all([await Storage.get(fileInfo.key, { level: "public" })]);

      const link = await Storage.get(key);
      this.imageUrl = link;
      this.viewerMode = this.viewerModes.image;
    },

    async listFiles() {
      this.fileInfos = await Storage.list("images/");
      this.viewerMode = this.viewerModes.files;
    },

    async upload() {
      const { name: key, type: contentType } = this.selectedFile;
      console.log(typeof this.selectedFile, this.selectedFile);

      this.results = "Uploading...";
      try {
        await Storage.put(`images/${key}`, this.selectedFile, { contentType });
        this.selectedFile = null;
        this.listFiles();
      } catch (err) {
        console.error(err);
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
  margin: 22px 12px 0 12px;
}

header > div {
  position: absolute;
  top: 22px;
  right: 12px;
}

.main {
  height: 82vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 300px auto;
  grid-gap: 12px;
  margin-top: 12px;
}

.main__viewer {
  border: solid 2px rgb(90, 98, 104);
  border-radius: 5px;
  overflow-x: auto;
  background: hsl(0, 0%, 95%);
}

.main__viewer > div {
  padding: 12px 24px;
  text-align: left;
  font-weight: 800;
  filter: brightness(70%);
}

.upload_area {
  margin-top: 8px;
  background-color: #606a71;
  border-radius: 6px;
}

.upload_area__file {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 12px;
  background: sandybrown;
  color: #eee;
}

.imagelist {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-start;
  list-style: none;
  flex-wrap: wrap;
  gap: 12px;
}

.imagelist__item {
  padding: 6px;
  border: dashed 0.5px slategray;
  border-radius: 6px;
  font-weight: 400;
  flex-grow: 1;
}

.main__viewer--image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.main__viewer--image > img {
  max-height: 100%;
  object-fit: cover;

  border-radius: 50px;
  background: #f3f3f3;
  box-shadow: 12px 12px 24px #e0e0e0, -12px -12px 24px #ffffff;
}
</style>
