import { Component, createApp } from 'vue';
import CreateAxios from './CreateAxios.vue';
import CreateTypes from './CreateTypes.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

async function init() {
    let domList = document.querySelectorAll('.interface-title');
    while(!domList.length) {
        await new Promise((resolve)=>{
            setTimeout(() => {
                domList = document.querySelectorAll('.interface-title');
                resolve();
            }, 10);
        });
    }
    domList.forEach((el) => {
        let com:Component | null = null;
        switch (el.textContent) {
        case '基本信息':
            com = CreateAxios;
            break;
        case '请求参数':
            com = CreateTypes;
            // while(!el.textContent.includes('Query') && !el.textContent.includes('Body')) {
            //     el = el.nextElementSibling;
            //     if(!el) return;
            // }
            // el = el?.firstChild as HTMLElement;
            break;
        case '返回数据':
            com = CreateTypes;
        }
        if(!com) return;
        createApp(com).use(ElementPlus).mount(
            (() => {
                const app = document.createElement('div');
                app.style.display = 'inline-block';
                app.style.marginLeft = '20px';
                el.append(app);
                return app;
            })(),
        );
    });
}
init();