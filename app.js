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
  // FFmpegの読み込み
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
  const videoName = videoFile[0].name

  // MEMFSへ保存
  ffmpeg.FS('writeFile', videoName, await fetchFile(videoFile[0]))

  // コマンドの実行
  await ffmpeg.run('-i', videoName, '-r', '10', 'output.gif')

  // MEMFSからファイルを取得
  const data = ffmpeg.FS('readFile', 'output.gif')

  // 変換結果を表示
  imagePreview.src = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }))
  imagePreview.style.display = 'block'

  // データのリンク解除
  ffmpeg.FS('unlink', videoName)
  ffmpeg.FS('unlink', 'output.gif')
}

// 進行情報の表示
function displayProgress (progress) {
  // 送信ボタン部分に進行状況を表示
  convertButton.innerText = Math.round(100 * progress.ratio) + '%'

  // 変換が完了したら変換ボタンに戻す
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

