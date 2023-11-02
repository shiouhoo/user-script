<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';

const btnRef = ref<HTMLElement>();

const type = ref('');
const msgMap = {
    request: '请求参数',
    response: '返回数据',
};

const responsetableIndex = {
    name: -1,
    type: -1,
    required: -1,
    description: -1,
};

function getResponseTypes(panel: Element | null | undefined, level = 0) {
    let obj = '{\r\n';
    const trList = panel?.querySelectorAll(`.ant-table-body table tbody tr.ant-table-row-level-${level}`);
    Array.from(trList || []).forEach((tr) => {
        const name = tr.querySelector(`td:nth-child(${responsetableIndex.name})`)?.textContent;
        let type = tr.querySelector(`td:nth-child(${responsetableIndex.type})`)?.textContent?.replaceAll(' ', '');
        if(type === 'integer') {
            type = 'number';
        }else if(type === 'object') {
            type = getResponseTypes(panel, level + 1);
        }else if(type === 'object[]') {
            type = getResponseTypes(panel, level + 1) + '[]';
        }
        let description = tr.querySelector(`td:nth-child(${responsetableIndex.description})`)?.textContent;
        const tab = '    '.repeat(level + 1);
        description = description?.trim() ? `${tab}/** ${description} */\r\n` : '';
        const item = `${description}${tab}${name}: ${type};\r\n`;
        obj += item;
    });
    obj += `${'    '.repeat(level)}}`;
    return obj;
}

const handleClick = () => {

    let panel = btnRef.value?.parentElement?.parentElement?.nextElementSibling;
    let obj = '{\r\n';
    if(type.value === 'request') {
        let nameIndex = -1;
        let typeIndex = -1;
        let requiredIndex = -1;
        let descriptionIndex = -1;
        panel?.querySelectorAll('.ant-table-body .ant-table-thead tr th').forEach((item, index)=>{
            if(item.textContent?.includes('参数名称')) {
                nameIndex = index + 1;
            }else if(item.textContent?.includes('类型')) {
                typeIndex = index + 1;
            }else if(item.textContent?.includes('是否必须')) {
                requiredIndex = index + 1;
            }else if(item.textContent?.includes('备注')) {
                descriptionIndex = index + 1;
            }
        });
        const trList = panel?.querySelectorAll('.ant-table-body table tbody tr');
        Array.from(trList || []).forEach((tr) => {
            const name = tr.querySelector(`td:nth-child(${nameIndex})`)?.textContent || '';
            let type = tr.querySelector(`td:nth-child(${typeIndex})`)?.textContent || 'any';
            if(type?.includes('文本')) {
                type = 'string';
            }
            const required = tr.querySelector(`td:nth-child(${requiredIndex})`)?.textContent?.includes('是');

            let description = tr.querySelector(`td:nth-child(${descriptionIndex})`)?.textContent;
            const descBeforeEnter = description?.includes('\n') ? '\r\n      * ' : ' ';
            const descEnter = description?.includes('\n') ? '\r\n      ' : ' ';
            description = description?.trim() ? `    /**${descBeforeEnter}${description?.replaceAll('\n', '\n      * ')}${descEnter}*/\r\n    ` : '';
            const item = `${description}${name}${required ? '' : '?'}: ${type};\r\n`;
            obj += item;
        });
        obj += '}';
    }else if(type.value === 'response') {
        panel?.querySelectorAll('.ant-table-body .ant-table-thead tr th').forEach((item, index)=>{
            if(item.textContent?.includes('名称')) {
                responsetableIndex.name = index + 1;
            }else if(item.textContent?.includes('类型')) {
                responsetableIndex.type = index + 1;
            }else if(item.textContent?.includes('是否必须')) {
                responsetableIndex.required = index + 1;
            }else if(item.textContent?.includes('备注')) {
                responsetableIndex.description = index + 1;
            }
        });
        obj = getResponseTypes(panel);
    }
    navigator.clipboard.writeText(obj);
    ElMessage.success('成功复制到剪切板');
};

onMounted(() => {
    const text = btnRef.value?.parentElement?.parentElement?.textContent;
    if(text?.includes('Body') || text?.includes('Query')) {
        type.value = 'request';
    }else if(text?.includes('返回数据')) {
        type.value = 'response';
    }
});

</script>

<template>
    <div ref="btnRef">
        <el-button @click="handleClick">复制{{ msgMap[type]  }}类型</el-button>
    </div>
</template>

<style scoped></style>
