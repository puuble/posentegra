<template>
  <div v-show="this.$store.state.login" class="py-6 container-fluid">
    <div class="row">
      <div class="col-12">
        <order-list :data="data" :restaurantCount="1" />
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
      stats: {
        titleColor: 'opacity-7 text-white',
        descColor: 'text-white',
        trip: {
          title: "Today's Trip",
          desc: '145 KM',
          classIcon: 'text-dark ni ni-money-coins',
        },
        health: {
          title: 'Battery Health',
          desc: '99 %',
          classIcon: 'text-dark ni ni-controller ',
        },
        speed: {
          title: 'Average Speed',
          desc: '56 Km/h',
          classIcon: 'text-dark ni ni-delivery-fast',
        },
        volume: {
          title: 'Music Volume',
          desc: '15/100',
          classIcon: 'text-dark ni ni-note-03',
        },
      },
    }
  },
  created() {
    // Get the darkMode flag from session storage
    const isDarkModeOn = sessionStorage.getItem('darkMode') === 'true'

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
