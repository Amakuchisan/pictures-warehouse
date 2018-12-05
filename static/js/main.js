/*------画像を投稿する------*/
function renderPictures() {
  const album = document.getElementById('alter-album');
  while (album.firstChild) album.removeChild(album.firstChild);
  getPictures().then(pictures => {
    pictures.forEach(picture => {
      let img = document.createElement('img')
      img.src = picture
      console.log(picture)
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
document.getElementById('delete').addEventListener("click", () => {
  if(document.getElementById('delete').value == '削除'){
    del()
  }else{
    deletePicture()
    renderPictures()
    document.getElementById('delete').value = "削除"
  }
})
function del (){
    const del = document.getElementById('delete')
    del.value = "削除する!!"
    let pictures = document.querySelectorAll("img")
    pictures.forEach(picture => {
        picture.addEventListener("click", function(){
            if(picture.className){
              picture.className = '';
            }else{
              picture.className = 'select';
            }
        })
    }) 
//    document.getElementById('delete').addEventListener("click", () => {
//      deletePicture()
//      renderPictures()
//      document.getElementById('delete').value = "削除"
//    })
}

function deletePicture() {
  let pictures = document.querySelectorAll("img.select")
  pictures.forEach(picture => {
    path = picture.src.substr(picture.src.indexOf("static", -1))
    fetch("/api/pics?path="+path, { method: 'DELETE'})
//      .then(res => res.json())
//      .then(json => renderPictures())
    picture.className = '';
  })
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


