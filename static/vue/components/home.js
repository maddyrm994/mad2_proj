import Creatorhome from "./creatorhome.js";
import Userhome from "./userhome.js";
import Adminhome from "./adminhome.js";

const Home =Vue.component('home', {
    template: `<div>
                <div v-if="userRole == 'Admin'">
                    <Adminhome></Adminhome>
                </div>
                <div v-if ="userRole == 'User'" >
                    <Userhome></Userhome>
                </div>
                <div v-if ="userRole == 'Creator'" >
                    <Creatorhome></Creatorhome>
                </div>
            </div>`,
                data() {
                    return {
                        userRole: localStorage.getItem('role'),
                    }
                },
                components: {
                    Creatorhome,
                    Userhome,
                    Adminhome,
                },
                mounted : function(){
                    document.title = "Home";
    }
});

export default Home;