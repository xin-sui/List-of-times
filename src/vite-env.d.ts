/// <reference types="vite/client" />
declare module 'parallax-js' {
    const Parallax: any;
    export default Parallax;
}
declare module "*.vue" {
    import type { DefineComponent } from "vue";

    const vueComponent: DefineComponent<{}, {}, any>;

    export default vueComponent;
}