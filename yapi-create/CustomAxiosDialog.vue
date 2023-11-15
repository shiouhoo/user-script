<script setup lang="ts">
import { inject, ref, Ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
const dialogVisible = inject<Ref<boolean>>('dialogVisible')!;
let tempalte = GM_getValue('customAxiosTemplate', '');

if(!tempalte) {
    tempalte = `/** \${describtion} */
export const \${name} = (params: any): Promise<any> => {
    return axios.\${method}('\${url}', \${method === 'get' ? '{ params }' : 'params'});
};`;
}

const customAxiosTemplate = ref(tempalte);

watch(dialogVisible, (val) => {
    if(!val) {
        GM_setValue('customAxiosTemplate', customAxiosTemplate.value);
        ElMessage.success('保存成功');
        dialogVisible.value = false;
    }
});

</script>

<template>
    <el-dialog v-model="dialogVisible" title="自定义axios模版">
        <p>在下方输入框中输入你的axios模版，采用es6的模版方式解析，提供了4个变量，describtion，name，method，url ：</p>
        <el-input
            spellcheck="false"
            class="input"
            v-model="customAxiosTemplate"
            :autosize="{ minRows: 10, maxRows: 20 }"
            type="textarea"
            placeholder="/** ${describtion} */
export const ${name} = (params: any): Promise<any> => {
    return axios.${method}('${url}', ${method === 'get' ? '{ params }' : 'params'});
};"
        />
    </el-dialog>
</template>

<style scoped>
.input{
    margin-top: 20px;
}
.confirm{
    margin: 20px auto;
    display: block;
}
</style>
