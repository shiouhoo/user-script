<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const btnRef = ref<HTMLElement>();

const typeMsg = ref('默认格式');

/**
 * 生成axois请求模板
 */
const createTemplate = ({
    method = '',
    url = '',
    name = '',
    describtion = '',
}: {
    method: string;
    url: string;
    name: string;
    describtion: string;
}) => {
    let template = '';
    switch(typeMsg.value) {
    case '默认格式':
        template = `/** ${describtion} */
export const ${name} = (params: any): Promise<any> => {
    return axios.${method}('${url}', ${method === 'get' ? '{ params }' : 'params'});
};`;
        break;
    case 'request--格式':
        template = `/** ${describtion} */
export const ${name} = (params: any): Promise<any> => {
    return request({
        url: '${url}',
        method: '${method.toUpperCase()}',
        ${method === 'get' ? 'params' : 'data: params'},
    });
};`;
        break;
    case '自定义格式':
        template = eval('`' + GM_getValue('customAxiosTemplate', '') + '`');
    }
    return template;
};

const handleClick = () => {
    const panel = btnRef.value?.parentElement?.parentElement?.nextElementSibling;

    if(panel) {
        const methodDom = panel.querySelector('.ant-row .tag-method');
        /** 请求方法 */
        const method = methodDom?.textContent?.toLowerCase();
        /** 请求url */
        const url = methodDom?.nextElementSibling?.textContent;
        /** 函数名 */
        const name = url?.split('/').slice(-1)[0];
        /** 注释 */
        const describtion = panel.querySelector('.ant-row .colName')?.textContent;

        const template = createTemplate({
            method: method || '',
            url: url || '',
            name: name || '',
            describtion: describtion || '',
        });
        navigator.clipboard.writeText(template.trim());
        ElMessage.success('成功复制到剪切板');
    }
};

</script>

<template>
    <div ref="btnRef">
        <el-dropdown split-button type="primary" @click="handleClick">
            复制axios请求({{ typeMsg }})
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="typeMsg = '默认格式'"> 默认格式 </el-dropdown-item>
                    <el-dropdown-item @click="typeMsg = 'request--格式'"> request--格式 </el-dropdown-item>
                    <el-dropdown-item @click="typeMsg = '自定义格式'"> 自定义格式 </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<style scoped></style>
