const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  viewportHeight : 1080 , 
  viewportWidth : 1920,
  defaultCommandTimeout : 20000,
  e2e: {
    setupNodeEvents(on, config) {
      const username = process.env.DB_USERNAME
      const password = process.env.PASSWORD

      if(!password){
        throw new Error(`missing PASSWORD variable`)
      }

      config.env = {username , password}
      return config

    },
    baseUrl: 'https://conduit.bondaracademy.com/',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}'
  },
  env:{
    userName: "jalgtest123@test.com",
    password: "jalgtest123",
    apiUrl: "https://conduit-api.bondaracademy.com",

  }
});
