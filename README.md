# เฝ้าระวังน้ำท่วมหาดใหญ่ (Hatyai Flood Watch)

เว็บแอปติดตามระดับน้ำและฝน จ.สงขลา (รวม อ.หาดใหญ่) แสดงสถานะรายสถานี รายอำเภอ แผนที่ พยากรณ์ฝน กล้อง CCTV จุดพักพิง รายงานจากประชาชน และแจ้งเตือนแบบ push ติดตั้งเป็นแอป (PWA) ได้ รองรับไทย อังกฤษ จีน

เว็บนี้จัดทำโดยประชาชนทั่วไป ไม่ใช่เว็บไซต์ของหน่วยงานรัฐ ระดับสถานะคำนวณอัตโนมัติ ไม่ใช่ประกาศเตือนภัยอย่างเป็นทางการ

เว็บจริง: https://hatyaifloodwatch.vercel.app

## เทคโนโลยี

Next.js 14 (App Router), React 18, TypeScript, Leaflet (แผนที่), web-push (แจ้งเตือน), zod (ตรวจรูปแบบข้อมูล), MediaPipe BlazeFace (เบลอใบหน้าในรูปรายงาน), Upstash Redis (เก็บข้อมูลและรูปบน Vercel)

## ข้อมูลมาจากไหน

ดึงผ่าน API ทั้งหมด ไม่มีการ scrape หน้าเว็บ

| ข้อมูล | แหล่ง | ไฟล์ | แคช |
|---|---|---|---|
| ระดับน้ำรายสถานี | ThaiWater API (สสน.) | lib/sources/thaiwater.ts | 10 นาที |
| พยากรณ์อากาศรายวัน | TMD NWP API (ต้องมี TMD_TOKEN) | lib/tmd.ts, lib/openmeteo.ts | 30 นาที |
| ฝนรายชั่วโมง 24 ชม. | Open-Meteo | lib/openmeteo.ts | 15 นาที |
| กล้อง CCTV และมาตรวัดคลอง | Hat Yai City Climate (hatyaicityclimate.org) | lib/cctv.ts | 5 นาที |
| เรดาร์ฝน | RainViewer (โหลดจากเบราว์เซอร์) | components/MapView.tsx | - |
| ขอบเขตตำบล | OCHA COD-AB (ไฟล์ในโปรเจกต์) | public/songkhla-tambons.geojson | - |

หมายเหตุเรื่อง data.go.th: เป็นพอร์ทัลข้อมูลเปิดแบบชุดข้อมูลที่อัปเดตเป็นรอบ ไม่เหมาะกับระดับน้ำแบบเรียลไทม์ จึงใช้ ThaiWater โดยตรงแทน ฝั่งเซิร์ฟเวอร์เป็นผู้เรียก API ทั้งหมด เบราว์เซอร์ไม่ได้ยิงไปแหล่งภายนอกเอง (ยกเว้นเรดาร์) ถ้าแหล่งใดล่ม หน้าจะแสดงสถานะว่างแทนที่จะพัง

## โครงสร้าง

- app/[locale]/ หน้าเว็บ: หน้าหลัก, map, area, forecast, shelters, updates, cctv, reports, notices, alerts, install, admin, privacy, terms, credits
- app/api/ stations, notices, shelters, report, cam/[id], push/(key|subscribe|test), cron/alerts, admin/login
- lib/ ตรรกะข้อมูล: status (คำนวณระดับเสี่ยง), alerts (ตัดสินว่าจะแจ้งอะไร), push (ส่ง web push), pushClient (สมัครรับแจ้งเตือนฝั่งเบราว์เซอร์), kv/store (เก็บข้อมูล), i18n (3 ภาษา), theme
- components/ ส่วนประกอบหน้าจอ เช่น Dashboard, MapView, AlertSettings, InstallPrompt, ReportFlood
- public/sw.js service worker (รับ push, หน้าออฟไลน์)

## ระดับสถานะ

คำนวณจากระดับน้ำเทียบตลิ่ง: วิกฤต (น้ำล้นตลิ่ง), เสี่ยงสูง (ต่ำกว่าตลิ่งไม่เกิน 0.3 ม.), เฝ้าระวัง (0.3 ถึง 1 ม.), ปกติ (เกิน 1 ม.)

## ติดตั้งและรัน

คัดลอก .env.example เป็น .env.local แล้วรัน:

```
npm install
npm run dev
```

ตั้ง MOCK=1 เพื่อใช้ข้อมูลจำลองตอนพัฒนาแบบออฟไลน์

## ตัวแปรสภาพแวดล้อม

| ชื่อ | ใช้ทำอะไร | จำเป็น |
|---|---|---|
| THAIWATER_URL, PROVINCE_CODE | เปลี่ยน endpoint หรือจังหวัด (ค่าเริ่มต้นสงขลา รหัส 90) | ไม่ |
| TMD_TOKEN | โทเคน API พยากรณ์ของกรมอุตุฯ (data.tmd.go.th) | หน้าพยากรณ์ |
| ADMIN_PASSWORD, ADMIN_SECRET | เข้าหน้า /th/admin และเซ็นคุกกี้ | ใช้ admin |
| UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN | ฐานข้อมูลบน Vercel (ประกาศ, ผู้สมัครแจ้งเตือน, รายงานและรูป) | บน Vercel |
| VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT | กุญแจ web push (VAPID_SUBJECT ต้องเป็น mailto: อีเมลจริง) | แจ้งเตือน |
| CRON_SECRET | รหัสป้องกัน /api/cron/alerts | แจ้งเตือน |
| OPERATOR_NAME, CONTACT_EMAIL | แสดงในหน้า PDPA และข้อกำหนด | ควรตั้ง |

## ระบบแจ้งเตือน (push)

1. ผู้ใช้ติ๊กยินยอมในหน้า /th/alerts เลือกอำเภอ ระดับ และเสียง แล้วเบราว์เซอร์สมัครรับ push ผ่านบริการของตัวเอง (FCM, Apple, Microsoft)
2. ข้อมูลการสมัครถูกเก็บใน Redis
3. ตัวตั้งเวลายิง GET /api/cron/alerts ทุก 5 นาทีพร้อมหัว Authorization: Bearer ตามค่า CRON_SECRET
4. เซิร์ฟเวอร์ตรวจระดับน้ำ ส่งเฉพาะตอนระดับสูงขึ้นถึงเกณฑ์ที่ผู้ใช้เลือก และไม่ส่งซ้ำสถานีเดิมภายใน 3 ชั่วโมง

สร้างกุญแจ VAPID ในเครื่องตัวเอง อย่าสร้างจากเว็บที่ไม่รู้จัก:

```
npm run vapid
```

ใส่ Public และ Private เป็นคู่เดียวกันใน Vercel แล้ว redeploy ถ้าเปลี่ยนกุญแจ ผู้ใช้เดิมต้องสมัครใหม่

### ตัวตั้งเวลา (cron)

ใช้ cron-job.org (ฟรี) แทน GitHub Actions เพราะเสถียรกว่า:

- URL: https://<โดเมนของคุณ>/api/cron/alerts
- ทุก 5 นาที, วิธี GET
- แท็บ Advanced เพิ่ม Header ชื่อ Authorization ค่า Bearer ตามด้วย CRON_SECRET
- ข้อจำกัดของบริการฟรี: ยิงได้ไม่เกิน 60 ครั้งต่อชั่วโมงต่อ job และตอบต้องเสร็จใน 30 วินาที

ผลตอบกลับ: 200 ปกติ, 401 รหัสไม่ตรง, 503 ยังไม่ได้ตั้งกุญแจ VAPID

### ตรวจปัญหาแจ้งเตือน

เปิด /th/alerts?debug=1 แล้วกดทดสอบ ข้อความแดงจะมีรหัสสาเหตุ:

| อาการ | สาเหตุ |
|---|---|
| push service error (ตอนสมัคร) | เบราว์เซอร์ติดต่อบริการ push ไม่ได้ ลองปิด VPN หรือตัวบล็อกโฆษณา ใน Brave ให้เปิด Use Google services for push messaging |
| 404 none | ไม่พบข้อมูลการสมัครในฐานข้อมูล (ตรวจ Upstash) |
| 401 หรือ 403 | VAPID public/private ไม่ใช่คู่เดียวกัน หรือ VAPID_SUBJECT ผิดรูปแบบ |
| 502 | บริการ push ปฏิเสธ ดูข้อความที่ตามมา |

### iPhone

ต้องใช้ iOS 16.4 ขึ้นไป เพิ่มเว็บลงหน้าจอโฮมด้วย Safari แล้วเปิดจากไอคอนเท่านั้น จึงจะรับแจ้งเตือนได้ ป๊อปอัปแนะนำจะขึ้นเมื่อเข้าเว็บ และถ้ากดปิด จะเว้นช่วง 1, 2, 4, 7 วันตามลำดับ

## ธีม

เริ่มต้นเป็นโหมดสว่าง (พื้นขาว) ตั้งแต่เข้าครั้งแรก ผู้ใช้สลับเป็นโหมดมืดหรืออัตโนมัติตามเครื่องได้จากปุ่มบนแถบ ค่าที่เลือกจะถูกจำไว้

## ดีพลอย

เชื่อม repo กับ Vercel ตั้งตัวแปรตามตารางด้านบน แล้ว push ขึ้น main Vercel จะ build ให้เอง จากนั้นตั้ง cron-job.org ตามหัวข้อตัวตั้งเวลา

## เครดิตข้อมูล

ThaiWater (สสน.), กรมอุตุนิยมวิทยา, Open-Meteo, RainViewer, OpenStreetMap, Hat Yai City Climate, ปภ., กรมชลประทาน, OCHA/Royal Thai Survey Department ดูรายละเอียดในหน้า /th/credits
