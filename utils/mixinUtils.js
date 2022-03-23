// 原生属性及方法
const originProperties = ['data', 'properties', 'options']
const originMethods = [
    'onLoad',
    'onShow',
    'onReady',
    'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onShareAppMessage',
    'onPageScroll',
    'onResize',
    'onTabItemTap'
]

// merge方法
function mergeMixin (mixins, options) {
    mixins.forEach(mixin => {
        // 检查 mixin 数据类型
        if(Object.prototype.toString.call(mixin) !== '[object Object]') {
            throw new Error('mixin is not object')
        }
        for (const [key, value] of Object.entries(mixin)) {
          // debugger
            if (originProperties.includes(key)) {
                // 混入属性
                options[key] = {...value, ...options[key]}
            } else if (originMethods.includes(key)) {
                // 混入方法
                const originFunc = options[key];
                // debugger
                options[key] = function(...arg) {
                    // debugger
                    value.call(this, ...arg);//mixin方法
                    // debugger
                    originFunc && originFunc.call(this, ...arg);//
                    // debugger
                }
            } else {
                // 混入其他自定义方法
                options = { ...mixin, ...options }
            }
        }
    });
    return options
}

export default function (options = {}) {
    if (Array.isArray(options.mixins)) {
        options = mergeMixin(options.mixins, options)
    }
    delete options.mixins
    return Page(
        options
    )
}