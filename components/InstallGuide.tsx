'use client'
import { useEffect, useState } from 'react'
import { Ic } from '@/components/Icons'
import { isIOS, isStandalone } from '@/lib/pushClient'

type Plat = 'ios' | 'android' | 'desktop'
type Step = { t: string; d: string; i?: string[] }
interface G {
  title: string; intro: string; done: string; tabs: Record<Plat, string>
  steps: Record<Plat, Step[]>
  after: { h: string; steps: Step[] }
  why: { h: string; ul: string[] }
  fix: { h: string; ul: string[] }
}

const TH: G = {
  title: 'วิธีติดตั้งแอปลงหน้าจอหลัก',
  intro: 'เว็บนี้ติดตั้งเป็นแอปได้ ไม่ต้องโหลดจาก App Store หรือ Play Store ใช้ฟรี เปิดได้เร็วเหมือนแอป และรับแจ้งเตือนแม้ปิดหน้าเว็บ เลือกเครื่องของคุณด้านล่างแล้วทำตามทีละข้อ',
  done: 'ติดตั้งแล้ว: คุณกำลังเปิดจากหน้าจอหลักอยู่ ไม่ต้องทำอะไรเพิ่ม',
  tabs: { ios: 'iPhone / iPad', android: 'Android', desktop: 'คอมพิวเตอร์' },
  steps: {
    ios: [
      { t: 'เปิดเว็บนี้ด้วย Safari เท่านั้น', d: 'ต้องใช้ Safari (ไอคอนเข็มทิศสีฟ้า) ถ้าเปิดจากแอป LINE, Facebook, Instagram หรือ Chrome ให้แตะเมนูแล้วเลือก "เปิดใน Safari" ก่อน เพราะ iPhone อนุญาตให้ติดตั้งผ่าน Safari เท่านั้น', i: ['compass'] },
      { t: 'แตะปุ่ม แชร์', d: 'ปุ่มรูปสี่เหลี่ยมมีลูกศรชี้ขึ้น อยู่แถบล่างสุดของหน้าจอ (iPhone) หรือแถบบนขวา (iPad) ถ้าไม่เห็นแถบ ให้เลื่อนหน้าเว็บลงเล็กน้อยแถบจะโผล่ขึ้นมา', i: ['share'] },
      { t: 'เลื่อนรายการลงแล้วแตะ "เพิ่มไปยังหน้าจอโฮม"', d: 'รายการแชร์จะเลื่อนขึ้นลงได้ ให้ปัดนิ้วขึ้นจนเจอเมนูที่มีไอคอนสี่เหลี่ยมมีเครื่องหมายบวก ถ้าไม่เจอให้เลื่อนลงสุดแล้วแตะ "แก้ไขการดำเนินการ" เพื่อเพิ่มเมนูนี้', i: ['plussq'] },
      { t: 'ตรวจชื่อแอป แล้วแตะ "เพิ่ม"', d: 'ชื่อจะขึ้นอัตโนมัติ แก้ได้ตามต้องการ แล้วแตะ "เพิ่ม" มุมขวาบน ไอคอนแอปจะไปอยู่บนหน้าจอหลัก', i: ['check'] },
      { t: 'เปิดแอปจากไอคอนบนหน้าจอหลัก', d: 'ต่อจากนี้ให้เปิดจากไอคอนนี้เสมอ ไม่ใช่จาก Safari เพราะการแจ้งเตือนบน iPhone ใช้ได้เฉพาะเมื่อเปิดจากไอคอนแอป (ต้องใช้ iOS 16.4 ขึ้นไป)', i: ['phone'] },
    ],
    android: [
      { t: 'เปิดเว็บนี้ด้วย Chrome', d: 'แนะนำ Chrome ถ้าเปิดจากแอป LINE หรือ Facebook ให้แตะจุดสามจุดแล้วเลือก "เปิดในเบราว์เซอร์" หรือ "เปิดใน Chrome" ก่อน', i: ['compass'] },
      { t: 'ถ้ามีแถบ "ติดตั้ง" ให้แตะได้เลย', d: 'เว็บนี้จะเด้งกล่องถามติดตั้งให้เองหลังเปิดไม่กี่วินาที แตะ "ติดตั้ง" แล้วข้ามไปข้อ 5 ได้', i: ['install'] },
      { t: 'ถ้าไม่เด้ง ให้แตะเมนู จุดสามจุด', d: 'อยู่มุมขวาบนของ Chrome (บางรุ่นอยู่มุมขวาล่าง)', i: ['dots'] },
      { t: 'แตะ "ติดตั้งแอป" หรือ "เพิ่มลงในหน้าจอหลัก"', d: 'ชื่อเมนูต่างกันตามรุ่น ถ้ามีทั้งสองแบบให้เลือก "ติดตั้งแอป" เพราะจะทำงานเหมือนแอปจริง แล้วแตะ "ติดตั้ง" ยืนยันอีกครั้ง', i: ['plussq'] },
      { t: 'เปิดแอปจากหน้าจอหลักหรือลิ้นชักแอป', d: 'ไอคอนจะอยู่ในหน้าจอหลักหรือรายการแอปทั้งหมด ถ้าเป็น Samsung Internet ให้แตะไอคอนบวกบนแถบที่อยู่ แล้วเลือก "หน้าจอหลัก"', i: ['phone'] },
    ],
    desktop: [
      { t: 'เปิดเว็บนี้ด้วย Chrome หรือ Edge', d: 'Firefox และ Safari บน Mac บางรุ่นไม่รองรับการติดตั้งจากเมนู', i: ['compass'] },
      { t: 'มองหาไอคอนติดตั้งที่ช่องที่อยู่เว็บ', d: 'อยู่ด้านขวาสุดของช่อง URL เป็นรูปจอคอมมีลูกศรลง หรือรูปลูกศรลงในวงกลม แตะแล้วกด "ติดตั้ง"', i: ['install'] },
      { t: 'หรือเปิดเมนู จุดสามจุด', d: 'มุมขวาบนของเบราว์เซอร์ แล้วเลือก "ส่ง บันทึก และแชร์" > "ติดตั้งเว็บนี้เป็นแอป" (Chrome) หรือ "แอป" > "ติดตั้งเว็บไซต์นี้เป็นแอป" (Edge)', i: ['dots'] },
      { t: 'เปิดแอปจากเดสก์ท็อปหรือเมนู Start', d: 'แอปจะเปิดเป็นหน้าต่างของตัวเอง ไม่มีแถบเบราว์เซอร์ และปักไว้บนแถบงานได้', i: ['desktop'] },
    ],
  },
  after: { h: 'หลังติดตั้งแล้ว: เปิดการแจ้งเตือน', steps: [
    { t: 'เปิดแอปจากไอคอนบนหน้าจอหลัก', d: 'ไม่ใช่จากเบราว์เซอร์', i: ['phone'] },
    { t: 'ไปที่เมนู "แจ้งเตือน"', d: 'จากหน้าหลักแตะการ์ดเมนู "แจ้งเตือน" เลือกอำเภอและระดับที่ต้องการรับ', i: ['bell'] },
    { t: 'ติ๊กยินยอม แล้วแตะเปิดการแจ้งเตือน', d: 'เมื่อเครื่องถามสิทธิ์ ให้เลือก "อนุญาต" (Allow) ถ้าเผลอกด "ไม่อนุญาต" ให้ไปเปิดที่ ตั้งค่า > การแจ้งเตือน > เฝ้าระวังน้ำท่วมหาดใหญ่', i: ['check'] },
  ] },
  why: { h: 'ติดตั้งแล้วได้อะไร', ul: ['เปิดเร็ว เต็มจอ ไม่มีแถบเบราว์เซอร์', 'รับแจ้งเตือนระดับน้ำและประกาศแม้ปิดแอป', 'ดูเบอร์ฉุกเฉินได้แม้ไม่มีอินเทอร์เน็ต', 'ไม่กินพื้นที่เครื่อง ลบออกเหมือนแอปทั่วไปได้ทุกเมื่อ'] },
  fix: { h: 'ถ้าติดตั้งไม่ได้', ul: ['iPhone ไม่เจอเมนู: ต้องเป็น Safari เท่านั้น ไม่ใช่ Chrome หรือเบราว์เซอร์ในแอปอื่น', 'Android ไม่มีเมนูติดตั้ง: อัปเดต Chrome เป็นรุ่นล่าสุด และอย่าเปิดโหมดไม่ระบุตัวตน', 'ปิดกล่องถามติดตั้งไปแล้ว: เข้าหน้านี้ทำตามขั้นตอนด้วยมือได้เสมอ', 'ลบแอป: แตะค้างที่ไอคอนบนหน้าจอหลัก แล้วเลือกลบแอปหรือถอนการติดตั้ง'] },
}

const EN: G = {
  title: 'How to install the app on your home screen',
  intro: 'This site installs like an app with no App Store or Play Store. It is free, opens fast, and sends alerts even when the page is closed. Pick your device below and follow the steps.',
  done: 'Already installed: you are opening it from the home screen. Nothing more to do.',
  tabs: { ios: 'iPhone / iPad', android: 'Android', desktop: 'Computer' },
  steps: {
    ios: [
      { t: 'Open this site in Safari only', d: 'Use Safari (blue compass icon). If you are inside LINE, Facebook, Instagram or Chrome, tap the menu and choose "Open in Safari" first. iPhone only allows installing from Safari.', i: ['compass'] },
      { t: 'Tap the Share button', d: 'A square with an up arrow, in the bottom bar (iPhone) or top right (iPad). If you do not see the bar, scroll the page down a little.', i: ['share'] },
      { t: 'Scroll the list and tap "Add to Home Screen"', d: 'The share sheet scrolls. Swipe up until you see the item with a square and plus sign. If it is missing, scroll to the bottom, tap "Edit Actions" and add it.', i: ['plussq'] },
      { t: 'Check the name, then tap "Add"', d: 'The name is filled in for you and can be edited. Tap "Add" at the top right. The icon appears on your home screen.', i: ['check'] },
      { t: 'Open the app from the home screen icon', d: 'Always open it from this icon, not Safari. Alerts on iPhone only work when opened from the app icon (iOS 16.4 or later).', i: ['phone'] },
    ],
    android: [
      { t: 'Open this site in Chrome', d: 'Chrome is recommended. From LINE or Facebook, tap the three dots and choose "Open in browser" or "Open in Chrome" first.', i: ['compass'] },
      { t: 'If an "Install" banner appears, tap it', d: 'The site shows an install prompt a few seconds after opening. Tap "Install" and skip to step 5.', i: ['install'] },
      { t: 'Otherwise tap the three-dot menu', d: 'Top right of Chrome (bottom right on some versions).', i: ['dots'] },
      { t: 'Tap "Install app" or "Add to Home screen"', d: 'The name varies by version. If both exist, pick "Install app" for a real app experience, then confirm with "Install".', i: ['plussq'] },
      { t: 'Open the app from the home screen or app drawer', d: 'The icon is on your home screen or in the all-apps list. In Samsung Internet, tap the plus icon on the address bar and choose "Home screen".', i: ['phone'] },
    ],
    desktop: [
      { t: 'Open this site in Chrome or Edge', d: 'Firefox and some Safari versions on Mac cannot install from the menu.', i: ['compass'] },
      { t: 'Look for the install icon in the address bar', d: 'At the far right of the URL bar: a monitor with a down arrow, or a down arrow in a circle. Click it, then "Install".', i: ['install'] },
      { t: 'Or open the three-dot menu', d: 'Top right of the browser, then "Cast, save and share" > "Install page as app" (Chrome) or "Apps" > "Install this site as an app" (Edge).', i: ['dots'] },
      { t: 'Open the app from the desktop or Start menu', d: 'It opens in its own window without browser bars and can be pinned to the taskbar.', i: ['desktop'] },
    ],
  },
  after: { h: 'After installing: turn on alerts', steps: [
    { t: 'Open the app from the home screen icon', d: 'Not from the browser.', i: ['phone'] },
    { t: 'Go to the "Alerts" menu', d: 'On the home page tap the "Alerts" card and pick your districts and level.', i: ['bell'] },
    { t: 'Tick consent, then turn alerts on', d: 'When asked for permission choose "Allow". If you tapped "Don\'t allow", enable it in Settings > Notifications > Hat Yai Flood Watch.', i: ['check'] },
  ] },
  why: { h: 'What you get', ul: ['Fast, full screen, no browser bars', 'Water level alerts and notices even when the app is closed', 'Emergency numbers available offline', 'Uses almost no storage and can be removed like any app'] },
  fix: { h: 'If it does not work', ul: ['iPhone has no menu item: it must be Safari, not Chrome or another app\'s browser', 'Android has no install option: update Chrome and avoid Incognito mode', 'Dismissed the install prompt: follow these steps manually any time', 'To remove: long-press the home screen icon and choose remove or uninstall'] },
}

const ZH: G = {
  title: '如何将应用添加到主屏幕',
  intro: '本网站可像应用一样安装，无需 App Store 或 Play 商店。免费、打开快，关闭页面后仍可收到提醒。请选择你的设备并按步骤操作。',
  done: '已安装：你正从主屏幕打开，无需其他操作。',
  tabs: { ios: 'iPhone / iPad', android: 'Android', desktop: '电脑' },
  steps: {
    ios: [
      { t: '仅用 Safari 打开本站', d: '必须使用 Safari（蓝色指南针图标）。若在 LINE、Facebook、Instagram 或 Chrome 内，请先点菜单选择“在 Safari 中打开”。iPhone 只能通过 Safari 安装。', i: ['compass'] },
      { t: '点按“分享”按钮', d: '带向上箭头的方框，位于底部工具栏（iPhone）或右上角（iPad）。看不到工具栏时，把页面稍微下拉。', i: ['share'] },
      { t: '向下滑动列表，点“添加到主屏幕”', d: '分享面板可滚动。向上滑动直到看到带加号的方框。找不到时滑到底部，点“编辑操作”添加。', i: ['plussq'] },
      { t: '确认名称后点“添加”', d: '名称会自动填写，可修改。点右上角“添加”，图标就会出现在主屏幕。', i: ['check'] },
      { t: '从主屏幕图标打开应用', d: '以后请始终从此图标打开，而不是 Safari。iPhone 上只有从应用图标打开才能收到提醒（需 iOS 16.4 及以上）。', i: ['phone'] },
    ],
    android: [
      { t: '用 Chrome 打开本站', d: '推荐 Chrome。若在 LINE 或 Facebook 内，请先点三个点选择“在浏览器中打开”。', i: ['compass'] },
      { t: '若出现“安装”提示，直接点它', d: '网站打开几秒后会弹出安装提示。点“安装”后可跳到第 5 步。', i: ['install'] },
      { t: '否则点右上角三点菜单', d: '位于 Chrome 右上角（部分版本在右下角）。', i: ['dots'] },
      { t: '点“安装应用”或“添加到主屏幕”', d: '名称因版本而异。两者都有时选“安装应用”，体验更像真正的应用，然后点“安装”确认。', i: ['plussq'] },
      { t: '从主屏幕或应用列表打开', d: '图标在主屏幕或全部应用中。Samsung Internet 请点地址栏的加号并选择“主屏幕”。', i: ['phone'] },
    ],
    desktop: [
      { t: '用 Chrome 或 Edge 打开本站', d: 'Firefox 和部分 Mac 版 Safari 不能从菜单安装。', i: ['compass'] },
      { t: '查看地址栏中的安装图标', d: '在网址栏最右侧：带向下箭头的显示器，或圆圈中的向下箭头。点击后选“安装”。', i: ['install'] },
      { t: '或打开三点菜单', d: '浏览器右上角，选“投放、保存和分享”>“将页面安装为应用”（Chrome），或“应用”>“将此站点作为应用安装”（Edge）。', i: ['dots'] },
      { t: '从桌面或开始菜单打开', d: '应用以独立窗口打开，没有浏览器工具栏，并可固定到任务栏。', i: ['desktop'] },
    ],
  },
  after: { h: '安装后：开启提醒', steps: [
    { t: '从主屏幕图标打开应用', d: '不要从浏览器打开。', i: ['phone'] },
    { t: '进入“提醒”菜单', d: '在首页点“提醒”卡片，选择地区和级别。', i: ['bell'] },
    { t: '勾选同意并开启提醒', d: '系统询问权限时选“允许”。若误点“不允许”，请到 设置 > 通知 中开启。', i: ['check'] },
  ] },
  why: { h: '安装的好处', ul: ['打开更快、全屏、无浏览器工具栏', '关闭应用后仍可收到水位提醒和通知', '无网络也能查看紧急电话', '几乎不占存储空间，可像普通应用一样删除'] },
  fix: { h: '无法安装时', ul: ['iPhone 没有该菜单：必须是 Safari，不能是 Chrome 或其他应用内浏览器', 'Android 没有安装选项：请更新 Chrome，且不要使用无痕模式', '关掉了安装提示：随时可按本页步骤手动安装', '删除方法：长按主屏幕图标，选择移除或卸载'] },
}

const G_: Record<string, G> = { th: TH, en: EN, zh: ZH }
const ICONS: Record<Plat, string> = { ios: 'phone', android: 'phone', desktop: 'desktop' }

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
  const [plat, setPlat] = useState<Plat>('ios')
  const [installed, setInstalled] = useState(false)
  useEffect(() => {
    setInstalled(isStandalone())
    setPlat(isIOS() ? 'ios' : /android/i.test(navigator.userAgent) ? 'android' : /Mobi/i.test(navigator.userAgent) ? 'android' : 'desktop')
  }, [])
  return (
    <main className="wrap page legal ig">
      <h1>{g.title}</h1>
      <p>{g.intro}</p>
      {installed && <p className="tip">{g.done}</p>}
      <div className="tabs" role="tablist">
        {(Object.keys(g.tabs) as Plat[]).map((k) => (
          <button key={k} role="tab" aria-selected={plat === k} className={plat === k ? 'on' : ''} onClick={() => setPlat(k)}><Ic n={ICONS[k]} />{g.tabs[k]}</button>
        ))}
      </div>
      <Steps steps={g.steps[plat]} />
      <h2><Ic n="bell" />{g.after.h}</h2>
      <Steps steps={g.after.steps} />
      <h2><Ic n="heart" />{g.why.h}</h2>
      <ul>{g.why.ul.map((x) => <li key={x}>{x}</li>)}</ul>
      <h2><Ic n="alert" />{g.fix.h}</h2>
      <ul>{g.fix.ul.map((x) => <li key={x}>{x}</li>)}</ul>
    </main>
  )
}
