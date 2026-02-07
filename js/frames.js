   
function frames(variable){
    // Default: Home (si llega un número que no existe)
    document.getElementById("enframe").src = "pages/home.html";

    // 1) About me
    if (variable == 5){
        document.getElementById("enframe").src = "pages/about_me.html";
    }

    // 2) Writings
    else if (variable == 15){
        document.getElementById("enframe").src = "pages/EssaysIndex.html";
    }
    else if (variable == 16){
        document.getElementById("enframe").src = "pages/writingsonmusic.html";
    }
    else if (variable == 17){
        document.getElementById("enframe").src = "pages/Poetry.html";
    }
    else if (variable == 18){
        document.getElementById("enframe").src = "pages/others.html";
    }

    // 3) Music
    else if (variable == 19){
        document.getElementById("enframe").src = "pages/reviews.html";
    }
    else if (variable == 20){
        document.getElementById("enframe").src = "pages/Interviews.html";
    }
    else if (variable == 21){
        document.getElementById("enframe").src = "pages/thelist.html";
    }

    // 4) Miscellaneous
    else if (variable == 22){
        document.getElementById("enframe").src = "pages/misc_wikipedia.html";
    }
    else if (variable == 23){
        document.getElementById("enframe").src = "pages/misc_oracle.html";
    }
    else if (variable == 24){
        document.getElementById("enframe").src = "pages/misc_favorite_websites.html";
    }
    else if (variable == 25){
        document.getElementById("enframe").src = "pages/misc_favorite_yt.html";
    }
    else if (variable == 26){
        document.getElementById("enframe").src = "pages/misc_poetry_anthology.html";
    }

    // 5) Blog
    else if (variable == 27){
        document.getElementById("enframe").src = "pages/blog.html";
    }
}

