<template>
  <div id="app">
    <input :value="val"/>
  </div>
</template>

<script>
    export default {
        name: 'app',
        components: {

        },
        data: function () {
            return {
                val: 'aa'
            }
        }
    }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>