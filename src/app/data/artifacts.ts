export interface Artifact {
  id: number;
  name: string;
  dynasty: string;
  year: string;
  description: string;
  story: string;
  image: string;
  personality: string;
  modelType: 'vase' | 'jade' | 'painting' | 'embroidery' | 'inkstone';
  modelPath?: string;
}

export const artifacts: Artifact[] = [
  {
    id: 1,
    name: "真珠舍利宝幢",
    dynasty: "北宋",
    year: "公元960-1127年",
    description: "苏州博物馆镇馆之宝，是北宋时期的佛教圣物。宝幢通高122.6厘米，由木胎、金银、珍珠、宝石等材料制成，工艺精湛，是中国佛教文物中的珍品。",
    story: "我诞生于北宋太平兴国二年，是当时吴越国王钱俶为祈求国泰民安而建造的。历经千年风霜，我见证了苏州的兴衰变迁，承载着虔诚的信仰和精湛的工艺。每一颗珍珠、每一片金叶，都凝聚着古人的智慧与虔诚。",
    image: new URL('../../assets/images/zhen.webp', import.meta.url).href,
    personality: "庄严神圣，充满佛性智慧，语气平和宁静",
    modelType: 'jade',
    modelPath: new URL('../../assets/models/zhen.glb', import.meta.url).href
  },
  {
    id: 2,
    name: "五代秘色瓷莲花碗",
    dynasty: "五代",
    year: "公元907-960年",
    description: "秘色瓷是越窑青瓷中的极品，专供皇室使用。这件莲花碗釉色青翠，造型优美，代表了五代时期制瓷工艺的最高水平。",
    story: "我来自越窑，那个出产'秘色瓷'的神秘之地。我的釉色如千峰翠色，如湖水碧波。在五代十国的乱世中，我曾是王室贵胄的珍宝。如今静卧于苏州博物馆，继续诉说着千年前的繁华。",
    image: "https://images.unsplash.com/photo-1770354227649-059bbfc475db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwcG9yY2VsYWluJTIwdmFzZXxlbnwxfHx8fDE3NzU4MDIwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    personality: "优雅细腻，如水般温润，富有诗意",
    modelType: 'vase',
    modelPath: "/assets/models/glbfile.glb"
  },
  {
    id: 3,
    name: "明代虎丘塔出土玉器",
    dynasty: "明代",
    year: "公元1368-1644年",
    description: "从苏州著名的虎丘塔中出土的玉器，雕工精细，玉质温润。包括玉璧、玉佩等多种器物，反映了明代苏州地区玉雕工艺的高超水平。",
    story: "我曾深藏于虎丘塔下，与佛经、舍利共同守护着这座古塔。我见证了明朝苏州的繁荣，那时的苏州是江南第一大城，商贾云集，文人荟萃。我的每一处雕刻都凝聚着工匠的心血，展现着'良玉虽集京师，工巧则推苏郡'的美誉。",
    image: "https://images.unsplash.com/photo-1703857537577-18f768266ab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwY2hpbmVzZSUyMGphZGV8ZW58MXx8fHwxNzc1ODAyMDI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    personality: "温润如玉，儒雅博学，喜欢讲述苏州的人文历史",
    modelType: 'jade',
    modelPath: "/assets/models/glbfile.glb"
  },
  {
    id: 4,
    name: "文徵明《拙政园图》",
    dynasty: "明代",
    year: "公元1533年",
    description: "明代著名画家文徵明所绘的拙政园全景图，详细描绘了苏州名园拙政园的景致。这幅画不仅是艺术珍品，也是研究苏州园林的重要史料。",
    story: "我出自吴门画派大师文徵明之手，描绘的是他好友王献臣的私家园林——拙政园。我用细腻的笔墨记录了那个年代苏州园林的绝代风华。每一笔一划都浸润着江南的诗意，每一处景致都体现着'虽由人作，宛自天开'的造园哲学。",
    image: "https://images.unsplash.com/photo-1684871430852-3413cb17e040?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNoaW5lc2UlMjBwYWludGluZ3xlbnwxfHx8fDE3NzU3MzY5Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    personality: "文雅风流，擅长诗词歌赋，充满江南韵味",
    modelType: 'painting',
    modelPath: "/assets/models/glbfile.glb"
  },
  {
    id: 5,
    name: "清代苏绣《仕女图》",
    dynasty: "清代",
    year: "公元1644-1911年",
    description: "苏州刺绣是中国四大名绣之一，以针法精细、图案秀丽著称。这件仕女图刺绣色彩淡雅，人物栩栩如生，展现了苏绣'平、齐、细、密、匀、顺、和、光'的八字诀。",
    story: "我是苏州绣娘用最细的丝线，最精湛的技艺绣制而成。每一针都经过精心设计，每一线都要恰到好处。我见证了苏绣从宫廷走向民间，从实用走向艺术的历程。我的存在，证明着'苏州刺绣甲天下'的美誉。",
    image: "https://images.unsplash.com/photo-1763400234383-8b9ecbb9c043?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwc2lsayUyMGVtYnJvaWRlcnl8ZW58MXx8fHwxNzc1ODAyMzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    personality: "细腻柔美，如同江南女子般温婉，讲述着绣娘的故事",
    modelType: 'embroidery',
    modelPath: "/assets/models/glbfile.glb"
  }
];