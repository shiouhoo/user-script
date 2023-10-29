<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const btnRef = ref<HTMLElement>();

const handleClick = () => {
    const panel = btnRef.value?.parentElement?.parentElement?.nextElementSibling;

    if(panel) {
        const methodDom = panel.querySelector('.ant-row:nth-child(3) .tag-method');
        /** 请求方法 */
        const method = methodDom?.textContent?.toLowerCase();
        /** 请求url */
        const url = methodDom?.nextElementSibling?.textContent;
        /** 函数名 */
        const name = url?.split('/').slice(-1)[0];
        /** 注释 */
        const describtion = panel.querySelector('.ant-row:nth-child(1) .colName')?.textContent;

        const template = `
/** ${describtion} */
export const ${name} = (params: any): Promise<any> => {
    return axios.${method}('${url}', ${method === 'get' ? '{ params }' : 'params'}});
};`;
        navigator.clipboard.writeText(template.trim());
        ElMessage.success('成功复制到剪切板');
    }
};

</script>

<template>
    <div ref="btnRef">
        <el-button @click="handleClick">复制axios请求</el-button>
    </div>
</template>

<style scoped></style>
