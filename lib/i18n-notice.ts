import { Lang } from './types'

export const NOTICE: Record<Lang, Record<string, string>> = {
  th: {
    rpB3: 'รายงานจะแสดงให้ทุกคนเห็นทันทีเป็นเวลา 24 ชั่วโมง', rpConsent: 'ยอมรับว่าภาพ ตำแหน่ง และข้อความจะเผยแพร่สาธารณะ', rpOk: 'เผยแพร่รายงานแล้ว ขอบคุณ', rpRate: 'ส่งบ่อยเกินไป รอสักครู่',
    rfTitle: 'รายงานจากประชาชน', rfSub: 'ภาพน้ำท่วมจากคนในพื้นที่ แสดง 24 ชั่วโมงล่าสุด ยังไม่ผ่านการตรวจสอบจากเจ้าหน้าที่', rfEmpty: 'ยังไม่มีรายงาน', rfMin: 'นาทีที่แล้ว', rfHr: 'ชม.ที่แล้ว', rfMap: 'ดูตำแหน่ง',
    rfFlag: 'รายงานภาพไม่เหมาะสม', rfFlagged: 'แจ้งแล้ว', rfConfirm: 'แจ้งว่าภาพนี้ไม่เหมาะสมหรือเป็นข้อมูลเท็จ?', reports: 'รายงานประชาชน',
    notices: 'ประกาศ', ntTitle: 'ประกาศจากผู้ดูแลเว็บไซต์', ntSub: 'ประกาศเตือนภัยและข่าวสารล่าสุด แชร์ลิงก์ให้คนในพื้นที่ได้', ntEmpty: 'ขณะนี้ยังไม่มีประกาศ',
    ntShare: 'แชร์', ntCopied: 'คัดลอกลิงก์แล้ว', ntAllArea: 'ทั้งจังหวัด', loading: 'กำลังโหลด',
    kind_rain: 'ฝนตกหนักต่อเนื่อง', kind_flood: 'น้ำท่วม', kind_evac: 'อพยพ', kind_info: 'ทั่วไป', lv_info: 'ข้อมูล', lv_watch: 'เฝ้าระวัง', lv_high: 'เสี่ยงสูง', lv_critical: 'วิกฤต',
    fcSrcTmd: 'ข้อมูลจากกรมอุตุนิยมวิทยา (TMD)',
    blurTitle: 'ตรวจภาพก่อนส่ง', blurHint: 'ระบบเบลอใบหน้าให้อัตโนมัติ ส่วนป้ายทะเบียนและข้อมูลส่วนตัวอื่น ให้ลากนิ้วคลุมบริเวณนั้นเพื่อเบลอ', blurAuto: 'เบลอใบหน้าอัตโนมัติ {n} จุด',
    blurLoading: 'กำลังตรวจหาใบหน้า', blurNoAI: 'ตรวจใบหน้าอัตโนมัติไม่ได้ กรุณาลากเบลอเอง', blurUndo: 'ย้อนกลับ', blurDone: 'ยืนยันภาพ', fab: 'แจ้งน้ำท่วม',
  },
  en: {
    rpB3: 'Your report is published to everyone immediately for 24 hours', rpConsent: 'I agree that my photo, location and note will be public', rpOk: 'Report published. Thank you.', rpRate: 'Too many reports. Please wait a moment.',
    rfTitle: 'Citizen reports', rfSub: 'Flood photos from people on the ground, last 24 hours. Not verified by officials.', rfEmpty: 'No reports yet', rfMin: 'min ago', rfHr: 'h ago', rfMap: 'View location',
    rfFlag: 'Flag as inappropriate', rfFlagged: 'Flagged', rfConfirm: 'Flag this photo as inappropriate or false?', reports: 'Reports',
    notices: 'Notices', ntTitle: 'Notices from the site admins', ntSub: 'Latest warnings and announcements. Share the link with people in the area.', ntEmpty: 'No notices at the moment',
    ntShare: 'Share', ntCopied: 'Link copied', ntAllArea: 'Whole province', loading: 'Loading',
    kind_rain: 'Prolonged heavy rain', kind_flood: 'Flood', kind_evac: 'Evacuation', kind_info: 'General', lv_info: 'Info', lv_watch: 'Watch', lv_high: 'High risk', lv_critical: 'Critical',
    fcSrcTmd: 'Data from the Thai Meteorological Department (TMD)',
    blurTitle: 'Review photo', blurHint: 'Faces are blurred automatically. Drag over license plates or other personal details to blur them.', blurAuto: '{n} face(s) blurred automatically',
    blurLoading: 'Detecting faces', blurNoAI: 'Automatic face detection unavailable. Please blur manually.', blurUndo: 'Undo', blurDone: 'Confirm photo', fab: 'Report flood',
  },
  zh: {
    rpB3: '报告将立即向所有人公开显示24小时', rpConsent: '我同意公开我的照片、位置和说明', rpOk: '报告已发布，谢谢', rpRate: '提交过于频繁，请稍候',
    rfTitle: '居民报告', rfSub: '来自现场居民的积水照片，最近24小时，未经官方核实', rfEmpty: '暂无报告', rfMin: '分钟前', rfHr: '小时前', rfMap: '查看位置',
    rfFlag: '举报不当内容', rfFlagged: '已举报', rfConfirm: '举报此照片不当或虚假？', reports: '居民报告',
    notices: '公告', ntTitle: '管理员公告', ntSub: '最新预警与通知，可分享链接给当地居民', ntEmpty: '暂无公告',
    ntShare: '分享', ntCopied: '链接已复制', ntAllArea: '全省', loading: '加载中',
    kind_rain: '持续强降雨', kind_flood: '洪水', kind_evac: '疏散', kind_info: '一般', lv_info: '信息', lv_watch: '关注', lv_high: '高风险', lv_critical: '危急',
    fcSrcTmd: '数据来自泰国气象局（TMD）',
    blurTitle: '发送前检查照片', blurHint: '系统会自动模糊人脸。车牌等个人信息请用手指拖动框选以模糊', blurAuto: '已自动模糊 {n} 张人脸',
    blurLoading: '正在检测人脸', blurNoAI: '无法自动检测人脸，请手动模糊', blurUndo: '撤销', blurDone: '确认照片', fab: '报告洪水',
  },
}
