import CreatorSongDetails from "./creatorsongdetails.js";
import AdminSongDetails from "./adminsongdetails.js";
import UserSongDetails from "./usersongdetails.js";

const Songs =Vue.component('songs', {
    template: `<div>
                <div v-if="userRole == 'Admin'">
                    <AdminSongDetails></AdminSongDetails>
                </div>
                <div v-if ="userRole == 'Creator'" >
                    <CreatorSongDetails></CreatorSongDetails>
                </div>
                <div v-if ="userRole == 'User'" >
                    <UserSongDetails></UserSongDetails>
                </div>
                
            </div>`,
                data() {
                    return {
                        userRole: localStorage.getItem('role'),
                    }

                },
                components: {
                    CreatorSongDetails,
                    AdminSongDetails,
                    UserSongDetails,
                },
                mounted : function(){
                    document.title = "Songs";
    }
});

export default Songs;