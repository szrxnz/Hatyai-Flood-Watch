import type { Lang } from './types'

export type Item = string | { t: string; href: string }
export interface Section { h: string; p?: string[]; ul?: Item[]; table?: { head: string[]; rows: string[][] } }
export interface Doc { title: string; updated: string; intro?: string; sections: Section[] }
export type Kind = 'privacy' | 'terms' | 'credits'


const OP = process.env.OPERATOR_NAME || ''
const MAIL = process.env.CONTACT_EMAIL || ''
const UPDATED = { th: '14 ตุลาคม 2569', en: '14 October 2026', zh: '2026年10月14日' }

const TH_PRIVACY = (op: string, mail: string): Doc => ({
  title: 'นโยบายความเป็นส่วนตัว (PDPA)', updated: `ปรับปรุงล่าสุด ${UPDATED.th}`,
  intro: 'นโยบายนี้อธิบายว่าเว็บไซต์ "เฝ้าระวังน้ำท่วมหาดใหญ่" เก็บ ใช้ และเปิดเผยข้อมูลส่วนบุคคลอย่างไร ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) เว็บไซต์นี้จัดทำโดยประชาชนทั่วไป ไม่ใช่เว็บไซต์หรือช่องทางประกาศอย่างเป็นทางการของหน่วยงานภาครัฐ',
  sections: [
    { h: '1. ผู้ควบคุมข้อมูลส่วนบุคคล', p: [`${op}`, `ติดต่อได้ที่ ${mail}`] },
    { h: '2. ข้อมูลที่เราเก็บ', table: { head: ['ข้อมูล', 'วัตถุประสงค์', 'ฐานทางกฎหมาย', 'ระยะเวลาเก็บ'], rows: [
      ['รายงานน้ำท่วมจากประชาชน: รูปถ่าย (ระบบเบลอใบหน้าในเบราว์เซอร์ก่อนส่ง) ตำแหน่ง GPS ที่ปัดเศษประมาณ 10 เมตร ข้อความ และเวลา', 'แสดงสถานการณ์น้ำท่วมให้ผู้อื่นเห็นบนเว็บไซต์ (เป็นข้อมูลสาธารณะ)', 'ความยินยอม (ติ๊กยอมรับก่อนส่ง)', 'แสดง 24 ชั่วโมง เก็บสูงสุด 48 ชั่วโมงแล้วลบ ผู้ดูแลลบก่อนได้'],
      ['การยืนยัน/แจ้งว่าเป็นเท็จต่อรายงาน: ค่าแฮชย่อยจาก IP (ไม่เก็บ IP จริง) และตำแหน่งที่ใช้ตรวจระยะขณะกดยืนยัน (ไม่เก็บพิกัดของผู้ยืนยัน)', 'เพิ่มความน่าเชื่อถือและป้องกันการกดซ้ำหรือใช้ในทางที่ผิด', 'ประโยชน์โดยชอบด้วยกฎหมาย', 'เท่ากับอายุของรายงาน'],
      ['การสมัครรับแจ้งเตือน: รหัสปลายทางสำหรับส่งแจ้งเตือนที่เบราว์เซอร์สร้างให้ (push endpoint และกุญแจเข้ารหัส) อำเภอที่เลือก ระดับที่ต้องการ เสียง ภาษา และเวลาสมัคร/ใช้ล่าสุด', 'ส่งแจ้งเตือนระดับน้ำ ฝนตกหนัก และประกาศ ถึงอุปกรณ์ของคุณ', 'ความยินยอม (ติ๊กยอมรับก่อนเปิดแจ้งเตือน)', 'จนกว่าจะยกเลิก หรือไม่เปิดเว็บเกิน 180 วัน หรือเมื่อบริการ push แจ้งว่ารหัสใช้ไม่ได้'],
      ['ตำแหน่งในฟังก์ชัน "พื้นที่เสี่ยง"', 'หาสถานีใกล้คุณ', 'ความยินยอม (เบราว์เซอร์ขออนุญาต)', 'ประมวลผลในเครื่องของคุณ ไม่ส่งมาเก็บที่เซิร์ฟเวอร์'],
      ['ข้อมูลในอุปกรณ์ (localStorage): ธีม อำเภอ/พื้นที่ที่เลือก ชั้นแผนที่ การตั้งค่าแจ้งเตือน และวันที่ปิดหน้าต่างขอติดตั้งแอป', 'จำค่าที่คุณเลือก', 'ความจำเป็นต่อการให้บริการที่คุณใช้', 'อยู่ในเครื่องคุณจนกว่าจะล้างข้อมูลเบราว์เซอร์'],
      ['ข้อมูลทางเทคนิคในบันทึกของผู้ให้บริการโฮสติ้ง เช่น IP, ชนิดเบราว์เซอร์, เวลาเข้าใช้', 'ความมั่นคงปลอดภัยและแก้ไขปัญหาระบบ', 'ประโยชน์โดยชอบด้วยกฎหมาย', 'ตามนโยบายของผู้ให้บริการโฮสติ้ง'],
    ] } },
    { h: '3. คุกกี้และการติดตาม', p: ['เราไม่ใช้คุกกี้หรือเครื่องมือติดตามเพื่อการโฆษณาหรือวิเคราะห์พฤติกรรม มีคุกกี้เฉพาะของผู้ดูแลเว็บไซต์ที่ล็อกอินหลังบ้านเท่านั้น'] },
    { h: '4. การเปิดเผยข้อมูลและผู้ให้บริการภายนอก', p: ['รายงานน้ำท่วม (รูป ตำแหน่ง ข้อความ) จะแสดงต่อสาธารณะ เราไม่ขายข้อมูลของคุณ ข้อมูลอาจถูกประมวลผลโดยผู้ให้บริการที่จำเป็นต่อการทำงานของเว็บไซต์ ดังนี้'], ul: [
      'ผู้ให้บริการโฮสติ้ง (Vercel) และฐานข้อมูล (Upstash) ใช้เก็บและให้บริการเว็บไซต์',
      'บริการ push ของเบราว์เซอร์ (Google FCM, Apple, Mozilla, Microsoft) ใช้ส่งแจ้งเตือนถึงอุปกรณ์ของคุณ ตามเบราว์เซอร์ที่คุณใช้',
      'OpenStreetMap (ภาพแผนที่) และ RainViewer (เรดาร์ฝน): เบราว์เซอร์ของคุณโหลดภาพจากเซิร์ฟเวอร์ของเขาโดยตรง ทำให้ IP ของคุณถูกส่งถึงผู้ให้บริการเหล่านั้น',
      'jsDelivr และ Google Cloud Storage: ใช้ดาวน์โหลดตัวตรวจจับใบหน้า (MediaPipe) เมื่อคุณเปิดหน้าแจ้งน้ำท่วม ภาพถ่ายของคุณไม่ถูกส่งไปที่นั่น ประมวลผลในเครื่องคุณ',
      'เรียกข้อมูลระดับน้ำจาก ThaiWater และพยากรณ์จากกรมอุตุนิยมวิทยาโดยเซิร์ฟเวอร์ของเรา โดยไม่ส่งข้อมูลของผู้ใช้ไป',
      'หน่วยงานที่มีอำนาจตามกฎหมาย หากมีคำสั่งหรือกฎหมายกำหนด',
    ] },
    { h: '5. การโอนข้อมูลไปต่างประเทศ', p: ['ผู้ให้บริการข้างต้นอาจเก็บหรือประมวลผลข้อมูลบนเซิร์ฟเวอร์นอกประเทศไทย เราเลือกใช้ผู้ให้บริการที่มีมาตรการรักษาความปลอดภัยตามมาตรฐานสากล และการโอนจะเป็นไปตามที่ PDPA กำหนด'] },
    { h: '6. สิทธิของเจ้าของข้อมูล', p: ['คุณมีสิทธิขอเข้าถึงและขอสำเนา ขอแก้ไข ขอลบหรือทำลาย ขอระงับหรือคัดค้านการประมวลผล และขอให้โอนย้ายข้อมูล รวมทั้งถอนความยินยอมได้ทุกเมื่อ โดยการถอนไม่กระทบการประมวลผลที่ได้ทำไปแล้วก่อนหน้า'], ul: [
      'ยกเลิกการแจ้งเตือน: กดปิดที่หน้า "แจ้งเตือน" ระบบจะลบข้อมูลการสมัครของเครื่องนั้นทันที',
      `ลบรายงานน้ำท่วมของคุณ: ส่งอีเมลมาที่ ${mail} พร้อมเวลาและตำแหน่งโดยประมาณ`,
      'หากเห็นว่าเราไม่ปฏิบัติตามกฎหมาย คุณมีสิทธิร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.)',
    ] },
    { h: '7. มาตรการรักษาความปลอดภัย', p: ['ใช้ HTTPS ทุกหน้า เบลอใบหน้าก่อนอัปโหลด ไม่เก็บ IP จริงในรายการรายงาน จำกัดการเข้าถึงหลังบ้านด้วยรหัสผ่านและเซสชันที่หมดอายุ จำกัดอัตราการส่งรายงาน และตรวจเฉพาะบริการ push ที่เชื่อถือได้ อย่างไรก็ตามไม่มีระบบใดปลอดภัยสมบูรณ์'] },
    { h: '8. ผู้เยาว์', p: ['ผู้ที่อายุต่ำกว่า 20 ปีควรได้รับความยินยอมจากผู้ปกครองก่อนส่งรายงานหรือสมัครแจ้งเตือน และเด็กอายุต่ำกว่า 10 ปีต้องได้รับความยินยอมจากผู้ปกครองเสมอ'] },
    { h: '9. การเปลี่ยนแปลงนโยบาย', p: ['เราอาจปรับปรุงนโยบายนี้ โดยจะแสดงวันที่ปรับปรุงล่าสุดไว้ที่ด้านบนของหน้า'] },
    { h: '10. ติดต่อเรา', p: [`${op} · ${mail}`] },
  ],
})

const TH_TERMS = (op: string, mail: string): Doc => ({
  title: 'ข้อกำหนดการใช้บริการ', updated: `ปรับปรุงล่าสุด ${UPDATED.th}`,
  intro: 'เว็บไซต์นี้จัดทำโดยประชาชนทั่วไป ไม่ใช่เว็บไซต์ของหน่วยงานภาครัฐ การใช้เว็บไซต์นี้ถือว่าคุณยอมรับข้อกำหนดด้านล่าง หากไม่ยอมรับ กรุณาหยุดใช้งาน',
  sections: [
    { h: '1. ลักษณะของบริการ', p: ['เว็บไซต์นี้รวบรวมข้อมูลระดับน้ำ ฝน และพยากรณ์จากแหล่งสาธารณะ เพื่อช่วยให้ประชาชนติดตามสถานการณ์ได้สะดวก เป็นข้อมูลอ้างอิงเท่านั้น ไม่ใช่ประกาศทางการของหน่วยงานรัฐ (เว็บไซต์นี้จัดทำโดยประชาชนทั่วไป ไม่ใช่เว็บไซต์ภาครัฐ) และไม่ใช่คำสั่งอพยพ'], ul: ['ข้อมูลอาจล่าช้า ผิดพลาด ขาดหาย หรือเซ็นเซอร์ขัดข้อง', 'สถานะ (ปกติ เฝ้าระวัง เสี่ยงสูง วิกฤต) คำนวณโดยระบบเทียบกับระดับตลิ่งของแต่ละสถานี ไม่ใช่การประเมินความเสี่ยงของพื้นที่ใดพื้นที่หนึ่งโดยเฉพาะ', 'เมื่อเกิดเหตุจริง ให้ยึดประกาศของ ปภ. กรมอุตุนิยมวิทยา และเจ้าหน้าที่ในพื้นที่ และโทร 1784 (น้ำท่วม) 1669 (การแพทย์ฉุกเฉิน) 191 (ตำรวจ)'] },
    { h: '2. การแจ้งเตือน', p: ['การแจ้งเตือนส่งแบบพยายามอย่างดีที่สุดผ่านบริการ push ของเบราว์เซอร์ อาจล่าช้า ไม่ถึง หรือถูกระบบประหยัดพลังงานของเครื่องบล็อก จึงไม่ควรใช้เป็นช่องทางเดียวในการเตือนภัย คุณยกเลิกได้ทุกเมื่อที่หน้า "แจ้งเตือน"'] },
    { h: '3. รายงานน้ำท่วมจากประชาชน', p: ['เมื่อส่งรายงาน คุณยืนยันและตกลงว่า'], ul: ['ถ่ายภาพจริงในจุดเกิดเหตุขณะนั้น และข้อมูลเป็นความจริงตามที่คุณทราบ', 'ไม่ส่งภาพหรือข้อความที่เป็นเท็จ ลามก ผิดกฎหมาย ละเมิดสิทธิผู้อื่น หรือมีข้อมูลส่วนบุคคลของผู้อื่น เช่น ใบหน้า ทะเบียนรถ เลขที่บ้าน', 'อนุญาตให้เว็บไซต์แสดงภาพ ตำแหน่ง และข้อความของคุณต่อสาธารณะเป็นเวลา 24 ชั่วโมง โดยไม่คิดค่าตอบแทน', 'ผู้ดูแลมีสิทธิลบหรือซ่อนรายงานโดยไม่ต้องแจ้งล่วงหน้า และรายงานที่ถูกแจ้งเป็นเท็จหลายครั้งอาจถูกซ่อนอัตโนมัติ', 'การส่งข้อมูลเท็จอาจมีความผิดตามกฎหมาย เช่น พ.ร.บ.ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ พ.ศ. 2550'] },
    { h: '4. ยืนยันรายงาน', p: ['ปุ่มยืนยันใช้ได้เมื่ออยู่ห่างจุดรายงานไม่เกิน 1 กม. และผู้ส่งยืนยันรายงานของตัวเองไม่ได้ จำนวนผู้ยืนยันช่วยประกอบการพิจารณาเท่านั้น ไม่ใช่การรับรองความถูกต้อง'] },
    { h: '5. จุดพักพิง', p: ['ข้อมูลและรูปถ่ายจุดพักพิงจัดทำโดยผู้ดูแลเว็บไซต์ สถานะอาจเปลี่ยนได้ตลอดเวลา กรุณาโทรยืนยันกับสถานที่ก่อนเดินทาง'] },
    { h: '6. ทรัพย์สินทางปัญญาและแหล่งข้อมูล', p: ['ซอร์สโค้ด การออกแบบ และเนื้อหาที่ผู้จัดทำสร้างขึ้นเป็นสิทธิ์ของผู้จัดทำเว็บไซต์ ห้ามคัดลอกไปใช้โดยไม่ได้รับอนุญาต หากต้องการนำไปต่อยอดโปรดติดต่อผู้จัดทำ ข้อมูลน้ำ ฝน แผนที่ และเนื้อหาจากแหล่งอื่นเป็นสิทธิ์ของเจ้าของข้อมูลเดิม ดูรายละเอียดที่หน้าเครดิต'] },
    { h: '7. ข้อจำกัดความรับผิด', p: ['เว็บไซต์ให้บริการตามสภาพ "ตามที่เป็น" โดยไม่มีการรับประกันความถูกต้อง ความต่อเนื่อง หรือความเหมาะสมกับวัตถุประสงค์ใด ในขอบเขตสูงสุดที่กฎหมายอนุญาต ผู้ดูแลไม่รับผิดชอบต่อความเสียหายที่เกิดจากการใช้หรือไม่สามารถใช้บริการ หรือการตัดสินใจโดยอาศัยข้อมูลในเว็บไซต์'] },
    { h: '8. การเปลี่ยนแปลงและการระงับบริการ', p: ['ผู้ดูแลอาจแก้ไขข้อกำหนด เปลี่ยนแปลง หยุดชั่วคราว หรือยุติบริการได้ทุกเมื่อ และอาจจำกัดการใช้งานของผู้ที่ใช้ในทางที่ผิด'] },
    { h: '9. กฎหมายที่ใช้บังคับ', p: ['ข้อกำหนดนี้อยู่ภายใต้กฎหมายแห่งราชอาณาจักรไทย'] },
    { h: '10. ติดต่อ', p: [`${op} · ${mail}`] },
  ],
})

const TH_CREDITS = (op: string): Doc => ({
  title: 'เครดิตและแหล่งข้อมูล', updated: `ปรับปรุงล่าสุด ${UPDATED.th}`,
  intro: 'ขอบคุณหน่วยงานเจ้าของข้อมูล ผู้พัฒนาโอเพนซอร์ส และประชาชนที่ร่วมรายงาน ที่ทำให้เว็บไซต์นี้เกิดขึ้นได้ การอ้างถึงชื่อไม่ได้หมายความว่าหน่วยงานเหล่านั้นรับรองหรือมีส่วนร่วมกับเว็บไซต์นี้',
  sections: [
    { h: 'ข้อมูลและรูปภาพ', ul: [
      { t: 'ระดับน้ำ: ThaiWater โดยสถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน) หรือ สสน.', href: 'https://www.thaiwater.net' },
      { t: 'พยากรณ์อากาศและฝนรายชั่วโมง: กรมอุตุนิยมวิทยา (TMD) ผ่าน Weather Forecast API', href: 'https://data.tmd.go.th' },
      { t: 'เรดาร์ฝน: RainViewer', href: 'https://www.rainviewer.com' },
      { t: 'แผนที่: © ผู้ร่วมจัดทำ OpenStreetMap (สัญญาอนุญาต ODbL)', href: 'https://www.openstreetmap.org/copyright' },
      { t: 'ข้อมูลกล้อง CCTV คลองและระดับน้ำ: โครงการ Hat Yai City Climate', href: 'https://hatyaicityclimate.org' },
      { t: 'เบอร์ติดต่อฉุกเฉินและประกาศ: กรมป้องกันและบรรเทาสาธารณภัย (ปภ.)', href: 'https://www.disaster.go.th' },
      { t: 'ข้อมูลน้ำและอ่างเก็บน้ำ: กรมชลประทาน', href: 'https://www.rid.go.th' },
      { t: 'ขอบเขตการปกครอง (ตำบล): Royal Thai Survey Department ผ่าน OCHA / Humanitarian Data Exchange (COD-AB Thailand) สัญญาอนุญาต CC BY-IGO', href: 'https://data.humdata.org/dataset/cod-ab-tha' },
      { t: 'ภาพพื้นหลังหน้าหลัก: ภาพถ่ายโดย Sorawit Pramokchutima ลิขสิทธิ์ภาพเป็นของเจ้าของภาพ', href: 'https://www.facebook.com/p.sorawit/' },
    ] },
    { h: 'ซอฟต์แวร์โอเพนซอร์ส', ul: [
      { t: 'Next.js และ React (MIT)', href: 'https://nextjs.org' },
      { t: 'Leaflet (BSD-2-Clause) แผนที่', href: 'https://leafletjs.com' },
      { t: 'MediaPipe Tasks Vision และโมเดล BlazeFace (Apache-2.0) ตรวจจับใบหน้าเพื่อเบลอ', href: 'https://developers.google.com/mediapipe' },
      { t: 'polygon-clipping (MIT)', href: 'https://github.com/mfogel/polygon-clipping' },
      { t: 'zod (MIT)', href: 'https://zod.dev' },
      { t: 'web-push (MPL-2.0) ส่งการแจ้งเตือน', href: 'https://github.com/web-push-libs/web-push' },
      { t: 'ฟอนต์ IBM Plex Sans Thai (SIL Open Font License 1.1)', href: 'https://fonts.google.com/specimen/IBM+Plex+Sans+Thai' },
    ] },
    { h: 'โครงสร้างพื้นฐาน', ul: [{ t: 'Vercel (โฮสติ้ง)', href: 'https://vercel.com' }, { t: 'Upstash (ฐานข้อมูล Redis)', href: 'https://upstash.com' }] },
    { h: 'ผู้จัดทำ', p: [op, 'เว็บไซต์นี้จัดทำโดยประชาชนทั่วไป ไม่ใช่เว็บไซต์ของหน่วยงานภาครัฐ และไม่ได้รับการรับรองจากหน่วยงานใด', 'และขอบคุณประชาชนทุกคนที่ช่วยรายงานและยืนยันสถานการณ์'] },
  ],
})

const EN_PRIVACY = (op: string, mail: string): Doc => ({
  title: 'Privacy Policy (PDPA)', updated: `Last updated ${UPDATED.en}`,
  intro: 'This policy explains how the "Hat Yai Flood Watch" website collects, uses and discloses personal data under the Thai Personal Data Protection Act B.E. 2562 (2019) (PDPA). This is an independent website made by ordinary citizens. It is not a government website or an official announcement channel.',
  sections: [
    { h: '1. Data controller', p: [op, `Contact: ${mail}`] },
    { h: '2. Data we collect', table: { head: ['Data', 'Purpose', 'Legal basis', 'Retention'], rows: [
      ['Citizen flood reports: photo (faces are blurred in your browser before upload), GPS location rounded to about 10 m, note text and time', 'Show flood conditions to others on the site (public)', 'Consent (checkbox before sending)', 'Shown for 24 hours, stored at most 48 hours then deleted; admins may delete sooner'],
      ['Confirming or flagging a report: a hash of your IP (not the IP itself) and your location used only to check distance at the moment you press confirm (your coordinates are not stored)', 'Improve credibility and prevent repeat or abusive use', 'Legitimate interest', 'Same as the report'],
      ['Alert subscription: the delivery endpoint and encryption keys your browser generates (push endpoint), chosen districts, level, sound, language, subscription and last-seen time', 'Send water level, heavy rain and notice alerts to your device', 'Consent (checkbox before enabling alerts)', 'Until you unsubscribe, or no visit for 180 days, or the push service reports the token invalid'],
      ['Your location in "Risk areas"', 'Find stations near you', 'Consent (browser permission prompt)', 'Processed on your device only, not sent to our server'],
      ['On-device storage (localStorage): theme, chosen district/area, map layers, alert settings and the date you dismissed the install prompt', 'Remember your choices', 'Necessary for the service you use', 'On your device until you clear browser data'],
      ['Technical data in the hosting provider logs such as IP, browser type and access time', 'Security and troubleshooting', 'Legitimate interest', 'Per the hosting provider policy'],
    ] } },
    { h: '3. Cookies and tracking', p: ['We use no advertising or behavioural tracking cookies or tools. The only cookie is for logged-in site admins in the back office.'] },
    { h: '4. Disclosure and third parties', p: ['Flood reports (photo, location, note) are shown publicly. We do not sell your data. It may be processed by providers needed to run the site:'], ul: [
      'Hosting (Vercel) and database (Upstash) to store and serve the site',
      'Browser push services (Google FCM, Apple, Mozilla, Microsoft), depending on your browser, to deliver alerts to your device',
      'OpenStreetMap (map tiles) and RainViewer (rain radar): your browser loads images directly from them, so your IP address reaches those providers',
      'jsDelivr and Google Cloud Storage: used to download the face detector (MediaPipe) when you open the report form; your photo is not sent there and is processed on your device',
      'Water levels from ThaiWater and forecasts from the Thai Meteorological Department are fetched by our server without sending any user data',
      'Authorities with legal power, where required by law',
    ] },
    { h: '5. Cross-border transfer', p: ['The providers above may store or process data on servers outside Thailand. We choose providers with internationally recognised security measures and transfers follow the PDPA.'] },
    { h: '6. Your rights', p: ['You may request access and a copy, correction, deletion or destruction, restriction or objection to processing, and data portability, and you may withdraw consent at any time. Withdrawal does not affect processing done before it.'], ul: [
      'Stop alerts: switch them off on the Alerts page and that device subscription is deleted immediately',
      `Delete your flood report: email ${mail} with the approximate time and place`,
      'If you believe we do not comply with the law, you may complain to the Personal Data Protection Committee Office (PDPC)',
    ] },
    { h: '7. Security', p: ['HTTPS on all pages, face blurring before upload, no raw IP stored in report records, back office protected by a password and expiring sessions, rate limiting, and only trusted push services accepted. No system is perfectly secure.'] },
    { h: '8. Minors', p: ['People under 20 should get a parent or guardian consent before sending a report or enabling alerts, and children under 10 always need it.'] },
    { h: '9. Changes', p: ['We may update this policy and will show the latest update date at the top of this page.'] },
    { h: '10. Contact', p: [`${op} · ${mail}`] },
  ],
})

const EN_TERMS = (op: string, mail: string): Doc => ({
  title: 'Terms of Service', updated: `Last updated ${UPDATED.en}`,
  intro: 'This is an independent website made by ordinary citizens, not a government website. By using it you accept the terms below. If you do not accept them, please stop using it.',
  sections: [
    { h: '1. What the service is', p: ['This site gathers water level, rain and forecast data from public sources so people can follow conditions easily. It is for reference only. It is not an official government announcement (this site is run by ordinary citizens, not the government) and not an evacuation order.'], ul: ['Data may be delayed, wrong or missing, and sensors can fail', 'Status labels (normal, watch, high, critical) are computed against each station bank level and are not a risk assessment of any specific location', 'In a real event follow DDPM, the Thai Meteorological Department and local officials, and call 1784 (floods), 1669 (medical emergency) or 191 (police)'] },
    { h: '2. Alerts', p: ['Alerts are best effort through your browser push service. They can be late, missed or blocked by your device battery saving, so never rely on them as your only warning. You can stop them any time on the Alerts page.'] },
    { h: '3. Citizen flood reports', p: ['When you send a report you confirm and agree that'], ul: ['You took the photo live at the place at that time, and the information is true to your knowledge', 'You will not submit false, obscene or illegal content, content violating others rights, or personal data of others such as faces, licence plates or house numbers', 'You allow the site to show your photo, location and note publicly for 24 hours, free of charge', 'Admins may delete or hide a report without notice, and reports flagged as false many times may be hidden automatically', 'Submitting false information may be an offence under laws such as the Computer Crime Act B.E. 2550'] },
    { h: '4. Confirming reports', p: ['Confirm works only within 1 km of the report and reporters cannot confirm their own report. The confirmation count is a hint only, not a guarantee of accuracy.'] },
    { h: '5. Shelters', p: ['Shelter information and photos are maintained by the site admins and may change at any time. Please call the venue to confirm before travelling.'] },
    { h: '6. Intellectual property and data sources', p: ['The source code, design and original content are owned by the site maker and may not be copied or reused without permission. If you want to build on it, please contact the maker. Water, rain, map and other third party content belongs to the original owners. See the Credits page.'] },
    { h: '7. Limitation of liability', p: ['The site is provided "as is" without warranty of accuracy, continuity or fitness for any purpose. To the maximum extent permitted by law the operator is not liable for damage arising from use of, or inability to use, the service, or from decisions based on its information.'] },
    { h: '8. Changes and suspension', p: ['The operator may amend these terms, change, pause or end the service at any time and may restrict misuse.'] },
    { h: '9. Governing law', p: ['These terms are governed by the laws of the Kingdom of Thailand.'] },
    { h: '10. Contact', p: [`${op} · ${mail}`] },
  ],
})

const EN_CREDITS = (op: string): Doc => ({
  title: 'Credits and data sources', updated: `Last updated ${UPDATED.en}`,
  intro: 'Thanks to the agencies, open-source authors and citizens who make this site possible. Naming them does not mean they endorse or take part in this site.',
  sections: [
    { h: 'Data and images', ul: [
      { t: 'Water levels: ThaiWater by the Hydro-Informatics Institute (HII)', href: 'https://www.thaiwater.net' },
      { t: 'Weather and hourly rain forecast: Thai Meteorological Department (TMD) Weather Forecast API', href: 'https://data.tmd.go.th' },
      { t: 'Rain radar: RainViewer', href: 'https://www.rainviewer.com' },
      { t: 'Map: © OpenStreetMap contributors (ODbL)', href: 'https://www.openstreetmap.org/copyright' },
      { t: 'Canal CCTV and staff gauges: Hat Yai City Climate project', href: 'https://hatyaicityclimate.org' },
      { t: 'Emergency numbers and notices: Department of Disaster Prevention and Mitigation (DDPM)', href: 'https://www.disaster.go.th' },
      { t: 'Water and reservoir data: Royal Irrigation Department', href: 'https://www.rid.go.th' },
      { t: 'Administrative boundaries (tambon): Royal Thai Survey Department via OCHA / Humanitarian Data Exchange (COD-AB Thailand), licensed CC BY-IGO.', href: 'https://data.humdata.org/dataset/cod-ab-tha' },
      { t: 'Home page background photo: by Sorawit Pramokchutima. Copyright remains with the photographer.', href: 'https://www.facebook.com/p.sorawit/' },
    ] },
    { h: 'Open-source software', ul: [
      { t: 'Next.js and React (MIT)', href: 'https://nextjs.org' },
      { t: 'Leaflet (BSD-2-Clause) maps', href: 'https://leafletjs.com' },
      { t: 'MediaPipe Tasks Vision and BlazeFace model (Apache-2.0) face detection for blurring', href: 'https://developers.google.com/mediapipe' },
      { t: 'polygon-clipping (MIT)', href: 'https://github.com/mfogel/polygon-clipping' },
      { t: 'zod (MIT)', href: 'https://zod.dev' },
      { t: 'web-push (MPL-2.0) sending notifications', href: 'https://github.com/web-push-libs/web-push' },
      { t: 'IBM Plex Sans Thai font (SIL Open Font License 1.1)', href: 'https://fonts.google.com/specimen/IBM+Plex+Sans+Thai' },
    ] },
    { h: 'Infrastructure', ul: [{ t: 'Vercel (hosting)', href: 'https://vercel.com' }, { t: 'Upstash (Redis database)', href: 'https://upstash.com' }] },
    { h: 'Maintainer', p: [op, 'This is an independent site made by ordinary citizens. It is not a government website and is not endorsed by any agency.', 'And thanks to every citizen who reports and confirms conditions.'] },
  ],
})

const ZH_PRIVACY = (op: string, mail: string): Doc => ({
  title: '隐私政策（PDPA）', updated: `最后更新：${UPDATED.zh}`,
  intro: '本政策说明“合艾洪水预警”网站依据泰国《个人数据保护法》（佛历2562年/2019年，简称 PDPA）如何收集、使用和披露个人数据。本网站是普通市民自发制作的独立网站，不是政府网站，也不是官方发布渠道。',
  sections: [
    { h: '1. 数据控制者', p: [op, `联系方式：${mail}`] },
    { h: '2. 我们收集的数据', table: { head: ['数据', '用途', '法律依据', '保存期限'], rows: [
      ['市民洪水报告：照片（上传前已在您的浏览器中对人脸做模糊处理）、精确到约10米的GPS位置、备注文字和时间', '向其他人公开显示洪水情况', '同意（发送前勾选确认框）', '显示24小时，最长保存48小时后删除；管理员可提前删除'],
      ['确认或举报某条报告：您的IP哈希值（不保存IP本身），以及仅在您按下确认的瞬间用于核对距离的位置（不保存您的坐标）', '提高可信度，防止重复或滥用', '合法利益', '与该报告相同'],
      ['提醒订阅：浏览器生成的推送地址和加密密钥（push endpoint）、所选县区、级别、声音、语言、订阅时间和最近访问时间', '向您的设备发送水位、暴雨和公告提醒', '同意（开启提醒前勾选确认框）', '直至您取消订阅、180天未访问，或推送服务报告该标识无效'],
      ['您在“风险区域”中的位置', '查找您附近的站点', '同意（浏览器权限提示）', '仅在您的设备上处理，不会发送到我们的服务器'],
      ['设备本地存储（localStorage）：主题、所选县区/区域、地图图层、提醒设置以及您关闭安装提示的日期', '记住您的选择', '为您使用的服务所必需', '保存在您的设备上，直至您清除浏览器数据'],
      ['托管服务商日志中的技术数据，如IP、浏览器类型和访问时间', '安全与故障排查', '合法利益', '依托管服务商的政策'],
    ] } },
    { h: '3. Cookie 与跟踪', p: ['我们不使用任何广告或行为跟踪的 Cookie 或工具。唯一的 Cookie 仅用于已登录后台的网站管理员。'] },
    { h: '4. 披露与第三方', p: ['洪水报告（照片、位置、备注）会公开显示。我们不会出售您的数据。为运行本网站，数据可能由以下服务商处理：'], ul: [
      '托管（Vercel）和数据库（Upstash），用于存储和提供网站服务',
      '浏览器推送服务（Google FCM、Apple、Mozilla、Microsoft，视您的浏览器而定），用于向您的设备送达提醒',
      'OpenStreetMap（地图图块）和 RainViewer（雨量雷达）：您的浏览器直接从它们加载图片，因此您的IP地址会到达这些服务商',
      'jsDelivr 和 Google Cloud Storage：在您打开报告表单时用于下载人脸检测器（MediaPipe）；您的照片不会发送到那里，而是在您的设备上处理',
      '来自 ThaiWater 的水位数据和泰国气象局的预报由我们的服务器获取，不会发送任何用户数据',
      '依法享有权力的主管机关（法律要求时）',
    ] },
    { h: '5. 跨境传输', p: ['上述服务商可能在泰国境外的服务器上存储或处理数据。我们选择具有国际认可安全措施的服务商，传输遵循 PDPA。'] },
    { h: '6. 您的权利', p: ['您可以要求访问并获取副本、更正、删除或销毁、限制或反对处理、数据可携带，并可随时撤回同意。撤回不影响撤回前已进行的处理。'], ul: [
      '停止提醒：在“提醒”页面关闭，该设备的订阅会立即删除',
      `删除您的洪水报告：请发送邮件至 ${mail}，并附上大致的时间和地点`,
      '如您认为我们未遵守法律，可向个人数据保护委员会办公室（PDPC）投诉',
    ] },
    { h: '7. 安全', p: ['所有页面均使用 HTTPS，上传前对人脸做模糊处理，报告记录中不保存原始IP，后台受密码和限时会话保护，设有请求频率限制，且仅接受可信的推送服务。没有任何系统是绝对安全的。'] },
    { h: '8. 未成年人', p: ['未满20岁的人在发送报告或开启提醒前应取得父母或监护人的同意，未满10岁的儿童一律需要取得同意。'] },
    { h: '9. 变更', p: ['我们可能更新本政策，并会在本页顶部显示最新更新日期。'] },
    { h: '10. 联系方式', p: [`${op} · ${mail}`] },
  ],
})

const ZH_TERMS = (op: string, mail: string): Doc => ({
  title: '服务条款', updated: `最后更新：${UPDATED.zh}`,
  intro: '本网站是普通市民自发制作的独立网站，不是政府网站。使用本网站即表示您接受以下条款；如不接受，请停止使用。',
  sections: [
    { h: '1. 服务内容', p: ['本网站汇集来自公开来源的水位、降雨和预报数据，方便大家了解情况。内容仅供参考，不是政府的官方公告（本网站由普通市民运营，并非政府），也不是疏散命令。'], ul: ['数据可能延迟、有误或缺失，传感器也可能故障', '状态标签（正常、留意、高风险、危急）是按各站点的堤岸水位计算的，不是对任何具体地点的风险评估', '发生实际灾情时，请遵循泰国防灾减灾厅（DDPM）、泰国气象局和当地官员的指示，并拨打 1784（洪水）、1669（急救）或 191（警察）'] },
    { h: '2. 提醒', p: ['提醒通过您的浏览器推送服务尽力发送，可能延迟、漏收，或被设备的省电功能拦截，因此切勿将其作为唯一的预警方式。您可随时在“提醒”页面停止。'] },
    { h: '3. 市民洪水报告', p: ['发送报告时，您确认并同意：'], ul: ['照片是您当时在现场实时拍摄的，且据您所知信息属实', '您不会提交虚假、淫秽或违法内容，不会提交侵犯他人权利的内容，也不会提交他人的个人信息，如人脸、车牌或门牌号', '您允许本网站免费公开显示您的照片、位置和备注24小时', '管理员可不经通知删除或隐藏报告，被多次举报为虚假的报告可能被自动隐藏', '提交虚假信息可能违反《计算机犯罪法》（佛历2550年）等法律'] },
    { h: '4. 确认报告', p: ['只有在报告位置1公里范围内才能确认，报告者不能确认自己的报告。确认数量仅作提示，不保证准确。'] },
    { h: '5. 避难点', p: ['避难点信息和照片由网站管理员维护，可能随时变化。出发前请先致电确认。'] },
    { h: '6. 知识产权与数据来源', p: ['源代码、设计和原创内容归网站制作者所有，未经许可不得复制或再利用。如需在此基础上开发，请联系制作者。水位、降雨、地图及其他第三方内容归原所有者所有，详见“致谢”页面。'] },
    { h: '7. 责任限制', p: ['本网站按“现状”提供，不保证准确、持续或适用于任何目的。在法律允许的最大范围内，运营者对因使用或无法使用本服务、或依据其信息所作决定而产生的损害不承担责任。'] },
    { h: '8. 变更与暂停', p: ['运营者可随时修订本条款，更改、暂停或终止服务，并可限制滥用行为。'] },
    { h: '9. 适用法律', p: ['本条款适用泰王国法律。'] },
    { h: '10. 联系方式', p: [`${op} · ${mail}`] },
  ],
})

const ZH_CREDITS = (op: string): Doc => ({
  title: '致谢与数据来源', updated: `最后更新：${UPDATED.zh}`,
  intro: '感谢各机构、开源作者以及参与报告的市民，让本网站得以实现。列出名称并不表示这些机构认可或参与本网站。',
  sections: [
    { h: '数据与图片', ul: [
      { t: '水位：ThaiWater，由水资源信息研究院（HII，即 สสน.）提供', href: 'https://www.thaiwater.net' },
      { t: '天气与逐小时降雨预报：泰国气象局（TMD）天气预报 API', href: 'https://data.tmd.go.th' },
      { t: '雨量雷达：RainViewer', href: 'https://www.rainviewer.com' },
      { t: '地图：© OpenStreetMap 贡献者（ODbL）', href: 'https://www.openstreetmap.org/copyright' },
      { t: '运河监控摄像头与水尺：合艾城市气候（Hat Yai City Climate）项目', href: 'https://hatyaicityclimate.org' },
      { t: '紧急电话与公告：泰国防灾减灾厅（DDPM）', href: 'https://www.disaster.go.th' },
      { t: '水与水库数据：泰国皇家灌溉厅', href: 'https://www.rid.go.th' },
      { t: '行政边界（乡）：泰国皇家测绘局，经 OCHA / 人道主义数据交换平台（COD-AB Thailand）发布，采用 CC BY-IGO 许可', href: 'https://data.humdata.org/dataset/cod-ab-tha' },
      { t: '首页顶部背景照片：摄影 Sorawit Pramokchutima。照片版权归摄影者所有。', href: 'https://www.facebook.com/p.sorawit/' },
    ] },
    { h: '开源软件', ul: [
      { t: 'Next.js 和 React（MIT）', href: 'https://nextjs.org' },
      { t: 'Leaflet（BSD-2-Clause）地图', href: 'https://leafletjs.com' },
      { t: 'MediaPipe Tasks Vision 和 BlazeFace 模型（Apache-2.0）用于人脸检测并模糊', href: 'https://developers.google.com/mediapipe' },
      { t: 'polygon-clipping（MIT）', href: 'https://github.com/mfogel/polygon-clipping' },
      { t: 'zod（MIT）', href: 'https://zod.dev' },
      { t: 'web-push（MPL-2.0）发送通知', href: 'https://github.com/web-push-libs/web-push' },
      { t: 'IBM Plex Sans Thai 字体（SIL Open Font License 1.1）', href: 'https://fonts.google.com/specimen/IBM+Plex+Sans+Thai' },
    ] },
    { h: '基础设施', ul: [{ t: 'Vercel（托管）', href: 'https://vercel.com' }, { t: 'Upstash（Redis 数据库）', href: 'https://upstash.com' }] },
    { h: '制作者', p: [op, '本网站由普通市民独立制作，不是政府网站，也未获任何机构认可。', '并感谢每一位报告和确认情况的市民。'] },
  ],
})

export function legal(kind: Kind, lang: Lang): Doc {
  const th = lang === 'th', zh = lang === 'zh'
  const op = OP || (th ? '[ระบุชื่อผู้ดูแลเว็บไซต์]' : zh ? '[请填写网站运营者名称]' : '[operator name]')
  const mail = MAIL || (th ? '[ระบุอีเมลติดต่อ]' : zh ? '[请填写联系邮箱]' : '[contact email]')
  if (kind === 'privacy') return th ? TH_PRIVACY(op, mail) : zh ? ZH_PRIVACY(op, mail) : EN_PRIVACY(op, mail)
  if (kind === 'terms') return th ? TH_TERMS(op, mail) : zh ? ZH_TERMS(op, mail) : EN_TERMS(op, mail)
  return th ? TH_CREDITS(op) : zh ? ZH_CREDITS(op) : EN_CREDITS(op)
}
