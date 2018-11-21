import os
import glob
import re
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__, static_folder='static')

#拡張子の指定
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'gif', 'PNG'])
#アップロードの上限サイズを1MBにする
app.config['MAX_CONTENT_LENGTH'] = 1*1024*1024

UPLOAD_FOLDER = './static/pic'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#OKな拡張子の設定
def allowed_file(filename):
   return '.' in filename and filename.rsplit('.', 1)[-1] in ALLOWED_EXTENSIONS

@app.route("/")
def hello():
    return render_template('top.html')


# /pics内の処理
@app.route('/pics', methods=['GET', 'POST'])
def pictures():
    pictures = glob.glob('static/pic/*')
    if request.method == 'GET':
        return render_template('pic.html', pictures=pictures)
    elif request.method == 'POST':
        try:
            img_file = request.files['img_file']
        except:
            img_file = None
        # ファイルがあれば
        if img_file and allowed_file(img_file.filename) :
            filename = img_file.filename
            #ここのifに重複しているときに入るようにする
            if 'static/pic/'+filename in glob.glob('static/pic/*'):
                count_same = 1
                for file_name in glob.glob('static/pic/*'):
                    match = re.match('static/pic/' + filename[:filename.index('.')] + '\(', file_name)
                    if match:
                        count_same += 1
                else:
                    filename = '{0}({1}){2}'.format(filename[:filename.index('.')], count_same, filename[filename.index('.'):])
            #含まれる個数をカウントして，増やすようにする
            # 保存する
            img_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            pictures = glob.glob('static/pic/*')
            return render_template('pic.html', pictures=pictures)
        elif img_file:
            pictures = glob.glob('static/pic/*')
            return render_template('pic.html', pictures=pictures, status = 'BadFileName')
        else:
            pictures = glob.glob('static/pic/*')
            return render_template('pic.html', pictures=pictures, status = 'NoFile')
    else:
        return redirect(url_for('pictures'))
        print('error')
