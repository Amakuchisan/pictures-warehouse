//function submitBtn(){
//    btn.disabled=true;
//}

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

//delete

function deletePicture(path) {
//    if (confirm("本当に消しますか？")){
        return fetch("/api/pics?path="+path, { method: 'DELETE'})
          .then(res => res.json())
          .then(json => console.log(json))
//        .then(location.reload(true))
//    }
}

window.addEventListener("load",  renderPictures);
