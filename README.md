# 算法漫步
能夠靈活視覺化任意演算法的動畫平台

## 隊伍資訊
隊伍: 薛爛了
隊員: 姚承希、吳赫宥、薛尹喆

- [專題摘要](https://hackmd.io/@YTP-XueMoney/B1AjpYOokl)
- [簡報](https://www.canva.com/design/DAGVC0tQQfE/p5q3bah2w10lJHzIWX0NwA/view?utm_content=DAGVC0tQQfE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hf8e3dbb968)
- [歷程檔案](https://hackmd.io/@YTP-XueMoney/rkqG1zJT0)

## 動機

教社員競程/自學時，發現動畫能夠幫助理解，所以上網找更多演算法動畫，但是發現他們大多都是固定樣式(樹是樹、陣列是陣列，無法合併)，少有變化，而且操作流程與競程的不符，因此希望能做出自由度更高的演算法動畫製作網站，且以模擬競程為導向。


## 技術方案與架構設計
 - 可互動的動畫，依照使用者操作展現資料結構的多面向
 - 提供接近競程環境，利用程式繪圖，加入輸入輸出功能
 - 內建繪圖函式庫，使用者可以自行製作演算法or範例程式的動畫![image](https://hackmd.io/_uploads/rJe_Db5Osyl.png)
- 網站概覽圖:
![image](https://hackmd.io/_uploads/HyDRW9di1l.png)

## 目標客群
- 用戶：教授算法、題目的老師  & 學習的學生
- 使用流程：
  - 老師：上傳AC code，並利用動畫函式庫撰寫、建構動畫，傳給學生最後的程式碼(AC code + animation code)
  - 學生：拿老師寫好的程式碼生成動畫，執行此程式碼並且輸入測資，觀察網頁生成的動畫執行並與之互動

## 安裝與啟動
1. 安裝[node.js](https://nodejs.org/zh-tw/download)
2. `npm install`
3. 啟動開發伺服器`npm run dev`
