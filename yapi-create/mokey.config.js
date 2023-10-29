import { cdn, util } from 'vite-plugin-monkey';

export default {
    entry: 'yapi-create/main.ts',
    userscript: {
        name: 'yapi-create',
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'shiouhoo/yapi-create',
        version: '0.0.1',
        license: 'MIT',
        description: '这是一个用于yapi的插件，快捷生成ts类型以及axios请求',
        match: ['*://trsyapi.trscd.com.cn/project/*/interface/api/*'],
    },
    build: {
        fileName: 'yapi-create.user.js',
        externalGlobals: [
            ['vue', cdn.bootcdn('Vue', 'vue.global.prod.js').concat(
                await util.fn2dataUrl(() => {
                    // eslint-disable-next-line no-undef
                    window.Vue = Vue;
                }),
            ),],
            [
                'element-plus',
                cdn.bootcdn('ElementPlus', 'index.full.min.js'),
            ],
        ],
        externalResource: {
            'element-plus/dist/index.css': cdn.bootcdn('element-plus/dist/index.css', 'index.min.css'),
        },
    },
};