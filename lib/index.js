import router from './router.js';

var index = defineChildren({
    register() {
        return {
            responseRouter: router
        };
    },
    onCreated() {
        logger.info('mihoyo服务');
    }
});

export { index as default };
