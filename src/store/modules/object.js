const object = {
  state: {
    baseInfo: {},
    env: {},
    active: 0
  },
  mutations: {
    EDIT_OBJ_BASEINFO: (state, baseInfo) => {
      state.baseInfo = baseInfo
    },
    EDIT_OBJ_ENV: (state, env) => {
      state.env = env
    },
    STEPS_ACTIVE: (state, active) => {
      state.active = active
    }
  },
  actions: {
    EditObjBaseInfo({ commit }, baseInfo) {
      commit('EDIT_OBJ_BASEINFO', baseInfo)
    },
    EditObjEnv({ commit }, env) {
      commit('EDIT_OBJ_ENV', env)
    },
    StepsActive({ commit }, active) {
      commit('STEPS_ACTIVE', active)
    }

  }
}

export default object
