# WebBaseMono
web base theo mô hình monolihic gồn auth server dùng ABP Framework,.net 6 và angular 14
# Cài đặt
1. >Net 6 SDK: https://dotnet.microsoft.com/en-us/download/dotnet/6.0
2. Node.js <= 16.1: https://nodejs.org/en/
3. Angular/Cli 14
````
npm i -g @angular/cli@14
``
4. yarn
````
npm i -g yarn
``
5. Redis: https://redis.io/docs/getting-started/installation/install-redis-on-windows/
6. Visual Studio 2022
7. Visual Studio Code
8. Sql Server 2019
# Môi trường dev
Chạy FE:
```
cd scr/angular
yarn
ng s -o --port 4201
```
Chạy BE:
1. Chạy redis sserver
```
sudo service redis-server start
```
2. Trong Visual Studio > tools > NUGet package manager
```
update-database
```
3. Chạy dự án DbMigrator
4. Chạy setup run multi project
- AuthServer: 5101
- ApiHost: 5102
- Tài khoản: admin, mật khẩu: Admin@123
2. Fix lỗi không tháy thư viện
- cd AuthServer
```
abp install-libs
```