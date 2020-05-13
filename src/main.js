import Vue from "vue";
import App from "./App.vue";

import Amplify from "aws-amplify";
import "@aws-amplify/ui-vue";
import awsConfig from "./aws-exports";
Amplify.configure(awsConfig);

import { BButton } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.component("b-button", BButton);
Vue.directive("b-button", BButton);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
