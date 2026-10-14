export interface Guide { title: string; intro: string; groups: { h: string; note?: string; steps: string[] }[]; tipsH: string; tips: string[]; link: string }

const th: Guide = {
  title: 'วิธีติดตั้งแอปไว้บนหน้าจอหลัก',
  intro: 'เว็บนี้ติดตั้งเป็นไอคอนบนมือถือได้ เปิดได้เร็วเหมือนแอปทั่วไป ไม่ต้องโหลดจาก App Store หรือ Play Store และต้องติดตั้งก่อนจึงจะรับแจ้งเตือนบน iPhone ได้ เลือกทำตามหัวข้อที่ตรงกับเครื่องของคุณ',
  groups: [
    {
      h: 'iPhone / iPad (ใช้ Safari)',
      note: 'ต้องใช้ iOS 16.4 ขึ้นไป และต้องเปิดด้วย Safari เท่านั้น ถ้าเปิดลิงก์มาจาก LINE หรือ Facebook จะไม่มีปุ่มติดตั้ง',
      steps: [
        'เปิดเว็บนี้ใน Safari ถ้าอยู่ใน LINE หรือ Facebook ให้แตะไอคอนเมนูมุมจอ (⋯ หรือไอคอนเข็มทิศ) แล้วเลือก "เปิดใน Safari"',
        'แตะปุ่ม "แชร์" คือไอคอนสี่เหลี่ยมมีลูกศรชี้ขึ้น อยู่แถบล่างกลางจอบน iPhone (บน iPad อยู่มุมขวาบน) ถ้าไม่เห็นปุ่มแชร์ ให้แตะ ⋯ ที่แถบล่างก่อน แล้วเลือก "แชร์"',
        'เลื่อนรายการที่เด้งขึ้นมาลงไปด้านล่าง แล้วแตะ "เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen) ถ้าไม่เห็น ให้เลื่อนลงให้สุดหรือแตะ "แก้ไขการดำเนินการ"',
        'ตั้งชื่อไอคอนได้ตามต้องการ (ค่าเริ่มต้นใช้ได้เลย) ถ้ามีสวิตช์ "เปิดเป็นเว็บแอป" ให้เปิดไว้ แล้วแตะ "เพิ่ม" มุมขวาบน',
        'กลับไปที่หน้าจอโฮม จะเห็นไอคอนใหม่ ให้เปิดเว็บจากไอคอนนี้ทุกครั้ง ไม่ใช่จาก Safari',
      ],
    },
    {
      h: 'Android (ใช้ Chrome)',
      steps: [
        'เปิดเว็บนี้ใน Chrome ถ้าอยู่ใน LINE หรือ Facebook ให้แตะเมนูมุมจอแล้วเลือก "เปิดในเบราว์เซอร์"',
        'แตะเมนูจุดสามจุด (⋮) มุมขวาบนของ Chrome',
        'แตะ "ติดตั้งแอป" (Install app) หรือถ้าไม่มีให้เลือก "เพิ่มไปยังหน้าจอหลัก" (Add to Home screen)',
        'แตะ "ติดตั้ง" (Install) แล้วแตะ "เพิ่ม" (Add) ในหน้าต่างถัดไป',
        'ไอคอนจะขึ้นที่หน้าจอหลักหรือในลิ้นชักแอป เปิดจากไอคอนนี้ได้เลย',
      ],
    },
    {
      h: 'Android (ใช้ Samsung Internet)',
      steps: [
        'เปิดเว็บนี้ใน Samsung Internet',
        'แตะเมนูสามขีด (☰) มุมขวาล่าง',
        'แตะ "เพิ่มหน้านี้ไปยัง" (Add page to) แล้วเลือก "หน้าจอหลัก" (Home screen)',
        'แตะ "เพิ่ม" เพื่อยืนยัน',
      ],
    },
    {
      h: 'คอมพิวเตอร์ (Chrome หรือ Edge)',
      steps: [
        'เปิดเว็บนี้ แล้วมองหาไอคอนติดตั้ง (จอคอมมีลูกศรลง) ทางขวาสุดของช่องที่อยู่เว็บ',
        'คลิกไอคอนนั้น แล้วคลิก "ติดตั้ง" ถ้าไม่เห็นไอคอน ให้คลิกเมนูจุดสามจุด (⋮) แล้วเลือก "ติดตั้ง" หรือ "ส่ง บันทึก และแชร์" > "ติดตั้งหน้านี้เป็นแอป"',
      ],
    },
    {
      h: 'หลังติดตั้งแล้ว เปิดการแจ้งเตือน',
      steps: [
        'เปิดแอปจากไอคอนบนหน้าจอหลัก',
        'ไปที่หน้า "แจ้งเตือน" ติ๊กยินยอม แล้วกด "เปิดแจ้งเตือน"',
        'เมื่อเครื่องถามขออนุญาตส่งการแจ้งเตือน ให้กด "อนุญาต"',
        'กดปุ่มทดสอบ ควรมีแจ้งเตือนเด้งขึ้นมา',
      ],
    },
  ],
  tipsH: 'ติดขัด ลองดูตรงนี้',
  tips: [
    'ไม่มีปุ่ม "เพิ่มไปยังหน้าจอโฮม" หรือ "ติดตั้งแอป": มักเกิดจากเปิดผ่านแอปอื่น (LINE, Facebook, Instagram) ให้คัดลอกลิงก์ไปเปิดใน Safari หรือ Chrome',
    'เปิดแจ้งเตือนแล้วไม่สำเร็จ: ปิด VPN และตัวบล็อกโฆษณาทั้งเครื่องก่อน แล้วลองใหม่ (Android ต้องติดต่อเซิร์ฟเวอร์ของ Google ได้)',
    'iPhone ไม่ขึ้นตัวเลือกแจ้งเตือน: ตรวจว่าเป็น iOS 16.4 ขึ้นไป และเปิดจากไอคอนบนหน้าจอโฮมแล้ว',
    'ต้องการลบไอคอน: กดค้างที่ไอคอนแล้วเลือกลบ หรือเอาแอปออก',
  ],
  link: 'วิธีติดตั้งแบบละเอียด',
}

const en: Guide = {
  title: 'How to add the app to your home screen',
  intro: 'You can install this site as an icon on your phone. It opens faster, needs no App Store or Play Store download, and on iPhone you must install it before you can receive alerts. Follow the section that matches your device.',
  groups: [
    {
      h: 'iPhone / iPad (Safari)',
      note: 'Requires iOS 16.4 or later and Safari. If you opened the link from LINE or Facebook, the install option will not appear.',
      steps: [
        'Open this site in Safari. If you are inside LINE or Facebook, tap the menu icon in the corner (⋯ or the compass icon) and choose "Open in Safari".',
        'Tap the Share button: the square with an up arrow, in the bottom bar on iPhone (top right on iPad). If you cannot see it, tap ⋯ in the bottom bar first, then Share.',
        'Scroll down the sheet and tap "Add to Home Screen". If you do not see it, scroll to the very bottom or tap "Edit Actions".',
        'Name the icon if you like (the default is fine). If there is an "Open as Web App" switch, keep it on. Tap "Add" at the top right.',
        'Go back to your home screen. Open the site from this new icon every time, not from Safari.',
      ],
    },
    {
      h: 'Android (Chrome)',
      steps: [
        'Open this site in Chrome. If you are inside LINE or Facebook, tap the corner menu and choose "Open in browser".',
        'Tap the three-dot menu (⋮) at the top right of Chrome.',
        'Tap "Install app". If it is not listed, tap "Add to Home screen".',
        'Tap "Install", then "Add" in the next prompt.',
        'The icon appears on your home screen or in the app drawer. Open the site from it.',
      ],
    },
    {
      h: 'Android (Samsung Internet)',
      steps: [
        'Open this site in Samsung Internet.',
        'Tap the three-line menu (☰) at the bottom right.',
        'Tap "Add page to" and choose "Home screen".',
        'Tap "Add" to confirm.',
      ],
    },
    {
      h: 'Computer (Chrome or Edge)',
      steps: [
        'Open this site and look for the install icon (a screen with a down arrow) at the right end of the address bar.',
        'Click it, then click "Install". If you do not see the icon, open the three-dot menu (⋮) and choose "Install" or "Cast, save, and share" > "Install page as app".',
      ],
    },
    {
      h: 'After installing: turn on alerts',
      steps: [
        'Open the app from the icon on your home screen.',
        'Go to the Alerts page, tick the consent box, then tap "Enable alerts".',
        'When your device asks for permission to send notifications, tap "Allow".',
        'Tap the test button. A notification should pop up.',
      ],
    },
  ],
  tipsH: 'Troubleshooting',
  tips: [
    'No "Add to Home Screen" or "Install app" option: you are probably inside another app (LINE, Facebook, Instagram). Copy the link and open it in Safari or Chrome.',
    'Enabling alerts fails: turn off any VPN or system-wide ad blocker and try again (Android must be able to reach Google servers).',
    'iPhone shows no alert option: check that you are on iOS 16.4 or later and that you opened the app from the home screen icon.',
    'To remove the icon: press and hold it and choose Remove / Delete.',
  ],
  link: 'Detailed install guide',
}

export const installGuide = (lang: string): Guide => (lang === 'th' ? th : en)
export const installLink = (lang: string) => (lang === 'th' ? th.link : en.link)
