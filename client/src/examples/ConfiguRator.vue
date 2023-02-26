<template>
  <div>
    <div
      class="d-flex align-items-center"
      :class="
        loading
          ? 'd-block'
          : 'd-none' || this.$store.state.darkMode
          ? 'text-white'
          : 'text-dark'
      "
    >
      <strong>Yükleniyor Lütfen Bekleyiniz</strong>
      <div
        class="spinner-border ms-auto"
        role="status"
        aria-hidden="true"
      ></div>
    </div>
    <OptionList
      v-show="providers.length > 0"
      v-for="option in providers"
      :key="option.providerId"
      :option="option"
    />
  </div>
</template>
<style>
.form-switch .form-check-input:checked:after {
  transform: translateX(42px) !important;
}

.form-switch .form-check-input:after {
  width: 2rem !important;
  height: 2rem !important;
}
.form-switch .form-check-input {
  width: 5rem !important;
  height: 2.25em !important;
}
</style>
<script>
import { mapMutations } from 'vuex'
import OptionList from '../components/OptionList.vue'
export default {
  name: 'ConfiguRator',
  props: ['toggle', 'providers', 'loading'],
  components: {
    OptionList,
  },

  methods: {
    ...mapMutations(['navbarMinimize', 'sidebarType', 'navbarFixed']),
    sidebarColor(color = 'success') {
      document.querySelector('#sidenav-main').setAttribute('data-color', color)
      this.$store.state.mcolor = `card-background-mask-${color}`
    },
    sidebarType(type) {
      this.$store.state.sidebarType = type
    },
    setNavbarFixed() {
      if (
        this.$route.name !== 'Profile' ||
        this.$route.name !== 'All Projects'
      ) {
        this.$store.state.isNavFixed = !this.$store.state.isNavFixed
      }
    },

    sidenavTypeOnResize() {},
  },
  computed: {
    sidenavResponsive() {
      return this.sidenavTypeOnResize
    },
  },
  beforeMount() {
    this.$store.state.isTransparent = 'bg-transparent'
    window.addEventListener('resize', this.sidenavTypeOnResize)
    window.addEventListener('load', this.sidenavTypeOnResize)
  },
}
</script>
