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