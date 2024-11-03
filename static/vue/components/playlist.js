const Playlist = Vue.component("playlist", {
    template:  `<div>
    <div class="container mt-4">
    <div class="row">
      <div class="col-lg-8 offset-lg-2">
        <!-- Welcome Message -->
        <div class="jumbotron">
          <h1>Welcome, {{username}}!</h1>
        </div>
        <div class="alert alert-danger" role="alert" v-if="error">
        {{error}}
        </div>
        <!--List of Albums -->
	<br>
        <div v-if="songs.length == 0">
            <h2>No Songs Found</h2>
            </div>
        <div v-else>
        <h2>List of Songs in your Playlist</h2>
        <div class="table-responsive">
          <table  class="table table-bordered table-lg" >
            <thead>
              <tr class="jumbotron">
                <th>Song Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="jumbotron" v-for= "song in songs" >
                <td> {{song.song_name}} </td>
                <td>
                <button class="btn btn-primary" @click="deleteSong(song.id)">Delete</button>
              </td>  
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-right mt-3" v-if="songs.length > 0">
	</div>        
      </div>
    </div>
  </div>
  </div>
     </div>`,

    data() {
      return {
        songs: [],
        username : localStorage.getItem('username'),
        token: localStorage.getItem('auth-token'),
        error: null,
        userid : localStorage.getItem('id'),
        userRole: localStorage.getItem('role'),
      };
    }
    ,
    methods: {
      async getSongs() {
        try {
          const res = await fetch('/api/playlist/'+ this.userid  , {
            headers: {
                'content-type': 'application/json',
                'Authentication-Token': this.token,
                'Authentication-Role': this.userRole,
            },
          });
          if (res.ok) {
            const data = await res.json();
            this.songs = data;
          } else {
            const errorData = await res.json();
            console.error(errorData);
          }
        }
	catch (error) {
          console.error(error);
        }
      }
    },
    	async deleteSong(id) {
            //are you sure?
            if (!confirm('Are you sure you want to delete this song from playlist?')) {
            return;
            }
            try {
                const res = await fetch('/api/playlist/' + id, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'Authentication-Token': this.token,
                    'Authentication-Role': this.userRole,
                },
                });
                if (res.ok) {
                this.getSongs();
                } else {
                const errorData = await res.json();
                console.error(errorData);
                }
            } catch (error) {
                console.error(error);
            }
            },

  mounted: function () {
      document.title = "Playlist";
      this.getSongs();
    },  
});
  
export default Playlist;