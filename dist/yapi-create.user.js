// ==UserScript==
// @name         yapi-create
// @namespace    shiouhoo/yapi-create
// @version      0.0.2
// @author       shiouhoo
// @description  这是一个用于yapi的插件，快捷生成ts类型以及axios请求
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match         *://trsyapi.trscd.com.cn/project/*
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus/2.4.1/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.bootcdn.net/ajax/libs/element-plus/2.4.1/index.min.css
// @grant        GM_getResourceText
// ==/UserScript==

(function (vue, ElementPlus) {
  'use strict';

  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "CreateAxios",
    setup(__props) {
      const btnRef = vue.ref();
      const handleClick = () => {
        var _a, _b, _c, _d, _e, _f;
        const panel = (_c = (_b = (_a = btnRef.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.nextElementSibling;
        if (panel) {
          const methodDom = panel.querySelector(".ant-row:nth-child(3) .tag-method");
          const method = (_d = methodDom == null ? void 0 : methodDom.textContent) == null ? void 0 : _d.toLowerCase();
          const url = (_e = methodDom == null ? void 0 : methodDom.nextElementSibling) == null ? void 0 : _e.textContent;
          const name = url == null ? void 0 : url.split("/").slice(-1)[0];
          const describtion = (_f = panel.querySelector(".ant-row:nth-child(1) .colName")) == null ? void 0 : _f.textContent;
          const template = `
/** ${describtion} */
export const ${name} = (params: any): Promise<any> => {
    return axios.${method}('${url}', ${method === "get" ? "{ params }" : "params"}});
};`;
          navigator.clipboard.writeText(template.trim());
          ElementPlus.ElMessage.success("成功复制到剪切板");
        }
      };
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "btnRef",
          ref: btnRef
        }, [
          vue.createVNode(_component_el_button, { onClick: handleClick }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("复制axios请求")
            ]),
            _: 1
          })
        ], 512);
      };
    }
  });
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "CreateTypes",
    setup(__props) {
      const btnRef = vue.ref();
      const type = vue.ref("");
      const msgMap = {
        request: "请求参数",
        response: "返回数据"
      };
      function getResponseTypes(panel, level = 0) {
        let obj = "{\r\n";
        const trList = panel == null ? void 0 : panel.querySelectorAll(`.ant-table-body table tbody tr.ant-table-row-level-${level}`);
        Array.from(trList || []).forEach((tr) => {
          var _a, _b, _c, _d;
          const name = (_a = tr.querySelector("td:nth-child(1)")) == null ? void 0 : _a.textContent;
          let type2 = (_c = (_b = tr.querySelector("td:nth-child(2)")) == null ? void 0 : _b.textContent) == null ? void 0 : _c.replaceAll(" ", "");
          if (type2 === "object") {
            type2 = getResponseTypes(panel, level + 1);
          } else if (type2 === "object[]") {
            type2 = getResponseTypes(panel, level + 1) + "[]";
          }
          let description = (_d = tr.querySelector("td:nth-child(5)")) == null ? void 0 : _d.textContent;
          const tab = "    ".repeat(level + 1);
          description = (description == null ? void 0 : description.trim()) ? `${tab}/** ${description} */\r
` : "";
          const item = `${description}${tab}${name}: ${type2};\r
`;
          obj += item;
        });
        obj += `${"    ".repeat(level)}}`;
        return obj;
      }
      const handleClick = () => {
        var _a, _b, _c;
        let panel = (_c = (_b = (_a = btnRef.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.nextElementSibling;
        let obj = "{\r\n";
        if (type.value === "request") {
          const trList = panel == null ? void 0 : panel.querySelectorAll(".ant-table-body table tbody tr");
          Array.from(trList || []).forEach((tr) => {
            var _a2, _b2, _c2, _d, _e;
            const name = (_a2 = tr.querySelector("td:nth-child(1)")) == null ? void 0 : _a2.textContent;
            let type2 = (_b2 = tr.querySelector("td:nth-child(2)")) == null ? void 0 : _b2.textContent;
            if (type2 == null ? void 0 : type2.includes("文本")) {
              type2 = "string";
            }
            const required = (_d = (_c2 = tr.querySelector("td:nth-child(3)")) == null ? void 0 : _c2.textContent) == null ? void 0 : _d.includes("是");
            let description = (_e = tr.querySelector("td:nth-child(5)")) == null ? void 0 : _e.textContent;
            const descBeforeEnter = (description == null ? void 0 : description.includes("\n")) ? "\r\n      * " : " ";
            const descEnter = (description == null ? void 0 : description.includes("\n")) ? "\r\n      " : " ";
            description = (description == null ? void 0 : description.trim()) ? `    /**${descBeforeEnter}${description == null ? void 0 : description.replaceAll("\n", "\n      * ")}${descEnter}*/\r
    ` : "";
            const item = `${description}${name}${required ? "" : "?"}: ${type2};\r
`;
            obj += item;
            obj += "}";
          });
        } else if (type.value === "response") {
          obj = getResponseTypes(panel);
        }
        navigator.clipboard.writeText(obj);
        ElementPlus.ElMessage.success("成功复制到剪切板");
      };
      vue.onMounted(() => {
        var _a, _b, _c;
        const text = (_c = (_b = (_a = btnRef.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.textContent;
        if ((text == null ? void 0 : text.includes("Body")) || (text == null ? void 0 : text.includes("Query"))) {
          type.value = "request";
        } else if (text == null ? void 0 : text.includes("返回数据")) {
          type.value = "response";
        }
      });
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "btnRef",
          ref: btnRef
        }, [
          vue.createVNode(_component_el_button, { onClick: handleClick }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("复制" + vue.toDisplayString(msgMap[type.value]) + "类型", 1)
            ]),
            _: 1
          })
        ], 512);
      };
    }
  });
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("element-plus/dist/index.css");
  function wrapState(action) {
    const raw = history[action];
    return function(...args) {
      const urlBefore = window.location.href;
      const wrapper = raw.apply(this, args);
      const urlAfter = window.location.href;
      if (urlBefore === urlAfter) {
        return;
      }
      const e = new Event(action);
      e.stateInfo = args;
      window.dispatchEvent(e);
      return wrapper;
    };
  }
  const historyWatch = (pushStateCallback, replaceStateCallback) => {
    history.pushState = wrapState("pushState");
    history.replaceState = wrapState("replaceState");
    pushStateCallback && window.addEventListener("pushState", function(e) {
      pushStateCallback(e.stateInfo);
    });
    replaceStateCallback && window.addEventListener("replaceState", function(e) {
      replaceStateCallback(e.stateInfo);
    });
  };
  async function init() {
    let domList = document.querySelectorAll(".interface-title");
    while (!domList.length) {
      await new Promise((resolve) => {
        setTimeout(() => {
          domList = document.querySelectorAll(".interface-title");
          resolve();
        }, 10);
      });
    }
    domList.forEach((el) => {
      var _a, _b;
      let list = [];
      let com = null;
      switch (el.textContent) {
        case "基本信息":
          com = _sfc_main$1;
          list = [el];
          break;
        case "请求参数":
          com = _sfc_main;
          while (el) {
            if (((_a = el.textContent) == null ? void 0 : _a.includes("Query")) || ((_b = el.textContent) == null ? void 0 : _b.includes("Body"))) {
              list.push(el == null ? void 0 : el.firstChild);
            }
            el = el.nextElementSibling;
            if (!el)
              break;
          }
          break;
        case "返回数据":
          list = [el];
          com = _sfc_main;
      }
      if (!com)
        return;
      for (let i = 0; i < list.length; i++) {
        vue.createApp(com).use(ElementPlus).mount(
          (() => {
            const app = document.createElement("div");
            app.style.display = "inline-block";
            app.style.marginLeft = "20px";
            list[i].append(app);
            return app;
          })()
        );
      }
    });
  }
  init();
  historyWatch(() => {
    vue.nextTick(() => init());
  });

})(Vue, ElementPlus);
