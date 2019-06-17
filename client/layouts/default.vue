<script>
import { mapState } from 'vuex'

export default {
  data: function () {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapState({
      alert: state => state.alert,
      confirm: state => state.confirm
    }),
    showAlert: {
      get: function () {
        return this.alert.resolve != null
      },
      set: function (val) {
        this.alert.resolve('close')
      }
    },
    showConfirm: {
      get: function () {
        return this.confirm.resolve != null
      },
      set: function (val) {
      }
    }
  },
  methods: {
    logout: async function () {
      await this.$auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<template>
  <v-app>
    <v-toolbar app clipped-left dark color="primary">
      <v-toolbar-title @click="$router.push('/')" class="clickable">Webhook Testing Server</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <nuxt/>
    </v-content>

    <v-dialog v-model="showAlert" max-width="290" persistent>
      <v-card>
        <v-card-title class="headline error lighten-2 white--text" primary-title>
          {{alert.title}}
        </v-card-title>

        <v-card-text>
          {{alert.body}}
        </v-card-text>

        <v-card-actions>
          <v-btn flat @click="alert.resolve('ok')">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showConfirm" max-width="350" persistent>
      <v-card>
        <v-card-title class="headline" primary-title>
          {{confirm.title}}
        </v-card-title>

        <v-card-text>
          {{confirm.body}}
        </v-card-text>

        <v-card-actions>
          <v-btn flat @click="confirm.resolve('no')">No</v-btn>
          <v-spacer />
          <v-btn color="primary" @click="confirm.resolve('yes')">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<style>
</style>
