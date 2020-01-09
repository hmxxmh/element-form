
class KVue {
    constructor(options) {
        this.$options = options;
        this.$data = options.data;
        this.observe(this.$data);

        new Compile(options.el, this);
    }

    observe(value) {
        if(!value || typeof value !== 'object') {
            return;
        }

        // 遍历该对象
        Object.keys(value).forEach(key => {
            this.defineReactive(value, key, value[key]);
        })
    }

    // 数据响应化
    defineReactive(obj, key, val) {
        this.observe(val);

        const dep = new Dep();

        Object.defineProperty(obj, key, {
            get: function() {
                Dep.target && dep.addDep(Dep.target);
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();
                // console.log(`${key}属性值更新了：${val}`);
            }
        })
    }
}

// Dep: 用来管理watcher
class Dep {
    constructor() {
        // 这里存放若干依赖（watcher)
        this.deps = [];
    }

    addDep(dep) {
        this.deps.push(dep);
    }

    notify() {
        this.deps.forEach(dep => dep.update());
    }
}

// watcher
class Watcher {
    constructor() {
        // 将当前watcher实例制定到Dep静态属性target
        Dep.target = this;
    }

    update() {
        console.log('属性更新了');
    }
}