<template>
  <div id="app">
    <nav>
      <router-link to="/" exact-active-class="active-link">Home</router-link>
      <router-link to="/reservation" exact-active-class="active-link">Reservez votre billet</router-link>
      <router-link to="/faq" exact-active-class="active-link">FAQ</router-link>
    </nav>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #e74c3c;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

nav a {
  margin: 0 15px;
  text-decoration: none;
  font-weight: 600;
  color: #2c3e50;
  transition: color 0.3s ease, transform 0.2s ease;
}

nav a:hover {
  color: #e74c3c;
  transform: scale(1.1);
}

nav a.active-link {
  color: #e74c3c;
  border-bottom: 2px solid #e74c3c;
  padding-bottom: 3px;
}

.content {
  margin-top: 80px;
  padding: 20px;
}
</style>
<script setup>
</script>