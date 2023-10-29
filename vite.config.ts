import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey from 'vite-plugin-monkey';
import yapiMokeyConfig from './yapi-create/mokey.config';

const monkeyConfig = {
    'yapi-create': yapiMokeyConfig
};
export default defineConfig(({ mode }) => {
    return {
        plugins: [
            vue(),
            monkey(monkeyConfig[mode]),
        ],
    };
});