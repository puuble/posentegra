<template>
  <div class="card">
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0" style="overflow-y: hidden">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-secondary text-sm font-weight-bolder col-md-1">
                Restoran
              </th>
              <th
                class="text-secondary text-sm font-weight-bolder col-md-2 ps-2"
              >
                Saat
              </th>
              <th
                class="text-secondary text-sm font-weight-bolder col-md-2 ps-2"
              >
                Müşteri
              </th>
              <th
                class="text-secondary text-sm font-weight-bolder col-md-1 ps-2"
              >
                Adisyon No
              </th>
              <th
                class="text-secondary text-sm font-weight-bolder col-md-1 ps-2"
              >
                Sipariş No
              </th>
              <th
                class="text-secondary text-sm font-weight-bolder col-md-3 ps-2"
              >
                Bölge
              </th>
              <th
                class="text-secondary text-sm font-weight-bolder col-md-2 ps-2"
              >
                Tutar
              </th>
              <th
                class="text-center text-secondary text-sm col-md-1 font-weight-bolder"
              >
                Durum
              </th>
              <th class="text-center text-secondary text-sm font-weight-bolder">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in data" :key="order.id">
              <td>
                <div
                  class="px-2 py-1"
                  :class="restaurantCount > 1 ? 'd-flex' : ''"
                >
                  <div
                    v-if="this.$store.state.darkMode"
                    class="avatar-content"
                    :class="
                      order.provider.slug == 'ty' ? 'bg-white scaleUp' : ''
                    "
                  >
                    <div class="" :class="order.provider.slug"></div>
                  </div>
                  <div
                    v-else
                    class="avatar-content"
                    :class="order.provider.slug == 'ty' ? 'bg-white' : ''"
                  >
                    <div class="" :class="order.provider.slug"></div>
                  </div>
                  <div
                    :class="restaurantCount > 1 ? 'd-block' : 'd-none'"
                    class="d-flex flex-column justify-content-center"
                    style="padding-left: 15px"
                  >
                    <h6 class="mb-0 text-sm">
                      {{ order.restaurantName }}
                    </h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-sm font-weight-bold mb-0">
                  {{ formatDate(order.updated_at) }}
                </p>
              </td>
              <td>{{ order.client.name }}</td>
              <td>{{ order.pos_ticket }}</td>
              <td>{{ order.shortCode }}</td>
              <td>
                {{ order.client.deliveryAddress.district }}
                <a
                  target="_blank"
                  class="text-secondary"
                  :href="
                    'https://' +
                    url +
                    '/' +
                    order.client.location.lat +
                    ',' +
                    order.client.location.lon +
                    '/@' +
                    order.client.location.lat +
                    ',' +
                    order.client.location.lon +
                    ',15.75z?hl=tr'
                  "
                >
                  <i class="fas fa-map-marker-alt text-warning"></i>
                </a>
              </td>
              <td>
                {{
                  order.totalDiscountedPrice > 0
                    ? parseFloat(order.totalDiscountedPrice).toFixed(2)
                    : parseFloat(order.totalPrice).toFixed(2)
                }}
              </td>
              <td
                class="align-middle text-center text-sm"
                v-html="getStatus(order.status)"
              ></td>

              <td class="align-middle">
                <button
                  type="button"
                  class="btn btn-secondary bg-secondary2 btn-sm font-weight-bold mb-0 text-sm"
                  data-toggle="tooltip"
                  data-original-title="Detay"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  @click="showModal(order)"
                >
                  Detay
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      data-bs-backdrop="static"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
      >
        <div
          class="modal-content"
          :class="
            this.$store.state.darkMode
              ? 'bg-dark text-white'
              : 'bg-white text-secondary'
          "
        >
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {{ provider.kaynak }}
            </h5>
            <button
              type="button"
              class="btn p-0 btn-link"
              :class="this.$store.state.darkMode ? 'text-white' : 'text-dark'"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fa fa-2x fa-close"></i>
            </button>
          </div>
          <div class="modal-body" style="text-align: left">
            <div class="d-flex bd-highlight">
              <div class="p-2 flex-fill bd-highlight">
                <p>
                  <b>Teslimat tipi:</b>
                  <span v-show="selectedOrder.deliveryType == 2"
                    >Restoran Kuryesi Teslim Edecek.</span
                  >
                  <span v-show="selectedOrder.deliveryType == 1">
                    <span>{{ provider.kaynak }}</span> Kuryesi Teslim
                    Edecek.</span
                  >
                  <span v-show="selectedOrder.deliveryType == 3"
                    >Gel Al Siparişi.</span
                  >
                </p>
                <p>
                  <b>Ödeme Yöntemi: </b>
                  <span>{{ selectedOrder.posPaymentMethod }}</span>
                </p>
              </div>
              <div class="p-2 flex-fill bd-highlight">
                <p>
                  <b>Restoran:</b>
                  <span> {{ selectedOrder.restaurantName }}</span>
                </p>
                <p>
                  <b>Sipariş No:</b>
                  <span>
                    {{ selectedOrder.shortCode }}
                  </span>
                </p>
                <p>
                  <b>Sipariş Tarihi:</b>
                  <span>
                    {{ selectedOrder.created_at }}
                  </span>
                </p>
              </div>
            </div>
            <modal-panel
              :order="selectedOrder"
              :products="products"
              :client="client"
              :deliveryAddress="deliveryAddress"
            ></modal-panel>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success"
              v-show="selectedOrder.status == 400"
            >
              Onayla
            </button>
            <button
              type="button"
              class="btn btn-success"
              v-show="selectedOrder.status == 400"
            >
              İptal Et
            </button>
            <button type="button" class="btn btn-success">
              Yeniden Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-secondary2 {
  background-color: #444445 !important;
}
.modal-footer {
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #2b2a2a;
  border-bottom-right-radius: calc(0.75rem - 1px);
  border-bottom-left-radius: calc(0.75rem - 1px);
}
.modal-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
  border-bottom: 1px solid #2b2a2a;
  border-top-left-radius: calc(0.75rem - 1px);
  border-top-right-radius: calc(0.75rem - 1px);
}
.ys {
  background-image: url('https://app.test.posentegra.com/images/yemeksepeti.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100px;
  height: 40px;

  transform: scale(1.6);
  margin-left: auto;
  margin-right: auto;
}
.ty {
  background-image: url('https://app.test.posentegra.com/images/trendyol.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transform: scale(2);
  margin-left: auto;
  margin-right: auto;
}
.migros {
  background-image: url('https://app.test.posentegra.com/images/migros-yemek.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transform: scale(2.5);
  margin-left: auto;
  margin-right: auto;
}
.getir {
  background-image: url('https://app.test.posentegra.com/images/getir.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transform: scale(1.5);
  margin-left: auto;
  margin-right: auto;
}
.avatar-content {
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
  padding: 4px;
  width: 120px;
}
.avatar-sm {
  width: 100% !important;
  height: auto !important;
}
.avatar-xl {
  width: 100% !important;
  height: auto !important;
}
</style>
<script>
import moment from 'moment'
import ModalPanel from './ModalPanel.vue'
export default {
  name: 'order-list',
  components: {
    ModalPanel,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    restaurantCount: {
      type: Number,
    },
  },
  data() {
    return {
      url: 'https://www.google.com/maps/dir',
      title: 'Modal title',
      selectedOrder: {},
      provider: {},
      client: {},
      deliveryAddress: {},
      products: [],
      open: false,
    }
  },
  computed: {},
  created() {
    // Get the darkMode flag from session storage
    const isDarkModeOn = window.localStorage.getItem('darkMode') === 'true'

    // Set the isDarkMode data property to the value from session storage
    this.$store.state.darkMode = isDarkModeOn
  },
  methods: {
    showModal(order) {
      this.selectedOrder = order
      this.provider = order.provider
      this.products = order.products
      this.client = order.client
      this.deliveryAddress = this.client.deliveryAddress

      this.open = true
    },
    getStatus(status) {
      let statusText = 'Onaylandı'
      let color = 'bg-success'
      if (status == 400) {
        statusText = 'Onay Bekliyor'
        color = 'bg-danger'
      }

      if (status == 550) {
        statusText = 'Sipariş Hazırlandı'
        color = 'bg-success'
      }
      if (status == 600) {
        statusText = 'Sipariş Kuryeye Teslim Edildi'
        color = 'bg-success'
      }
      if (status == 700) {
        statusText = 'Kurye Yola Çıktı'
        color = 'bg-info'
      }
      if (status == 800) {
        statusText = 'Kurye Adrese Ulaştı'
        color = 'bg-success'
      }
      if (status == 900) {
        statusText = 'Sipariş Teslim Edildi.'
        color = 'bg-success'
      }
      if (status == 1600) {
        statusText = 'Restoran İptal Etti'
        color = 'bg-danger'
      }
      if (status == 1600) {
        statusText = 'Platform İptal Etti'
        color = 'bg-danger'
      }

      return `<span class="badge badge-lg w-100 ${color}" style="text-transform: none">${statusText}</span>`
    },
    formatDate(date) {
      return moment(date).format('HH:mm')
    },
  },
}
</script>
