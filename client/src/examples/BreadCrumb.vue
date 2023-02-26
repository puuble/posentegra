<template>
  <nav aria-label="breadcrumb">
    <h6
      class="mb-0 font-weight-bolder"
      :class="this.$store.state.isNavFixed ? 'text-dark' : 'text-white'"
    >
      {{ currentPage }}
    </h6>
  </nav>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    currentPage: {
      required: true,
    },
    textWhite: {
      type: String,
    },
  },
}
</script>
