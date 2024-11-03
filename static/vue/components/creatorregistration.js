// Assuming you already have Vue imported and set up

const CreatorRegistration = Vue.component('registration', {
    template: `<div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2 class="text-center">Creator Registration Form</h2>
          <div class="alert alert-danger" v-if="error">
            {{ error }}
          </div>
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" class="form-control" id="username" name="username" placeholder="Enter Username"
              v-model="user.username">
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="text" class="form-control" id="email" name="email" placeholder="Enter Email"
              v-model="user.email">
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="Enter Password"
              v-model="user.password">
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password:</label>
            <input type="password" class="form-control" id="confirmPassword" name="confirmPassword"
              placeholder="Confirm Password" v-model="user.confirmPassword">
          </div>
	<br>
          <button type="submit" class="btn btn-primary" @click="register">Register</button>
          <p class="mt-3">Already have an account? <router-link to="/login">Login here</router-link></p>
        </div>
      </div>
    </div>`,
    data() {
      return {
        user: {
          username: null,
          email: null,
          password: null,
          confirmPassword: null,
        },
        error: null,
      };
    },
    methods: {
      async register() {
        if (this.user.password !== this.user.confirmPassword) {
          this.error = "Passwords do not match.";
          return;
        }
  
        const res = await fetch('/creator-registration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.user.username,
            email: this.user.email,
            password: this.user.password,
          }),
        });
  
        if (res.ok) {
          this.$router.push('/login');

        } else {
          const data = await res.json();
          this.error = data.message;

        }
      },
    },
    mounted: function () {
      document.title = 'Registration';
    },
  });
  
  export default CreatorRegistration;  