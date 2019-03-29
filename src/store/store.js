import Vue from 'vue';
import Vuex from 'vuex';

import taskrelated from './modules/taskrelated';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        taskrelated
    }
});