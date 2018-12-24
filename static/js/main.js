/*------画像を表示する------*/
function renderPictures() {
  const album = document.getElementById('alterAlbum');
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
          showPicture(img)
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
  let pictures = document.querySelectorAll("#alterAlbum > img")
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

function afterPost(formData) {
  const input = document.getElementById('imgFile');
  const btn = document.getElementById('submitBtn');
  btn.disabled = false;
  btn.value="送信";
  input.value = "";
  formData = new FormData();
  renderPictures();
}


/*----------------------------------------------------------------------------*/

/*------写真を大きく表示する------*/

function showPicture(img_pic){
  const table = document.getElementById('picTable');
  const album = document.getElementById('alterAlbum');
  let picture = "static/pic/" + img_pic.src.split('/').pop() //画像のパスの指定
  while (table.firstChild) table.removeChild(table.firstChild);
  let img = document.createElement('img')
  img.src = picture
  img.classList.add('table')
  table.appendChild(img)
  table.style.display = 'block'

  document.onkeydown = function(e) {
    if (e) event = e;
    if (event) {
      if (event.keyCode == 27) { //Escキー
        table.style.display = 'none'
        table.removeChild(table.firstChild)
        img.classList.remove('table')
      }else if (event.keyCode == 39) { //右矢印キー
        showPicture(next(img_pic)) //次の画像を表示
      }else if(event.keyCode == 37) { //左矢印キー
        showPicture(previous(img_pic)) //前の画像を表示
      };
    };
  };


  document.getElementById('slideShow').addEventListener('click', () => {
    while (table.firstChild) table.removeChild(table.firstChild);
    img.classList.remove('table')
    table.style.display = 'none'
    slideShow(img_pic)
  });

  img.addEventListener('click', () => {
    table.style.display = 'none'
    while (table.firstChild) table.removeChild(table.firstChild);
    img.classList.remove('table')
  })
}

function next(node) {
  const album = document.getElementById('alterAlbum');
  if(node.nextElementSibling) return node.nextElementSibling
  return album.firstElementChild
}

function previous(node) {
  const album = document.getElementById('alterAlbum');
  if(node.previousElementSibling) return node.previousElementSibling
  return album.lastElementChild
}

/*-----------------------------------------------------------------------------*/
/*スライドショーを流す*/
function slideShow(img_pic){
  const slide = document.getElementById('picSlide');
  const album = document.getElementById('alterAlbum');
  let picture = img_pic.src.substr(img_pic.src.indexOf("static", -1))
  let timerId
  while (slide.firstChild) slide.removeChild(slide.firstChild);
  let img = document.createElement('img')
  img.src = picture
  img.classList.add('slide')
  slide.appendChild(img)
  slide.style.display = 'inline'
 
  document.onkeydown = function(e) {
    if (e) event = e;
    if (event) {
      if (event.keyCode == 27) {
        slide.style.display = 'none'
        while (slide.firstChild) slide.removeChild(slide.firstChild);
        img.classList.remove('slide')
        clearTimeout(timerId);
        return
      }
    }
  }



  img.addEventListener('click', () => {
    slide.style.display = 'none'
    while (slide.firstChild) slide.removeChild(slide.firstChild);
    img.classList.remove('slide')
    clearTimeout(timerId);
  });
  let photo = next(img_pic)
  if (photo == null) photo = album.firstChild
  timerId = setTimeout(function(){
  slideShow(photo)
  }, 1500);
};


/*-----------------------------------------------------------------------------*/

window.addEventListener("load", () => renderPictures());
window.addEventListener("load", () => {
  let formData = new FormData();
  const upload = () => {
    const btn = document.getElementById('submitBtn');
    file = document.getElementById('imgFile');
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
      if(json["status"] == "false"){
        alert(json["message"])
      }
      afterPost(formData);
    }).catch(err => {
      alert("ファイルサイズが2MBを超えていませんか?")
      afterPost(formData);}
    )
  };

  document.getElementById('submitBtn').addEventListener('click', upload, false);
  const input = document.getElementById('imgFile');
  input.addEventListener("change", () => {
    formData = new FormData();
    formData.append('imgFile', input.files[0]);
  });
  const album = document.getElementById('alterAlbum')
  const table = document.getElementById('picTable');
 
  document.getElementById('slideShow').addEventListener('click', () => {
    if(!album.hasChildNodes()) return
    if(table.hasChildNodes()) return
    slideShow(album.firstChild)
  })
})
