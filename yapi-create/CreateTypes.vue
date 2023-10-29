<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';

const btnRef = ref<HTMLElement>();

const type = ref('');
const msgMap = {
    request: '请求参数',
    response: '返回数据',
};
const handleClick = () => {

    let panel = btnRef.value?.parentElement?.parentElement?.nextElementSibling;
    let obj = '{\r\n';
    if(type.value === 'request') {
        if(!panel?.textContent?.includes('Body') || !panel?.textContent?.includes('Query')) {
            panel = panel?.nextElementSibling;
        }
        const trList = panel?.querySelectorAll('.ant-table-body table tbody tr');
        Array.from(trList || []).forEach((tr) => {
            const name = tr.querySelector('td:nth-child(1)')?.textContent;
            let type = tr.querySelector('td:nth-child(2)')?.textContent;
            if(type?.includes('文本')) {
                type = 'string';
            }
            const required = tr.querySelector('td:nth-child(3)')?.textContent?.includes('是');

            let description = tr.querySelector('td:nth-child(5)')?.textContent;
            const descBeforeEnter = description?.includes('\n') ? '\r\n      * ' : ' ';
            const descEnter = description?.includes('\n') ? '\r\n      ' : ' ';
            description = description?.trim() ? `    /**${descBeforeEnter}${description?.replaceAll('\n', '\n      * ')}${descEnter}*/\r\n    ` : '';
            const item = `${description}${name}${required ? '' : '?'}: ${type};\r\n`;
            obj += item;
        });
        obj += '}';
    }else if(type.value === 'response') {
        const trList = panel?.querySelectorAll('.ant-table-body table tbody tr');
        Array.from(trList || []).forEach((tr) => {
            const name = tr.querySelector('td:nth-child(1)')?.textContent;
            const type = tr.querySelector('td:nth-child(2)')?.textContent;

            const description = tr.querySelector('td:nth-child(4)')?.textContent;
            const item = `    /** ${description} */\r\n    ${name}: ${type};\r\n`;
            obj += item;
        });
        obj += '}';
    }
    navigator.clipboard.writeText(obj);
    ElMessage.success('成功复制到剪切板');
};

onMounted(() => {
    const text = btnRef.value?.parentElement?.parentElement?.textContent;
    if(text?.includes('请求参数')) {
        type.value = 'request';
    }else if(text?.includes('返回数据')) {
        type.value = 'response';
    }
});

</script>

<template>
    <div ref="btnRef">
        <el-button @click="handleClick">复制{{ msgMap[type]  }}请求类型</el-button>
    </div>
</template>

<style scoped></style>
