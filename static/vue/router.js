import Home from "./components/home.js";
import About from "./components/about.js";
import Playlist from "./components/playlist.js";
import Login from "./components/login.js";
import Registration from "./components/registration.js";
import CreatorRegistration from "./components/creatorregistration.js";
import Users from "./components/users.js";
import Songs from "./components/songs.js";

const routes = [
    { 
    path: '/', 
    component: Home,
    },
    { 
    path: '/about', 
    component: About,
    },
    {
    path: '/playlist',
    component: Playlist,
    name: 'Playlist',
    },
    {
    path: '/login',
    component: Login,
    name: 'Login',
    },
    {
      path: '/Registration',
      component: Registration,
      name: 'Registration',
    },
    {
      path: '/Creator_Registration',
      component: CreatorRegistration,
      name: 'CreatorRegistration',
    },
    {
      path: '/songs/:id',
      component: Songs,
      name: 'Songs',
    },
    {
      path: '/users',
      component: Users,
      name: 'Users',
    }
];
const router = new VueRouter({
    routes,
  });
export default router;