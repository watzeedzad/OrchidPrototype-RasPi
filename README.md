# OrchidPrototype-RasPi (Controller Gateway)

## วิธีการติดตั้ง
 - ทำการ clone ตัวโปรเจคโดยใช้คำสั่ง git clone
```
git clone https://github.com/watzeedzad/OrchidPrototype-RasPi.git
```
 - สร้างไฟล์ .env โดยที่สร้างตามตัวอย่างไฟล์ .env.example
 ```
 DB_HOST="your-host/your-db-name"
 DB_USER="your-db-username"
 DB_PASS="your-db-password"
 ```
 - แก้ไขค่า environment variable ต่าง ๆ ให้ตรงตาม environment นั้น ๆ โดยที่
 ```
 DB_HOST : your-host คือ ip และ post ของ database ส้วน your-db-name คือชื่อของ database ที่จะใช้
 DB_USER : username ที่ใช้ในการ authentication กับ database
 DB_PASS : password ที่ใช้ในการ authentication กับ database
 ```
 - ติดตั้ง dependentcy โดยที่ใช้คำสั่ง
 ```
 npm install
 ```
## วิธีการรัน
 - ไปที่ root folder และใช้คำสี่ง
 ```
 npm start
 ```
