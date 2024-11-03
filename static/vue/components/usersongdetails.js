const UserSongDetails = Vue.component("usersongdetails", {
    template: `
      <div>
        <div class="container mt-5">
          <h1>Welcome {{name}} to the Amplifi Dashboard</h1>
          <div class="input-group mt-3">
            <input type="text" class="form-control" v-model="searchQuery" placeholder="Search Song">
          </div>
        </div>
	<br>
        <div v-if="songs.length == 0">
          <h2>No Songs Found</h2>
        </div>
        <div v-else>
         <div class="container">
            <h2>View for {{ albumname }} </h2>
            <div class="row mt-5">
              <div class="col-sm-4" v-for="song in filteredSongs" :key="song.id" v-if="song.display !== false">
		<div class="card">
                  <button :src="song.lyrics" class="btn btn-primary" :alt="song.name">View Lyrics</button>
                  <div class="card-body">
                    <h5 class="card-title">{{ song.name }}</h5>
		    <p class="card-text">Lasting upto {{ song.duration }} </p>
		     <div class="card-text">
                        <small class="text-muted">Date Created: {{ song.date_created }}</small>
		       <div class="input-group-append">
                          <button class="btn btn-primary" @click="addToPlaylist(song)">Add to Playlist</button>
                        </div>
                      </div>
                    </div>
		 </div>
                  </div>
                  <div class="card-footer">
                    <small class="text-muted">Genre: {{ song.genre }}</small>
                  </div>
                </div>
              </div>
	   </div>
      </div>
    `,
    data() {
      return {
        songs: [],
        error: null,
        albumid: this.$route.params.id,
        albumname: null,
        userRole: localStorage.getItem('role'),
        searchQuery: '',
        token: localStorage.getItem('auth-token'),
        name : localStorage.getItem('username'),
        error: null,
      };
    },
    computed: {
      filteredSongs() {
        const inputText = this.searchQuery.toLowerCase();
        return this.songs.filter(song => {
          const songName = song.name.toLowerCase();
          return (
            songName.includes(inputText)
          );
        });
      }
    },
    methods: {
      async getSongs() {
        try {
          const res = await fetch('api/songs/' + this.$route.params.id,
          {
            headers: {
              'content-type': 'application/json',
              'Authentication-Token': this.token,
              'Authentication-Role': this.userRole,
              },
          }
         );

	if (!res.ok) {
      	   throw new Error('Failed to fetch songs');
    	}
	    const songs = await res.json();
	    this.songs = songs;
	} catch (error) {
             this.error = error;
        }
      },

      async getalbumname() {
        try {
          const res = await fetch('/api/albumget/' + this.$route.params.id,
            {
                headers: {
                    'content-type': 'application/json',
                    'Authentication-Token': this.token,
                    'Authentication-Role': this.userRole,
                },
            }
          );
          const data = await res.json();
          this.albumname = data.name;
        } catch (error) {
          this.error = error;
        }
      },

      async addToPlaylist(song) {
        try {
          const res = await fetch('/api/playlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
                'Authentication-Token': this.token,
                'Authentication-Role': this.userRole,
            },
            body: JSON.stringify({
              user_id: localStorage.getItem('id'),
              song_id: song.id,
              song_name: song.name,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            console.log(data);
            alert('Added to playlist successfully!');
          } else {
            const errorData = await res.json();
            throw new Error(errorData.error_message);
          }
        } catch (error) {
          console.error(error);
          alert(error.message || 'An error occurred while adding to playlist.');
        }
      },      
    },
    mounted() {
      document.title = "Song Details";
      this.getSongs();
      this.getalbumname();
    }
  });
  
  export default UserSongDetails;