import os
import time
from flask import Flask, request, render_template, render_template_string
from utils.scraper import fetch_images_and_title

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    thread_url = None
    thread_title = None
    images = []
    warning_message = None  # 警告メッセージを格納する変数
    current_timestamp = int(time.time())  # 現在の Unix タイムスタンプを取得

    if request.method == "POST":
        # ユーザー入力URL
        thread_url = request.form.get("url")
        if thread_url:
            # URLがあにまん掲示板か確認
            if "https://bbs.animanch.com/" not in thread_url:
                warning_message = "あにまん掲示板でおねがいします"
                thread_url = "https://bbs.animanch.com/"
            else:
                # スレッドタイトルと画像を取得
                thread_title, images = fetch_images_and_title(thread_url)

    return render_template(
        "index.html",
        thread_url=thread_url,
        thread_title=thread_title,
        images=images,
        warning_message=warning_message,
        current_timestamp=current_timestamp  # タイムスタンプを渡す
    )
@app.route("/favorites", methods=["GET"])
def favorites():
    return render_template("favorite.html")
@app.route("/view-thread", methods=["GET"])
def view_thread():
    thread_url = request.args.get("url")
    if not thread_url:
        return "URLが提供されていません", 400

    # スレッドの情報を取得
    thread_title, images = fetch_images_and_title(thread_url)
    # 現在のタイムスタンプを取得
    current_timestamp = int(time.time())
    return render_template(
        "view_thread.html",
        thread_url=thread_url,
        thread_title=thread_title,
        images=images,
        current_timestamp=current_timestamp  # タイムスタンプを渡す
    )
@app.route("/favorite-threads", methods=["GET"])
def favorite_threads():
    # フロントエンドでローカルストレージからURLを取得し、表示用に送信
    return render_template("favorite_threads.html")
@app.route("/fetch-thread-info", methods=["GET"])
def fetch_thread_info():
    thread_url = request.args.get("url")
    if not thread_url:
        return {"error": "URLが提供されていません"}, 400

    # スレッド情報を取得
    thread_title, _ = fetch_images_and_title(thread_url)

    if not thread_title:
        return {"error": "スレッドタイトルを取得できませんでした"}, 404

    return {"title": thread_title}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    #app.run(host="0.0.0.0", port=port)
    app.run(debug=True, host="0.0.0.0", port=5000)