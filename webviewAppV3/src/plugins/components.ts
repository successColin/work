const modules = import.meta.globEager('../components/*/*.vue');

export default {
    install(app) {
        Object.keys(modules).forEach(componentPath => {
            // 获取遍历的当前组件实例对象
            let curComponent = modules[componentPath]?.default;
            console.log(curComponent.name, curComponent)
            app.component(curComponent.name, curComponent);
        });
    }
}


