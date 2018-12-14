/*------画像を投稿する------*/
function renderPictures() {
  const album = document.getElementById('alter-album');
  const del = document.getElementById('delete')
  del.value = '削除' // この2行はここでやる処理か?
  while (album.firstChild) album.removeChild(album.firstChild);
  getPictures().then(pictures => {
    pictures.forEach(picture => {
      let img = document.createElement('img')
      img.src = picture
      album.appendChild(img)
      img.addEventListener("click", () => {
        if(del.value == '削除'){
          showPicture(img, picture)
        }else{
          img.classList.toggle('select')
        }
      })
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
  console.log('delete')
  let pictures = document.querySelectorAll("img")
  pictures.forEach(picture => {
    picture.addEventListener("click", function(){
    })
  })
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

/*------キャンセル------*/

document.getElementById('cansel').addEventListener("click", () => {
  const del = document.getElementById('delete')
  if(del.value == '削除する!!'){
    del.value = '削除'
    document.querySelectorAll("img.select").forEach(picture => {
      picture.className = ''
    })
  }
})
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
      alert("ファイルサイズが2MBを超えていませんか?")
      afterPost();}
  )
};

const onSelectFile = () => upload();
document.getElementById('submit_btn').addEventListener('click', onSelectFile, false);


/*----------------------------------------------------------------------------*/

/*------写真を表示する------*/

function showPicture(img_pic, picture){
  const table = document.getElementById('pic_table');
  const album = document.getElementById('alter-album');
  let pictures = album.childNodes;
  while (table.firstChild) table.removeChild(table.firstChild);
  let img = document.createElement('img')
  img.src = picture
  img.classList.toggle('table')
  table.appendChild(img)
  table.style.display = 'inline'
 
  document.onkeydown = function(e) {
    if (e) event = e;
    if (event) {
      if (event.keyCode == 27) {
        table.style.display = 'none'
      }else if (event.keyCode == 39){
        let photo = next(img_pic)
        if(photo != null){
          path = photo.src.substr(photo.src.indexOf("static", -1))
          showPicture(photo, path);
        }else{
          showPicture(album.firstChild, album.firstChild.src.substr(album.firstChild.src.indexOf("static", -1)))
        }
      }else if(event.keyCode == 37){
        let photo = previous(img_pic)
        if(photo != null){
          path = photo.src.substr(photo.src.indexOf("static", -1))
          showPicture(photo, path);
        }else{
          showPicture(album.lastChild, album.lastChild.src.substr(album.lastChild.src.indexOf("static", -1)))
        }

      }
    }
  };
 
  img.addEventListener('click', () => {table.style.display = 'none'})
}


function previous(node, selector) {
  if (selector && document.querySelector(selector) !== node.previousElementSibling) {
    return null;
  }
  return node.previousElementSibling;
}

function next(node, selector) {
  if (selector && document.querySelector(selector) !== node.nextElementSibling) {
    return null;
  }
  return node.nextElementSibling;
}
/*-----------------------------------------------------------------------------*/


/*-----------------------------------------------------------------------------*/

window.addEventListener("load",  () => renderPictures());
window.addEventListener("load", () => {
  const input = document.getElementById('img_file');
  input.addEventListener("change", () => {
    formData = new FormData();
    formData.append('img_file', input.files[0]);
  });
})


