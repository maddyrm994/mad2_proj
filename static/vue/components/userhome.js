const Userhome = Vue.component("userhome", {
    template: `
      <div>
        <div class="container mt-5">
          <h1>Welcome {{name}} to the Amplifi Dashboard</h1>
          <div class="input-group mt-3">
            <input class="form-control" type="text" v-model="searchQuery" @input="searchAlbum" placeholder="Search Album">
          </div>
        </div>
	<br>
        <div v-if="albums.length == 0">
          <h2>No Albums Found</h2>
        </div>
        <div v-else>
          <div class="container">
            <h2>View By Album</h2>
            <div class="row mt-5">
              <div class="col-sm-3" v-for="album in filteredAlbums" :key="album.id">
              <div v-if= "album.active === true"> 
                 <div class="card-body">
                    <h5 class="card-title">{{ album.name }}</h5>
			<br>
                    <button type="button" class="btn btn-primary" @click="viewsongs(album.id)">
                         View {{ album.name }}
                         </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        albums: [],
        searchQuery: '',
        name : localStorage.getItem('username'),
        userRole: localStorage.getItem('role'),
        token: localStorage.getItem('auth-token'),
      };
    },
    computed: {
      filteredAlbums() {
        const inputText = this.searchQuery.toLowerCase();
        return this.albums.filter(album => album.name.toLowerCase().includes(inputText));
      }
    },
    methods: {
      async getAlbums() {
        try {
          const res = await fetch('/api/album',
          {
            headers: {
                "content-type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
            }
          },

          );
          if (res.ok) {
            const data = await res.json();
            this.albums = data;
          } else {
            const errorData = await res.json();
            console.error(errorData);
          }
        } catch (error) {
          console.error(error);
        }
      },
      searchAlbum() {
        // This method is not needed in this version because the filteredAlbums computed property handles the filtering
      },
      viewsongs(id) {
            this.$router.push('songs/' + id);
        }
    },
    mounted() {
      document.title = 'User Home';
      this.getAlbums();
    }
  });

  export default Userhome;  