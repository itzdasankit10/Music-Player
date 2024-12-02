let lists;
let tracks ;
let currentSong = new Audio;
let currentFolder;
// Taking songs from the local library
async function music(folder) {
    
    currentFolder = folder;
    let songs = await fetch(`http://127.0.0.1:3000/Songs/${folder}`);
    let song = await songs.text();

    let div = document.createElement("div");
    div.innerHTML = song;
     tracks = [ ];
    
    let as = div.getElementsByTagName("a");
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            tracks.push(element.href.split(`/${folder}/`)[1]);
        }

    }
    // console.log(tracks);
    
    let list = document.querySelector(".sogs_list").getElementsByTagName("ul")[0];
    list.innerHTML = "";
    for (const song of tracks) {
        list.insertAdjacentHTML(`beforeend`,
            `<li class="songss">
                <div class="songs_list">
                    <img class = "sogs_play" src="IMAGES/list_play.svg" alt="" srcset="">
                    <div class="names">
                        <div class="music_name">${song.replaceAll("%20", " ")}</div>
                         <div class="artist_name">Artist</div>
                    </div>
                <img id= "last_image" src="IMAGES/music.svg" alt="" srcset="">
                </div>
            </li>`);
    }
    lists = tracks;

    Array.from(document.querySelector(".sogs_list").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", function(){

            let es = e.querySelector(".music_name").innerHTML;
            console.log(es);
            
            music_play(es);
            

        })
    })
    
}
async function displayAlbums() {
    let album = await fetch(`http://127.0.0.1:3000/Songs/`);
    let albums = await album.text();
    let div = document.createElement("div");
    div.innerHTML = albums; // Parse the HTML string into DOM elements.
    let cardContainer = document.querySelector(".playlist");
    // Now, query `div` for `<a>` tags
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/Songs/")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`);
            let as = await a.json();
            
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"  class="card-1">
                        <div>
                            <img class="lk" src="IMAGES/play-button-svgrepo-com.svg" alt="" srcset="">
                        </div>
                        <div class="imgg">
                            <img src="Songs/${folder}/cover.jpg" alt="" srcset="">
                        </div>
                        
                        <div class="writing">${as.title}</div>
                        <div class="writings">${as.description}</div>

                    </div`
        }
        Array.from(document.getElementsByClassName("card-1")).forEach(item =>{
            item.addEventListener("click", async (e)=>{
                lists = await music(`${e.currentTarget.dataset.folder}`);
                
            })
        })
        
    };
}



//Song playing functions
function music_play(es) {
    
    let songs_name = es;
    //Playing The Song
    currentSong.src = es.innerHTML = `http://127.0.0.1:3000/Songs/${currentFolder}/${songs_name.replaceAll(" ", "%20")}`;
    currentSong.play();
    play_song.src = "IMAGES/play.svg";

    //Naming The Song Name which is playing
    document.querySelector(".song_name").innerHTML = "Now Playing - " + es;

    //Updating the current song time
    const songs_duraton = document.querySelector(".song_duration");
    currentSong.addEventListener("timeupdate", ()=>{
        const currenttime = currentSong.currentTime;
        const current_mins = Math.floor(currenttime/60);
        const current_secs = Math.floor(currenttime%60).toString().padStart(2,"0");
        const total_time = currentSong.duration;
        const total_mins = Math.floor(total_time/60);
        const total_secs = Math.floor(total_time%60).toString().padStart(2,"0");

        songs_duraton.innerHTML = `${current_mins} : ${current_secs} / ${total_mins} : ${total_secs}`;

        document.querySelector(".circle").style.left = (currenttime/total_time) * 100 + "%";

         //Moving The Seekbar to a certain position

    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (percent * currentSong.duration) / 100;
        if(percent==99){
            play_song.src = "IMAGES/stop.svg";
        }
        })
         
    })
    
   
}

//Playing 
async function main() {
    lists = await music(``);
    
    displayAlbums();
   

    play_song.addEventListener("click", function(){
        if(currentSong.paused && currentSong.currentTime>0){
            currentSong.play();
            play_song.src = "IMAGES/play.svg";
        }
        else if(currentSong.currentTime==0){
            play_song.src = "IMAGES/stop.svg";
        }
        else if(!currentSong.paused){
            currentSong.pause();
            document.querySelector("#play_song").src = "IMAGES/pause.svg";
        }
        
    })

    //Playing the previous Song
    previous_song.addEventListener("click", ()=>{
        let index = tracks.indexOf(currentSong.src.split("/").slice(-1)[0]);
        
        if(index<=0){
            let indexing = tracks[tracks.length-1];
            indexing = indexing.replaceAll("%20", " ");
            music_play(indexing);
             
           // currentSong.src=lists[lists.length-1];
        }
        else{
            let indexing = tracks[index-1];
            indexing = indexing.replaceAll("%20", " ");
            music_play(indexing);
            
            
        }   
    })
    
    //Playing the next Song
    next_song.addEventListener("click", ()=>{
        let index = tracks.indexOf(currentSong.src.split("/").slice(-1)[0]);

        
        
        if(index>=tracks.length-1){
            let indexing = tracks[0]
            indexing = indexing.replaceAll("%20", " ");
            music_play(indexing);
            
        }
        else{
            let indexing = tracks[index+1];
            indexing = indexing.replaceAll("%20", " ");
            music_play(indexing);
        }
    })
    
    //Attaching the volume button function
    document.querySelector(".slider").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
       // console.log(e.target, e.target.value);
        currentSong.volume = (e.target.value)/100;
    })

    //
    document.querySelector(".volss>img").addEventListener("click", e=>{
        console.log("CHANGING", e.target.src);
        if (e.target.src.includes("volume_full.svg")) {
            e.target.src = e.target.src.replace("volume_full.svg", "volume_mute.svg");
            currentSong.volume=0;
            document.querySelector(".slider").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src = e.target.src.replace("volume_mute.svg", "volume_full.svg");
            currentSong.volume=1;
            document.querySelector(".slider").getElementsByTagName("input")[0].value=100;
        }
    })

    //Applying the Media query library menu
    document.querySelector(".option").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
        document.querySelector(".left").style.transition = "left .5s"
        document.querySelector(".options").style.display = "none"
    })

    document.querySelector(".crosses").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%";
        document.querySelector(".left").style.transition = "left 3s";
        document.querySelector(".options").style.display = "block"
    })
}

function music_pl(params) {
    
}

main();

// http://127.0.0.1:3000
