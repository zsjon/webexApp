
// Placeholder for Webex Embedded App SDK
// Original: https://binaries.webex.com/static-content-widget/webex-embedded-app/webex-embedded-app-sdk.js

(function(window) {
  window.Webex = {
    EmbeddedAppSdk: function() {
      this.ready = () => Promise.resolve();
      // this.getUser = () => Promise.resolve({ email: "admin@cho010105-6xnw.wbx.ai" }); // 관리자 계정
      this.getUser = () => Promise.resolve({ email: "cho010105@gachon.ac.kr" }); //
    }
  };
})(window);
