import { Lang } from './types'

export const ZONE: Record<Lang, Record<string, string>> = {
  th: {
    zoSearchPh: 'ค้นหาตำบล / อำเภอ', zoNear: 'ใกล้ฉัน', zoAmphoe: 'เลือกอำเภอ', zoTambon: 'เลือกตำบล',
    zoAllAmphoe: 'ทุกอำเภอ', zoWholeAmphoe: 'ทั้งอำเภอ',
    zoYouAre: 'ตำแหน่งของคุณอยู่ที่ {z}', zoOut: 'ตำแหน่งของคุณอยู่นอกพื้นที่จังหวัดสงขลา แสดงทุกพื้นที่แทน',
    zoShowing: 'แสดง {n} รายการ', zoRpEmpty: 'ยังไม่มีรายงานในพื้นที่นี้', zoShEmpty: 'ยังไม่มีศูนย์พักพิงในพื้นที่นี้',
    zoAway: 'ห่าง {d} กม.', zoNoZone: 'ไม่ระบุตำบล', zoListTitle: 'รายการ', zoMapTitle: 'แผนที่',
  },
  en: {
    zoSearchPh: 'Search sub-district / district', zoNear: 'Near me', zoAmphoe: 'Choose district', zoTambon: 'Choose sub-district',
    zoAllAmphoe: 'All districts', zoWholeAmphoe: 'Whole district',
    zoYouAre: 'You are in {z}', zoOut: 'Your location is outside Songkhla province, showing all areas instead.',
    zoShowing: 'Showing {n}', zoRpEmpty: 'No reports in this area yet', zoShEmpty: 'No shelters in this area yet',
    zoAway: '{d} km away', zoNoZone: 'Sub-district unknown', zoListTitle: 'List', zoMapTitle: 'Map',
  },
  zh: {
    zoSearchPh: '搜索乡 / 县', zoNear: '我附近', zoAmphoe: '选择县', zoTambon: '选择乡',
    zoAllAmphoe: '所有县', zoWholeAmphoe: '整个县',
    zoYouAre: '您当前位于 {z}', zoOut: '您的位置在宋卡府范围之外，已显示所有区域。',
    zoShowing: '显示 {n} 条', zoRpEmpty: '该区域暂无报告', zoShEmpty: '该区域暂无避难所',
    zoAway: '距离 {d} 公里', zoNoZone: '未标明乡', zoListTitle: '列表', zoMapTitle: '地图',
  },
}
