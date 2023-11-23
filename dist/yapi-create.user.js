// ==UserScript==
// @name         yapi-create
// @namespace    shiouhoo/yapi-create
// @version      0.0.9
// @author       shiouhoo
// @description  这是一个用于yapi的插件，快捷生成ts类型以及axios请求
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match         *://*.trscd.com.cn/project/*
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus/2.4.1/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.bootcdn.net/ajax/libs/element-plus/2.4.1/index.min.css
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(" .menu[data-v-098de0bb]{position:fixed;z-index:10;border:1px solid #ebeef5;box-shadow:0 2px 12px #0000001a;transition:display 0s}.input[data-v-395bcdc4]{margin-top:20px}.confirm[data-v-395bcdc4]{margin:20px auto;display:block} ");

(function (vue, ElementPlus) {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "CreateAxios",
    setup(__props) {
      const btnRef = vue.ref();
      const typeMsg = vue.ref("默认格式");
      const createTemplate = ({
        method = "",
        url = "",
        name = "",
        describtion = ""
      }) => {
        let template = "";
        switch (typeMsg.value) {
          case "默认格式":
            template = `/** ${describtion} */
export const ${name} = (params: any): Promise<any> => {
    return axios.${method}('${url}', ${method === "get" ? "{ params }" : "params"});
};`;
            break;
          case "request--格式":
            template = `/** ${describtion} */
export const ${name} = (params: any): Promise<any> => {
    return request({
        url: '${url}',
        method: '${method.toUpperCase()}',
        ${method === "get" ? "params" : "data: params"},
    });
};`;
            break;
          case "自定义格式":
            template = eval("`" + _GM_getValue("customAxiosTemplate", "") + "`");
        }
        return template;
      };
      const handleClick = () => {
        var _a, _b, _c, _d, _e, _f;
        const panel = (_c = (_b = (_a = btnRef.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.nextElementSibling;
        if (panel) {
          const methodDom = panel.querySelector(".ant-row .tag-method");
          const method2 = (_d = methodDom == null ? void 0 : methodDom.textContent) == null ? void 0 : _d.toLowerCase();
          const url2 = (_e = methodDom == null ? void 0 : methodDom.nextElementSibling) == null ? void 0 : _e.textContent;
          const name2 = url2 == null ? void 0 : url2.split("/").slice(-1)[0];
          const describtion2 = (_f = panel.querySelector(".ant-row .colName")) == null ? void 0 : _f.textContent;
          const template2 = createTemplate({
            method: method2 || "",
            url: url2 || "",
            name: name2 || "",
            describtion: describtion2 || ""
          });
          navigator.clipboard.writeText(template2.trim());
          ElementPlus.ElMessage.success("成功复制到剪切板");
        }
      };
      return (_ctx, _cache) => {
        const _component_el_dropdown_item = vue.resolveComponent("el-dropdown-item");
        const _component_el_dropdown_menu = vue.resolveComponent("el-dropdown-menu");
        const _component_el_dropdown = vue.resolveComponent("el-dropdown");
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "btnRef",
          ref: btnRef
        }, [
          vue.createVNode(_component_el_dropdown, {
            "split-button": "",
            type: "primary",
            onClick: handleClick
          }, {
            dropdown: vue.withCtx(() => [
              vue.createVNode(_component_el_dropdown_menu, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_dropdown_item, {
                    onClick: _cache[0] || (_cache[0] = ($event) => typeMsg.value = "默认格式")
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(" 默认格式 ")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_dropdown_item, {
                    onClick: _cache[1] || (_cache[1] = ($event) => typeMsg.value = "request--格式")
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(" request--格式 ")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_dropdown_item, {
                    onClick: _cache[2] || (_cache[2] = ($event) => typeMsg.value = "自定义格式")
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(" 自定义格式 ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            default: vue.withCtx(() => [
              vue.createTextVNode(" 复制axios请求(" + vue.toDisplayString(typeMsg.value) + ") ", 1)
            ]),
            _: 1
          })
        ], 512);
      };
    }
  });
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-098de0bb"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("span", null, "复制类型", -1));
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "CreateTypes",
    setup(__props2) {
      const btnRef2 = vue.ref();
      const type = vue.ref("request");
      const msgMap = {
        request: "请求参数",
        response: "返回数据"
      };
      const responsetableIndex = {
        name: -1,
        type: -1,
        required: -1,
        description: -1,
        other: -1
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
          const menuDom = (_a = btnRef2.value) == null ? void 0 : _a.querySelector(".menu");
          menuDom == null ? void 0 : menuDom.setAttribute("style", `left: ${x + 8}px; top: ${y - 25}px;`);
          document.addEventListener("click", function() {
            targetDom.value = null;
          });
        });
      }
      function getResponseTypes(panel, level = 0, tab = 0) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        let obj = "{\r\n";
        let trList = Array.from((panel == null ? void 0 : panel.querySelectorAll(` tr.ant-table-row-level-${level}`)) || []);
        let isCanReturnType = false;
        if ((!trList || !trList.length) && level === 0) {
          trList = [panel];
          isCanReturnType = true;
          const match = panel == null ? void 0 : panel.className.match(/ant-table-row-level-(\d+)/);
          if (match) {
            level = parseInt(match[1]);
          }
          panel = panel == null ? void 0 : panel.parentElement;
        }
        if ((!trList || !trList.length) && level !== 0) {
          return "{}";
        }
        for (let tr of trList) {
          const name2 = (_a = tr.querySelector(`td:nth-child(${responsetableIndex.name})`)) == null ? void 0 : _a.textContent;
          let type2 = (_c = (_b = tr.querySelector(`td:nth-child(${responsetableIndex.type})`)) == null ? void 0 : _b.textContent) == null ? void 0 : _c.replaceAll(" ", "");
          if (type2 === "integer") {
            type2 = "number";
            isCanReturnType = false;
          } else if (type2 === "object") {
            type2 = getResponseTypes(panel, level + 1, isCanReturnType ? tab : tab + 1);
          } else if (type2 === "object[]") {
            type2 = getResponseTypes(panel, level + 1, isCanReturnType ? tab : tab + 1) + "[]";
          } else {
            isCanReturnType = false;
          }
          const otherInfoDom = tr.querySelector(`td:nth-child(${responsetableIndex.other})`);
          if ((_d = otherInfoDom == null ? void 0 : otherInfoDom.textContent) == null ? void 0 : _d.includes("枚举")) {
            let enumString = "";
            const pNodeList = otherInfoDom.querySelectorAll("p");
            for (const pNode of Array.from(pNodeList)) {
              if ((_e = pNode.textContent) == null ? void 0 : _e.includes("枚举")) {
                let txt = ((_f = pNode.lastChild) == null ? void 0 : _f.textContent) || "";
                for (let item2 of txt.split(",")) {
                  if (Number.isNaN(Number(item2))) {
                    enumString += `'${item2.trim()}' | `;
                  } else {
                    enumString += `${item2.trim()} | `;
                  }
                }
                enumString = enumString.slice(0, -3) || type2 || "";
                break;
              }
            }
            type2 = enumString;
          }
          if (!name2 || isCanReturnType) {
            return type2 || "";
          }
          let description = (_g = tr.querySelector(`td:nth-child(${responsetableIndex.description})`)) == null ? void 0 : _g.textContent;
          const tabString = "    ".repeat(tab + 1);
          const required = ((_i = (_h = tr.querySelector(`td:nth-child(${responsetableIndex.required})`)) == null ? void 0 : _h.textContent) == null ? void 0 : _i.trim()) === "必须";
          const descEnter = (description == null ? void 0 : description.includes("\n")) ? `\r
${tabString}` : " ";
          description = (description == null ? void 0 : description.trim()) ? `${tabString}/** ${description.replaceAll("\n", `
${tabString} * `)}${descEnter} */\r
` : "";
          const item = `${description}${tabString}${name2}${required ? "" : "?"}: ${type2};\r
`;
          obj += item;
        }
        obj += `${"    ".repeat(tab)}}`;
        return obj;
      }
      const handleClick2 = () => {
        var _a, _b, _c;
        let panel = (_c = (_b = (_a = btnRef2.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.nextElementSibling;
        let obj = "{\r\n";
        panel == null ? void 0 : panel.querySelectorAll(".ant-table-body .ant-table-thead tr th").forEach((item, index) => {
          var _a2, _b2, _c2, _d, _e;
          if ((_a2 = item.textContent) == null ? void 0 : _a2.includes("名称")) {
            responsetableIndex.name = index + 1;
          } else if ((_b2 = item.textContent) == null ? void 0 : _b2.includes("类型")) {
            responsetableIndex.type = index + 1;
          } else if ((_c2 = item.textContent) == null ? void 0 : _c2.includes("是否必须")) {
            responsetableIndex.required = index + 1;
          } else if ((_d = item.textContent) == null ? void 0 : _d.includes("备注")) {
            responsetableIndex.description = index + 1;
          } else if ((_e = item.textContent) == null ? void 0 : _e.includes("其他")) {
            responsetableIndex.other = index + 1;
          }
        });
        if (type.value === "request") {
          const trList = panel == null ? void 0 : panel.querySelectorAll(".ant-table-body table tbody tr");
          Array.from(trList || []).forEach((tr) => {
            var _a2, _b2, _c2, _d, _e;
            const name2 = ((_a2 = tr.querySelector(`td:nth-child(${responsetableIndex.name})`)) == null ? void 0 : _a2.textContent) || "";
            let type2 = ((_b2 = tr.querySelector(`td:nth-child(${responsetableIndex.type})`)) == null ? void 0 : _b2.textContent) || "any";
            if (type2 == null ? void 0 : type2.includes("文本")) {
              type2 = "string";
            }
            const required = (_d = (_c2 = tr.querySelector(`td:nth-child(${responsetableIndex.required})`)) == null ? void 0 : _c2.textContent) == null ? void 0 : _d.includes("是");
            let description = (_e = tr.querySelector(`td:nth-child(${responsetableIndex.description})`)) == null ? void 0 : _e.textContent;
            const descBeforeEnter = (description == null ? void 0 : description.includes("\n")) ? "\r\n      * " : " ";
            const descEnter = (description == null ? void 0 : description.includes("\n")) ? "\r\n      " : " ";
            description = (description == null ? void 0 : description.trim()) ? `    /**${descBeforeEnter}${description == null ? void 0 : description.replaceAll("\n", "\n      * ")}${descEnter}*/\r
` : "";
            const item = `${description}    ${name2}${required ? "" : "?"}: ${type2};\r
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
        var _a, _b, _c, _d, _e, _f, _g;
        const text = (_c = (_b = (_a = btnRef2.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement) == null ? void 0 : _c.textContent;
        if ((text == null ? void 0 : text.includes("Body")) || (text == null ? void 0 : text.includes("Query"))) {
          type.value = "request";
        } else if (text == null ? void 0 : text.includes("返回数据")) {
          type.value = "response";
          let tableDom = (_g = (_f = (_e = (_d = btnRef2.value) == null ? void 0 : _d.parentElement) == null ? void 0 : _e.parentElement) == null ? void 0 : _f.nextElementSibling) == null ? void 0 : _g.querySelector(".ant-table-tbody");
          tableDom == null ? void 0 : tableDom.querySelectorAll("tr").forEach((item) => {
            modifyDom(item.firstChild);
          });
          let observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
              if (mutation.type === "childList") {
                const target = mutation.addedNodes[0];
                if (!target)
                  return;
                modifyDom(target.firstChild);
              }
            }
          });
          tableDom && observer.observe(tableDom, {
            childList: true,
            subtree: true
          });
          vue.onBeforeUnmount(() => {
            observer.disconnect();
          });
        }
      });
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_menu_item = vue.resolveComponent("el-menu-item");
        const _component_el_menu = vue.resolveComponent("el-menu");
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "btnRef",
          ref: btnRef2
        }, [
          vue.createVNode(_component_el_button, { onClick: handleClick2 }, {
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
                  _hoisted_1$1
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
  const CreateTypes = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-098de0bb"]]);
  const _withScopeId = (n) => (vue.pushScopeId("data-v-395bcdc4"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "在下方输入框中输入你的axios模版，采用es6的模版方式解析，提供了4个变量，describtion，name，method，url ：", -1));
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "CustomAxiosDialog",
    setup(__props2) {
      const dialogVisible2 = vue.inject("dialogVisible");
      let tempalte = _GM_getValue("customAxiosTemplate", "");
      if (!tempalte) {
        tempalte = `/** \${describtion} */
export const \${name} = (params: any): Promise<any> => {
    return axios.\${method}('\${url}', \${method === 'get' ? '{ params }' : 'params'});
};`;
      }
      const customAxiosTemplate = vue.ref(tempalte);
      vue.watch(dialogVisible2, (val) => {
        if (!val) {
          _GM_setValue("customAxiosTemplate", customAxiosTemplate.value);
          ElementPlus.ElMessage.success("保存成功");
          dialogVisible2.value = false;
        }
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createBlock(_component_el_dialog, {
          modelValue: vue.unref(dialogVisible2),
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.isRef(dialogVisible2) ? dialogVisible2.value = $event : null),
          title: "自定义axios模版"
        }, {
          default: vue.withCtx(() => [
            _hoisted_1,
            vue.createVNode(_component_el_input, {
              spellcheck: "false",
              class: "input",
              modelValue: customAxiosTemplate.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => customAxiosTemplate.value = $event),
              autosize: { minRows: 10, maxRows: 20 },
              type: "textarea",
              placeholder: "/** ${describtion} */\r\nexport const ${name} = (params: any): Promise<any> => {\r\n    return axios.${method}('${url}', ${method === 'get' ? '{ params }' : 'params'});\r\n};"
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  });
  const CustomAxiosDialog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-395bcdc4"]]);
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
          com = _sfc_main$2;
          list = [el];
          break;
        case "请求参数":
          com = CreateTypes;
          while (el) {
            if (!el.innerHTML.includes("button")) {
              if (((_b = (_a = el == null ? void 0 : el.firstChild) == null ? void 0 : _a.textContent) == null ? void 0 : _b.startsWith("Query")) || ((_d = (_c = el == null ? void 0 : el.firstChild) == null ? void 0 : _c.textContent) == null ? void 0 : _d.startsWith("Body"))) {
                list.push(el == null ? void 0 : el.firstChild);
              }
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
    setTimeout(() => {
      init();
    }, 100);
  });
  setTimeout(() => {
    const tabsList = document.querySelectorAll(".ant-tabs-tab");
    for (const tab of Array.from(tabsList)) {
      if (tab.textContent === "预览") {
        tab.addEventListener("click", () => {
          setTimeout(() => {
            init();
          }, 100);
        });
      }
    }
  });
  const dialogVisible = vue.ref(false);
  vue.createApp(CustomAxiosDialog).provide("dialogVisible", dialogVisible).use(ElementPlus).mount(
    (() => {
      const app = document.createElement("div");
      app.id = "custom-axios-dialog";
      document.body.appendChild(app);
      return app;
    })()
  );
  _GM_registerMenuCommand("自定义axios模版", function() {
    dialogVisible.value = true;
  });

})(Vue, ElementPlus);
