const Navbar = Vue.component('Navbar', {
  template: `<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="/" >Amplifi</a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav">
      <button class="nav-item nav-link active d-lg-block" v-if="['Admin', 'Creator', 'User'].includes(role)"><router-link class="nav-item nav-link active d-lg-block" to="/">Home</router-link></button>
      <button class="nav-item nav-link active d-lg-block" v-if="['Admin', 'Creator', 'User'].includes(role)"><router-link class="nav-item nav-link active d-lg-block" to="/about">About Us</router-link></button>
      <button class="nav-item nav-link active d-lg-block" v-if="['Admin'].includes(role)"><router-link class="nav-item nav-link active d-lg-block" to="/users">Users</router-link></button>
      <button class="nav-item nav-link active d-lg-block" v-if="['User'].includes(role)"> <router-link class="nav-item nav-link active d-lg-block" to="/playlist">Your Playlist</router-link></button>
      <button class="nav-link" v-if="['Admin', 'Creator', 'User'].includes(role)" @click='logout'>Logout</button>
    </div>
  </div>
</nav>

`,
  data() {
    return {
      role: localStorage.getItem('role'),
      is_login: localStorage.getItem('auth-token'),
      id : localStorage.getItem('id'),
      inactivityTimeout: 5 * 60 * 1000, // 30 minutes in milliseconds
      inactivityTimer: null,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('role');
      localStorage.removeItem('id');
      localStorage.removeItem('username');
      this.$router.push({ path: '/login' });
    },
    handleUserActivity() {
      // Update the last activity timestamp
      localStorage.setItem('lastActivityTimestamp', Date.now().toString());
    },
    checkInactivity() {
      const lastActivityTimestamp = localStorage.getItem('lastActivityTimestamp');
      const currentTime = Date.now();

      if (lastActivityTimestamp && currentTime - lastActivityTimestamp > this.inactivityTimeout) {
        // User has been inactive for too long, clear local storage
        this.clearLocalStorage();
      }
    },
    clearLocalStorage() {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('role');
      this.$router.push({ path: '/login' });
    },
    startInactivityTimer() {
      this.inactivityTimer = setInterval(() => {
        this.checkInactivity();
      }, 60000); // Check every minute (adjust as needed)
    },
    stopInactivityTimer() {
      clearInterval(this.inactivityTimer);
    },
  },
  mounted() {
    // Set up event listeners to track user activity
    document.addEventListener('mousemove', this.handleUserActivity);
    document.addEventListener('keydown', this.handleUserActivity);
    document.title = "Navbar";

    // Start the inactivity timer
    this.startInactivityTimer();
  },
  beforeDestroy() {
    // Clean up event listeners and the inactivity timer
    document.removeEventListener('mousemove', this.handleUserActivity);
    document.removeEventListener('keydown', this.handleUserActivity);
    this.stopInactivityTimer();
  },
});

export default Navbar;
