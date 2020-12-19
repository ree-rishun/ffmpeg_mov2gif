const { createFFmpeg, fetchFile } = FFmpeg
const ffmpeg = createFFmpeg({ log: true })

// エレメントの定義
const imagePreview = document.getElementById('imagePreview')
const videoPreview = document.getElementById('videoPreview')

// 入力ファイルの格納変数
let videoFile = null

// 入力ファイルのアップデート
async function updateVideo ({ target: { files } }) {
  console.log(files)
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

  console.log('入力ファイルチェック')
  console.log(videoFile)

  // FFmpegの読み込み
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }
  ffmpeg.FS('writeFile', videoFile[0].name, await fetchFile(videoFile[0]))
  await ffmpeg.run('-i', videoFile[0].name, '-r', '10', 'output.gif')
  const data = ffmpeg.FS('readFile', 'output.gif')

  imagePreview.src = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }))
  imagePreview.style.display = 'block'
}

// リサイズ値のアップデート

// 処理開始ボタンのクリック時処理
document
  .getElementById('convertButton').onclick = function() {
  convertGIF()
}

// ファイル入力の監視
document
  .getElementById('videoFile')
  .addEventListener('change', updateVideo)

// リサイズ値の監視
const resize_range = document.getElementById('videoResize_range')
const resize_numberX = document.getElementById('videoResize_numberX')
const resize_numberY = document.getElementById('videoResize_numberY')

resize_range.addEventListener('input', function () {
  resize_numberY.value = resize_range.value
})
resize_numberX.addEventListener('input', function () {
  resize_range.value = resize_numberX.value
})
resize_numberY.addEventListener('input', function () {
  resize_range.value = resize_numberY.value
})
