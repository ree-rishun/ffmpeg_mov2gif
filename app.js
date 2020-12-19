const { createFFmpeg, fetchFile } = FFmpeg
const ffmpeg = createFFmpeg({ log: true, progress: p => displayProgress(p)})

// エレメントの定義
const imagePreview = document.getElementById('imagePreview')    // GIF変換結果
const videoPreview = document.getElementById('videoPreview')    // アップロード動画プレビュー
const convertButton = document.getElementById('convertButton')  // 変換ボタン

// 入力ファイルの格納変数
let videoFile = null

// 入力ファイルのアップデート
async function updateVideo ({ target: { files } }) {
  // ビデオファイルのアップデート
  videoFile = files

  // プレビューの表示
  videoPreview.src = window.URL.createObjectURL(files[0])
  videoPreview.style.display = 'block'
}

// GIFへの変換処理
async function convertGIF () {
  // メッセージエリアを取得
  let messageArea = document.getElementById('inputfiles');

  // FFmpegの読み込み
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }

  // ファイルに変換
  ffmpeg.FS('writeFile', videoFile[0].name, await fetchFile(videoFile[0]))

  // コマンドの実行
  await ffmpeg.run('-i', videoFile[0].name, '-r', '10', 'output.gif')

  // 変換結果を取得
  const data = ffmpeg.FS('readFile', 'output.gif')

  // 変換結果を表示
  imagePreview.src = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }))
  imagePreview.style.display = 'block'
}

// 進行情報の表示
function displayProgress (progress) {
  console.log(progress)
  convertButton.innerText = Math.round(100 * progress.ratio) + '%'

  if (progress.ratio >= 1) {
    setTimeout(
      function () {
        convertButton.innerText = 'GIF画像に変換'
      },
      1000
    )
  }
}

// 処理開始ボタンのクリック時処理
convertButton.onclick = function() {
  convertGIF()
}

// ファイル入力の監視
document
  .getElementById('videoFile')
  .addEventListener('change', updateVideo)

