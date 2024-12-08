//FormからURL取得
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("URLをコピーしました: " + text);
    }).catch(err => {
        alert("コピーに失敗しました: " + err);
    });
}
// 画像をお気に入りに追加
function addToFavorites(thumbUrl, imgUrl, resNumber, resLink) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push({ thumbUrl, imgUrl, resNumber, resLink });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("お気に入りに追加されました！");
}


// スレッドをお気に入りに追加
function addThreadToFavorites(threadTitle, threadUrl, threadThumb) {
    const favoriteThreads = JSON.parse(localStorage.getItem("favoriteThreads")) || [];
    favoriteThreads.push({ title: threadTitle, url: threadUrl, thumb: threadThumb });
    localStorage.setItem("favoriteThreads", JSON.stringify(favoriteThreads));
    alert("スレッドがお気に入りに追加されました！");
}

// お気に入り画像の一覧を表示
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const container = document.getElementById("favorites-container");
    favorites.forEach(fav => {
        const row = document.createElement("div");
        row.classList.add("row");
        row.innerHTML = `
            <div class="cell">
                <img src="${fav.img}" alt="お気に入り画像">
            </div>
            <div class="cell">
                <span>${fav.url}</span>
                <button class="remove-btn" onclick="removeFavorite('${fav.img}')">削除</button>
            </div>`;
        container.appendChild(row);
    });
}

// 画像をお気に入りから削除
function removeFavorite(imgSrc) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(fav => fav.img !== imgSrc);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    location.reload(); // ページをリロードして更新
}

// お気に入りスレッド一覧を表示
function displayFavoriteThreads() {
    const favoriteThreads = JSON.parse(localStorage.getItem("favoriteThreads")) || [];
    const container = document.getElementById("threads-container");

    if (favoriteThreads.length === 0) {
        container.innerHTML = "<p>お気に入りスレッドがありません。</p>";
    } else {
        container.innerHTML = ""; // 既存の内容をクリア
        favoriteThreads.forEach(thread => {
            const threadElement = document.createElement("div");
            threadElement.classList.add("thread-item");
            threadElement.innerHTML = `
                <div class="d-flex">
                    <img src="${thread.thumb}" alt="${thread.title}" class="thread-thumb">
                    <div class="card-body">
                        <h3>${thread.title}</h3>
                        <a href="${thread.url}" target="_blank">${thread.url}</a>
                    </div>
                </div>
                <button onclick="viewThread('${thread.url}')">表示</button>
                <button onclick="removeThread('${thread.url}')">削除</button>`;
            container.appendChild(threadElement);
        });
    }
}

// お気に入りスレッドを削除
function removeThread(url) {
    const favoriteThreads = JSON.parse(localStorage.getItem("favoriteThreads")) || [];
    const updatedThreads = favoriteThreads.filter(thread => thread.url !== url);
    localStorage.setItem("favoriteThreads", JSON.stringify(updatedThreads));
    displayFavoriteThreads(); // リストを再描画
}

// お気に入りスレッドを表示
function viewThread(url) {
    window.location.href = `/view-thread?url=${encodeURIComponent(url)}`;
}

// コピー機能
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("URLをコピーしました: " + text);
    }).catch(err => {
        alert("コピーに失敗しました: " + err);
    });
}

// DOM読み込み後に表示関数を実行
document.addEventListener("DOMContentLoaded", function() {
    const addThreadButton = document.getElementById("add-thread-btn");
    if (addThreadButton) {
        addThreadButton.addEventListener("click", function() {
            // ボタンのデータ属性から情報を取得
            const threadUrl = addThreadButton.getAttribute("data-thread-url");
            const threadTitle = addThreadButton.getAttribute("data-thread-title");
            const threadThumb = addThreadButton.getAttribute("data-thread-thumb");

            // 取得した情報を使用
            addThreadToFavorites(threadTitle, threadUrl, threadThumb);
        });
    }
    // お気に入りスレッド一覧を表示
    displayFavoriteThreads();
});