const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  viewportHeight : 1080 , 
  viewportWidth : 1920,
  defaultCommandTimeout : 5000,

  //retries:1, // most simple way to configure a retry affects all the tests in the suite 
retries:{
  runMode:2, //headless will run twice 
  openMode:0 // with the dashboard will not run
},

  e2e: {
    setupNodeEvents(on, config) {
      const username = process.env.DB_USERNAME
      const password = process.env.PASSWORD

      /*if(!password){
        throw new Error(`missing PASSWORD variable`)
      }*/

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
