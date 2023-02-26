<template>
  <div class="p-0 card-body" style="overflow-y: auto">
    <ul class="list-group m-0">
      <li class="list-group-item m-0">
        <div class="mb-3">
          <h6 class="mb-0">{{ option.restaurantName }}</h6>
        </div>
        <ul class="list-group">
          <li
            class="list-group-item m-0"
            v-for="subOption in option.options"
            :key="subOption.providerId"
          >
            <div class="mb-3">
              <h6 class="mb-0">{{ subOption.name }}</h6>
            </div>
            <ul class="list-group">
              <li>
                <div>
                  <div class="mt-3 text-left d-flex" style="text-align: left">
                    <div>
                      <h6 class="mb-0">Restoran Durumu</h6>
                      <p
                        class="text-sm w-100"
                        :class="
                          subOption.status ? 'text-success' : 'text-danger'
                        "
                      >
                        {{ subOption.status ? 'Açık' : 'Kapalı' }}
                      </p>
                    </div>

                    <div class="form-check form-switch ps-0 ms-auto my-auto">
                      <input
                        class="mt-1 ms-auto form-check-input"
                        type="checkbox"
                        id="navbarFixed"
                        :checked="subOption.status"
                        @click="
                          updateRestaurant(
                            subOption.status,
                            subOption.providerId,
                            'status'
                          )
                        "
                      />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <!-- Navbar Fixed -->
    <!-- Navbar Fixed -->

    <hr class="horizontal dark my-2" />
  </div>
</template>
<style scoped>
.form-switch .form-check-input:checked {
  border-color: #10b36d;
  background-color: #0c8d56;
}
</style>
<script>
export default {
  name: 'OrderList',
  props: {
    option: {
      type: Object,
      required: true,
    },
  },
  methods: {
    updateRestaurant(on, provider, field) {
      fetch('/ajax/updateRestaurantStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          provider,
          on,
          field,
        }),
      }).then(async (response) => {
        const res = await response.json()
        console.log(res)
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
