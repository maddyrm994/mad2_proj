const About =  Vue.component('about', {
    template: `<div>
    <h2>Amplifi Music Streaming Application</h2>
	<br>
	<h4>Welcome to Amplifi Music Streaming, where melodies meet innovation.
		We're not just an app; we're your rhythm companion, tailored to elevate your auditory journey.
		With a vast library of albums, and seamless user experience,
		Amplifi ensures your musical odyssey is nothing short of extraordinary.
		Tune in and amplify your music experience today!
	</h4>
    </div>`,
        mounted : function(){
        document.title = "About";
    }
});

export default About;
