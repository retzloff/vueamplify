import Vue from "vue";
import App from "./App.vue";

import Amplify from "aws-amplify";
import "@aws-amplify/ui-vue";

import awsConfig from "./aws-exports";

Amplify.configure(awsConfig);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
