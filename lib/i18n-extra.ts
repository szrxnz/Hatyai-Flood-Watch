import { Lang } from './types'

export const EXTRA: Record<Lang, Record<string, string>> = {
  th: {
    shelters: 'จุดพักพิง', shTitle: 'จุดพักพิงชั่วคราว', shSub: 'ศูนย์พักพิงสำหรับผู้ประสบภัยน้ำท่วม สถานะอาจเปลี่ยนได้ ควรโทรยืนยันก่อนเดินทาง',
    shEmpty: 'ยังไม่มีข้อมูลจุดพักพิง', shEmptyHow: 'เจ้าหน้าที่เพิ่มข้อมูลได้ที่หน้าแอดมิน',
    sh_open: 'เปิดรับ', sh_full: 'เต็ม', sh_closed: 'ปิด', shCap: 'รองรับ', shCall: 'โทร', shNav: 'นำทาง',
    shNote: 'ข้อมูลจุดพักพิงมาจากผู้ดูแลเว็บ ไม่ใช่ประกาศทางการ ในภาวะฉุกเฉินโทร 1784 หรือ 191', lyShelters: 'จุดพักพิง', alAll: 'ทั้งหมด',
    alTitle: 'ตั้งค่าแจ้งเตือน', alSub: 'รับแจ้งเตือนทันทีบนมือถือแม้ไม่ได้เปิดแอป เมื่อระดับน้ำในพื้นที่ที่เลือกสูงขึ้นถึงระดับที่กำหนด เมื่อมีประกาศจากเจ้าหน้าที่ และเมื่อกรมอุตุฯ คาดว่าฝนตกหนัก',
    alEnable: 'เปิดการแจ้งเตือน', alDisable: 'ปิดการแจ้งเตือน', alAreas: 'อำเภอที่ต้องการติดตาม', alMin: 'แจ้งเตือนเมื่อถึงระดับ',
    alTest: 'ทดสอบแจ้งเตือน', alTestTitle: 'ทดสอบการแจ้งเตือน', alTestBody: 'ระบบแจ้งเตือนทำงานปกติ', alTestSent: 'ส่งแล้ว',
    alDenied: 'เบราว์เซอร์บล็อกการแจ้งเตือน ให้เปิดสิทธิ์ที่การตั้งค่าเว็บไซต์ก่อน', alUnsupported: 'อุปกรณ์หรือเบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน',
    alHit: '{n} สถานีถึงระดับที่คุณตั้งไว้',
    alNote: 'ระบบแจ้งเฉพาะตอนระดับน้ำ "สูงขึ้น" และไม่เด้งซ้ำสถานีเดิมภายใน 3 ชั่วโมง ส่งผ่านบริการ push ของเบราว์เซอร์ จึงอาจล่าช้าหรือไม่ถึงในบางสภาพเครือข่าย อย่าใช้เป็นช่องทางเดียว ติดตามประกาศทางการและโทร 1784 เมื่อมีเหตุฉุกเฉิน',
    rpBtn: 'แจ้งน้ำท่วม', rpTitle: 'แจ้งน้ำท่วม', rpSub: 'ถ่ายรูปถนนหรือจุดน้ำท่วมจากกล้องเพื่อเตือนคนอื่น',
    rpB1: 'ถ่ายสด ณ จุดนั้น', rpB2: 'ระบบขอตำแหน่งเพื่อระบุจุดเกิดเหตุ', rpB3: 'รายงานจะแสดงต่อสาธารณะ 24 ชั่วโมง (ระบบเบลอใบหน้าก่อนส่ง) ผู้ดูแลลบได้ตลอดเวลา', rpB4: 'ห้ามถ่ายเจาะจงบุคคลหรือป้ายทะเบียน',
    rpConsent: 'ฉันยินยอมให้เผยแพร่ภาพ ตำแหน่ง และข้อความนี้ต่อสาธารณะ 24 ชั่วโมง ตาม', rpOpen: 'เปิดกล้อง', rpNote: 'รายละเอียดเพิ่มเติม (ไม่บังคับ)',
    rpSend: 'ส่งรายงาน', rpSending: 'กำลังส่ง', rpLocating: 'กำลังหาตำแหน่ง', rpOk: 'ส่งรายงานแล้ว ขอบคุณ',
    rpFail: 'ส่งไม่สำเร็จ ลองใหม่อีกครั้ง', rpNoLoc: 'ไม่ได้รับตำแหน่ง ให้อนุญาตการเข้าถึงตำแหน่งแล้วลองใหม่', close: 'ปิด',
    rfOk: 'ยืนยันว่าจริง (ฉันอยู่แถวนี้)', rfOkLoc: 'กำลังหาตำแหน่ง', rfOkDone: 'ยืนยันแล้ว', rfOkN: 'ยืนยันโดยคนในพื้นที่ {n} คน', rfOkNone: 'ยังไม่มีผู้ยืนยัน',
    rfOkFar: 'ต้องอยู่ห่างจากจุดนี้ไม่เกิน 1 กม. จึงจะยืนยันได้', rfOkOwn: 'คุณเป็นผู้ส่งรายงานนี้ ยืนยันเองไม่ได้', rfOkFail: 'ยืนยันไม่สำเร็จ ลองใหม่อีกครั้ง',
    camShot: 'ถ่ายภาพ', camDenied: 'เปิดกล้องไม่ได้ ให้อนุญาตการใช้กล้องในการตั้งค่าเบราว์เซอร์แล้วลองใหม่', camRetake: 'ถ่ายใหม่', staffLink: 'สำหรับผู้ดูแลเว็บไซต์', back: 'ย้อนกลับ', notGov: 'เว็บไซต์นี้จัดทำโดยประชาชนทั่วไป ไม่ใช่เว็บไซต์ของหน่วยงานภาครัฐ',
<<<<<<< HEAD
    alBrave: "เบราว์เซอร์ติดต่อบริการแจ้งเตือน (push) ไม่ได้ ลองปิด VPN/ตัวบล็อกโฆษณา หรือรีสตาร์ตเบราว์เซอร์ หากใช้ Brave ให้เปิด Settings > Privacy and security > Use Google services for push messaging หรือสลับไปใช้ Chrome/Edge",
=======
    alNoGuarantee: "การแจ้งเตือนผ่านเครื่องเป็นเพียงตัวช่วย ไม่รับประกันว่าจะส่งถึงทุกเครื่องหรือทันเวลาเสมอ ขึ้นอยู่กับสัญญาณอินเทอร์เน็ต การตั้งค่าเครื่อง โหมดประหยัดพลังงาน และบริการของผู้ผลิตเครื่อง กรุณาเข้ามาตรวจสอบระดับน้ำและประกาศบนเว็บนี้เป็นระยะ โดยเฉพาะช่วงฝนตกหนัก และปฏิบัติตามประกาศของหน่วยงานราชการเป็นหลัก", alBrave: "เบราว์เซอร์ติดต่อบริการแจ้งเตือน (push) ไม่ได้ ลองปิด VPN/ตัวบล็อกโฆษณา หรือรีสตาร์ตเบราว์เซอร์ หากใช้ Brave ให้เปิด Settings > Privacy and security > Use Google services for push messaging หรือสลับไปใช้ Chrome/Edge",
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
    alConsent: 'ฉันยินยอมให้เก็บข้อมูลการสมัครรับแจ้งเตือนของอุปกรณ์นี้ (รหัสสำหรับส่งแจ้งเตือน พื้นที่ และการตั้งค่า) ตาม', legPrivacy: 'นโยบายความเป็นส่วนตัว (PDPA)', legTerms: 'ข้อกำหนดการใช้บริการ', legCredits: 'เครดิตและแหล่งข้อมูล', alSound: 'เสียงแจ้งเตือน', alSnd_siren: 'ไซเรน', alSnd_bell: 'ระฆัง', alSnd_beep: 'บี๊บ', alSnd_voice: 'เสียงพูด', alSnd_silent: 'เงียบ (สั่นอย่างเดียว)', alSoundNote: 'เสียงที่เลือกจะดังเมื่อเปิดหน้าเว็บหรือแอปอยู่ ส่วนตอนปิดแอป เบราว์เซอร์ไม่ยอมให้เว็บกำหนดเสียงเอง ระบบจะใช้เสียงแจ้งเตือนของเครื่อง (ปรับได้ที่การตั้งค่าการแจ้งเตือนของมือถือ) และสั่นตามระดับความรุนแรงแทน', alExtra: 'ข่าวเพิ่มเติม', alNotices: 'ประกาศจากผู้ดูแลเว็บไซต์', alOnMsg: 'เปิดการแจ้งเตือนแล้ว ปิดแอปก็ยังแจ้งเตือน', alOnState: 'เปิดอยู่ แจ้งเตือนได้แม้ปิดแอป', alOff: 'ระบบแจ้งเตือนยังไม่เปิดใช้งานบนเซิร์ฟเวอร์ (ผู้ดูแลยังไม่ได้ตั้งค่า)', alFail: 'ไม่สำเร็จ ลองใหม่อีกครั้ง', alIos: 'บน iPhone/iPad ต้องแตะแชร์ แล้วเลือก "เพิ่มไปยังหน้าจอโฮม" ก่อน จากนั้นเปิดแอปจากหน้าจอโฮมจึงจะเปิดการแจ้งเตือนได้ (iOS 16.4 ขึ้นไป)', alVoiceText: 'แจ้งเตือนระดับน้ำ นี่คือตัวอย่างเสียงพูด', pwaTitle: 'ติดตั้งแอปไว้บนหน้าจอหลัก', pwaBody: 'เปิดดูระดับน้ำได้เร็วเหมือนแอป รับแจ้งเตือนแม้ปิดหน้าเว็บ และดูเบอร์ฉุกเฉินได้แม้ไม่มีอินเทอร์เน็ต', pwaIosBody: 'แตะปุ่มแชร์ (ไอคอนสี่เหลี่ยมมีลูกศรชี้ขึ้น) ที่แถบของ Safari แล้วเลือก "เพิ่มไปยังหน้าจอโฮม"', pwaInstall: 'ติดตั้ง', pwaLater: 'ไว้ทีหลัง', loading: 'กำลังโหลด…', themeAuto: 'ตามอุปกรณ์', themeLight: 'โหมดสว่าง', themeDark: 'โหมดมืด', pwaClose: 'ปิด', camDelete: 'ลบรูปนี้', install: 'วิธีติดตั้งแอป', mInstall: 'เพิ่มลงหน้าจอหลัก iPhone / Android / คอม', pwaHow: 'ดูวิธีติดตั้งแบบละเอียด',
  },
  en: {
    shelters: 'Shelters', shTitle: 'Temporary shelters', shSub: 'Evacuation centres for flood victims. Status can change, so call ahead before travelling.',
    shEmpty: 'No shelter data yet', shEmptyHow: 'Officials can add entries on the admin page',
    sh_open: 'Open', sh_full: 'Full', sh_closed: 'Closed', shCap: 'Capacity', shCall: 'Call', shNav: 'Directions',
    shNote: 'Shelter data is maintained by the site admin and is not an official announcement. In an emergency call 1784 or 191.', lyShelters: 'Shelters', alAll: 'All',
    alTitle: 'Alert settings', alSub: 'Get instant alerts on your phone even when the app is closed: when water in your chosen areas rises to your level, when officials post a notice, and when TMD forecasts heavy rain.',
    alEnable: 'Turn on alerts', alDisable: 'Turn off alerts', alAreas: 'Districts to follow', alMin: 'Alert at level',
    alTest: 'Send test alert', alTestTitle: 'Test alert', alTestBody: 'Alerts are working', alTestSent: 'Sent',
    alDenied: 'Notifications are blocked. Allow them in your browser site settings first.', alUnsupported: 'This device or browser does not support notifications.',
    alHit: '{n} station(s) reached your alert level',
    alNote: 'Alerts fire only when a level rises, with no repeat for the same station within 3 hours. They travel through your browser push service and may be delayed or missed on poor networks, so do not rely on them alone. Follow official announcements and call 1784 in an emergency.',
    rpBtn: 'Report flood', rpTitle: 'Report a flood', rpSub: 'Take a photo of a flooded road or spot to warn others',
    rpB1: 'Take the photo live at the spot', rpB2: 'Your location is requested to mark the spot', rpB3: 'Your report is shown publicly for 24 hours (faces are blurred before sending). Admins can remove it at any time.', rpB4: 'Do not photograph individuals or licence plates',
    rpConsent: 'I consent to publishing this photo, location and note publicly for 24 hours as described in the', rpOpen: 'Open camera', rpNote: 'Extra details (optional)',
    rpSend: 'Send report', rpSending: 'Sending', rpLocating: 'Finding location', rpOk: 'Report sent. Thank you.',
    rpFail: 'Could not send. Please try again.', rpNoLoc: 'Location unavailable. Allow location access and try again.', close: 'Close',
    rfOk: 'Confirm it is real (I am nearby)', rfOkLoc: 'Locating', rfOkDone: 'Confirmed', rfOkN: 'Confirmed by {n} nearby', rfOkNone: 'Not confirmed yet',
    rfOkFar: 'You must be within 1 km of this spot to confirm', rfOkOwn: 'You sent this report, so you cannot confirm it', rfOkFail: 'Could not confirm. Please try again.',
    camShot: 'Take photo', camDenied: 'Cannot open the camera. Allow camera access in your browser settings and try again.', camRetake: 'Retake', staffLink: 'Admin login', back: 'Back', notGov: 'This is an independent website made by ordinary citizens. It is not a government website.',
<<<<<<< HEAD
    alBrave: "The browser cannot reach its push service. Turn off any VPN or ad blocker, or restart the browser. In Brave, enable Settings > Privacy and security > Use Google services for push messaging, or switch to Chrome/Edge.",
=======
    alNoGuarantee: "Push alerts are a convenience only and are not guaranteed to reach every device or arrive on time. Delivery depends on your connection, device settings, battery saver mode, and your device maker's push service. Please check this site regularly, especially during heavy rain, and follow official announcements first.", alBrave: "The browser cannot reach its push service. Turn off any VPN or ad blocker, or restart the browser. In Brave, enable Settings > Privacy and security > Use Google services for push messaging, or switch to Chrome/Edge.",
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
    alConsent: 'I consent to storing this device alert subscription (delivery token, areas and settings) as described in the', legPrivacy: 'Privacy Policy (PDPA)', legTerms: 'Terms of Service', legCredits: 'Credits and data sources', alSound: 'Alert sound', alSnd_siren: 'Siren', alSnd_bell: 'Bell', alSnd_beep: 'Beep', alSnd_voice: 'Voice', alSnd_silent: 'Silent (vibrate only)', alSoundNote: 'The chosen sound plays while the site or app is open. When it is closed, browsers do not let websites pick the sound, so your phone default notification sound is used (change it in phone notification settings) and vibration strength follows severity.', alExtra: 'More news', alNotices: 'Notices from the site admins', alOnMsg: 'Alerts are on. You will be notified even when the app is closed.', alOnState: 'On: alerts work even when the app is closed', alOff: 'Alerts are not enabled on the server yet (the admin has not configured them).', alFail: 'Failed. Please try again.', alIos: 'On iPhone/iPad, tap Share and choose "Add to Home Screen" first, then open the app from your home screen to turn on alerts (iOS 16.4 or later).', alVoiceText: 'Water level alert. This is a voice sample.', pwaTitle: 'Install the app on your home screen', pwaBody: 'Open water levels faster, get alerts even when the page is closed, and see emergency numbers without internet.', pwaIosBody: 'Tap the Share button (square with an up arrow) in Safari, then choose "Add to Home Screen".', pwaInstall: 'Install', pwaLater: 'Later', loading: 'Loading…', themeAuto: 'Match device', themeLight: 'Light mode', themeDark: 'Dark mode', pwaClose: 'Close', camDelete: 'Delete photo', install: 'How to install', mInstall: 'Add to home screen: iPhone / Android / PC', pwaHow: 'See detailed install steps',
  },
  zh: {
    shelters: '避难所', shTitle: '临时避难所', shSub: '为洪水受灾者提供的安置点。状态可能变化，出发前请先电话确认。',
    shEmpty: '暂无避难所数据', shEmptyHow: '工作人员可在管理页面添加',
    sh_open: '开放', sh_full: '已满', sh_closed: '关闭', shCap: '容纳', shCall: '拨打', shNav: '导航',
    shNote: '避难所数据由网站管理员维护，并非官方公告。紧急情况请拨打 1784 或 191。', lyShelters: '避难所', alAll: '全部',
    alTitle: '提醒设置', alSub: '即使应用已关闭，也能在手机上即时收到提醒：所选地区水位升至设定级别、官方发布通知、气象部门预报暴雨时。',
    alEnable: '开启提醒', alDisable: '关闭提醒', alAreas: '关注的县区', alMin: '达到以下级别时提醒',
    alTest: '发送测试提醒', alTestTitle: '测试提醒', alTestBody: '提醒功能正常', alTestSent: '已发送',
    alDenied: '通知已被浏览器阻止，请先在网站设置中允许。', alUnsupported: '此设备或浏览器不支持通知。',
    alHit: '{n} 个站点达到您设定的级别',
    alNote: '仅在水位上升时提醒，同一站点3小时内不重复。提醒通过浏览器推送服务发送，网络不佳时可能延迟或收不到，请勿只依赖它。紧急情况请关注官方公告并拨打1784。',
    rpBtn: '上报洪水', rpTitle: '上报洪水', rpSub: '拍摄积水道路或地点的照片，提醒他人',
    rpB1: '请在现场实时拍摄', rpB2: '需要获取位置以标记地点', rpB3: '报告将公开显示24小时（发送前会模糊人脸），管理员可随时删除。', rpB4: '请勿拍摄个人或车牌',
    rpConsent: '我同意按以下政策公开发布此照片、位置和文字24小时：', rpOpen: '打开相机', rpNote: '补充说明（可选）',
    rpSend: '提交报告', rpSending: '发送中', rpLocating: '正在定位', rpOk: '报告已提交，谢谢',
    rpFail: '发送失败，请重试', rpNoLoc: '无法获取位置，请允许定位后重试', close: '关闭',
    rfOk: '确认属实（我在附近）', rfOkLoc: '正在定位', rfOkDone: '已确认', rfOkN: '{n} 位附近居民已确认', rfOkNone: '暂无人确认',
    rfOkFar: '需在此地点1公里内才能确认', rfOkOwn: '这是你提交的报告，不能自行确认', rfOkFail: '确认失败，请重试',
    camShot: '拍照', camDenied: '无法打开相机，请在浏览器设置中允许使用相机后重试', camRetake: '重拍', staffLink: '管理员入口', back: '返回', notGov: '本网站由普通民众自发制作，并非政府官方网站。',
<<<<<<< HEAD
    alBrave: "浏览器无法连接推送服务。请关闭 VPN 或广告拦截器，或重启浏览器。在 Brave 中请开启 设置 > 隐私和安全 > 使用 Google 服务进行推送消息，或改用 Chrome/Edge。",
=======
    alNoGuarantee: "推送通知仅作辅助，不保证送达每台设备或及时到达，可能受网络、设备设置、省电模式及设备厂商推送服务影响。请定期查看本网站，尤其在暴雨期间，并以官方公告为准。", alBrave: "浏览器无法连接推送服务。请关闭 VPN 或广告拦截器，或重启浏览器。在 Brave 中请开启 设置 > 隐私和安全 > 使用 Google 服务进行推送消息，或改用 Chrome/Edge。",
>>>>>>> 64a1286b514201750dcba787527d4eb8807aed62
    alConsent: '我同意按以下政策保存本设备的提醒订阅信息（推送标识、地区和设置）：', legPrivacy: '隐私政策（PDPA）', legTerms: '服务条款', legCredits: '致谢与数据来源', alSound: '提醒声音', alSnd_siren: '警报声', alSnd_bell: '铃声', alSnd_beep: '哔声', alSnd_voice: '语音', alSnd_silent: '静音（仅震动）', alSoundNote: '所选声音在网站或应用打开时播放。关闭后浏览器不允许网站指定声音，将使用手机默认通知声音（可在手机通知设置中更改），并按严重程度震动。', alExtra: '更多消息', alNotices: '管理员通知', alOnMsg: '提醒已开启，关闭应用后仍会通知。', alOnState: '已开启：关闭应用也能提醒', alOff: '服务器尚未启用提醒功能（管理员未配置）。', alFail: '失败，请重试。', alIos: '在 iPhone/iPad 上，请先点分享并选择“添加到主屏幕”，再从主屏幕打开应用才能开启提醒（iOS 16.4 及以上）。', alVoiceText: '水位提醒，这是语音示例。', pwaTitle: '将应用添加到主屏幕', pwaBody: '更快查看水位，页面关闭后仍可收到提醒，没有网络也能查看紧急电话。', pwaIosBody: '点按 Safari 中的分享按钮（带向上箭头的方框），然后选择“添加到主屏幕”。', pwaInstall: '安装', pwaLater: '稍后', loading: '加载中…', themeAuto: '跟随设备', themeLight: '浅色模式', themeDark: '深色模式', pwaClose: '关闭', camDelete: '删除照片', install: '安装方法', mInstall: '添加到主屏幕：iPhone / Android / 电脑', pwaHow: '查看详细安装步骤',
  },
}
