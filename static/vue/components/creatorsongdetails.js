const CreatorSongDetails = Vue.component('creatorsongdetails',{
    template: `<div>
        <!-- Main Content -->
        <div class="container mt-4">
          <div class="row">
            <div class="col-lg-12 ">
              <!-- Welcome Message -->
              <div class="jumbotron">
                <h1>Welcome, {{userRole}}!</h1>
                <p>You can Add, Delete, Edit songs.</p>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#songModal">
                Add Song
                </button>
              </div>
		<br>
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="jumbotron" v-for="song in songs" >
                      <td> {{song.name}} </td>
                      <td> {{song.genre}}  </td>
                      <td> {{song.duration}} </td>
                      <td><button class="btn btn-outline-primary" onclick="alert('{{song.lyrics}}')">View Lyrics</button></td>
                      <td> {{song.date_created}}  </td>
                      <td>
                      <button class="btn btn-outline-danger"@click="deleteSong(song.id)">
                      Delete
                      </button>
                      <button class="btn btn-outline-secondary" data-bs-toggle="modal" :data-bs-target="'#songModal' + song.id">
                      Edit
                      </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="songModal" tabindex="-1" role="dialog" aria-labelledby="songModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
               <div class="modal-content">
                  <div class="modal-header">
                     <h5 class="modal-title" id="songModal">Song Form</h5>
                     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                     <span aria-hidden="true">&times;</span>
                     </button>
                  </div>
                  <div class="modal-body">
                     <div class="form-group">
                        <label for="name">Name:</label>
                        <input v-model="songname" type="text" class="form-control" id="songname" name="songname" required>
                     </div>
                     <div class="form-group">
                        <label for="genre">Genre:</label>
                        <input v-model="genre" type="text" class="form-control" id="genre" name="genre">
                     </div>
                     <div class="form-group">
                        <label for="duration">Duration:</label>
                        <input v-model="duration" type="text" class="form-control" id="duration" name="duration" required>
                     </div>
                     <div class="form-group">
                        <label for="lyrics">Lyrics:</label>
                        <input v-model="lyrics" type="text" class="form-control" id="lyrics" name="lyrics" required>
                     </div>
                     <div class="form-group">
                        <label for="date_created">Date Created:</label>
                        <input v-model="date_created" type="date" class="form-control" id="date_created" name="date_created" required>
                     </div>
                     <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" @click="addsong(albumid)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
        <div v-for = "song in songs">
         <div class="modal fade" :id="'songModal' + song.id " tabindex="-1" role="dialog" aria-labelledby="'songModalLabel' + song.id" aria-hidden="true">
            <div class="modal-dialog" role="document">
               <div class="modal-content">
                  <div class="modal-header">
                     <h5 class="modal-title" :id="'songModal'+ song.id">Song Edit Form</h5>
                     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                     <span aria-hidden="true">&times;</span>
                     </button>
                  </div>
                  <div class="modal-body">
                     <div class="form-group">
                        <label for="name">Name:</label>
                        <input v-model="song.name" type="text" class="form-control" id="songname" name="songname"  required>
                     </div>
                     <div class="form-group">
                        <label for="genre">Genre:</label>
                        <input v-model="song.genre" type="text" class="form-control" id="genre" name="genre">
                     </div>
                     <div class="form-group">
                        <label for="duration">Duration:</label>
                        <input v-model="song.duration" type="text" class="form-control" id="duration" name="duration" required>
                     </div>
                     <div class="form-group">
                        <label for="lyrics">Lyrics:</label>
                        <input v-model="song.lyrics" type="text" class="form-control" id="lyrics" name="lyrics" required>
                     </div>
                     <div class="form-group">
                        <label for="date_created">Date Created:</label>
                        <input v-model="song.date_created" type="date" class="form-control" id="date_created" name="date_created" required>
                     </div>
                     <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" @click="editSong(song)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
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
                songs : [],
                albumname : null,
                songname: null,
                genre: null,
                duration: null,
                lyrics: null,
                date_created: null,
                error : null,
                albumid : this.$route.params.id,
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
                            'Authentication-Role': this.userRole,
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
                            'Authentication-Role': this.userRole,
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

            async deleteSong(id) {
              //are you sure?
              const do_delete = confirm("Are you sure you want to delete this song?");
              if (!do_delete) {
                  return; //do nothing if cancel
              }   
                try {
                    const res = await fetch('/api/song/' + id, {
                        method: 'DELETE',
                        headers: {
                            'content-type': 'application/json',
                            'Authentication-Token': this.token,
                            'Authentication-Role': this.userRole,
                        },
                    });
                    if (res.ok) {
                        this.getSongs();
                    }
                } catch (error) {
                    console.log(error);
                    this.error = error;
                }
            },

            async addsong(id) {
                try {
                    const res = await fetch('/api/song/' + id, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authentication-Token': this.token,
                            'Authentication-Role': this.userRole,
                        },
                        body: JSON.stringify({
                            name: this.songname,
                            genre: this.genre,
                            duration: this.duration,
                            lyrics: this.lyrics,
                            date_created: this.date_created,
                        }),
                    });
                    if (res.ok) {
                        this.getSongs();
                    }
                } catch (error) {
                    console.log(error);
                    this.error = error;
                }
            },
          
          async editSong(song) {
            this.songname = song.name;
            this.genre = song.genre;
            this.duration = song.duration;
            this.lyrics = song.lyrics;
            this.date_created = song.date_created;
            try {
                const res = await fetch('/api/song/' + song.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token,
                        'Authentication-Role': this.userRole,
                    },
                    body: JSON.stringify({
                        name: this.songname,
                        genre: this.genre,
                        duration: this.duration,
                        lyrics: this.lyrics,
                        date_created: this.date_created,
                        album_id : this.albumid,
                    }),
                });
                if (res.ok) {
                    this.getSongs();
                }
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

export default CreatorSongDetails;