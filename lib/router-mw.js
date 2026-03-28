import { defineRouter, lazy } from 'alemonjs';

var routerMw = defineRouter([
    {
        handler: lazy(() => import('./middleware/mw.js'))
    }
]);

export { routerMw as default };
