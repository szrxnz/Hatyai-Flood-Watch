'use client'
import { useEffect, useState } from 'react'
import { Ic } from '@/components/Icons'
import { isStandalone } from '@/lib/pushClient'

type Step = { t: string; d: string; i?: string[] }
interface G {
  title: string; intro: string; done: string; steps: { ios: Step[] }
  after: { h: string; steps: Step[] }
  why: { h: string; ul: string[] }
  fix: { h: string; ul: string[] }
}

const TH: G = {
  title: 'วิธีติดตั้งแอปลงหน้าจอหลัก',
  intro: 'เว็บนี้ติดตั้งเป็นแอปได้ ไม่ต้องโหลดจาก App Store หรือ Play Store ใช้ฟรี เปิดได้เร็วเหมือนแอป และรับแจ้งเตือนแม้ปิดหน้าเว็บ ขั้นตอนด้านล่างสำหรับ iPhone / iPad ส่วน Android และคอมพิวเตอร์จะมีป็อปอัพให้กดติดตั้งได้เลย',
  done: 'ติดตั้งแล้ว: คุณกำลังเปิดจากหน้าจอหลักอยู่ ไม่ต้องทำอะไรเพิ่ม',
  steps: {
    ios: [
      { t: 'เปิดเว็บนี้ด้วย Safari เท่านั้น', d: 'ต้องใช้ Safari (ไอคอนเข็มทิศสีฟ้า) ถ้าเปิดจากแอป LINE, Facebook, Instagram หรือ Chrome ให้แตะเมนูแล้วเลือก "เปิดใน Safari" ก่อน เพราะ iPhone อนุญาตให้ติดตั้งผ่าน Safari เท่านั้น', i: ['compass'] },
      { t: 'แตะปุ่ม แชร์', d: 'ปุ่มรูปสี่เหลี่ยมมีลูกศรชี้ขึ้น อยู่แถบล่างสุดของหน้าจอ (iPhone) หรือแถบบนขวา (iPad) ถ้าไม่เห็นแถบ ให้เลื่อนหน้าเว็บลงเล็กน้อยแถบจะโผล่ขึ้นมา', i: ['share'] },
      { t: 'เลื่อนรายการลงแล้วแตะ "เพิ่มไปยังหน้าจอโฮม"', d: 'รายการแชร์จะเลื่อนขึ้นลงได้ ให้ปัดนิ้วขึ้นจนเจอเมนูที่มีไอคอนสี่เหลี่ยมมีเครื่องหมายบวก ถ้าไม่เจอให้เลื่อนลงสุดแล้วแตะ "แก้ไขการดำเนินการ" เพื่อเพิ่มเมนูนี้', i: ['plussq'] },
      { t: 'ตรวจชื่อแอป แล้วแตะ "เพิ่ม"', d: 'ชื่อจะขึ้นอัตโนมัติ แก้ได้ตามต้องการ แล้วแตะ "เพิ่ม" มุมขวาบน ไอคอนแอปจะไปอยู่บนหน้าจอหลัก', i: ['check'] },
      { t: 'เปิดแอปจากไอคอนบนหน้าจอหลัก', d: 'ต่อจากนี้ให้เปิดจากไอคอนนี้เสมอ ไม่ใช่จาก Safari เพราะการแจ้งเตือนบน iPhone ใช้ได้เฉพาะเมื่อเปิดจากไอคอนแอป (ต้องใช้ iOS 16.4 ขึ้นไป)', i: ['phone'] },
    ],
  },
  after: { h: 'หลังติดตั้งแล้ว: เปิดการแจ้งเตือน', steps: [
    { t: 'เปิดแอปจากไอคอนบนหน้าจอหลัก', d: 'ไม่ใช่จากเบราว์เซอร์', i: ['phone'] },
    { t: 'ไปที่เมนู "แจ้งเตือน"', d: 'จากหน้าหลักแตะการ์ดเมนู "แจ้งเตือน" เลือกอำเภอและระดับที่ต้องการรับ', i: ['bell'] },
    { t: 'ติ๊กยินยอม แล้วแตะเปิดการแจ้งเตือน', d: 'เมื่อเครื่องถามสิทธิ์ ให้เลือก "อนุญาต" (Allow) ถ้าเผลอกด "ไม่อนุญาต" ให้ไปเปิดที่ ตั้งค่า > การแจ้งเตือน > เฝ้าระวังน้ำท่วมหาดใหญ่', i: ['check'] },
  ] },
  why: { h: 'ติดตั้งแล้วได้อะไร', ul: ['เปิดเร็ว เต็มจอ ไม่มีแถบเบราว์เซอร์', 'รับแจ้งเตือนระดับน้ำและประกาศแม้ปิดแอป', 'ดูเบอร์ฉุกเฉินได้แม้ไม่มีอินเทอร์เน็ต', 'ไม่กินพื้นที่เครื่อง ลบออกเหมือนแอปทั่วไปได้ทุกเมื่อ'] },
  fix: { h: 'ถ้าติดตั้งไม่ได้', ul: ['iPhone ไม่เจอเมนู: ต้องเป็น Safari เท่านั้น ไม่ใช่ Chrome หรือเบราว์เซอร์ในแอปอื่น', 'ลบแอป: แตะค้างที่ไอคอนบนหน้าจอหลัก แล้วเลือกลบแอปหรือถอนการติดตั้ง'] },
}

const EN: G = {
  title: 'How to install the app on your home screen',
  intro: 'This site installs like an app with no App Store or Play Store. It is free, opens fast, and sends alerts even when the page is closed. The steps below are for iPhone / iPad. On Android and computers an install popup appears automatically.',
  done: 'Already installed: you are opening it from the home screen. Nothing more to do.',
  steps: {
    ios: [
      { t: 'Open this site in Safari only', d: 'Use Safari (blue compass icon). If you are inside LINE, Facebook, Instagram or Chrome, tap the menu and choose "Open in Safari" first. iPhone only allows installing from Safari.', i: ['compass'] },
      { t: 'Tap the Share button', d: 'A square with an up arrow, in the bottom bar (iPhone) or top right (iPad). If you do not see the bar, scroll the page down a little.', i: ['share'] },
      { t: 'Scroll the list and tap "Add to Home Screen"', d: 'The share sheet scrolls. Swipe up until you see the item with a square and plus sign. If it is missing, scroll to the bottom, tap "Edit Actions" and add it.', i: ['plussq'] },
      { t: 'Check the name, then tap "Add"', d: 'The name is filled in for you and can be edited. Tap "Add" at the top right. The icon appears on your home screen.', i: ['check'] },
      { t: 'Open the app from the home screen icon', d: 'Always open it from this icon, not Safari. Alerts on iPhone only work when opened from the app icon (iOS 16.4 or later).', i: ['phone'] },
    ],
  },
  after: { h: 'After installing: turn on alerts', steps: [
    { t: 'Open the app from the home screen icon', d: 'Not from the browser.', i: ['phone'] },
    { t: 'Go to the "Alerts" menu', d: 'On the home page tap the "Alerts" card and pick your districts and level.', i: ['bell'] },
    { t: 'Tick consent, then turn alerts on', d: 'When asked for permission choose "Allow". If you tapped "Don\'t allow", enable it in Settings > Notifications > Hat Yai Flood Watch.', i: ['check'] },
  ] },
  why: { h: 'What you get', ul: ['Fast, full screen, no browser bars', 'Water level alerts and notices even when the app is closed', 'Emergency numbers available offline', 'Uses almost no storage and can be removed like any app'] },
  fix: { h: 'If it does not work', ul: ['iPhone has no menu item: it must be Safari, not Chrome or another app\'s browser', 'To remove: long-press the home screen icon and choose remove or uninstall'] },
}

const ZH: G = {
  title: '如何将应用添加到主屏幕',
  intro: '本网站可像应用一样安装，无需 App Store 或 Play 商店。免费、打开快，关闭页面后仍可收到提醒。下面的步骤适用于 iPhone / iPad；Android 和电脑会自动弹出安装提示。',
  done: '已安装：你正从主屏幕打开，无需其他操作。',
  steps: {
    ios: [
      { t: '仅用 Safari 打开本站', d: '必须使用 Safari（蓝色指南针图标）。若在 LINE、Facebook、Instagram 或 Chrome 内，请先点菜单选择“在 Safari 中打开”。iPhone 只能通过 Safari 安装。', i: ['compass'] },
      { t: '点按“分享”按钮', d: '带向上箭头的方框，位于底部工具栏（iPhone）或右上角（iPad）。看不到工具栏时，把页面稍微下拉。', i: ['share'] },
      { t: '向下滑动列表，点“添加到主屏幕”', d: '分享面板可滚动。向上滑动直到看到带加号的方框。找不到时滑到底部，点“编辑操作”添加。', i: ['plussq'] },
      { t: '确认名称后点“添加”', d: '名称会自动填写，可修改。点右上角“添加”，图标就会出现在主屏幕。', i: ['check'] },
      { t: '从主屏幕图标打开应用', d: '以后请始终从此图标打开，而不是 Safari。iPhone 上只有从应用图标打开才能收到提醒（需 iOS 16.4 及以上）。', i: ['phone'] },
    ],
  },
  after: { h: '安装后：开启提醒', steps: [
    { t: '从主屏幕图标打开应用', d: '不要从浏览器打开。', i: ['phone'] },
    { t: '进入“提醒”菜单', d: '在首页点“提醒”卡片，选择地区和级别。', i: ['bell'] },
    { t: '勾选同意并开启提醒', d: '系统询问权限时选“允许”。若误点“不允许”，请到 设置 > 通知 中开启。', i: ['check'] },
  ] },
  why: { h: '安装的好处', ul: ['打开更快、全屏、无浏览器工具栏', '关闭应用后仍可收到水位提醒和通知', '无网络也能查看紧急电话', '几乎不占存储空间，可像普通应用一样删除'] },
  fix: { h: '无法安装时', ul: ['iPhone 没有该菜单：必须是 Safari，不能是 Chrome 或其他应用内浏览器', '删除方法：长按主屏幕图标，选择移除或卸载'] },
}

const G_: Record<string, G> = { th: TH, en: EN, zh: ZH }

function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol>
      {steps.map((s, i) => (
        <li key={i} className="st">
          <div>
            <b>{s.i?.map((n) => <span key={n} className="bic"><Ic n={n} /></span>)}{s.t}</b>
            <p>{s.d}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default function InstallGuide({ lang }: { lang: string }) {
  const g = G_[lang] ?? TH
  const [installed, setInstalled] = useState(false)
  useEffect(() => {
    setInstalled(isStandalone())
  }, [])
  return (
    <main className="wrap page legal ig">
      <h1>{g.title}</h1>
      <p>{g.intro}</p>
      {installed && <p className="tip">{g.done}</p>}
      <Steps steps={g.steps.ios} />
      <h2><Ic n="bell" />{g.after.h}</h2>
      <Steps steps={g.after.steps} />
      <h2><Ic n="heart" />{g.why.h}</h2>
      <ul>{g.why.ul.map((x) => <li key={x}>{x}</li>)}</ul>
      <h2><Ic n="alert" />{g.fix.h}</h2>
      <ul>{g.fix.ul.map((x) => <li key={x}>{x}</li>)}</ul>
    </main>
  )
}
