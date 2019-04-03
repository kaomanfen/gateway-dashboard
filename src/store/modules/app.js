import { getGroupSelect, getAppSelect, setSelect } from '@/utils/select'
import logo from '@/assets/images/logo-100.png'
const app = {
  state: {
    sidebar: {
      selected: getGroupSelect()
    },
    app: {
      selected: getAppSelect()
    },
    device: 'desktop',
    logo: logo
  },
  mutations: {
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SELECTED_SIDERBAR: (state, key) => {
      setSelect('groupSelect', key)
      state.sidebar.selected = key
    },
    SELECTED_APP: (state, key) => {
      setSelect('appSelect', key)
      state.app.selected = key
    }
  },
  actions: {
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    selectedSidebar({ commit }, key) {
      commit('SELECTED_SIDERBAR', key)
    },
    selectedApp({ commit }, key) {
      commit('SELECTED_APP', key)
    }
  }
}

export default app
