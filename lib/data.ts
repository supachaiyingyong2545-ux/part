import { Candidate, Track } from './types';

export const tracks: Track[] = [
  {
    id: 'tech',
    name: 'สายเทคโนโลยี',
    nameEn: 'Technology',
    description: 'นวัตกรรมที่ขับเคลื่อนด้วยเทคโนโลยี',
    emoji: '💡',
    color: 'blue',
  },
  {
    id: 'biz',
    name: 'สายธุรกิจ',
    nameEn: 'Business',
    description: 'โมเดลธุรกิจที่ยั่งยืนและสร้างคุณค่า',
    emoji: '📊',
    color: 'emerald',
  },
  {
    id: 'social',
    name: 'สายสังคม',
    nameEn: 'Social Impact',
    description: 'แนวคิดที่สร้างผลกระทบเชิงบวกต่อสังคม',
    emoji: '🌱',
    color: 'purple',
  },
  {
    id: 'creative',
    name: 'สายสร้างสรรค์',
    nameEn: 'Creative',
    description: 'ความคิดสร้างสรรค์ที่ไม่มีขีดจำกัด',
    emoji: '🎨',
    color: 'amber',
  },
];

export const candidates: Candidate[] = [
  // Tech
  {
    id: 'tech-1',
    teamName: 'Team Alpha',
    pitchTitle: 'MediScan AI',
    description: 'ระบบวินิจฉัยโรคเบื้องต้นด้วย AI ที่ทุกคนเข้าถึงได้ผ่านสมาร์ทโฟน',
    trackId: 'tech',
    members: ['สมชาย ใจดี', 'นภา เพชรรัตน์', 'วิชัย สุขสม'],
  },
  {
    id: 'tech-2',
    teamName: 'Team Beta',
    pitchTitle: 'SmartFarm Hub',
    description: 'แพลตฟอร์ม IoT ที่ช่วยให้เกษตรกรบริหารจัดการฟาร์มได้อย่างแม่นยำ',
    trackId: 'tech',
    members: ['ประยุทธ์ มานะ', 'ยุพิน สดใส', 'ชาติชาย ทองดี'],
  },
  {
    id: 'tech-3',
    teamName: 'Team Gamma',
    pitchTitle: 'EduBot Learn',
    description: 'AI ที่ออกแบบแผนการเรียนรู้แบบ personalized สำหรับนักเรียนทุกระดับ',
    trackId: 'tech',
    members: ['อาทิตย์ แสงทอง', 'จันทรา รุ่งเรือง', 'ศุกร์ดี มีสุข'],
  },
  {
    id: 'tech-4',
    teamName: 'Team Delta',
    pitchTitle: 'ClearAir Monitor',
    description: 'เครือข่ายเซ็นเซอร์ตรวจจับคุณภาพอากาศแบบ real-time พร้อมพยากรณ์ล่วงหน้า',
    trackId: 'tech',
    members: ['มงคล บริสุทธิ์', 'นภา เมฆา', 'เกียรติ ศรีสุข'],
  },

  // Business
  {
    id: 'biz-1',
    teamName: 'Team Echo',
    pitchTitle: 'LocalMart Connect',
    description: 'แพลตฟอร์มเชื่อมเกษตรกรท้องถิ่นกับผู้บริโภคโดยตรง ลดพ่อค้าคนกลาง',
    trackId: 'biz',
    members: ['สุรชัย เจริญ', 'วาสนา ดีงาม', 'ประพันธ์ สร้างสรรค์'],
  },
  {
    id: 'biz-2',
    teamName: 'Team Foxtrot',
    pitchTitle: 'SkillBridge Pro',
    description: 'ตลาดแรงงานทักษะสูงที่เชื่อมผู้เชี่ยวชาญอิสระกับโปรเจกต์คุณภาพ',
    trackId: 'biz',
    members: ['กิตติ รุ่งโรจน์', 'นิภา ใจงาม', 'เจนจิรา ฉลาด'],
  },
  {
    id: 'biz-3',
    teamName: 'Team Golf',
    pitchTitle: 'GreenPack Sub',
    description: 'บริการบรรจุภัณฑ์ยั่งยืนแบบสมัครสมาชิก ลดขยะพลาสติกในธุรกิจ',
    trackId: 'biz',
    members: ['ธนชาติ มั่นคง', 'ปิยะมาศ สุดใจ', 'สหรัฐ ก้าวหน้า'],
  },
  {
    id: 'biz-4',
    teamName: 'Team Hotel',
    pitchTitle: 'TravelMind AI',
    description: 'AI วางแผนการท่องเที่ยวที่เข้าใจรสนิยมและงบประมาณของแต่ละคน',
    trackId: 'biz',
    members: ['ชนะพล เก่งกาจ', 'รัตนา สว่าง', 'วิโรจน์ เด่นชัด'],
  },

  // Social
  {
    id: 'social-1',
    teamName: 'Team India',
    pitchTitle: 'WasteWise',
    description: 'แพลตฟอร์มชุมชนที่ทำให้การแยกขยะและรีไซเคิลกลายเป็นเรื่องสนุกและได้รางวัล',
    trackId: 'social',
    members: ['อภิชาติ ใจดี', 'ชนิดา สะอาด', 'พิทักษ์ รักษา'],
  },
  {
    id: 'social-2',
    teamName: 'Team Juliet',
    pitchTitle: 'ElderCare Connect',
    description: 'ระบบดูแลผู้สูงอายุด้วยเทคโนโลยีที่เรียบง่าย ให้ครอบครัวอุ่นใจทุกที่',
    trackId: 'social',
    members: ['ปราโมทย์ เอาใจใส่', 'สุจิตรา อบอุ่น', 'วรรณา รักดี'],
  },
  {
    id: 'social-3',
    teamName: 'Team Kilo',
    pitchTitle: 'LearnEqual',
    description: 'แพลตฟอร์มการศึกษาที่สร้างโอกาสเท่าเทียมให้เด็กในพื้นที่ห่างไกล',
    trackId: 'social',
    members: ['ชัยวัฒน์ พัฒนา', 'ลำไย สดใส', 'ศิริพร เจริญ'],
  },
  {
    id: 'social-4',
    teamName: 'Team Lima',
    pitchTitle: 'FoodHero Network',
    description: 'เครือข่ายกู้ภัยอาหารส่วนเกินจากร้านค้าและร้านอาหารส่งต่อผู้ขาดแคลน',
    trackId: 'social',
    members: ['สันติ แบ่งปัน', 'กุลธิดา ช่วยเหลือ', 'ไพบูลย์ มีใจ'],
  },

  // Creative
  {
    id: 'creative-1',
    teamName: 'Team Mike',
    pitchTitle: 'ArtBridge Global',
    description: 'เชื่อมโยงศิลปินไทยสู่ตลาดศิลปะระดับโลกผ่านแพลตฟอร์มดิจิทัล',
    trackId: 'creative',
    members: ['สมศักดิ์ สร้างสรรค์', 'ชุติมา ศิลป์', 'ยศวดี งดงาม'],
  },
  {
    id: 'creative-2',
    teamName: 'Team November',
    pitchTitle: 'StoryMap Thailand',
    description: 'แพลตฟอร์มอนุรักษ์และเล่าเรื่องราวท้องถิ่นของไทยผ่านสื่อดิจิทัลเชิงสร้างสรรค์',
    trackId: 'creative',
    members: ['อำนาจ บอกเล่า', 'นลินรัตน์ เรื่องราว', 'พลวัต ประวัติ'],
  },
  {
    id: 'creative-3',
    teamName: 'Team Oscar',
    pitchTitle: 'CraftCircle Modern',
    description: 'พื้นที่ฟื้นฟูงานหัตถกรรมพื้นบ้านด้วยดีไซน์ร่วมสมัยที่ตอบโจทย์ตลาดปัจจุบัน',
    trackId: 'creative',
    members: ['เอกพล ประณีต', 'สุภาพร ฝีมือดี', 'ณัฐวุฒิ คิดสร้าง'],
  },
  {
    id: 'creative-4',
    teamName: 'Team Papa',
    pitchTitle: 'SoundSpace Indie',
    description: 'แพลตฟอร์มค้นพบและสนับสนุนศิลปินดนตรีอินดี้ไทยที่กำลังเติบโต',
    trackId: 'creative',
    members: ['ภูวไนย ดนตรี', 'พิมพ์ชนก เสียง', 'ทวีศักดิ์ ทำนอง'],
  },
];
