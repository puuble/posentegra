<template>
  <div class="d-flex align-items-center justify-content-center vh-100">
    <div class="col-md-6">
      <form @submit.prevent="login">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Lisans Ekranı</h5>
          </div>
          <div class="card-body">
            <div class="col-md-12">
              <label for="validationCustom01" class="form-label">
                Lisans Anahtarı Giriniz.
              </label>
              <input
                type="text"
                class="form-control"
                id="validationCustom01"
                required
                v-model="key"
              />
              <div class="valid-feedback">Looks good!</div>
            </div>
          </div>
          <div class="card-footer">
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            <button class="btn btn-primary w-100">{{ buttonText }}</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>

<script>
export default {
  name: 'LoginPanel',
  data() {
    return {
      key: '6373f7b9700159f47701094f|8v9BKG58CyAOtdx9XBYWp9hWnJaxNFfkEPGMGugl',
      buttonText: 'Giriş Yap',
      errorMessage: false,
    }
  },
  methods: {
    login() {
      const FORM_URL = '/api/ajax/token'
      // code to handle login request
      this.buttonText = 'Gönderiliyor'
      let formData = {
        token: this.key,
      }
      fetch(FORM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(async (response) => {
          if (!response.ok) {
            this.error = true
            this.errorMessage = 'Bilinmeyen bir hata'
          } else {
            let result = await response.text()
            result = JSON.parse(result)
            if (result.success) {
              this.key = ''
              this.formMessage = 'Ayarlarınız Kaydedildi'
              this.$store.state.login = true
              this.$router.push('/')
            } else {
              this.error = true
              this.errorMessage = 'Lütfen lisans anahtarını Kontrol Edin.'
            }
          }
        })
        .catch(() => {
          this.formMessage = 'Bilinmeyen bir hata'
        })
        .finally(() => {
          this.formLoading = false
          this.buttonText = 'Gönder'
        })
    },
  },
}
</script>
