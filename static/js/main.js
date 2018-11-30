/*------画像を投稿する------*/
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


/*------画像を削除する------*/
function deletePicture(path) {
  if (confirm("本当に消しますか？")){
    fetch("/api/pics?path="+path, { method: 'DELETE'})
      .then(res => res.json())
      .then(json => renderPictures())
  }
}

/*----------------------------------------------------------------------------*/

function get_func(url) {
  fetch(url)
    .then(() => renderPictures())
}


const formData = new FormData();
const input = document.getElementById('img_file');

formData.append('img_file', input.files[0]);

const upload = (file) => {
  fetch('/api/pics', {
    method: 'POST',
    body: formData ,
  }).then(res => res.json()
  ).then(json => {
    console.log(json)
    get_func('/pics');
  });
};

const onSelectFile = () => upload(input.files[0]);
document.getElementById('submit_btn').addEventListener('click', onSelectFile, false);


/*----------------------------------------------------------------------------*/



window.addEventListener("load",  renderPictures);
