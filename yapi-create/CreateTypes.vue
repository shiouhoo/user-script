<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';

const btnRef = ref<HTMLElement>();

const type = ref<'request' | 'response'>('request');
const msgMap = {
    request: '请求参数',
    response: '返回数据',
};

/** 用于记录字段td在tr中的位置 */
const responsetableIndex = {
    name: -1,
    type: -1,
    required: -1,
    description: -1,
    other: -1,
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

/**
 * 获取返回类型
 * @param panel html节点
 * @param level 递归层级
 * @param tab tab空格的数量
 */
function getResponseTypes(panel: Element | null | undefined, level = 0, tab = 0): string {
    // TODO 用字符串拼接，为了注解，后续考虑用对象拼接
    let obj = '{\r\n';
    // 右键复制时，list会为空列表
    let trList = Array.from(panel?.querySelectorAll(` tr.ant-table-row-level-${level}`) || []);
    let isCanReturnType = false;
    if((!trList || !trList.length) && level === 0) {
        trList = [<Element>panel];
        // 只有右键复制才会为true
        isCanReturnType = true;
        const match = panel?.className.match(/ant-table-row-level-(\d+)/);
        if(match) {
            level = parseInt(match[1]);
        }
        panel = panel?.parentElement;
    }
    if((!trList || !trList.length) && level !== 0) {
        return '{}';
    }
    for(let tr of trList) {
        const name = tr.querySelector(`td:nth-child(${responsetableIndex.name})`)?.textContent;
        let type = tr.querySelector(`td:nth-child(${responsetableIndex.type})`)?.textContent?.replaceAll(' ', '');
        if (type === 'integer') {
            type = 'number';
            isCanReturnType = false;
        } else if (type === 'object') {
            // 当可以直接返回时，不需要加空格,因为会直接返回类型
            type = getResponseTypes(panel, level + 1, isCanReturnType ? tab : tab + 1);
        } else if (type === 'object[]') {
            type = getResponseTypes(panel, level + 1, isCanReturnType ? tab : tab + 1) + '[]';
        }else{
            isCanReturnType = false;
        }
        // 是否为枚举
        const otherInfoDom = tr.querySelector(`td:nth-child(${responsetableIndex.other})`);
        if(otherInfoDom?.textContent?.includes('枚举')) {
            let enumString = '';
            const pNodeList = otherInfoDom.querySelectorAll('p');
            for(const pNode of Array.from(pNodeList)) {
                if(pNode.textContent?.includes('枚举')) {
                    let txt = pNode.lastChild?.textContent || '';
                    for(let item of txt.split(',')) {
                        if(Number.isNaN(Number(item))) {
                            enumString += `'${item.trim()}' | `;
                        }else{
                            enumString += `${item.trim()} | `;
                        }
                    }
                    enumString = enumString.slice(0, -3) || type || '';
                    break;
                }
            }
            type = enumString;
        }
        // 当名称为空时，说明是入口，直接返回
        // 或者是右键复制时类型是对象 || 数组，直接返回
        if (!name || isCanReturnType) {
            return type || '';
        }
        let description = tr.querySelector(`td:nth-child(${responsetableIndex.description})`)?.textContent;
        const tabString = '    '.repeat(tab + 1);

        const required = tr.querySelector(`td:nth-child(${responsetableIndex.required})`)?.textContent?.trim() === '必须';
        // 注解
        const descEnter = description?.includes('\n') ? `\r\n${tabString}` : ' ';
        description = description?.trim() ? `${tabString}/** ${description.replaceAll('\n', `\n${tabString} * `)}${descEnter} */\r\n` : '';
        const item = `${description}${tabString}${name}${required ? '' : '?'}: ${type};\r\n`;
        obj += item;
    }
    obj += `${'    '.repeat(tab)}}`;
    return obj;
}

const handleClick = () => {

    let panel = btnRef.value?.parentElement?.parentElement?.nextElementSibling;
    let obj = '{\r\n';
    // 保证顺序正确
    panel?.querySelectorAll('.ant-table-body .ant-table-thead tr th').forEach((item, index) => {
        if (item.textContent?.includes('名称')) {
            responsetableIndex.name = index + 1;
        } else if (item.textContent?.includes('类型')) {
            responsetableIndex.type = index + 1;
        } else if (item.textContent?.includes('是否必须')) {
            responsetableIndex.required = index + 1;
        } else if (item.textContent?.includes('备注')) {
            responsetableIndex.description = index + 1;
        }else if (item.textContent?.includes('其他')) {
            responsetableIndex.other = index + 1;
        }
    });
    if (type.value === 'request') {
        const trList = panel?.querySelectorAll('.ant-table-body table tbody tr');
        Array.from(trList || []).forEach((tr) => {
            const name = tr.querySelector(`td:nth-child(${responsetableIndex.name})`)?.textContent || '';
            let type = tr.querySelector(`td:nth-child(${responsetableIndex.type})`)?.textContent || 'any';
            if (type?.includes('文本')) {
                type = 'string';
            }
            const required = tr.querySelector(`td:nth-child(${responsetableIndex.required})`)?.textContent?.includes('是');

            let description = tr.querySelector(`td:nth-child(${responsetableIndex.description})`)?.textContent;
            const descBeforeEnter = description?.includes('\n') ? '\r\n      * ' : ' ';
            const descEnter = description?.includes('\n') ? '\r\n      ' : ' ';
            description = description?.trim() ? `    /**${descBeforeEnter}${description?.replaceAll('\n', '\n      * ')}${descEnter}*/\r\n` : '';
            const item = `${description}    ${name}${required ? '' : '?'}: ${type};\r\n`;
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
        type.value = 'response';
        let tableDom = btnRef.value?.parentElement?.parentElement?.nextElementSibling?.querySelector('.ant-table-tbody');
        tableDom?.querySelectorAll('tr').forEach((item)=>{
            modifyDom(item.firstChild as Node);
        });
        let observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    const target = mutation.addedNodes[0];
                    if(!target) return;
                    modifyDom(target.firstChild as Node);
                }
            }
        });
        tableDom && observer.observe(tableDom, {
            childList: true,
            subtree: true,
        });
        onBeforeUnmount(()=>{
            observer.disconnect();
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
