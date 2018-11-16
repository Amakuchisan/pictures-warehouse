import os
import glob
from flask import Flask, render_template, request

app = Flask(__name__, static_folder='static')

UPLOAD_FOLDER = './static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
def hello():
    return "Hello world"


@app.route('/pics')
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
            # 保存する
            img_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            pictures = glob.glob('static/*')
            return render_template('index.html', pictures=pictures)
