import { createStore } from 'vuex'

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: false,
    login: false,
    accountName: 'Entegrasyon Yönetim Paneli',
    showConfig: false,
    sidebarType: 'bg-dark',
    isRTL: false,
    mcolor: '',
    darkMode: sessionStorage.getItem('darkMode') === 'true',
    isNavFixed: true,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: false,
    showMain: true,
    layout: 'default',
  },
  getters: {},
  mutations: {
    navbarMinimize(state) {
      const sidenav_show = document.querySelector('.g-sidenav-show')

      if (sidenav_show.classList.contains('g-sidenav-hidden')) {
        sidenav_show.classList.remove('g-sidenav-hidden')
        sidenav_show.classList.add('g-sidenav-pinned')
        state.isPinned = true
      } else {
        sidenav_show.classList.add('g-sidenav-hidden')
        sidenav_show.classList.remove('g-sidenav-pinned')
        state.isPinned = false
      }
    },
    sidebarType(state, payload) {
      state.sidebarType = payload
    },
    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true
      } else {
        state.isNavFixed = false
      }
    },
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit('sidebarType', payload)
    },
  },
  modules: {},
})
