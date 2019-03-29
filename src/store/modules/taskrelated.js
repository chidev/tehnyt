const state = {
    taskList: [
        {
            taskName: "1: flagged and next",
            indent: 0,
            done: false,
            startDate: "2018-11-10",
            dueDate: "2018-11-10",
            completedDate: null,
            flagged: false,
            forceNext: true,
            isNext: true,
            notDroppable: false,
            tags: [],
            importance: 0,
            id: 435353245,
            taskIndexInMainList: null
        },
        {
            taskName: "2: Has flag",
            indent: 0,
            done: false,
            startDate: "2018-11-10",
            dueDate: "2018-11-18",
            completedDate: null,
            flagged: true,
            forceNext: false,
            isNext: false,
            notDroppable: false,
            tags: ["Hello"],
            importance: 0,
            id: 245325432543253,
            taskIndexInMainList: null
        },
        {
            taskName: "3: I have 2 children",
            indent: 0,
            done: false,
            startDate: "2018-11-10",
            dueDate: "2018-11-25",
            completedDate: null,
            flagged: false,
            forceNext: false,
            isNext: false,
            notDroppable: false,
            tags: [],
            importance: 0,
            id: 423525435534,
            taskIndexInMainList: null
        },
        {
            taskName: "3.1 Child uno",
            indent: 1,
            done: false,
            startDate: "2018-11-10",
            dueDate: "2018-11-25",
            completedDate: null,
            flagged: false,
            forceNext: false,
            isNext: false,
            notDroppable: false,
            tags: [],
            importance: 0,
            id: 9234823432,
            taskIndexInMainList: null
        },
        {
            taskName: "3.2 Child due",
            indent: 1,
            done: false,
            startDate: "2018-11-10",
            dueDate: "2018-11-28",
            completedDate: null,
            flagged: false,
            forceNext: false,
            isNext: false,
            notDroppable: false,
            tags: [],
            importance: 0,
            id: 92384324832,
            taskIndexInMainList: null
        },
        {
            taskName: "4. I have 2 children",
            indent: 0,
            done: false,
            startDate: "2018-11-10",
            dueDate: "2018-12-02",
            completedDate: null,
            flagged: false,
            forceNext: false,
            isNext: false,
            notDroppable: false,
            tags: [],
            importance: 0,
            id: 235436546456,
            taskIndexInMainList: null
        },
        {
            taskName: "4.1 Child uno",
            indent: 1,
            done: false,
            startDate: "2018-11-10",
            dueDate: "2018-12-18",
            completedDate: null,
            flagged: false,
            forceNext: false,
            isNext: false,
            notDroppable: false,
            tags: ["Work", "Family", "Friends", "Home", "Evening"],
            importance: 0,
            id: 5262562456234,
            taskIndexInMainList: null
        },
        {
            taskName: "4.2 Child with tags",
            indent: 1,
            done: false,
            startDate: "2018-11-10",
            dueDate: "2019-01-18",
            completedDate: null,
            flagged: false,
            forceNext: false,
            isNext: false,
            notDroppable: false,
            tags: ["Work", "Family", "Friends", "Home", "Evening"],
            importance: 0,
            id: 5243549484874,
            taskIndexInMainList: null
        },
        {
            taskName: "5 indent",
            indent: 0,
            done: false,
            startDate: "2018-11-10",
            dueDate: "2018-11-05",
            completedDate: null,
            flagged: false,
            forceNext: false,
            isNext: false,
            notDroppable: false,
            tags: [],
            importance: 0,
            id: 4329324222393,
            taskIndexInMainList: null
        },
        {
            taskName: "6 Future start",
            indent: 0,
            done: false,
            startDate: "2019-11-10",
            dueDate: "2018-11-05",
            completedDate: null,
            flagged: false,
            forceNext: false,
            isNext: false,
            notDroppable: false,
            tags: [],
            importance: 0,
            id: 432932482393,
            taskIndexInMainList: null
        },
        {
            taskName: "7 done",
            indent: 0,
            done: true,
            startDate: "2018-11-10",
            dueDate: "2018-11-05",
            completedDate: null,
            flagged: false,
            forceNext: false,
            isNext: false,
            notDroppable: false,
            tags: [],
            importance: 0,
            id: 432932482333,
            taskIndexInMainList: null
        }
    ],
    activeTask: 5
};

const getters = {
    taskList: state => {
        return state.taskList
    },
    activeTask: state => {
        return state.activeTask
    }
}

const mutations = {
    SET_ACTIVE_TASK(state, taskindex) {
        state.activeTask = taskindex
    },
    SET_TASK_NAME(state, payload) {
        state.taskList[payload[0]].taskName = payload[1]
    },
    UPDATE_A_TASK(state, payload) {
        state.taskList[payload[0]][payload[1]] = payload[2] // 0 = index, 1=key, 2=value
    }
}

export default {
    state,
    getters,
    mutations
}