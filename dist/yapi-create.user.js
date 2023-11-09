// ==UserScript==
// @name         yapi-create
// @namespace    shiouhoo/yapi-create
// @version      0.0.5
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

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(" .menu[data-v-359bdd73]{position:fixed;z-index:10;border:1px solid #ebeef5;box-shadow:0 2px 12px #0000001a;transition:display 0s} ");

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
          const methodDom = panel.querySelector(".ant-row .tag-method");
          const method = (_d = methodDom == null ? void 0 : methodDom.textContent) == null ? void 0 : _d.toLowerCase();
          const url = (_e = methodDom == null ? void 0 : methodDom.nextElementSibling) == null ? void 0 : _e.textContent;
          const name = url == null ? void 0 : url.split("/").slice(-1)[0];
          const describtion = (_f = panel.querySelector(".ant-row .colName")) == null ? void 0 : _f.textContent;
          const template = `
/** ${describtion} */
export const ${name} = (params: any): Promise<any> => {
    return axios.${method}('${url}', ${method === "get" ? "{ params }" : "params"});
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
  const _withScopeId = (n) => (vue.pushScopeId("data-v-359bdd73"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "复制类型", -1));
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "CreateTypes",
    setup(__props) {
      const btnRef = vue.ref();
      const type = vue.ref("");
      const msgMap = {
        request: "请求参数",
        response: "返回数据"
      };
      const responsetableIndex = {
        name: -1,
        type: -1,
        required: -1,
        description: -1
      };
      const targetDom = vue.ref();
      function modifyDom(dom) {
        dom.addEventListener("contextmenu", (e) => {
          var _a;
          e.stopPropagation();
          e.preventDefault();
          targetDom.value = e.target;
          const x = e.clientX;
          const y = e.clientY;
          const menuDom = (_a = btnRef.value) == null ? void 0 : _a.querySelector(".menu");
          menuDom == null ? void 0 : menuDom.setAttribute("style", `left: ${x + 8}px; top: ${y - 25}px;`);
          document.addEventListener("click", function() {
            targetDom.value = null;
          });
        });
      }
      function getResponseTypes(panel, level = 0) {
        let obj = "{\r\n";
        let trList = [...(panel == null ? void 0 : panel.querySelectorAll(` tr.ant-table-row-level-${level}`)) || []];
        if ((!trList || !trList.length) && level === 0) {
          trList = [panel];
          panel = panel == null ? void 0 : panel.parentElement;
        }
        if ((!trList || !trList.length) && level !== 0) {
          return "{}";
        }
        trList == null ? void 0 : trList.forEach((tr) => {
          var _a, _b, _c, _d;
          const name = (_a = tr.querySelector(`td:nth-child(${responsetableIndex.name})`)) == null ? void 0 : _a.textContent;
          if (!name)
            return;
          let type2 = (_c = (_b = tr.querySelector(`td:nth-child(${responsetableIndex.type})`)) == null ? void 0 : _b.textContent) == null ? void 0 : _c.replaceAll(" ", "");
          if (type2 === "integer") {
            type2 = "number";
          } else if (type2 === "object") {
            type2 = getResponseTypes(panel, level + 1);
          } else if (type2 === "object[]") {
            type2 = getResponseTypes(panel, level + 1) + "[]";
          }
          let description = (_d = tr.querySelector(`td:nth-child(${responsetableIndex.description})`)) == null ? void 0 : _d.textContent;
          const tab = "    ".repeat(level + 1);
          description = (description == null ? void 0 : description.trim()) ? `${tab}/** ${description.replaceAll("\n", `
${tab}* `)} */\r
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
          let nameIndex = -1;
          let typeIndex = -1;
          let requiredIndex = -1;
          let descriptionIndex = -1;
          panel == null ? void 0 : panel.querySelectorAll(".ant-table-body .ant-table-thead tr th").forEach((item, index) => {
            var _a2, _b2, _c2, _d;
            if ((_a2 = item.textContent) == null ? void 0 : _a2.includes("参数名称")) {
              nameIndex = index + 1;
            } else if ((_b2 = item.textContent) == null ? void 0 : _b2.includes("类型")) {
              typeIndex = index + 1;
            } else if ((_c2 = item.textContent) == null ? void 0 : _c2.includes("是否必须")) {
              requiredIndex = index + 1;
            } else if ((_d = item.textContent) == null ? void 0 : _d.includes("备注")) {
              descriptionIndex = index + 1;
            }
          });
          const trList = panel == null ? void 0 : panel.querySelectorAll(".ant-table-body table tbody tr");
          Array.from(trList || []).forEach((tr) => {
            var _a2, _b2, _c2, _d, _e;
            const name = ((_a2 = tr.querySelector(`td:nth-child(${nameIndex})`)) == null ? void 0 : _a2.textContent) || "";
            let type2 = ((_b2 = tr.querySelector(`td:nth-child(${typeIndex})`)) == null ? void 0 : _b2.textContent) || "any";
            if (type2 == null ? void 0 : type2.includes("文本")) {
              type2 = "string";
            }
            const required = (_d = (_c2 = tr.querySelector(`td:nth-child(${requiredIndex})`)) == null ? void 0 : _c2.textContent) == null ? void 0 : _d.includes("是");
            let description = (_e = tr.querySelector(`td:nth-child(${descriptionIndex})`)) == null ? void 0 : _e.textContent;
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
          obj = getResponseTypes(panel);
        }
        navigator.clipboard.writeText(obj);
        ElementPlus.ElMessage.success("成功复制到剪切板");
      };
      const copyItemTypes = () => {
        const obj = getResponseTypes(targetDom.value.parentElement);
        navigator.clipboard.writeText(obj);
        ElementPlus.ElMessage.success("成功复制到剪切板");
      };
      vue.onMounted(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        const text = (_c = (_b = (_a = btnRef.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.textContent;
        if ((text == null ? void 0 : text.includes("Body")) || (text == null ? void 0 : text.includes("Query"))) {
          type.value = "request";
        } else if (text == null ? void 0 : text.includes("返回数据")) {
          (_g = (_f = (_e = (_d = btnRef.value) == null ? void 0 : _d.parentElement) == null ? void 0 : _e.parentElement) == null ? void 0 : _f.nextElementSibling) == null ? void 0 : _g.querySelectorAll(".ant-table-body .ant-table-thead tr th").forEach((item, index) => {
            var _a2, _b2, _c2, _d2;
            if ((_a2 = item.textContent) == null ? void 0 : _a2.includes("名称")) {
              responsetableIndex.name = index + 1;
            } else if ((_b2 = item.textContent) == null ? void 0 : _b2.includes("类型")) {
              responsetableIndex.type = index + 1;
            } else if ((_c2 = item.textContent) == null ? void 0 : _c2.includes("是否必须")) {
              responsetableIndex.required = index + 1;
            } else if ((_d2 = item.textContent) == null ? void 0 : _d2.includes("备注")) {
              responsetableIndex.description = index + 1;
            }
          });
          type.value = "response";
          let tableDom = (_k = (_j = (_i = (_h = btnRef.value) == null ? void 0 : _h.parentElement) == null ? void 0 : _i.parentElement) == null ? void 0 : _j.nextElementSibling) == null ? void 0 : _k.querySelector(".ant-table-tbody");
          tableDom == null ? void 0 : tableDom.querySelectorAll("tr").forEach((item) => {
            modifyDom(item.firstChild);
          });
          let observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
              if (mutation.type === "childList") {
                const target = mutation.addedNodes[0];
                modifyDom(target.firstChild);
              }
            }
          });
          tableDom && observer.observe(tableDom, {
            childList: true,
            subtree: true
          });
        }
      });
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_menu_item = vue.resolveComponent("el-menu-item");
        const _component_el_menu = vue.resolveComponent("el-menu");
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "btnRef",
          ref: btnRef
        }, [
          vue.createVNode(_component_el_button, { onClick: handleClick }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("复制" + vue.toDisplayString(msgMap[type.value]) + "类型", 1)
            ]),
            _: 1
          }),
          vue.withDirectives(vue.createVNode(_component_el_menu, {
            ref: "menuDom",
            class: "menu"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_menu_item, {
                index: "1",
                onClick: copyItemTypes
              }, {
                default: vue.withCtx(() => [
                  _hoisted_1
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 512), [
            [vue.vShow, targetDom.value]
          ])
        ], 512);
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
  const CreateTypes = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-359bdd73"]]);
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
      var _a, _b, _c, _d;
      let list = [];
      let com = null;
      switch (el.textContent) {
        case "基本信息":
          com = _sfc_main$1;
          list = [el];
          break;
        case "请求参数":
          com = CreateTypes;
          while (el) {
            if (el.innerHTML.includes("button")) {
              break;
            }
            if (((_b = (_a = el == null ? void 0 : el.firstChild) == null ? void 0 : _a.textContent) == null ? void 0 : _b.startsWith("Query")) || ((_d = (_c = el == null ? void 0 : el.firstChild) == null ? void 0 : _c.textContent) == null ? void 0 : _d.startsWith("Body"))) {
              list.push(el == null ? void 0 : el.firstChild);
            }
            el = el.nextElementSibling;
            if (!el)
              break;
          }
          break;
        case "返回数据":
          list = [el];
          com = CreateTypes;
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
