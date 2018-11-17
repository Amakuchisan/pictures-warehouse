import os
import glob
from flask import Flask, render_template, request

app = Flask(__name__, static_folder='static')

#アップロードの上限サイズを1MBにする
app.config['MAX_CONTENT_LENGTH'] = 1*1024*1024

UPLOAD_FOLDER = './static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
def hello():
    return "Hello world"


# /pics内の処理
@app.route('/pics', methods=['GET', 'POST'])
def pictures():
    pictures = glob.glob('static/*')
    if request.method == 'GET':
        return render_template('index.html', pictures=pictures)
    else:
        img_file = request.files['img_file']
        # ファイルがあれば
        if img_file :
            filename = img_file.filename
            #ここのifに重複しているときに入るようにする
            if 'static/'+filename in glob.glob('static/*'): 
                filename = '{0}{1}{2}{3}{4}'.format(filename[:filename.index('.')], '(', glob.glob('static/*').count('static/'+filename), ')', filename[filename.index('.'):])
                #含まれる個数をカウントして，増やすようにする
            # 保存する
            img_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            pictures = glob.glob('static/*')
            return render_template('index.html', pictures=pictures)
