// ==UserScript==
// @name         yapi-create
// @namespace    shiouhoo/yapi-create
// @version      0.0.1
// @author       shiouhoo
// @description  这是一个用于yapi的插件，快捷生成ts类型以及axios请求
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        *://trsyapi.trscd.com.cn/project/*/interface/api/*
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
      const handleClick = () => {
        var _a, _b, _c, _d, _e;
        let panel = (_c = (_b = (_a = btnRef.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.nextElementSibling;
        let obj = "{\r\n";
        if (type.value === "request") {
          if (!((_d = panel == null ? void 0 : panel.textContent) == null ? void 0 : _d.includes("Body")) || !((_e = panel == null ? void 0 : panel.textContent) == null ? void 0 : _e.includes("Query"))) {
            panel = panel == null ? void 0 : panel.nextElementSibling;
          }
          const trList = panel == null ? void 0 : panel.querySelectorAll(".ant-table-body table tbody tr");
          Array.from(trList || []).forEach((tr) => {
            var _a2, _b2, _c2, _d2, _e2;
            const name = (_a2 = tr.querySelector("td:nth-child(1)")) == null ? void 0 : _a2.textContent;
            let type2 = (_b2 = tr.querySelector("td:nth-child(2)")) == null ? void 0 : _b2.textContent;
            if (type2 == null ? void 0 : type2.includes("文本")) {
              type2 = "string";
            }
            const required = (_d2 = (_c2 = tr.querySelector("td:nth-child(3)")) == null ? void 0 : _c2.textContent) == null ? void 0 : _d2.includes("是");
            let description = (_e2 = tr.querySelector("td:nth-child(5)")) == null ? void 0 : _e2.textContent;
            const descBeforeEnter = (description == null ? void 0 : description.includes("\n")) ? "\r\n      * " : " ";
            const descEnter = (description == null ? void 0 : description.includes("\n")) ? "\r\n      " : " ";
            description = (description == null ? void 0 : description.trim()) ? `    /**${descBeforeEnter}${description == null ? void 0 : description.replaceAll("\n", "\n      * ")}${descEnter}*/\r
    ` : "";
            const item = `${description}${name}${required ? "" : "?"}: ${type2};\r
`;
            obj += item;
          });
          obj += "}";
        } else if (type.value === "response") {
          const trList = panel == null ? void 0 : panel.querySelectorAll(".ant-table-body table tbody tr");
          Array.from(trList || []).forEach((tr) => {
            var _a2, _b2, _c2;
            const name = (_a2 = tr.querySelector("td:nth-child(1)")) == null ? void 0 : _a2.textContent;
            const type2 = (_b2 = tr.querySelector("td:nth-child(2)")) == null ? void 0 : _b2.textContent;
            const description = (_c2 = tr.querySelector("td:nth-child(4)")) == null ? void 0 : _c2.textContent;
            const item = `    /** ${description} */\r
    ${name}: ${type2};\r
`;
            obj += item;
          });
          obj += "}";
        }
        navigator.clipboard.writeText(obj);
        ElementPlus.ElMessage.success("成功复制到剪切板");
      };
      vue.onMounted(() => {
        var _a, _b, _c;
        const text = (_c = (_b = (_a = btnRef.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.textContent;
        if (text == null ? void 0 : text.includes("请求参数")) {
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
              vue.createTextVNode("复制" + vue.toDisplayString(msgMap[type.value]) + "请求类型", 1)
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
      let com = null;
      switch (el.textContent) {
        case "基本信息":
          com = _sfc_main$1;
          break;
        case "请求参数":
          com = _sfc_main;
          break;
        case "返回数据":
          com = _sfc_main;
      }
      if (!com)
        return;
      vue.createApp(com).use(ElementPlus).mount(
        (() => {
          const app = document.createElement("div");
          app.style.display = "inline-block";
          app.style.marginLeft = "20px";
          el.append(app);
          return app;
        })()
      );
    });
  }
  init();

})(Vue, ElementPlus);
