interface historyEvent extends Event {
     stateInfo: any
}

/**
 * 重写history的pushState和replaceState
 * @param action pushState|replaceState
 * @return {function(): *}
 */
function wrapState(action) {
    // 获取原始定义
    const raw = history[action];
    return function (...args) {
        // 更新前的 url
        const urlBefore = window.location.href;
        // 经过包装的pushState或replaceState
        const wrapper = raw.apply(this, args);
        // 更新后的 url
        const urlAfter = window.location.href;
        if(urlBefore === urlAfter) {
            return;
        }

        // 定义名为action的事件
        const e = new Event(action) as historyEvent;

        // 将调用pushState或replaceState时的参数作为stateInfo属性放到事件参数event上
        e.stateInfo = args;
        // 调用pushState或replaceState时触发该事件
        window.dispatchEvent(e);
        return wrapper;
    };
}

export const historyWatch = (pushStateCallback?:(stateInfo)=>void, replaceStateCallback?:(stateInfo)=>void)=>{

    // 修改原始定义
    history.pushState = wrapState('pushState');
    history.replaceState = wrapState('replaceState');

    // 监听自定义的事件
    pushStateCallback && window.addEventListener('pushState', function (e) {
        pushStateCallback((<historyEvent>e).stateInfo);
    });
    replaceStateCallback && window.addEventListener('replaceState', function (e) {
        replaceStateCallback((<historyEvent>e).stateInfo);
    });
};