// 載入 express 並建構應用程式伺服器
const express = require('express') // (包含取得內建的body-parse)
const app = express() 
const port = 3000
//把mongoose抽出到config後，在app.js 要引用設定檔
require('./config/mongoose')


// require express-handlebars here
const exphbs = require('express-handlebars')

const Url = require('./models/url')
const shortenURL = require("./models/shortenURL")


// setting body-parser 改寫成 express，也可以直接取得 urlencoded 方法
app.use(express.urlencoded({ extended: true })) 


// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main' , extname: '.hbs'}))
//啟用template engine
app.set('view engine', 'hbs')

//使用靜態檔案
app.use(express.static("public"))


// 設定首頁路由
app.get('/', (req, res) => {
  //因為此作業規格不需要做列表，因此可以簡單render畫面就好
    res.render('index')
  // Url.find() // 取出 Url model 裡的所有資料
  //   .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
  //   .then(urls => res.render('index', { urls })) // 將資料傳給 index 樣板 這裡 { urls } 是 { urls: urls } 的縮寫。
  //   .catch(error => console.error(error)) // 錯誤處理

    
})

app.post('/', (req, res) => {
  if (!req.body.url) return res.redirect("/") //如果沒有輸入url網址就點擊送出，導回首頁
  const shortURL = shortenURL(5)

  Url.findOne({ originalURL: req.body.url })
    .then(data =>
      data ? data : Url.create({ shortURL, originalURL: req.body.url })
    )
    .then(data =>
      res.render("index", {
        origin: req.headers.origin,
        shortURL: data.shortURL,
      })
    )
    .catch(error => console.error(error))

})

//
app.get("/:shortURL", (req, res) => {
  const { shortURL } = req.params

  Url.findOne({ shortURL })
    .then(data => {
      if (!data) {
        return res.render("error", {
          errorMsg: "Can't find the URL",
          errorURL: req.headers.host + "/" + shortURL,
        })
      }

      res.redirect(data.originalURL)
    })
    .catch(error => console.error(error))
})

// 設定 port 3000
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})