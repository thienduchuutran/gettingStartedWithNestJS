### Các bước cần làm để chạy dự án NestJS

#### 1. Cài đặt thư viện với câu lệnh: npm i

#### 2. Chạy dự án với câu lệnh: npm run dev

=================

Tác giả: Hỏi Dân IT

Mọi thông tin về Tác giả Hỏi Dân IT, các bạn có thể tìm kiếm tại đây:

Website chính thức: https://hoidanit.com.vn/

Youtube “Hỏi Dân IT” : https://www.youtube.com/@hoidanit

Tiktok “Hỏi Dân IT” : https://www.tiktok.com/@hoidanit

Fanpage “Hỏi Dân IT” : https://www.facebook.com/askITwithERIC/

Udemy Hỏi Dân IT: https://www.udemy.com/user/eric-7039/

#######################################################################################
passport local is used to log in
passport local helps nestjs access database to check if username and password valid. If so, issue jwt (and this is when we need passport-jwt)

JWT guard gets token from header (req.headers) then decode token
if token valid then JWT guard is informed then allow to access resources
