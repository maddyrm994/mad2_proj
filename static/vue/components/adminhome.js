const Adminhome = Vue.component("adminhome", {
    template:  `<div class="container mt-4">
    <div class="row">
       <div class="col-lg-8 offset-lg-2">
          <!-- Welcome Message -->
          <div class="jumbotron">
             <h1>Welcome, {{userRole}}!</h1>
             <p>You can Add, Delete, Edit Albums.</p>
             <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
             Add Album
             </button>
          </div>
	 <br>
          <div class="alert alert-danger" v-if="error">
             {{ error }}
          </div>
          <div v-if="albums.length == 0">
             <h2>No Album Found</h2>
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
                      <th>Status</th>
                   </tr>
                </thead>
                <tbody>
                   <tr v-for="album in albums">
                      <td>{{ album.name }}</td>
		    <td>{{ album.artist }}</td>
                      <td>
                         <button v-if="album.active" class="btn btn-outline-primary" type="button" @click="viewsongs(album.id)">
                         View Songs
                         </button>
                         <button v-if="album.active" class="btn btn-outline-secondary" :data-bs-target="'#editModal' + album.id" data-bs-toggle="modal">
                         Edit 
                         </button>
                         <button v-if="album.active" class="btn btn-outline-danger" @click="deletealbum(album.id)">
                         Delete
                         </button>
                         <button v-if="!album.active " class="btn btn-outline-success" @click="approve(album.id)">
                        Activate
                        </button>
                        <button v-if="album.active " class="btn btn-outline-warning" @click="disapprove(album.id)">
                        Deactivate
                        </button>
                      </td>
                      <td>
                    <button v-if="album.active" class="btn btn-success" disabled>
                    Activated
                    </button>
                    <button v-if="!album.active" class="btn btn-warning" disabled>
                    Deactivated
                    </button>
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
       <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
         <div class="modal-dialog">
            <div class="modal-content">
               <div class="modal-header">
                  <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Album</h1>
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
</div>`,

data() {
    return {
    albums: [],
    Albumname: null,
    Albumartist: null,
    error: null,
    userRole: localStorage.getItem('role'),
    token: localStorage.getItem('auth-token'),
    };
},

methods: {
   async getalbum() {
      try {
         const res = await fetch('/api/album', {
            headers: {
               'Authentication-Token': this.token,
               'Authentication-Role': this.userRole,
            },
         });
      
         if (res.ok) {
             const data = await res.json();
             this.albums = data;
         }
         else {
               const errorData = await res.json();
               console.error(errorData);
         }
      }
      catch (error) {
            console.error(error);
      }
   },

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
        active: true,
        }),
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
        this.getalbum();
    } else {
        const data = await res.json();
        console.log(data);
        this.error = data.error_message;

    }
    },

    async deletealbum(id) {
    //are you sure?
    const do_delete = confirm("Are you sure you want to delete this album?");
    if (do_delete) {
      const res = await fetch("/api/album/" + id, {
          method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.token,
            "Authentication-Role": this.userRole,
            },
      });
      if (res.ok) {
          const data = await res.json();
          console.log(data);
          this.getalbum();
      } else {
          const data = await res.json();
          console.log(data);
          this.error = data.error_message;

      }
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
        active: true,
        }),
    });
    if (res.ok) {
        const data = await res.json();
        console.log(data);
         this.getalbum();
    } else {
        const data = await res.json();
        console.log(data);
        this.error = data.error_message;

    }
    },
    
    viewsongs(id) {
    this.$router.push("/songs/" + id);
    },

    async approve(id) {
        const res = await fetch(`/activate/album/${id}`, {
          headers: {
            'Authentication-Token': this.token,
            'Authentication-Role': 'Admin',

          },
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          this.getalbum();
        }
      },
      async disapprove(id) {
        const res = await fetch(`/deactivate/album/${id}`, {
          headers: {
            'Authentication-Token': this.token,
            'Authentication-Role': 'Admin',
            
          },
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message);
            this.getalbum();
        }
      },
},
mounted: function () {
    document.title = "Admin Home";
      this.getalbum();
},

});

export default Adminhome;