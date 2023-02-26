<template>
  <div
    v-show="this.$store.state.layout === 'landing' && this.$store.state.login"
    class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
  ></div>

  <main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
  >
    <!-- nav -->

    <NavBar
      v-show="this.$store.state.showNavbar"
      :class="[navClasses]"
      :textWhite="
        this.$store.state.isAbsolute ? 'text-white opacity-8' : 'text-white'
      "
      :minNav="navbarMinimize"
      :toggleConfigurator="toggleConfigurator"
      v-if="this.$store.state.showNavbar"
    />

    <offcanvas-menu
      :toggle="toggleConfigurator"
      :providers="providers"
      :loading="loading"
    />
    <router-view></router-view>
  </main>
</template>

<script>
import NavBar from '@/examples/Navbars/NavBar.vue'
import OffcanvasMenu from '@/components/OffcanvasMenu.vue'
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  components: {
    NavBar,
    OffcanvasMenu,
  },
  data: () => ({
    login: false,
    loading: true,
    providers: [],
    orders: [
      { id: 1, date: '2022-02-20', customer: 'John Doe', total: 100 },
      { id: 2, date: '2022-02-21', customer: 'Jane Smith', total: 200 },
      { id: 3, date: '2022-02-22', customer: 'Bob Johnson', total: 150 },
    ],
  }),
  computed: {
    navClasses() {
      console.log(this.$store.state.isNavFixed, this.$store.state.darkMode)
      return {
        'position-fixed w-100 bg-white text-gray-800 left-auto  z-index-sticky':
          this.$store.state.isNavFixed && !this.$store.state.darkMode,
        'position-fixed w-100 bg-default left-auto   z-index-sticky':
          this.$store.state.isNavFixed && this.$store.state.darkMode,
        'position-absolute z-index-sticky  w-100  z-index-2':
          this.$store.state.isAbsolute,
      }
    },
  },
  beforeMount() {
    this.$store.state.isTransparent = 'bg-transparent'
  },
  created() {
    // Get the darkMode flag from session storage
    const isDarkModeOn = sessionStorage.getItem('darkMode') === 'true'

    // Set the isDarkMode data property to the value from session storage
    this.$store.state.darkMode = isDarkModeOn
  },
  async mounted() {
    let url = '/api/ajax/login'
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          return []
        } else {
          let result = await response.json()
          console.log(result)
          if (result.success) {
            this.$store.state.login = true
            await this.listOrders()
          } else {
            this.$store.state.login = false
            this.$router.push('/login')
          }
        }
      })
      .catch(() => {})
  },
  methods: {
    ...mapMutations(['navbarMinimize']),
    toggleConfigurator(showConfig) {
      this.$store.state.showConfig = !showConfig
      this.loading = true
      if (!showConfig) {
        let url = '/api/ajax/getProviders'
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }).then(async (response) => {
          const res = await response.json()
          this.loading = false
          this.providers = res.data.restaurants
        })
      }
    },
    async listOrders() {
      return []
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
