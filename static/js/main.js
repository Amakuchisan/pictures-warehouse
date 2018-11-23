window.onload = function(){
    let del = document.getElementById("delete");
    del.addEventListener("click", function(){
        alert('削除するファイルを選んでください');//alert以外に変えたい
        this.value = "削除する";
    });
    
}

function renderPictures() {
  const album = document.getElementById('alter-album');
  getPictures().then(pictures => {
    pictures.forEach(picture => {
      let img = document.createElement('img')
      img.src = picture
      img.addEventListener("click", () => deletePicture(picture))
      album.appendChild(img)
    })
  })
}

function getPictures() {
  return fetch("/api/pics", { headers: {'Content-Security-Policy': "default-src 'self'"}})
    .then(res => res.json())
}

function deletePicture(path) {
  return fetch("/api/pics?path="+path, { method: 'DELETE'})
    .then(res => res.json())
    .then(json => console.log(json))
}

window.addEventListener("load",  renderPictures);


//fetch('status')
