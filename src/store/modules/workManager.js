export default {
  namespaced: true,
  state: {
    // 成品
    params1: null,
    page1: {},
    // 作品
    params2: null,
    page2: {},
    entityList: [],
    form: {
      desc: "",
      label: "",
      // thing0: "",
      // thing1: "",
      // thing2: "",
    },
    rules: {
      desc: [{
          required: true,
          message: "请输入",
          trigger: "blur"
        },
        // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
      ],
      label: [{
          required: true,
          message: "请输入",
          trigger: "blur"
        },
        // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
      ],
    },
  },
  mutations: {
    setP1(state, p) {
      state.params1 = p
    },
    setPage1(state, p) {
      state.page1 = p
    },
    resetP1(state) {
      state.params1 = null
    },
    setP2(state, p) {
      state.params2 = p
    },
    setPage2(state, p) {
      state.page2 = p
    },
    resetP2(state) {
      state.params2 = null
    },
    getEntityList(state, payload) {
      console.log(state, 'form0');
      state.entityList = payload
    },
    setOpt(state, {
      id,
      option
    }) {
      state.entityList.forEach(e => {
        if (e.id == id) {
          e.option = option
        }
      })
    },
    setFormAndRule(state, payload) {
      console.log(state.form, 'form');
      payload.forEach((e, i) => {
        state.form['thing' + i] = ''
        state.rules["thing" + i] = {
          required: true,
          message: "请输入",
          trigger: "blur",
        };
      })

    }
  },
  actions: {}
}