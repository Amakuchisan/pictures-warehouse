window.onload = function(){
    let del = document.getElementById("delete");
    del.addEventListener("click", function(){
        alert('削除するファイルを選んでください');//alert以外に変えたい
        this.value = "削除する";
    });
    
}

//fetch('status')
