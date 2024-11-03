const Creatorhome = Vue.component("creatorhome", {
  template: `
  <div class="container mt-4">
   <div class="row">
      <div class="col-lg-8 offset-lg-2">
         <!-- Welcome Message -->
         <div class="jumbotron">
            <h1>Welcome, {{userRole}}!</h1>
            <p>You can Add, Delete, Edit Songs and Add Albums with Admin approval.</p>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Add Album
            </button>
            <button type="button" @click="downloadResource" class="btn btn-primary" data-bs-dismiss="modal" >Download Song Details</button><span v-if = 'isWaiting' >Downloading....</span>
         </div>
	<br>
         <div class="alert alert-danger" v-if="error">
            {{ error }}
         </div>
         <div v-if="albums.length == 0">
            <h2>No Albums Found</h2>
        	</div>
        	<div v-else>
         <!-- List of Albums -->
         <h2>List of Albums</h2>
         <div class="table-responsive">
            <table class="table table-bordered">
               <thead>
                  <tr class="table-header">
                     <th>Album Name</th>
		   <th>Album Artist</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  <tr v-for="album in albums">
                     <td>{{ album.name }}</td>
		   <td>{{ album.artist }}</td>
                     <td>
                        <button class="btn btn-outline-primary" v-if="album.active" @click="viewsongs(album.id)">
                        View Songs
                        </button>
                        <button class="btn btn-outline-success" v-if="album.active" :data-bs-target="'#songModal' + album.id" data-bs-toggle="modal">
                        Add Song
                        </button>
                        <button class="btn btn-outline-secondary" v-if="album.active" :data-bs-target="'#editModal' + album.id" data-bs-toggle="modal">
                        Edit 
                        </button>
                        <p v-if="!album.active"> Admin needs to activate the album to proceed further... </p>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
        </div>
      <div v-for="album in albums" :key="album.id">
         <div class="modal fade" :id="'editModal' + album.id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="'editModalLabel' + album.id" aria-hidden="true">
            <div class="modal-dialog">
               <div class="modal-content">
                  <div class="modal-header">
                     <h1 class="modal-title fs-5" :id="'editModal' + album.id">Edit Album</h1>
                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                     <div class="my-3">
                        <label for="title">Enter Album Name</label>
                        <input v-model="album.name" type="text" id="Albumname" class="form-control" :placeholder= "album.name">
                     </div>
		  </div>
                  <div class="modal-body">
                     <div class="my-3">
                        <label for="title">Enter Album Artist</label>
                        <input v-model="album.artist" type="text" id="Albumartist" class="form-control" :placeholder= "album.artist">
                     </div>
		  </div>
                  <div class="modal-footer">
                     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                     <button type="button" @click="editalbum(album)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div v-for="album in albums">
         <div class="modal fade" :id="'songModal'+ album.id" tabindex="-1" role="dialog" aria-labelledby="'songModalLabel'+ album.id"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
               <div class="modal-content">
                  <div class="modal-header">
                     <h5 class="modal-title" :id="'songModal'+ album.id">Song Form</h5>
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
                        <button type="button" @click="addsong(album.id)" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div class="modal-body">
                  <div class="my-3">
                     <label for="Albumname">Enter Album Name</label>
                     <input v-model="Albumname" type="text" id="Albumname" class="form-control" placeholder="Albumname">
                  </div>
               </div>
               <div class="modal-body">
                  <div class="my-3">
                     <label for="Albumartist">Enter Album Artist</label>
                     <input v-model="Albumartist" type="text" id="Albumartist" class="form-control" placeholder="Albumartist">
                  </div>
               </div>
               <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" @click="addalbum" class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
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
        Albumname: null,
        Albumartist: null,
        songname: null,
        genre: null,
        duration: null,
        lyrics: null,
        date_created: null,
        error: null,
        token: localStorage.getItem('auth-token'),
        userRole: localStorage.getItem('role'),
        isWaiting: false,
        };
    },
    methods: {
        async addalbum() {
        const res = await fetch("/api/album", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token,
            "Authentication-Role": this.userRole,
            },
            body: JSON.stringify({
            name: this.Albumname,
            active: false,
            }),
        });
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            fetch("/api/album", {
               headers: {
                "content-type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
            },
            })
            .then((res) => res.json())
            .then((data) => {
                this.albums = data;
            });
        } else {
            const data = await res.json();
            console.log(data);
            this.error = data.error_message;

        }
        },
    
        async editalbum(album) {
            this.albumname = album.name;
            const res = await fetch("/api/album/" + album.id, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token,
            "Authentication-Role": this.userRole,
            },
            body: JSON.stringify({
            name: this.albumname,
            active: false,
            }),
        });
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            fetch("/api/album", {
               headers: {
                "content-type": "application/json",
                "Authentication-Token": this.token,
                "Authentication-Role": this.userRole,
            },
            })
            .then((res) => res.json())
            .then((data) => {
                this.albums = data;
            });
        } else {
            const data = await res.json();
            console.log(data);
            this.error = data.error_message;
        }
        },
        async addsong(id) {
        const res = await fetch("/api/song/" + id, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token,
            "Authentication-Role": this.userRole,
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
            const data = await res.json();
            console.log(data);
        } else {
            const data = await res.json();
            console.log(data);
            this.error = data.error_message;

        }
        },
        viewsongs(id) {
        this.$router.push("/songs/" + id);
        },

        async downloadResource() {
         this.isWaiting = true
         const res = await fetch('/download_csv',{
           headers:{
             "Content-Type" : "application/json" ,
             'Authentication-Token': this.token,
             'Authentication-Role':this.role_name,
           }
         })
         const data = await res.json()
         if (res.ok) {
           const taskId = data['task-id']
           const intv = setInterval(async () => {
             const csv_res = await fetch(`/get-csv/${taskId}`)
             if (csv_res.ok) {
               this.isWaiting = false
               clearInterval(intv)
               window.location.href = `/get-csv/${taskId}`
             }
           }, 1000)
         }
       },
    },
    mounted: function () {
        document.title = "Creator Home";
        fetch("/api/album", {
         headers: {
            "content-type": "application/json",
            "Authentication-Token": this.token,
            "Authentication-Role": this.userRole,
        },
        } )
        .then((res) => res.json())
        .then((data) => {
            this.albums = data;
        });
    },
});

export default Creatorhome;
