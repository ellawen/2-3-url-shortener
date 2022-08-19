const shortenURL_Length = (length) => {
  
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  const n = length || 5
  for (let i = 0; i < n; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

module.exports = shortenURL_Length

//下列為觀摩model answer的做法
// //短網址輸出格式為 5 碼英數組合，由 0-9、a-z、A-Z 組成
// const BASE_62_CHAR = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
// //最大 Index (26+26+10-1)
// const MAX = 61
// //最小 Index 
// const MIN = 0

// /**
//  * 依照輸入的短網址長度，產生對應的亂數字串
//  * @param {number} shortenURL_Length
//  */

// module.exports = (shortenURL_Length) => {
//   //負責儲存對應的字元
//   let result = ""

//   for (let i = 0; i < shortenURL_Length; i++) {
//     //產生亂數 Index
//     const randomIndex = Math.floor(Math.random() * (MAX - MIN + 1) + MIN)
//     //依照亂數表找出對應的字元
//     const chooseChar = BASE_62_CHAR[randomIndex]
//     //將對應字元放入 result
//     result += chooseChar
//   }

//   //回傳，即為亂數字串
//   return result
// }

