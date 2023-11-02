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

const targetDom = ref();

// 修改dom右键菜单
function modifyDom(dom: Node) {
    dom.addEventListener('contextmenu', (e) => {
        e.stopPropagation();
        e.preventDefault();
        targetDom.value = e.target;
        // 获取鼠标相对屏幕位置
        const x = (<MouseEvent>e).clientX;
        const y = (<MouseEvent>e).clientY;
        const menuDom = btnRef.value?.querySelector('.menu');
        menuDom?.setAttribute('style', `left: ${x + 8}px; top: ${y - 25}px;`);
        document.addEventListener('click', function () {
            targetDom.value = null;
        });

    });
}

function getResponseTypes(panel: Element | null | undefined, level = 0) {
    let obj = '{\r\n';
    let trList: any = panel?.querySelectorAll(` tr.ant-table-row-level-${level}`);
    if((!trList || !trList.length) && level === 0) {
        trList = [<Element>panel];
        panel = panel?.parentElement;
    }
    trList.forEach((tr) => {
        const name = tr.querySelector(`td:nth-child(${responsetableIndex.name})`)?.textContent;
        let type = tr.querySelector(`td:nth-child(${responsetableIndex.type})`)?.textContent?.replaceAll(' ', '');
        if (type === 'integer') {
            type = 'number';
        } else if (type === 'object') {
            type = getResponseTypes(panel, level + 1);
        } else if (type === 'object[]') {
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
    if (type.value === 'request') {
        let nameIndex = -1;
        let typeIndex = -1;
        let requiredIndex = -1;
        let descriptionIndex = -1;
        panel?.querySelectorAll('.ant-table-body .ant-table-thead tr th').forEach((item, index) => {
            if (item.textContent?.includes('参数名称')) {
                nameIndex = index + 1;
            } else if (item.textContent?.includes('类型')) {
                typeIndex = index + 1;
            } else if (item.textContent?.includes('是否必须')) {
                requiredIndex = index + 1;
            } else if (item.textContent?.includes('备注')) {
                descriptionIndex = index + 1;
            }
        });
        const trList = panel?.querySelectorAll('.ant-table-body table tbody tr');
        Array.from(trList || []).forEach((tr) => {
            const name = tr.querySelector(`td:nth-child(${nameIndex})`)?.textContent || '';
            let type = tr.querySelector(`td:nth-child(${typeIndex})`)?.textContent || 'any';
            if (type?.includes('文本')) {
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
    } else if (type.value === 'response') {
        obj = getResponseTypes(panel);
    }
    navigator.clipboard.writeText(obj);
    ElMessage.success('成功复制到剪切板');
};

const copyItemTypes = ()=>{
    const obj = getResponseTypes(targetDom.value.parentElement);
    navigator.clipboard.writeText(obj);
    ElMessage.success('成功复制到剪切板');
};

onMounted(() => {
    const text = btnRef.value?.parentElement?.parentElement?.textContent;
    if (text?.includes('Body') || text?.includes('Query')) {
        type.value = 'request';
    } else if (text?.includes('返回数据')) {

        btnRef.value?.parentElement?.parentElement?.nextElementSibling?.querySelectorAll('.ant-table-body .ant-table-thead tr th').forEach((item, index) => {
            if (item.textContent?.includes('名称')) {
                responsetableIndex.name = index + 1;
            } else if (item.textContent?.includes('类型')) {
                responsetableIndex.type = index + 1;
            } else if (item.textContent?.includes('是否必须')) {
                responsetableIndex.required = index + 1;
            } else if (item.textContent?.includes('备注')) {
                responsetableIndex.description = index + 1;
            }
        });

        type.value = 'response';
        let tableDom = btnRef.value?.parentElement?.parentElement?.nextElementSibling?.querySelector('.ant-table-tbody');
        tableDom?.querySelectorAll('tr').forEach((item)=>{
            modifyDom(item.firstChild as Node);
        });
        let observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    const target = mutation.addedNodes[0];
                    modifyDom(target.firstChild as Node);
                }
            }
        });
        tableDom && observer.observe(tableDom, {
            childList: true,
            subtree: true,
        });
    }
});

</script>

<template>
    <div ref="btnRef">
        <el-button @click="handleClick">复制{{ msgMap[type] }}类型</el-button>
        <el-menu v-show="targetDom" ref="menuDom" class="menu">
            <el-menu-item index="1" @click="copyItemTypes">
                <span>复制类型</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style scoped>
.menu{
    position: fixed;
    z-index: 10;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    transition: display 0s;
}
</style>
