// ==UserScript==
// @name         yapi-create
// @namespace    shiouhoo/yapi-create
// @version      0.0.1
// @author       shiouhoo
// @description  这是一个用于yapi的插件，快捷生成ts类型以及axios请求
// @icon         https://vitejs.dev/logo.svg
// @match        https://www.google.com/
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus/2.4.1/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.bootcdn.net/ajax/libs/element-plus/2.4.1/index.min.css
// @grant        GM_getResourceText
// ==/UserScript==

(e=>{const o=document.createElement("style");o.dataset.source="vite-plugin-monkey",o.textContent=e,document.head.append(o)})(" :root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;display:flex;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}#app{max-width:1280px;margin:0 auto;padding:2rem;text-align:center}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}.logo[data-v-c229d009]{height:6em;padding:1.5em;will-change:filter}.logo[data-v-c229d009]:hover{filter:drop-shadow(0 0 2em #646cffaa)}.logo.vue[data-v-c229d009]:hover{filter:drop-shadow(0 0 2em #42b883aa)} ");

(function (vue, ElementPlus) {
  'use strict';

  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      console.log(23);
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createTextVNode(" asd "),
          vue.createVNode(_component_el_button, null, {
            default: vue.withCtx(() => [
              vue.createTextVNode("dsa")
            ]),
            _: 1
          })
        ], 64);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c229d009"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("element-plus/dist/index.css");
  vue.createApp(App).use(ElementPlus).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue, ElementPlus);
