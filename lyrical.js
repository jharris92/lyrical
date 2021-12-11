function getLyrix(artist, song) {
    if (artist != '' || song != '') {

        $.ajax({ 

            url: "https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=json&callback=callback&q_track=" + song + "&q_artist=" + artist + "&apikey=057fcae6cc1599a783e98bf3f2153ced",
            method: "GET"
        }).then(function (response) {
            if (JSON.parse(response).message.header.status_code != 404) {
                $('#lyrix').show();
                
                var data = JSON.parse(response);
                postToHtml(data);
            } else {
                var data = { message: { body: { lyrics: { lyrics_body: "Lyrics Not Available" } } } };
                postToHtml(data);
            }
        });

    } else { 
        $("#error").html('Field cannot be empty');
    }
}

function postToHtml(response) {
    $("#songLyrix").empty;
    var myLyrixString = JSON.stringify(response.message.body.lyrics.lyrics_body);
    var myEscapedLyrixString = myLyrixString.replace(/\\n/g, "<br>")
        .replace(/\\'|\\"|\\&|\\r|\\t|\\b|\\f/g, function (x) {
            return x.slice(1);
        })
    $("#songLyrix").html(myEscapedLyrixString.slice(1, myEscapedLyrixString.length - 1));
}