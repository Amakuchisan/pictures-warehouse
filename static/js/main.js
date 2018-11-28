/*-----------------------------------------------------------------------------*/
//submitBtn
function submitBtn(btn){
  let form = document.getElementByID('file_post');
  btn.disabled=true;
  btn.value="送信中";
  document.getElementByID('file_post').action = "/api/pics";
  form.target = "form_response";
//  btn.action = "/pics";
  btn.form.submit();
    
//  fetch("/api/pics", {method: 'POST'} { headers: {'Content-Security-Policy': "default-src 'self'"}})
//    .then(res => res.json())
//    .then(res => console.log())
  //postPictures();
}

function renderPictures() {
  const album = document.getElementById('alter-album');
  while (album.firstChild) album.removeChild(album.firstChild);
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
  if (confirm("本当に消しますか？")){
    fetch("/api/pics?path="+path, { method: 'DELETE'})
      .then(res => res.json())
      .then(json => renderPictures())
  }
}

/*------------------POST------------------*/
//function postPictures(message){
//  fetch("/api/pics", { method: 'POST' })
//    .then(res => res.json())
//}

window.addEventListener("load",  renderPictures);
