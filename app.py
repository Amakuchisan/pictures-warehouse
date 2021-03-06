import os
import glob
import re
from flask import send_from_directory #favicon
from werkzeug.exceptions import RequestEntityTooLarge, BadRequest
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_folder='static')

#拡張子の指定
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'gif', 'PNG'])
#アップロードの上限サイズを2MBにする
app.config['MAX_CONTENT_LENGTH'] = 2*1024*1024
app.config['SECRET_KEY'] = os.urandom(24)

UPLOAD_FOLDER = './static/pic'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#OKな拡張子の設定
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[-1] in ALLOWED_EXTENSIONS

@app.route("/")
def hello():
    return render_template('top.html')

# /pics内の処理
@app.route('/pics', methods=['GET'])
def pictures():
    pictures = glob.glob('static/pic/*')
    if request.method == 'GET':
        return render_template('pic.html')
    else:
        print('error')
        return render_template('pic.html')

@app.route('/api/pics', methods=['GET', 'POST', 'DELETE'])
def api_pictures():
    if request.method == 'GET':
        pictures = glob.glob('static/pic/*')
        return jsonify(pictures)

    elif request.method == 'POST':
        img_file = None
        try:
            img_file = request.files['img_file']
        except RequestEntityTooLarge as err:
            print("toolarge err:{}".format(err))
            return jsonify({'status': "false",
                            'message': "アップロード可能なファイルサイズは2MBまでです"}), 413
        except BadRequest as e:
            print(e)
            return jsonify({'status': "false",
                            "message": e.description})
        except:
            print('error')
            return jsonify({'status': "false",
                            "message": "error"})
        # ファイルがあれば
        if img_file and allowed_file(img_file.filename):
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
            return jsonify(pictures)
        elif img_file:
            pictures = glob.glob('static/pic/*')
            #拡張子がダメ
            return jsonify({'status': "false",
                            'message': "アップロード可能な拡張子は[png, jpg, gif]です"})
        else:
            print('ERROR!!何かの条件に満たないファイルがアップロードされました') 
            return jsonify({'status': "false",
                            'message': "何かの状態に満たないファイルがアップロードされました"})

    elif request.method == 'DELETE':
        # TODO: ここに画像を消すための処理 
        path = request.args.get('path')
        os.remove('./'+path)
        return jsonify({'message': "{} deleted".format(path)})
    else:
        print('error')
        return jsonify({'message': "error"})

#@app.route('/favicon.ico')
#def favicon():
#    return send_from_directory(os.path.join(app.root_path, 'static'),
#                            'favicon.ico', mimetype='image/vnd.microsoft.icon')
