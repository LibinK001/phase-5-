
    // Data: songs and artists (replace with your own images and audio)
    const demoAudio = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    const songs = [
      { id:'s1', title:'Rahein Na Rahein Hum', meta:'Sachin-Jigar, Soumyadeep Sarkar', img:'https://picsum.photos/seed/rai1/400/400', audio: demoAudio },
      { id:'s2', title:'Oorum Blood', meta:'Sai Abhyankkar, Paal Dabba', img:'https://picsum.photos/seed/oorum/400/400', audio: demoAudio },
      { id:'s3', title:'Tumse Behtar', meta:'Tanishk Bagchi, Arijit Singh', img:'https://picsum.photos/seed/tumse/400/400', audio: demoAudio },
      { id:'s4', title:'Kashish', meta:'Ashish Bhatia, Omkar', img:'https://picsum.photos/seed/kash/400/400', audio: demoAudio },
      { id:'s5', title:'Eyes Closed', meta:'JISOO, ZAYN', img:'https://picsum.photos/seed/eyes/400/400', audio: demoAudio },
      { id:'s6', title:'Mera Hua', meta:'Annnur R Pathakk', img:'https://picsum.photos/seed/mera/400/400', audio: demoAudio },
    ];

    const artists = [
      {name:'A.R. Rahman', img:'https://picsum.photos/seed/ar/300/300'},
      {name:'Arijit Singh', img:'https://picsum.photos/seed/arijit/300/300'},
      {name:'Shreya Ghoshal', img:'https://picsum.photos/seed/shreya/300/300'},
      {name:'Badshah', img:'https://picsum.photos/seed/bad/300/300'},
      {name:'Nucleya', img:'https://picsum.photos/seed/nuc/300/300'},
      {name:'Drums', img:'https://picsum.photos/seed/drums/300/300'},
    ];

    // DOM refs
    const grid = document.getElementById('trendingGrid');
    const artistsRow = document.getElementById('artistsRow');
    const playerBar = document.getElementById('playerBar');
    const playerTitle = document.getElementById('playerTitle');
    const playerSub = document.getElementById('playerSub');
    const playerArt = document.getElementById('playerArt');
    const playerToggle = document.getElementById('playerToggle');

    // Audio element used for previews
    const audio = new Audio();
    audio.preload = "auto";
    let currentSongId = null;

    // load liked state from localStorage
    const likedKey = 'mm_liked_songs_v1';
    const likedSet = new Set(JSON.parse(localStorage.getItem(likedKey) || '[]'));

    function renderSongs(list){
      grid.innerHTML = '';
      list.forEach(song => {
        const c = document.createElement('div');
        c.className = 'card';
        c.innerHTML = `
          <div class="art" style="background-image:url('${song.img}')" data-id="${song.id}"></div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <div class="title">${song.title}</div>
            <div class="meta">${song.meta}</div>
          </div>
          <div class="actions" style="margin-top:auto">
            <div class="play-btn" data-id="${song.id}" title="Play preview">▶ Play</div>
            <div class="heart ${likedSet.has(song.id)?'liked':''}" data-id="${song.id}" title="Like">❤</div>
          </div>
        `;
        // add interaction listeners
        const playBtn = c.querySelector('.play-btn');
        const heart = c.querySelector('.heart');
        playBtn.addEventListener('click', () => playSong(song));
        heart.addEventListener('click', () => toggleLike(song.id, heart));
        grid.appendChild(c);
      });
    }

    function renderArtists(){
      artistsRow.innerHTML = '';
      artists.forEach(a=>{
        const d = document.createElement('div');
        d.className = 'artist';
        d.innerHTML = `
          <div class="circle" style="background-image:url('${a.img}')"></div>
          <div class="name">${a.name}</div>
        `;
        artistsRow.appendChild(d);
      });
    }

    function toggleLike(id, el){
      if(likedSet.has(id)){
        likedSet.delete(id);
        el.classList.remove('liked');
      } else {
        likedSet.add(id);
        el.classList.add('liked');
      }
      localStorage.setItem(likedKey, JSON.stringify(Array.from(likedSet)));
    }

    function playSong(song){
      if(currentSongId === song.id && !audio.paused){
        // already playing -> pause
        audio.pause();
        playerToggle.textContent = 'Play';
        return;
      }

      // load and play
      audio.src = song.audio;
      audio.currentTime = 0;
      audio.play().catch(e => {
        // autoplay may be blocked; show play button text but still set source
        console.warn('Playback blocked (browser). User interaction required to hear audio.');
      });

      currentSongId = song.id;
      playerTitle.textContent = song.title;
      playerSub.textContent = song.meta;
      playerArt.style.backgroundImage = `url('${song.img}')`;
      playerBar.style.display = 'flex';
      playerToggle.textContent = 'Pause';
    }

    // audio events
    audio.addEventListener('play', () => playerToggle.textContent = 'Pause');
    audio.addEventListener('pause', () => playerToggle.textContent = 'Play');
    audio.addEventListener('ended', () => playerToggle.textContent = 'Play');

    playerToggle.addEventListener('click', () => {
      if(!audio.src) return;
      if(audio.paused) audio.play();
      else audio.pause();
    });

    // search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e)=>{
      const q = e.target.value.trim().toLowerCase();
      if(!q) renderSongs(songs);
      else {
        const filtered = songs.filter(s => s.title.toLowerCase().includes(q) || s.meta.toLowerCase().includes(q));
        renderSongs(filtered);
      }
    });

    // small helpers for buttons
    document.getElementById('createPlaylist').addEventListener('click', ()=> alert('Create playlist — UI stub (replace with your logic)'));
    document.getElementById('browsePod').addEventListener('click', ()=> alert('Browse podcasts — UI stub'));

    // initial render
    renderSongs(songs);
    renderArtists();

    // Accessibility: keyboard support for playing first song with Enter on highlighted play button
    document.addEventListener('keydown', (e)=>{
      if(e.key === ' ' && document.activeElement && document.activeElement.classList.contains('play-btn')){
        e.preventDefault();
        document.activeElement.click();
      }
    });