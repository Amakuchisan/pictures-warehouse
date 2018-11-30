/*-----------------------------------------------------------------------------*/
//submitBtn
function submitBtn(btn){
 // let form = document.getElementByID('file_post');
//  btn.disabled=true;
//  btn.value="送信中";
}



/*----------------------------------------------------------------------------*/
function get_func(url) {
  fetch(url)
    .then(renderPictures)
}


function handle(fil){
  let btn = document.getElementById('submit_btn')
  btn.addEventListener('click', post_func(fil))
  console.log(btn)
  console.log(fil)
}


function post_func(files) {
  console.log(files)
})
    
/*
  // Postで送るパラメータを作成
  const url = '/api/pics'
  let formData = new FormData();
  formData.append('filename', document.getElementById('img_file'));
    fetch(url, {
      method: 'POST',  // methodを指定しないとGETになる
      body: formData,  // Postで送るパラメータを指定
    })
    .then(console.log(formData))
    .then(console.log(files))
    .then(function() {  // Postした後に結果をGetする（コールバックなのでPostが実行完了してから実行される）
      get_func('/pics');
    });

*/

}
/*----------------------------------------------------------------------------*/
/*    
// This will upload the file after having read it
// Select your input type file and store it in a variable
const input = document.getElementById('file_post');
const upload = (file) => {
  fetch('/api/pics', { // Your POST endpoint
    method: 'POST',
    headers: {
//"Content-Type": "You will perhaps need to define a content-type here"
    },
    body: file // This is your file object
  }).then(
  response => response.json() // if the response is a JSON object
  ).then(
    success => console.log(success) // Handle the success response object
    ).catch(
       error => console.log(error) // Handle the error response object
    );
};
// Event handler executed when a file is selected
const onSelectFile = () => upload(input.files[0]);
// Add a listener on your input
// It will be triggered when a file will be selected
input.addEventListener('change', file_post, false);

*/
/*---------------------------------------------------------------------*/

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
