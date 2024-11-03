const AdminSongDetails = Vue.component('adminsongdetails',{
    template: `<div>
        <!-- Main Content -->
        <div class="container mt-4">
          <div class="row">
            <div class="col-lg-12 ">
              <!-- Welcome Message -->
              <div class="jumbotron">
                <h1>Welcome, {{userRole}}!</h1>
                <p>You can view songs.</p>
              </div>
              <div class="alert alert-danger" role="alert" v-if="error">
                {{error}}
              </div>
              <div v-if="songs.length == 0">
                <h2>No Songs Found</h2>
              </div>
              <div v-else>
              <!-- List of Albums -->
              <h2>List of Songs of {{albumname}} Album</h2>
              <div class="table-responsive">
                <table  class="table table-bordered" >
                  <thead>
                    <tr class="jumbotron" >
                      <th>Song Name</th>
                      <th>Genre</th>
                      <th>Duration</th>
                      <th>Lyrics</th>
                      <th>Date Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="jumbotron" v-for="song in songs" >
                      <td> {{song.name}} </td>
                      <td> {{song.genre}} </td>
                      <td> {{song.duration}} </td>
                      <td><button class="btn btn-outline-primary" onclick="alert('{{song.lyrics}}')">View Lyrics</button></td>
                      <td> {{song.date_created}} </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              </div>
            </div>
          </div>
        </div>
        </div>`,
        data() {
            return {
                songs : [],
                error : null,
                albumid : this.$route.params.id,
                albumname : null,
                userRole: localStorage.getItem('role'),
                token: localStorage.getItem('auth-token'),
            };
        },

        methods: {
            async getSongs() {
                try {
                    const res = await fetch('/api/song/' + this.$route.params.id,
                        {
                            headers: {
                                'content-type': 'application/json',
                                'Authentication-Token': this.token,
                                'Authentication-Role': 'Admin',

                            },
                        }
                     );
                    this.songs = await res.json();
                    console.log(this.songs);
                } catch (error) {
                    console.log(error);
                    this.error = error;
                }
            },
            async getalbumname() {
                try {
                    const res = await fetch('/api/albumget/' + this.$route.params.id
                        ,
                        {
                            headers: {
                                'content-type': 'application/json',
                                'Authentication-Token': this.token,
                                'Authentication-Role': 'Admin',

                            },
                        }
                    );
                    const data = await res.json();
                    console.log(data);
                    this.albumname = data.name;
                    console.log(this.albumname);
                } catch (error) {
                    console.log(error);
                    this.error = error;
                }
            },
            
        },


    
        mounted : function(){
            document.title = "Song Details";
            console.log(this.$route.params.id);
            this.getSongs();
            this.getalbumname();
        }


}) ;

export default AdminSongDetails;

