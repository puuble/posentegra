<template>
  <div v-show="this.$store.state.login" class="py-6 container-fluid">
    <div class="row">
      <div class="col-12">
        <order-list :data="data" :restaurantCount="2" />
      </div>
    </div>
  </div>
</template>

<script>
import OrderList from './components/OrderList.vue'

export default {
  name: 'TableList',
  components: {
    OrderList,
  },
  data() {
    return {
      data: [],
      stats: {},
    }
  },
  created() {
    // Get the darkMode flag from session storage
    const isDarkModeOn = window.localStorage.getItem('darkMode') === 'true'

    // Set the isDarkMode data property to the value from session storage
    this.$store.state.darkMode = isDarkModeOn
  },
  async mounted() {
    let result = await fetch('/api/ajax/getOrders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    if (result) {
      this.data = await result.json()
    }
  },
}
</script>
