<template>
  <div class="table-responsive">
    <table class="table table-striped">
      <thead
        class="border-b"
        :class="this.$store.state.darkMode ? 'bg-dark' : 'bg-white'"
      >
        <tr>
          <th scope="col" class="text-sm font-medium px-6 py-4 text-center">
            Ürün
          </th>
          <th scope="col" class="text-sm font-medium px-6 py-4 text-center">
            Fiyat
          </th>
          <th scope="col" class="text-sm font-medium px-6 py-4 text-center">
            Adet
          </th>
          <th
            scope="col"
            class="text-sm font-medium text-gray-900 px-6 py-4 text-center"
          >
            Tutar
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>
            {{ product.name.tr }}
            <ol class="list-group w-100">
              <li
                v-for="cat in product.optionCategories"
                :key="cat.id"
                class="list-group-item"
              >
                <div v-if="product.name.tr != cat.name.tr">
                  {{ cat.name.tr }}
                  <ol class="list-group list-group-numbered w-100">
                    <li
                      v-for="(opt, ky) in cat.options"
                      :key="ky"
                      class="list-group-item"
                    >
                      {{ opt.name.tr }}
                    </li>
                  </ol>
                </div>
                <div v-else>
                  <ol class="list-group w-100">
                    <li
                      v-for="(opt, ky) in cat.options"
                      :key="ky"
                      class="list-group-item"
                    >
                      {{ opt.name.tr }}
                    </li>
                  </ol>
                </div>
              </li>
            </ol>
          </td>
          <td class="text-center">{{ getFloat(product.priceWithOption) }}</td>
          <td class="text-center">{{ product.count }}</td>
          <td class="text-end">{{ getFloat(product.totalPriceWithOption) }}</td>
        </tr>
        <tr :class="this.$store.state.darkMode ? 'bg-secondary' : 'bg-gray'">
          <td colspan="3" class="text-end">Ara Toplam:</td>
          <td class="text-end">
            {{ getFloat(order.totalPrice) }}
          </td>
        </tr>
        <tr
          v-show="order.totalDiscount > 0"
          :class="this.$store.state.darkMode ? 'bg-secondary' : 'bg-gray'"
        >
          <td colspan="3" class="text-end">İndirim:</td>
          <td class="text-end">
            {{ getFloat(order.totalDiscount) }}
          </td>
        </tr>
        <tr :class="this.$store.state.darkMode ? 'bg-secondary' : 'bg-gray'">
          <td colspan="3" class="text-end">Toplam:</td>
          <td class="text-end">
            {{ getTotal(order) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <p>
        <b>Müşteri:</b>
        <span>{{ client.name }}</span>
      </p>

      <p v-show="deliveryAddress.address != 'null'">
        <b>Adres:</b>
        <span>
          {{ deliveryAddress.address }}
        </span>
      </p>
      <p v-show="deliveryAddress.aptNo != 'null'">
        <b>Apt No:</b>
        <span>
          {{ deliveryAddress.aptNo }}
        </span>
      </p>

      <p v-show="deliveryAddress.doorNo != 'null'">
        <b>Daire No:</b>
        <span> {{ deliveryAddress.doorNo }} </span>
      </p>

      <p v-show="deliveryAddress.floor != 'null'">
        <b>Kat:</b>
        <span>
          {{ deliveryAddress.floor }}
        </span>
      </p>

      <p v-show="deliveryAddress.description != 'null'">
        <b>Adres Tarifi:</b>
        <span>
          {{ deliveryAddress.description }}
        </span>
      </p>
      <p v-show="client.clientPhoneNumber != 'null'">
        <b>Müşteri İletişim:</b>
        <span>
          {{ client.clientPhoneNumber }}
        </span>
      </p>
    </div>
  </div>
</template>
<style scoped>
.modal-header {
  background-color: #007bff;
  color: #fff;
}
.bg-gray {
  background-color: #e0e2e3;
}
.table-striped > tbody > tr:nth-of-type(odd) > * {
  color: inherit;
}
</style>

<script>
export default {
  name: 'ModalPanel',
  props: {
    order: {
      type: Object,
      required: true,
    },
    client: {
      type: Object,
      required: true,
    },
    deliveryAddress: {
      type: Object,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getFloat(number) {
      return parseFloat(number).toFixed(2)
    },
    getTotal(order) {
      if (order.totalDiscountedPrice > 0) {
        return parseFloat(order.totalDiscountedPrice).toFixed(2)
      } else {
        return parseFloat(order.totalPrice).toFixed(2)
      }
    },
  },
}
</script>
