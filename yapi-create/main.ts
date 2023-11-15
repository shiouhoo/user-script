import { Component, createApp } from 'vue';
import CreateAxios from './CreateAxios.vue';
import CreateTypes from './CreateTypes.vue';
import CustomAxiosDialog from './CustomAxiosDialog.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { historyWatch } from '../util/histotyWatch';

async function init() {
    let domList = document.querySelectorAll('.interface-title');
    while(!domList.length) {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                domList = document.querySelectorAll('.interface-title');
                resolve();
            }, 10);
        });
    }
    domList.forEach((el) => {
        let list: Element[] = [];
        let com:Component | null = null;
        switch (el.textContent) {
        case '基本信息':
            com = CreateAxios;
            list = [el];
            break;
        case '请求参数':
            com = CreateTypes;
            while(el) {
                if(!el.innerHTML.includes('button')) {
                    if(el?.firstChild?.textContent?.startsWith('Query') || el?.firstChild?.textContent?.startsWith('Body')) {
                        list.push(el?.firstChild as HTMLElement);
                    }
                }
                el = el.nextElementSibling!;
                if(!el) break;
            }
            break;
        case '返回数据':
            list = [el];
            com = CreateTypes;
        }
        if(!com) return;
        for(let i = 0;i < list.length;i++) {
            createApp(com).use(ElementPlus).mount(
                (() => {
                    const app = document.createElement('div');
                    app.style.display = 'inline-block';
                    app.style.marginLeft = '20px';
                    list[i].append(app);
                    return app;
                })(),
            );
        }
    });
}
init();
historyWatch(()=>{
    setTimeout(() => {
        init();
    }, 100);
});
// 定义选项
GM_registerMenuCommand('自定义axios模版', function () {
    createApp(CustomAxiosDialog).use(ElementPlus).mount(
        (() => {
            const app = document.createElement('div');
            document.body.appendChild(app);
            return app;
        })(),
    );
});
