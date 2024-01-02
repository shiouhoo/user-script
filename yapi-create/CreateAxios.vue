<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const btnRef = ref<HTMLElement>();

const typeMsg = ref('默认格式');

function getContentType() {
    let domList = document.querySelectorAll('.interface-title');
    for(let i = 0;i < domList.length;i++) {
        if(domList[i].textContent?.includes('请求参数')) {
            const title = domList[i].nextElementSibling?.querySelector('.col-title');
            if(title?.textContent?.toLowerCase().includes('headers')) {
                const rows = domList[i]?.nextElementSibling?.querySelectorAll('.ant-table-row') || [];
                for(let j = 0;j < rows.length;j++) {
                    if(rows[j].firstChild?.textContent?.toLowerCase() === 'content-type') {
                        // 第二个td
                        return rows[j].childNodes[1].textContent;
                    }
                }
            }
        }
    }
}

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
    const contentType = getContentType();
    switch(typeMsg.value) {
    case '默认格式':
        // eslint-disable-next-line no-case-declarations
        let contentTpeStr = contentType
            ? `, {
        headers: {
            'Content-Type': '${contentType}',
        }
    }`
            : '';

        template = `/** ${describtion} */
export const ${name} = (params: any): Promise<any> => {
    return axios.${method}('${url}', ${method === 'get' ? `{ params${contentTpeStr} }` : `params${contentTpeStr}`});
};`;
        break;
    case 'request--格式':
        template = `/** ${describtion} */
export const ${name} = (params: any): Promise<any> => {
    return request({
        url: '${url}',
        method: '${method.toUpperCase()}',
        ${method === 'get' ? 'params' : 'data: params'},
        ${contentType
        ? `headers: {
            'Content-Type': '${contentType}',
        }`
        : ''}
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
