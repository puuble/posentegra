<template>
  <div
    class="offcanvas offcanvas-end"
    :class="
      this.$store.state.darkMode ? 'bg-dark text-white' : 'bg-white text-dark'
    "
    tabindex="-1"
    id="offcanvas"
    aria-labelledby="offcanvasLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasLabel">Ayarlar</h5>
      <button
        type="button"
        class="btn p-0 btn-link"
        :class="this.$store.state.darkMode ? 'text-white' : 'text-dark'"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        @click="toggle"
      >
        <i class="fa fa-2x fa-close"></i>
      </button>
    </div>
    <div class="offcanvas-body">
      <ConfiguRator
        :toggle="toggle"
        :providers="providers"
        :loading="loading"
        :class="[
          this.$store.state.showConfig ? 'show' : '',
          this.$store.state.hideConfigButton ? 'd-none' : '',
        ]"
      />
    </div>
  </div>
</template>

<script>
import ConfiguRator from '@/examples/ConfiguRator.vue'
export default {
  name: 'OffcanvasMenu',
  props: ['toggle', 'providers', 'loading'],
  components: {
    ConfiguRator,
  },
}
</script>
