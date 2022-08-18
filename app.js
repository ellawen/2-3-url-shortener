// 載入 express 並建構應用程式伺服器
const express = require('express') // (包含取得內建的body-parse)
const app = express() 


// require express-handlebars here
const exphbs = require('express-handlebars')

const Url = require('./models/url')

//把mongoose抽出到config後，在app.js 要引用設定檔
require('./config/mongoose')


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
  Url.find() // 取出 Url model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(urls => res.render('index', { urls })) // 將資料傳給 index 樣板 這裡 { urls } 是 { urls: urls } 的縮寫。
    .catch(error => console.error(error)) // 錯誤處理
})

app.post('/', (req, res) => {
  if (!req.body.url) return res.redirect("/") //如果沒有輸入url網址就點擊送出，導回首頁
  const shortURL = shortenURL(5)

  URL.findOne({ originalURL: req.body.url })
    .then(data =>
      data ? data : URL.create({ shortURL, originalURL: req.body.url })
    )
    .then(data =>
      res.render("index", {
        origin: req.headers.origin,
        shortURL: data.shortURL,
      })
    )
  //   .catch(error => console.error(error))
  // const url = req.body.url      // 從 req.body 拿出表單裡的 name 資料
  // return Url.create({ url })     // 存入資料庫
  //   .then(() => res.redirect('/')) // 新增完成後導回首頁
  //   .catch(error => console.log(error))
})

//
app.get("/:shortURL", (req, res) => {
  const { shortURL } = req.params

  URL.findOne({ shortURL })
    .then(data => {
      if (!data) {
        return res.render("error", {
          errorMsg: "Can't found the URL",
          errorURL: req.headers.host + "/" + shortURL,
        })
      }

      res.redirect(data.originalURL)
    })
    .catch(error => console.error(error))
})

// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})