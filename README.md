# Express Login

## Login
1. 從網頁輸入帳號及密碼
2. 收到帳號、密碼後，將密碼以md5及des3的方式加密(使用`LOGIN_API_KEY`加密)
3. 將帳號、加密後密碼傳回後台login api(需要`LOGIN_API_TOKEN`)
4. 後台api返回驗證token，將token以des3的方式加密(使用`COOKIE_DATA_KEY`加密)後，存入cookie中
5. 經路由導向至登入成功頁面

## Check Login
1. 確認是否有Cookie資料(尚未有檢測Cookie是否符合規定格式的機制)
2. 若無則跳出驗證錯誤訊息
3. 若有則進行Cookie驗證，先使用`COOKIE_DATA_KEY`解密，並將解密的session儲存
4. 另外再使用jwt解析(使用JWT_KEY)session中的用戶資料，並取出解析的用戶名稱
5. 將解密的session及用戶名稱傳至checkess api，api會回傳status號碼
6. 若status200則確認有登入，若狀態為其他值則重新導向至登入頁