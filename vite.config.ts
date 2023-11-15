import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { util } from 'vite-plugin-monkey';
import AutoImport from 'unplugin-auto-import/vite';
import yapiMokeyConfig from './yapi-create/mokey.config';

const monkeyConfig = {
    'yapi-create': yapiMokeyConfig
};
export default defineConfig(({ mode }) => {
    return {
        plugins: [
            AutoImport({
                imports: [util.unimportPreset],
            }),
            vue(),
            monkey(monkeyConfig[mode]),
        ],
    };
});