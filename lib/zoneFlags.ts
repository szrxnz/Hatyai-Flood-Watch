export interface ZoneGroup { slug: string; name: string; muni: string; communities: string[] }
export type FlagLevel = 'normal' | 'watch' | 'high' | 'critical' | 'nodata'
export interface ZoneFlag extends ZoneGroup { level: FlagLevel; color: string | null; banner: string | null; url: string }

export const ZONE_SITE = 'https://hatyaicityclimate.org'
export const ZONE_GROUPS: ZoneGroup[] = [
  {
    "slug": "zone8",
    "name": "กลุ่มเขต 8",
    "muni": "เทศบาลนครหาดใหญ่",
    "communities": [
      "ชุมชนบางหัก",
      "ชุมชนต้นโด",
      "ชุมชนท่าไทร",
      "ชุมชน 3 ทหาร",
      "ชุมชนสถานีอู่ตะเภา",
      "ชุมชนวัดโคกสมานคุณ",
      "ชุมชนโชคสมานคุณ",
      "ชุมชนสถานี 2",
      "ชุมชนสัจจกุล",
      "ชุมชนรัตนอุทิศ",
      "ชุมชนรัชมังคลาภิเษก",
      "ชุมชนหัวพานรถไฟ",
      "ชุมชนหน้าโรงเหล้าสรรพสามิตร",
      "ชุมชนบ้านกลาง",
      "ชุมชนเกาะเลียบ",
      "ชุมชนบ้านฉาง"
    ]
  },
  {
    "slug": "klongrien",
    "name": "กลุ่มคลองเรียน",
    "muni": "เทศบาลนครหาดใหญ่",
    "communities": [
      "ชุมชนคลองเรียน",
      "ชุมชนทุ่งคลองเรียน",
      "ชุมชนตลาดคลองเรียน",
      "ชุมชนบ้านร่มเย็น",
      "ชุมชนบ้านจ่า",
      "ชุมชนหัวนาหัก",
      "ชุมชนหน้าวัดคลองเรียน",
      "ชุมชนอู่ญี่ปุ่น",
      "ชุมชนผาสุก-เคียงดาว",
      "ชุมชนขนส่ง",
      "ชุมชน ม.อ.-คลองเรียน 1",
      "ชุมชนดรุณศึกษา",
      "ชุมชนโรงพยาลาลกรุงเทพ",
      "ชุมชนกลางนา",
      "ชุมชนหน้าโรงเรียนโสตศึกษา",
      "ชุมชนภาสว่าง",
      "ชุมชนอู่ ท.ส.",
      "ชุมชนหน้าค่ายเสนาณรงค์",
      "ชุมชนสุภาพอ่อนหวาน",
      "ชุมชนทักษิณเมืองทอง"
    ]
  },
  {
    "slug": "plagtong",
    "name": "กลุ่มคลองหวะปลักธง",
    "muni": "เทศบาลเมืองคอหงส์",
    "communities": [
      "ชุมชนคลองหวะ 1",
      "ชุมชนคลองหวะ 2",
      "ชุมชนคลองหวะ 3",
      "ชุมชนคลองหวะ 4",
      "ชุมชนปลักธง"
    ]
  },
  {
    "slug": "klonghae",
    "name": "กลุ่มคลองแห",
    "muni": "เทศบาลเมืองคลองแห",
    "communities": [
      "ชุมชนท่าไทร 1",
      "ชุมชนท่าไทร 2",
      "ชุมชนป่ายาง",
      "ชุมชนสะพานดำ",
      "ชุมชนเมืองใหม่ 6",
      "นรินทร์ธร/หนองบัว",
      "ชุมชนใกล้เคียง"
    ]
  },
  {
    "slug": "janwiroch",
    "name": "กลุ่มจันทร์วิโรจน์",
    "muni": "เทศบาลนครหาดใหญ่",
    "communities": [
      "ชุมชนจันทร์วิโรจน์",
      "ชุมชนจันทร์ประทีป",
      "ชุมชนจันทร์นิเวศ",
      "ชุมชนทุ่งเสา",
      "ชุมชนรัตนวิบูลย์"
    ]
  },
  {
    "slug": "economic",
    "name": "กลุ่มย่านเศรษฐกิจ",
    "muni": "เทศบาลนครหาดใหญ่",
    "communities": [
      "ชุมชนกิมหยงสันติสุข",
      "ชุมชนพระเสน่หามนตรี",
      "ชุมชนประชาธิปัตย์",
      "ชุมชนท่งเซียเซี่ยงตึ๊ง",
      "ชุมชนสวนศิริ",
      "ชุมชนชีกิมหยง",
      "ชุมชนป้อม 4",
      "ชุมชนละม้ายสงเคราะห์",
      "ชุมชนศาลเจ้าพ่อเสือ",
      "ชุมชนตลาดใหม่",
      "ชุมชนบ้านพักรถไฟ",
      "ชุมชนแสงสี",
      "ชุมชนสามชัย",
      "ชุมชนจิระนคร",
      "ชุมชนหน้าโรงเรียนหาดใหญ่วิทยาลัย",
      "ชุมชนชุมอุทิศ",
      "ชุมชนพรุแม่สอน"
    ]
  },
  {
    "slug": "stadium",
    "name": "กลุ่มย่านสนามกีฬากลาง",
    "muni": "เทศบาลนครหาดใหญ่",
    "communities": [
      "ชุมชนป้อมหก",
      "ตลาดคอมเพล็กซ์",
      "ชุมชนริมทางรถไฟ",
      "ชุมชนเกาะเสือ",
      "ชุมชนหอนาฬิกา",
      "ชุมชนมุสลิม",
      "ชุมชนหมัดยาเมาะ",
      "ชุมชนศรีนิล",
      "ชุมชนหน้าสนามกีฬากลาง",
      "ชุมชนโรงเรียนชาตรี",
      "ชุมชนหลังสนามกีฬากลาง",
      "ชุมชนหลังโรงเรียนหาดใหญ่วิทยาลัย",
      "ชุมชนศิครินทร์",
      "ชุมชนหน้าโรงพยาบาลศิครินทร์",
      "ชุมชนกอบกาญน์ศึกษา",
      "ชุมชนรัถการ",
      "ชุมชนสามัคคี",
      "ชุมชนอนุสรณ์อาจารย์ทอง",
      "ชุมชนแม่ลิเตา",
      "ชุมชนคลองเตย"
    ]
  },
  {
    "slug": "kuanlang",
    "name": "กลุ่มสองคลองควนลัง",
    "muni": "เทศบาลเมืองควนลัง",
    "communities": [
      "ชุมชนประสานมิตร",
      "ชุมชนหน้าควน",
      "ชุมชนควนสันติ",
      "ชุมชนท่าเคียน",
      "ชุมชนปลักหว้า"
    ]
  },
  {
    "slug": "utapaowest",
    "name": "กลุ่มอู่ตะเภาฝั่งตะวันตก",
    "muni": "เทศบาลนครหาดใหญ่",
    "communities": [
      "ชุมชนวัดหาดใหญ่ใน",
      "ชุมชนเทศาพัฒนา",
      "ชุมชนสถานี 2",
      "ชุมชนริมคลอง ร.1",
      "ชุมชนศาลาลุงทอง",
      "ชุมชนตลาดพ่อพรหม",
      "ชุมชนริมควน"
    ]
  },
  {
    "slug": "utapaoeast",
    "name": "กลุ่มอู่ตะเภาฝั่งตะวันออก",
    "muni": "เทศบาลนครหาดใหญ่",
    "communities": [
      "ชุมชนมงคลหรรษา",
      "ชุมชนหน้าอำเภอ",
      "ชุมชนราษฎร์อุทิศ",
      "ชุมชนหลังที่ว่าการอำเภอ",
      "ชุมชนบ้านหาดใหญ่",
      "ชุมชนไทยโฮเต็ล",
      "ชุมชนหน้าสถานีรถไฟ",
      "ชุมชนปลักกริม",
      "ชุมชนดีแลนด์-ไทยเจริญ",
      "ชุมชนท่าเคียน",
      "ชุมชนหลังโรงพัก",
      "ชุมชนหลังอู่รถไฟ",
      "ชุมชนแฟลตเคหะใหม่",
      "ชุมชนแฟลตเคหะเก่า",
      "ชุมชนประชาราษฎร์อุทิศ"
    ]
  }
]

const COLORS: Record<string, FlagLevel> = { green: 'normal', yellow: 'watch', orange: 'high', red: 'critical' }
export const LEVEL_RANK: Record<FlagLevel, number> = { critical: 0, high: 1, watch: 2, nodata: 3, normal: 4 }

async function one(g: ZoneGroup): Promise<ZoneFlag> {
  const url = `${ZONE_SITE}/zone/${g.slug}`
  const bad: ZoneFlag = { ...g, level: 'nodata', color: null, banner: null, url }
  try {
    const r = await fetch(url, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'hatyai-flood-watch (contact: you@example.com)' } })
    if (!r.ok) return bad
    const html = await r.text()
    const m = [...html.matchAll(/upload\/img\/(area-flag-([a-z0-9-]+)\.(?:jpg|jpeg|png|webp))/gi)].find((x) => x[2].toLowerCase() !== 'description')
    if (!m) return bad
    const color = m[2].toLowerCase()
    return { ...g, level: COLORS[color] ?? 'nodata', color, banner: `${ZONE_SITE}/upload/img/${m[1]}`, url }
  } catch { return bad }
}

export async function getZoneFlags(): Promise<ZoneFlag[]> {
  const all = await Promise.all(ZONE_GROUPS.map(one))
  return all.sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level])
}
