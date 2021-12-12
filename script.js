$(document).ready(function () {

    //var toggle = true;
    var localPlaylist = localStorage.getItem('playlist');
    var foundSong = false;
    var foundSongName;
    var clickThis;
    var addSongArr = localPlaylist ? JSON.parse(localPlaylist) : [];
    var newSongArr = [];
    var isPlaying = false;
    var imgDataElNum;
    var beenCleared = false;
    var artistName;
    $('#lyrix').hide();
    $('#add').hide();
    $('#remove').hide();
    $('#clear').hide();
    $('#searchButton').on('click', function (event) {
        
        $('#songRow').empty();
        
        var artist = $('#searchInput').val();

        $.ajax({
            headers: {
                "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                "x-rapidapi-key": "4e31acf4c0mshe9fe802121748ecp15e1f1jsn3259148dce29"
            },
            url: "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $('#add').show();
            $('#clear').show();
            //create song div
            for (var i = 0; (i < response.data.length ); i++) {
                artistName = response.data[i].artist.name;
                var titleDiv = $(`<div class="column" id="songSpot" data-number=${i} data-preview=${response.data[i].preview} >`);
                titleDiv.attr('style', 'background-size: cover; background-repeat: no-repeat, repeat; background-image: url("' + response.data[i].album.cover + '");');
                titleDiv.html("<span id='songTitle'>" + response.data[i].title + "<span>");
                
                $('#songRow').append(titleDiv);
                $('#songRow').attr('style', 'padding:20px;margin-bottom:20px;');
            }
        })
    })

    function selectToggle(compareSong) {

        $("#songLyrix").html('');
       
        getLyrix(compareSong, artistName);
      
        if (addSongArr.length > 0) {
            for (var i = 0; i < addSongArr.length; i++) {
                
                if (addSongArr[i].title === compareSong) {
                    foundSongName = addSongArr[i].title;
                    foundSong = true;
                }
            }
        }

        if (!foundSong) {
            
            clickThis.css('border', '5px solid purple');
            
            
            addSongArr.push({
                id: clickThis.attr('data-number'),
                title: clickThis.text(),
                preview: clickThis.attr('data-preview'),
                artist: artistName
            });
            
        } else {
            clickThis.css('border', '5px solid black');
            
            newSongArr = addSongArr.filter(function (val) {
                
                return val.title !== foundSongName;
            });
           
            localStorage.setItem('playlist', JSON.stringify(newSongArr));

            addSongArr = newSongArr;

            foundSong = false;
        }
        
    }
    function addToPlaylist() {
        $('#remove').show();
        $('#songRow').children().css('border', '5px solid black');
        //this function stops music so set var to not playing i.e. false
        isPlaying = false;
        //save playlist array to local storage;
        localStorage.setItem('playlist', JSON.stringify(addSongArr));
        //add playlist array to playlist div
        var playlistEl = $('#playlist');
        addSongArr.forEach(function (val) {

            
            var div = $('<div>');
            var preview = val.preview
            div.attr('id', 'playlistItem');
            div.attr('data-title', val.title);
            div.attr('data-artist', val.artist);
            div.attr('data-play', 'https://img.icons8.com/flat_round/24/000000/play--v1.png');
            div.attr('data-pause', 'https://img.icons8.com/flat_round/24/000000/pause--v1.png')
            div.attr('data-delete', 'https://img.icons8.com/plasticine/100/000000/filled-trash.png')
            div.html(val.title + `<span id='songBtn' style='float: right;'>
        <img src='https://img.icons8.com/flat_round/24/000000/play--v1.png' /></span>`);

            
            var audioElement = $("<audio>");

            audioElement.attr("src", preview);
            div.append(audioElement);
            playlistEl.append(div);

        })
        
    }

    function initPlaylist() {
        if (addSongArr.length > 0) {
            fromLocal = true;
            addToPlaylist();
        }else{
            $('#playlist').hide();
        }
    }

    $(document).on('click', '#playlistenItem', function (e) {
        var playMe = $(this)[0].childNodes[2];
        var thisEl = $(this);

        if (!isPlaying) {
            playMe.play();
            getLyrix(thisEl[0].getAttribute('data-title'), thisEl[0].getAttribute('data-artist'))
            var parentDiv;
            isPlaying = true;
            if (beenCleared) {
                imgDataElNum = 2;
            } else {
                imgDataElNum = 5;
            }
            parentDiv = $(this).parent()[0].childNodes[imgDataElNum];
            var pauseBtnData = parentDiv.getAttribute('data-pause');
            var pauseLocale = $(this)[0].childNodes[1].childNodes[1];
            pauseLocale.setAttribute('src', pauseBtnData);

            playMe.addEventListener('ended', function() {
                isPlaying = false;
                var parentDiv = $(this)[0].parentNode; 
                var playBtnData = parentDiv.getAttribute('data-play');
                var imgSrcEl = $(this)[0].previousSibling.children[0];
                imgSrcEl.setAttribute('src', playBtnData);     
            });
            } else {
                playMe.pause();
                isPlaying = false;
                var playBtnData = thisEl.attr('data-play');
                var imgEl = thisEl.children()[0].children[0];
                imgEl.setAttribute('src', playBtnData);
            }
        })

        $('#add').on('click', function (e) {
            beenCleared = true;
            $('#playlist').show();
            $('#remove').show();
            $('#playlist').empty();
            var h1 = $('<h2>');
            h1.text('SnapTrax Repo');
            var hr = $('<hr>');
            $('#playlist').append(h1);
            $('#playlist').append(hr);
            addToPlaylist();
    }