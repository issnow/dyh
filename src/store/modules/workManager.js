export default {
  namespaced: true,
  state: {
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