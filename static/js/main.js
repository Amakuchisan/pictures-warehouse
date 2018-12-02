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
  return fetch("/api/pics")
//  return fetch("/api/pics", { headers: {'Content-Security-Policy': "default-src 'self'"}})
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

function afterPost() {
  const input = document.getElementById('img_file');
  const btn = document.getElementById('submit_btn');
  btn.disabled = false;
  btn.value="送信";
  input.value = "";
  formData = new FormData();
  renderPictures();
}

let formData = new FormData();

const upload = () => {
  const btn = document.getElementById('submit_btn');
  file = document.getElementById('img_file');
  if (!file.value){
    return false;
  }
  btn.disabled = true;
  btn.value="送信中";
  fetch('/api/pics', {
    mode: 'cors',
    method: 'POST',
    body: formData ,
  }).then(res => res.json()
  ).then(json => {
    console.log(json)
    if(json["status"] == "false"){
      alert(json["message"])
    }
    afterPost();
  }).catch(err => {
      console.log(err)
      alert("大きすぎます．アップロード可能なファイルサイズは1MBまでです")
      afterPost();}
  )
};

const onSelectFile = () => upload();
document.getElementById('submit_btn').addEventListener('click', onSelectFile, false);


/*----------------------------------------------------------------------------*/



window.addEventListener("load",  renderPictures);
window.addEventListener("load", () => {
  const input = document.getElementById('img_file');
  input.addEventListener("change", () => {
    formData.append('img_file', input.files[0]);
  });
})


