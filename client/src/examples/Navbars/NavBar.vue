<template>
  <nav
    class="navbar navbar-main navbar-expand-lg shadow-none"
    :class="
      this.$store.state.isRTL ? 'top-0 position-sticky z-index-sticky' : ''
    "
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <BreadCrumb :currentPage="currentRouteName" textWhite="text-white" />

      <div
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="this.$store.state.isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar"
      >
        <div
          class="pe-md-3 d-flex align-items-center"
          :class="this.$store.state.isRTL ? 'me-md-auto' : 'ms-md-auto'"
        >
          <div class="form-check form-switch ps-0 ms-auto my-auto">
            <input
              class="form-check-input mt-1 ms-auto"
              type="checkbox"
              :checked="this.$store.state.darkMode"
              @click="setDarkMode"
            />
          </div>
        </div>
        <ul class="navbar-nav justify-content-end">
          <li class="px-3 nav-item d-flex align-items-center">
            <a
              class="p-0 nav-link"
              :class="this.$store.state.darkMode ? 'text-white' : 'text-dark'"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas"
              aria-controls="offcanvas"
              @click="toggleConfigurator(this.$store.state.showConfig)"
            >
              <i
                class="cursor-pointer fa-3x fa fa-cog fixed-plugin-button-nav"
              ></i>
            </a>
          </li>
          <li
            class="nav-item dropdown d-flex align-items-center"
            :class="this.$store.state.isRTL ? 'ps-2' : 'pe-2'"
          >
            <a
              href="#"
              class="p-0 nav-link"
              :class="
                [showMenu ? 'show' : ''] && this.$store.state.darkMode
                  ? 'text-white'
                  : 'text-dark'
              "
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click="showMenu = !showMenu"
            >
              <i class="cursor-pointer fa-3x fa fa-bell"></i>
            </a>
            <ul
              class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4"
              :class="showMenu ? 'show' : ''"
              aria-labelledby="dropdownMenuButton"
            >
              <li v-show="notifications.length > 0" class="mb-2">
                <a class="dropdown-item border-radius-md" href="javascript:;">
                  <div class="py-1 d-flex">
                    <div class="my-auto">
                      <img
                        src="../../assets/img/team-2.jpg"
                        class="avatar avatar-sm me-3"
                        alt="user image"
                      />
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-1 text-sm font-weight-normal">
                        <span class="font-weight-bold">New message</span> from
                        Laur
                      </h6>
                      <p class="mb-0 text-xs text-secondary">
                        <i class="fa fa-clock me-1"></i>
                        13 minutes ago
                      </p>
                    </div>
                  </div>
                </a>
              </li>
              <li class="mb-2">Bildirim Yok</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import { activateDarkMode, deactivateDarkMode } from '@/assets/js/dark-mode'
import { mapMutations, mapActions } from 'vuex'
import BreadCrumb from '../BreadCrumb.vue'
export default {
  name: 'NavBar',
  data() {
    return {
      showMenu: false,
      notifications: [],
    }
  },
  props: ['minNav', 'textWhite', 'toggleConfigurator'],
  created() {
    this.minNav
    const isDarkModeOn = window.localStorage.getItem('darkMode') === 'true'
    this.$store.state.darkMode = isDarkModeOn
    if (isDarkModeOn) {
      activateDarkMode()
    } else {
      deactivateDarkMode()
    }
  },
  methods: {
    ...mapMutations(['navbarMinimize']),
    ...mapActions(['toggleSidebarColor']),

    setDarkMode() {
      if (this.$store.state.darkMode) {
        this.$store.state.darkMode = false
        this.$store.state.sidebarType = 'bg-white'
        window.localStorage.setItem('darkMode', false)
        deactivateDarkMode()
        return
      } else {
        this.$store.state.darkMode = true
        this.$store.state.sidebarType = 'bg-default'
        window.localStorage.setItem('darkMode', true)
        activateDarkMode()
      }
    },

    toggleSidebar() {
      this.toggleSidebarColor('bg-white')
      this.navbarMinimize()
    },
  },
  components: {
    BreadCrumb,
  },
  computed: {
    currentRouteName() {
      return this.$store.state.accountName
    },
  },
}
</script>
