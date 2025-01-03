import Lunar from 'lunar-javascript';

interface MarketingAdvice {
  suitable: string[];    
  unsuitable: string[];  
  suggestions: string[]; 
}

export interface HolidayInfo {
  name: string;
  type: 'traditional' | 'international' | 'marketing';
  description: string;
  marketingAdvice?: MarketingAdvice;
}

export function getHolidayInfo(dateString: string): HolidayInfo | null {
  const [year, month, day] = dateString.split('-').map(Number);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const targetDate = new Date(year, month - 1, day);

  // 如果是往年的日期，不显示弹窗
  if (year < currentYear) {
    return null;
  }

  // 如果是当前年份的节日，正常显示
  if (year === currentYear) {
    return getBasicHolidayInfo(dateString);
  }

  // 如果是明年及以后的日期，显示节日但不显示弹窗
  const holidayInfo = getBasicHolidayInfo(dateString);
  if (holidayInfo) {
    return {
      ...holidayInfo,
      marketingAdvice: undefined  // 不显示营销建议
    };
  }

  return null;
}

// 获取基本节日信息的函数
function getBasicHolidayInfo(dateString: string): HolidayInfo | null {
  const [year, month, day] = dateString.split('-').map(Number);
  const solar = Lunar.Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  // 检查浮动节日（优先级最高）
  const floatingHoliday = getFloatingHoliday(year, month, day);
  if (floatingHoliday) {
    return {
      name: floatingHoliday.name,
      type: 'international',
      description: floatingHoliday.description,
      marketingAdvice: getMarketingAdvice(floatingHoliday.name, 'international')
    };
  }

  // 检查固定公历节日
  const monthDay = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const fixedHoliday = fixedHolidays[monthDay];
  if (fixedHoliday) {
    return {
      name: fixedHoliday.name,
      type: 'international',
      description: fixedHoliday.description,
      marketingAdvice: getMarketingAdvice(fixedHoliday.name, 'international')
    };
  }

  // 获取节气
  const jieQi = lunar.getJieQi();
  if (jieQi) {
    return {
      name: jieQi,
      type: 'traditional',
      description: `二十四节气之${jieQi}`,
      marketingAdvice: getMarketingAdvice(jieQi, 'traditional')
    };
  }

  // 获取农历节日
  const festivals = lunar.getFestivals();
  if (festivals.length > 0) {
    const festival = festivals[0];
    // 检查这个节日是否已经在 fixedHolidays 中定义过
    const isFixedHoliday = Object.values(fixedHolidays).some(h => h.name === festival);
    if (!isFixedHoliday) {
      return {
        name: festival,
        type: 'traditional',
        description: `农历传统节日${festival}`,
        marketingAdvice: getMarketingAdvice(festival, 'traditional')
      };
    }
  }

  // 获取公历节日
  const solarFestivals = solar.getFestivals();
  if (solarFestivals.length > 0) {
    const festival = solarFestivals[0];
    return {
      name: festival,
      type: 'international',
      description: `公历节日${festival}`,
      marketingAdvice: getMarketingAdvice(festival, 'international')
    };
  }

  // 检查营销节日
  const marketingFestivals = getMarketingFestivals(year, month, day);
  if (marketingFestivals) {
    return {
      name: marketingFestivals.name,
      type: 'marketing',
      description: marketingFestivals.description,
      marketingAdvice: getMarketingAdvice(marketingFestivals.name, 'marketing')
    };
  }

  return null;
}

// 处理浮动节日
function getFloatingHoliday(year: number, month: number, day: number): { name: string; description: string } | null {
  const date = new Date(year, month - 1, day);
  const weekDay = date.getDay();  // 0 是星期日, 6 是星期六
  const weekNum = Math.ceil(day / 7);  // 第几周
  
  // 世界住房日：10月第一个星期一
  if (month === 10 && weekDay === 1 && weekNum === 1) {
    return { name: '世界住房日', description: '联合国确定的国际性纪念日' };
  }
  
  // 母亲节：5月第二个星期日
  if (month === 5 && weekDay === 0 && weekNum === 2) {
    return { name: '母亲节', description: '感恩母亲的节日' };
  }
  
  // 全国助残日：5月第三个星期日
  if (month === 5 && weekDay === 0 && weekNum === 3) {
    return { name: '全国助残日', description: '关注残疾人群体的公益节日' };
  }
  
  // 全民国防教育日：9月第三个星期六
  if (month === 9 && weekDay === 6 && weekNum === 3) {
    return { name: '全民国防教育日', description: '普及国防教育的主题日' };
  }
  
  // 感恩节：11月第四个星期四
  if (month === 11 && weekDay === 4 && weekNum === 4) {
    return { name: '感恩节', description: '美国传统节日' };
  }
  
  return null;
}

// 固定公历节日数据
const fixedHolidays: Record<string, { name: string; description: string }> = {
  '01-01': { name: '元旦', description: '新年第一天' },
  '02-14': { name: '情人节', description: '浪漫的西方情人节' },
  '03-08': { name: '妇女节', description: '国际妇女节' },
  '03-12': { name: '植树节', description: '中国植树节' },
  '03-15': { name: '消费者权益日', description: '国际消费者权益日' },
  '04-01': { name: '愚人节', description: '西方传统节日愚人节' },
  '05-01': { name: '劳动节', description: '国际劳动节' },
  '05-04': { name: '青年节', description: '中国青年节' },
  '06-01': { name: '儿童节', description: '国际儿童节' },
  '07-01': { name: '建党节', description: '中国共产党成立纪念日' },
  '08-01': { name: '建军节', description: '中国人民解放军建军纪念日' },
  '09-10': { name: '教师节', description: '尊师重教的节日' },
  '10-01': { name: '国庆节', description: '中华人民共和国国庆节' },
  '10-31': { name: '万圣节前夜', description: '西方传统节日万圣节前夜' },
  '11-01': { name: '万圣节', description: '西方传统节日万圣节' },
  '11-11': { name: '双十一', description: '全球最大的网络购物节' },
  '12-24': { name: '平安夜', description: '圣诞节前夜' },
  '12-25': { name: '圣诞节', description: '西方传统节日圣诞节' }
};

// 判断营销节日的函数
function getMarketingFestivals(year: number, month: number, day: number): { name: string; description: string } | null {
  // 双11
  if (month === 11 && day === 11) {
    return {
      name: '双十一',
      description: '全球最大的网络购物节'
    };
  }

  // 618
  if (month === 6 && day === 18) {
    return {
      name: '618',
      description: '年中购物狂欢'
    };
  }

  return null;
}

// 节日营销建议数据
const holidayAdviceMap: Record<string, MarketingAdvice> = {
  // 全年主要节假日，节气
  //二十四节气
  "立春": { 
      "suitable": ["健康食品", "春季服饰", "家居用品", "春季健身类产品"], 
      "unsuitable": ["寒冷季节的保暖产品", "冬季高端奢侈品", "过于单一的功能性产品"], 
      "suggestions": [
        "立春标志着春天的到来，是人们调整生活节奏和健康习惯的时机，适合推出健康食品和滋补类产品，如养生茶、维生素、保健品等。",
        "春季服饰和家居用品是立春期间的重要消费品类，推广轻盈、舒适、富有活力感的服饰、床上用品等，满足消费者春季更新的需求。",
        "春天是健身和户外活动的季节，推出春季健身类产品，如瑜伽垫、跑步鞋、运动服等，吸引消费者加入健康生活方式。",
        "结合立春的‘新气象’，推出季节性家居产品或家装配件，帮助消费者清新装饰家居空间，迎接春天的到来。"
      ]
  },
  "雨水": { 
      "suitable": ["春季护肤", "保湿类产品", "绿植与花卉", "春季服饰"], 
      "unsuitable": ["冬季高档保暖服饰", "不适合湿气季节的电子产品", "没有季节感的家电产品"], 
      "suggestions": [
        "雨水节气湿润的气候带来皮肤的干燥和湿气困扰，适合推出保湿护肤产品，如面霜、乳液、精华等，帮助消费者调整季节变化带来的皮肤问题。",
        "绿植和花卉产品在春季需求增大，可以推出春季新品花卉、绿植及植物相关的装饰品，提升消费者的家居气氛。",
        "春季服饰的需求开始升温，可以推出适合雨水节气的防水外套、薄款风衣等，满足消费者的春季穿搭需求。",
        "针对湿气季节，推出抗湿气的家居清洁用品，如除湿机、空气净化器等，帮助消费者创造舒适的生活环境。"
      ]
  },
  "惊蛰": { 
      "suitable": ["春季护肤", "春季服饰", "户外用品", "保健食品"], 
      "unsuitable": ["过于厚重的冬季衣物", "没有春季感的家居电器", "高端功能性强的电子产品"], 
      "suggestions": [
        "惊蛰是春天的节气，适合推出春季护肤产品，如滋润型面霜、清新型洗面奶等，帮助消费者调整因季节变化引起的肌肤问题。",
        "随着气温回暖，春季服饰需求开始增加，可以推出薄款春装、外套、时尚配饰等，满足消费者的春季穿搭需求。",
        "春季是户外活动的好时机，可以推广户外用品，如运动鞋、登山包、跑步器材等，吸引喜欢户外运动的消费者。",
        "可以推出针对春季养生的保健食品，如维生素、蜂蜜、枸杞等，帮助消费者增强免疫力，迎接春天的活力。"
      ]
  },
  "春分": { 
    "suitable": ["春季护肤", "时尚服饰", "户外用品", "保健食品"], 
    "unsuitable": ["过于厚重的冬季服饰", "大宗耐用性产品", "科技类高价产品"], 
    "suggestions": [
      "春分时节气温回暖，适合推广春季护肤产品，如保湿面霜、清爽洗面奶等，帮助消费者应对季节变化带来的皮肤问题。",
      "春季服饰如薄款外套、长袖T恤、轻便鞋类等非常适合推广，满足消费者春季换季的需求。",
      "随着气温回升，推出适合户外活动的产品，如户外运动鞋、登山包、露营器材等，满足消费者的春季出游和户外活动需求。",
      "春季是养生和保健的好时机，可以推出适合春季的保健食品，如茶饮、蜂蜜、养生汤包等，帮助消费者保持健康。"
    ]
  },
  "谷雨": { 
      "suitable": ["茶叶", "养生保健品", "春季护肤", "农业产品"], 
      "unsuitable": ["秋冬季节商品", "与农业无关的科技产品", "高端奢侈品"], 
      "suggestions": [
        "谷雨是春季最后一个节气，也是茶叶的采摘时节。可以推出新茶系列，特别是绿茶、白茶等时令茶品，吸引消费者体验季节性饮品。",
        "养生保健品也非常适合谷雨节气，如草本养生茶、滋补食品等，帮助消费者保持健康，缓解春季气候变化带来的身体不适。",
        "春季护肤产品可以推出如清爽型面霜、防晒产品等，帮助消费者应对季节变化对皮肤的影响，保持水润和清爽。",
        "谷雨是与农业生产和春耕密切相关的节气，可以推出相关农业产品，如种子、园艺工具等，鼓励消费者参与春季种植活动。"
      ]
  },
  "清明节": { 
      "suitable": ["传统祭扫用品", "纪念品", "健康保健品", "春季旅游产品"], 
      "unsuitable": ["高科技电子产品", "非节日文化相关商品", "大宗耐用消费品"], 
      "suggestions": [
        "清明节是祭扫祖先、怀念先人的传统节日，适合推出传统祭扫用品，如香烛、纸钱、花篮等，帮助消费者进行祭祖活动。",
        "在清明节期间，纪念品和定制产品，如刻字纪念品、纪念册等，能够满足人们追思故人的需求。",
        "健康保健品也是清明节的热门品类，可以推广针对春季防病保健的产品，如花茶、养生汤料等，帮助消费者调整节气变化。",
        "随着气候回暖，春季旅游需求增加，推出清明假期出游相关产品，如机票、酒店预定、短途旅游线路等，吸引消费者利用假期出行。"
      ]
  },

  "立夏": { 
      "suitable": ["春夏换季服饰", "保湿类护肤品", "夏季防晒产品", "户外用品"], 
      "unsuitable": ["厚重冬季衣物", "非季节性商品", "高价耐用产品"], 
      "suggestions": [
        "立夏时节气温逐渐升高，适合推出春夏换季服饰，如薄款衬衫、短袖T恤、轻便外套等，满足消费者的换季需求。",
        "随着气温升高，推出保湿类护肤品，如润肤露、面膜、补水精华等，帮助消费者应对夏季的干燥天气。",
        "夏季防晒产品在立夏时节开始流行，推出防晒霜、太阳镜、遮阳帽等，保护消费者的肌肤免受紫外线伤害。",
        "户外用品也非常适合在此时推广，尤其是适合夏季活动的如露营装备、登山包、运动鞋等，吸引喜欢户外活动的消费者。"
      ]
  },
  "小满": { 
      "suitable": ["夏季服饰", "清凉护肤品", "防晒产品", "健康饮品"], 
      "unsuitable": ["冬季厚重服饰", "秋冬季节商品", "奢侈品"], 
      "suggestions": [
        "小满是夏季即将到来的时节，适合推广夏季服饰，如薄款T恤、短裤、凉鞋等，帮助消费者应对逐渐升高的气温。",
        "推出清凉护肤品如防晒喷雾、隔离霜、清凉啫喱等，帮助消费者在夏季时节保持清爽，防止紫外线伤害。",
        "防晒产品在小满节气非常适合推广，防晒霜、遮阳帽、太阳镜等都是热销商品，帮助消费者保护肌肤免受阳光伤害。",
        "健康饮品如绿茶、凉茶、养生茶等，也适合在小满时节推广，帮助消费者保持体内的清凉与平衡。"
      ]
  },
  "芒种": { 
      "suitable": ["茶叶", "农产品", "夏季护肤", "养生保健品"], 
      "unsuitable": ["冬季产品", "过于奢华的高端商品", "电子产品"], 
      "suggestions": [
        "芒种是夏季的开始，茶叶尤其是绿茶、花茶等具有清凉解渴的作用，适合推出新茶系列，吸引茶文化爱好者。",
        "农产品如时令水果、夏季蔬菜等，在芒种期间正好可以迎合季节需求，适合推广有机农产品、绿色食品等。",
        "夏季护肤产品如防晒霜、补水面膜、清爽洗面奶等，非常适合芒种节气时推出，帮助消费者应对夏季日照强烈和皮肤问题。",
        "养生保健品，如夏季养生茶、去火茶、凉茶等，帮助消费者调节体质，适应气候变化，增强抵抗力。"
      ]
  },
  "夏至": { 
      "suitable": ["夏季服饰", "凉感护肤产品", "清凉饮品", "户外用品", "空调家电", "防晒产品"], 
      "unsuitable": ["冬季厚重服饰", "与夏季无关的健康产品", "过于奢华的高价商品"], 
      "suggestions": [
        "夏至时节，气温逐渐升高，夏季服饰如T恤、短裤、轻便鞋等，适合在这一时节推出，满足消费者换季需求。",
        "凉感护肤产品如清爽的防晒霜、隔离霜、清凉喷雾等，帮助消费者应对炎热天气，保护肌肤免受紫外线伤害。",
        "推出清凉饮品，如绿茶、凉茶、果汁等，迎合消费者在高温下对清凉饮品的需求，提供夏季的解渴选择。",
        "户外用品也是夏至时节的热门选择，如露营装备、登山包、防晒衣等，迎合消费者的户外活动需求。",
        "空调家电在夏季需求增加，推出空调、风扇、冷风机等产品，帮助消费者应对高温天气，提升舒适度。"
      ]
  },
  "小暑": { 
      "suitable": ["夏季服饰", "凉感家居用品", "防晒用品", "夏季饮品", "户外运动产品"], 
      "unsuitable": ["冬季保暖产品", "与夏季不符的过季商品", "奢侈品"], 
      "suggestions": [
        "小暑是炎热的夏季即将来临时节，适合推出清凉的夏季服饰，如薄款T恤、短裤、夏季裙装等，帮助消费者应对炎热天气。",
        "凉感家居用品如空调被、凉席、冰垫等，在小暑时节需求大增，适合在这一时段推出，帮助消费者在家中也能保持清凉。",
        "防晒用品如防晒霜、遮阳伞、护肤喷雾等也是小暑期间的热销产品，帮助消费者预防紫外线带来的肌肤伤害。",
        "夏季饮品，如养生茶、果汁、冷泡茶等，也适合在小暑时节推广，满足消费者的清凉解渴需求。",
        "推出适合夏季的户外运动产品，如跑步鞋、运动装备、露营用品等，吸引消费者参与户外活动，享受夏日时光。"
      ]
  },
  "大暑": { 
      "suitable": ["清凉饮品", "空调家电", "夏季护肤品", "防暑降温产品", "消暑食品"], 
      "unsuitable": ["寒冷天气服饰", "冬季用品", "奢侈品"], 
      "suggestions": [
        "大暑是最热的时节之一，清凉饮品如冰镇茶、果汁、矿泉水等是大暑期间的热门商品，帮助消费者降温解渴。",
        "空调家电在大暑时节的需求达到高峰，推广空调、冷风机、风扇等产品，提升消费者在高温下的舒适度。",
        "夏季护肤品如清爽防晒霜、去油控油产品等，适合大暑时节的市场需求，帮助消费者保持清爽肌肤。",
        "防暑降温产品如风扇、电风扇、冰凉贴等也适合大暑期间推广，帮助消费者度过酷暑。",
        "消暑食品如冰淇淋、雪糕、凉糕等也是大暑时节的热销产品，迎合消费者的食欲需求。"
      ]
  },

  "立秋": { 
      "suitable": ["秋季服饰", "健康食品", "养生保健品", "空调家电", "秋季水果"], 
      "unsuitable": ["夏季服饰", "过于热季节相关的商品", "过于奢华的高端商品"], 
      "suggestions": [
        "立秋标志着天气逐渐转凉，适合推出秋季服饰，如薄款外套、针织衫、长袖衬衫等，帮助消费者应对初秋的气候变化。",
        "秋季也是养生的关键时节，健康食品如秋季养生茶、滋补汤料、健脾养胃的食材等可以推出，帮助消费者调养身体。",
        "立秋是养生的时机，可以推出养生保健品，如针对秋季的中药保健品、润燥类产品，满足消费者的养生需求。",
        "秋季水果如苹果、葡萄、柿子等逐渐上市，可以推出应季的水果促销，吸引消费者购买新鲜水果。"
      ]
  },
  "处暑": { 
      "suitable": ["清凉饮品", "秋季护肤品", "家居清洁用品", "运动装备", "健康食品"], 
      "unsuitable": ["冬季保暖产品", "与秋季不符的重型家电", "奢侈品"], 
      "suggestions": [
        "处暑标志着夏季的结束，适合推广清凉饮品如绿茶、凉茶、冰镇果汁等，帮助消费者消暑降温。",
        "秋季护肤品如润肤霜、修复面膜等，针对夏季阳光伤害后皮肤的护理非常适合推出，帮助消费者过渡到秋季护肤需求。",
        "随着天气转凉，家居清洁用品也会成为热门商品，尤其是适合秋季大扫除的家电，如吸尘器、除湿机等，帮助消费者整理家居环境。",
        "运动装备如跑步鞋、瑜伽垫、健身器材等可以吸引开始恢复运动的消费者，特别是在暑热逐渐消退时，推出秋季健身产品。"
      ]
  },
  "白露": { 
      "suitable": ["秋季食品", "滋补养生产品", "润肤品", "暖宝宝", "秋季服饰"], 
      "unsuitable": ["夏季清凉产品", "冬季保暖产品", "不适合秋季调养的产品"], 
      "suggestions": [
        "白露时节，天气渐凉，适合推出秋季食品，如润肺养生的汤品、糖水、秋季特色美食等，满足消费者的饮食需求。",
        "秋季滋补养生产品非常适合推出，特别是对身体调养有益的产品，如滋补汤料、滋阴补肾的保健品等。",
        "润肤产品如补水面霜、秋季修复面膜等，适合白露期间推出，帮助消费者保湿、抵抗秋季干燥气候。",
        "随着天气转凉，推出暖宝宝、保暖内衣等秋季基础保暖产品，也是一个不错的选择，帮助消费者应对秋季寒气。"
      ]
  },
  "秋分": { 
      "suitable": ["秋季服饰", "养生保健品", "滋补食品", "季节性水果", "茶叶"], 
      "unsuitable": ["夏季服饰", "冬季保暖产品", "过于单一的奢侈品"], 
      "suggestions": [
        "秋分意味着秋季已到正中，气温开始下降，适合推出秋季服饰，如外套、围巾、针织衫等，帮助消费者应对早晚温差。",
        "秋季是养生的季节，适合推出滋补食品，如养生茶、山药、枸杞等食品，帮助消费者进行秋季养生。",
        "推荐推出润肺滋补产品，如蜂蜜、银耳、梨膏等，迎合消费者养生需求，尤其是调养肺部健康。",
        "茶叶产品尤其是秋季新茶也适合在此时推出，满足茶文化爱好者的需求，同时也能顺应秋天的茶饮文化。"
      ]
  },
  "寒露": { 
      "suitable": ["秋季保暖服饰", "滋补食品", "暖宝宝", "营养保健品", "季节性水果"], 
      "unsuitable": ["夏季服饰", "过于清凉的商品", "不符合秋冬需求的产品"], 
      "suggestions": [
        "寒露是气温逐渐转冷的时节，适合推出秋冬季节的保暖服饰，如羽绒服、围巾、手套等，满足消费者的温暖需求。",
        "滋补食品如秋冬季养生汤、滋补药材等适合在寒露时推出，帮助消费者进行季节调养，增强免疫力。",
        "推出暖宝宝、加热贴等取暖产品，帮助消费者在逐渐寒冷的天气中保持温暖。",
        "营养保健品如维生素、矿物质补充品等，满足消费者的冬季免疫力需求，提升身体健康水平。"
      ]
  },
  "霜降": { 
      "suitable": ["暖冬服饰", "保健食品", "冬季保暖家居产品", "运动装备", "秋冬季水果"], 
      "unsuitable": ["夏季清凉商品", "不适合季节性需求的商品", "与保暖无关的轻奢品"], 
      "suggestions": [
        "霜降意味着进入了秋冬季节的过渡期，适合推出暖冬服饰，如羽绒服、羊毛衫、秋冬外套等，帮助消费者适应寒冷天气。",
        "保健食品如冬季养生汤、滋补类食品、膳食补充品等，在霜降时节非常适合推出，满足消费者的秋冬保健需求。",
        "冬季保暖家居产品如电暖器、加热床垫等，能够帮助消费者应对寒冷天气，提高家居舒适度。",
        "运动装备如防寒运动服、跑步鞋、户外运动包等，适合喜欢户外运动的消费者，迎合他们对冬季运动的需求。",
        "秋冬季水果如柿子、柚子、苹果等，正是霜降时节的应季水果，可以通过促销或礼盒形式吸引消费者购买。"
      ]
  },

  "立冬": { 
      "suitable": ["秋冬季服饰", "暖宝宝", "滋补食品", "冬季家居用品", "热饮类产品"], 
      "unsuitable": ["夏季轻薄衣物", "清凉型产品", "无季节感的奢侈品"], 
      "suggestions": [
        "立冬意味着正式进入冬季，适合推广秋冬季服饰，如羽绒服、保暖内衣、毛衣等，满足消费者应季穿搭需求。",
        "推出暖宝宝、热水袋等保暖产品，帮助消费者应对逐渐寒冷的天气，提供温暖的生活体验。",
        "滋补食品如冬季养生汤、营养餐包等，能够帮助消费者增强体质，顺应季节变化进行调养。",
        "冬季家居用品如加热器、电热毯、暖气片等，可以帮助消费者提高冬季家庭生活的舒适度。",
        "热饮类产品如温暖的咖啡、热巧克力、姜茶等可以在立冬时推出，迎合冬季消费者对暖饮的需求。"
      ]
  },
  "小雪": { 
      "suitable": ["保暖衣物", "滋补食品", "暖水袋", "家居用品", "秋冬季水果"], 
      "unsuitable": ["夏季轻便产品", "过季产品", "不具季节性的商品"], 
      "suggestions": [
        "小雪标志着天气逐渐变冷，适合推出保暖衣物，如厚外套、羽绒服、围巾等，满足消费者的穿衣需求。",
        "推出滋补食品如滋补汤、补气养血的中药食品等，帮助消费者增强体质，预防冬季感冒等健康问题。",
        "暖水袋、暖宝宝等保暖产品非常适合在小雪时节推出，帮助消费者抵御寒冷。",
        "家居用品如加湿器、电暖气、暖脚器等，适合在小雪期间推广，提升消费者的家居舒适度。",
        "秋冬季水果如柿子、柚子等，可以通过促销或者礼盒形式推出，满足消费者的营养需求。"
      ]
  },
  "大雪": { 
      "suitable": ["冬季服饰", "保暖产品", "滋补食品", "热饮类产品", "家电产品"], 
      "unsuitable": ["夏季服饰", "过于轻薄的衣物", "不具季节感的商品"], 
      "suggestions": [
        "大雪标志着冬季气温进一步下降，适合推出冬季服饰如羽绒服、羊毛大衣、围巾、手套等，帮助消费者应对严寒天气。",
        "推出保暖产品如电暖器、暖水袋、暖手宝等，满足消费者保暖需求，提升生活舒适度。",
        "滋补食品如冬季养生汤、黑枸杞、红枣等，帮助消费者增强免疫力，应对寒冷的冬季。",
        "热饮类产品如姜茶、热巧克力、温暖奶茶等，满足消费者在寒冷天气中的需求，提升节日气氛。",
        "家电产品如空调、电暖器、电热毯等，适合在大雪时节推出，帮助消费者提升家中温暖度。"
      ]
  },
  "冬至": { 
      "suitable": ["传统食品", "温补食品", "冬季家居用品", "节日礼品", "保暖衣物"], 
      "unsuitable": ["夏季清凉产品", "过季商品", "非节庆产品"], 
      "suggestions": [
        "冬至是冬季的一个重要节气，适合推出传统食品，如饺子、汤圆等，满足消费者的节令饮食需求。",
        "温补食品如羊肉汤、鸡汤、花胶等，是冬至时节非常受欢迎的商品，可以帮助消费者养生。",
        "冬季家居用品如电热毯、暖气片、羽绒被等，帮助消费者提高家庭生活的温暖度。",
        "节日礼品类产品，如营养保健品、健康礼盒等，适合在冬至时推出，迎合消费者送礼的需求。",
        "保暖衣物如羊毛衫、毛衣、保暖裤等，帮助消费者抵御寒冷，尤其适合冬季家庭使用。"
      ]
  },
  "小寒": { 
      "suitable": ["保暖产品", "健康食品", "温饮类", "护肤品"], 
      "unsuitable": ["夏季产品", "清凉饮品", "户外运动装备"], 
      "suggestions": [
        "小寒是冬季的标志性节气，可以围绕‘寒冷天气’推出暖身产品或暖饮，如热茶、温酒、暖宝宝等，帮助消费者应对严寒。",
        "考虑到节气的季节性，推出专门的‘养生保暖’主题营销活动，例如健康食品、滋补品等，可以借助节气的养生文化，吸引消费者的关注。",
        "结合小寒节气推出限时优惠，促销传统保健品，如蜂蜜、枸杞等，通过健康话题与消费者产生共鸣。",
        "针对寒冷天气，推出温暖护肤产品，如滋润护肤霜，强调保湿、防干裂，契合季节需求。"
      ]
  },
  "大寒": { 
      "suitable": ["保暖产品", "滋补食品", "冬季护肤", "舒适家居用品"], 
      "unsuitable": ["轻便夏季服饰", "不具季节性且与寒冷无关的户外运动装备", "过于高科技且缺乏温暖感的产品"], 
      "suggestions": [
        "大寒作为一年中最冷的时节，推广与保暖相关的商品最具吸引力，例如高端保暖内衣、加热器、舒适家居服等。",
        "针对滋补养生的需求，可以推出大寒专属养生套餐，如滋补汤品、热饮、汤料包等，通过温补和养生概念吸引消费者。",
        "结合‘寒冷季节的温暖陪伴’，推出冬季护肤品、加湿器等健康产品，强调防寒、保湿和增强免疫力。",
        "通过线上营销引导消费者提前购买过冬必备的保暖用品，同时结合‘冬日打折’等活动，提高节日销量。"
      ]
  },

  //节假日
  "元旦": { 
      "suitable": ["庆祝类商品", "家居及家电产品", "健康产品和滋补食品", "礼品类商品"], 
      "unsuitable": ["季节性强的商品", "日常实用工具", "无节日氛围的商品"], 
      "suggestions": [
        "元旦是迎接新年的开端，适合全品类产品的推广，重点可以放在新年祝福、跨年庆祝的情感链接上。通过定制化包装和品牌故事传递，提升消费者的节日参与感。",
        "可结合元旦的‘跨年’氛围推出限时折扣，吸引早期购买行为，强化‘新年新气象’的主题。",
        "结合社交媒体和线上直播，通过互动、抽奖等手段提升品牌的曝光度，并通过个性化产品推荐提升转化率。",
        "以‘家庭团聚’为主题，推出适合家庭使用的产品，如茶叶、酒类等，同时结合家庭聚会场景打造套餐组合，提高消费者购买欲望。"
      ]
  },
  "腊八节": { 
      "suitable": ["传统食品", "节日礼盒", "健康饮品", "暖饮"], 
      "unsuitable": ["非传统食品", "过于功能化的现代产品", "低价快消品"], 
      "suggestions": [
        "腊八节具有浓厚的传统文化色彩，可以通过推出腊八粥、腊八蒜等传统节日食品吸引消费者。",
        "推出针对家庭聚会的腊八节礼盒，结合年节大促销，打出‘团圆’和‘温暖’的情感主题，吸引消费者进行赠送和分享。",
        "可以结合‘寒冷养生’的概念，推出健康饮品，如滋补类的茶饮、温饮等，体现节气和传统食文化的结合。",
        "借助节日习俗，将‘腊八’文化与现代产品结合，开发创新型的传统食品，提升品牌文化附加值。"
      ]
  },
  "除夕": { 
      "suitable": ["传统食品", "酒类", "家庭用品", "健康食品"], 
      "unsuitable": ["功能性较强的日常用品", "工作相关的高效工具", "与节日气氛不符的电子产品"], 
      "suggestions": [
        "除夕是辞旧迎新的关键时刻，适合推出具有节日氛围的家庭聚餐产品，如年夜饭套餐、传统酒类、茶叶等。",
        "强化团圆和祝福的情感，推出个性化年货礼包，可以结合新年祝福语、红包等元素，提升产品的节日气息和情感链接。",
        "借助‘团圆’的主题，通过社交化营销手段，设计‘年夜饭分享’或‘春节聚会’等活动，促使消费者分享购买体验。",
        "通过线上限时促销活动，提供跨品牌联合优惠，提升节日期间的销售额，并增强品牌在消费者心中的印象。"
      ]
  },
  "春节": { 
      "suitable": ["传统食品", "健康食品", "酒类", "家庭娱乐产品", "奢侈品（经过节日包装或定制）"], 
      "unsuitable": ["过于功能性、单一的日常用品", "无节日氛围的高端商品", "无法与春节情感契合的个人用品"], 
      "suggestions": [
        "春节是最重要的家庭团聚时节，可以通过推出适合家庭团圆的年货礼包，如健康食品、保健饮品、传统美食等，满足消费者的节日需求。",
        "结合春节返乡潮，推出定制化产品，强化‘新春大吉’的主题，利用大折扣吸引消费者提前购买。",
        "社交化营销是春节期间重要手段，举办线上互动活动，如‘新春红包’、‘春节幸运大抽奖’等，提升品牌曝光度。",
        "鼓励消费者将品牌产品与‘团圆’氛围结合，推出适合家庭聚会的娱乐产品，如游戏、影音设备等，提升节日消费体验。"
      ]
  },
  "元宵节": { 
      "suitable": ["传统食品", "节庆装饰品", "家庭娱乐用品", "温馨家居产品"], 
      "unsuitable": ["高科技电子产品", "非节庆文化相关的商品", "价格较低、无情感附加值的快消品"], 
      "suggestions": [
        "元宵节是家庭团圆的重要节日，适合推广传统食品，如元宵、汤圆等，同时可以结合地方特色推出不同口味的元宵，增加节日文化感。",
        "推出与元宵节相关的节庆装饰品，如灯笼、花灯等，强化节日氛围，吸引消费者进行家庭装饰或送礼。",
        "家庭聚会是元宵节的重要组成部分，可以推出家庭娱乐用品，如桌游、亲子活动套件等，提升家庭成员之间的互动和情感连接。",
        "推出温馨家居产品，如灯光装饰、暖手宝等，营造舒适、温暖的家居环境，契合节日团聚的主题。"
      ]
  },
  "情人节": { 
      "suitable": ["浪漫礼品", "珠宝饰品", "香水", "情侣定制产品"], 
      "unsuitable": ["过于实用的功能性产品", "与浪漫氛围不符的商品", "大宗商品或耐用性强的商品"], 
      "suggestions": [
        "情人节是传递爱意和浪漫的时刻，适合推出浪漫礼品，如巧克力、玫瑰花束、情侣定制礼品等，增强节日的纪念意义。",
        "珠宝饰品是情人节的经典选择，推出限量版的情侣戒指、项链等，突出浪漫氛围，激发消费者的购买欲望。",
        "香水在情人节特别受欢迎，推出具有浪漫气息的香水套装，搭配情人节主题的包装，提升礼品的纪念意义。",
        "提供个性化定制产品，如情侣对戒、定制耳机等，增加情感附加值，吸引年轻消费者为伴侣选购独特礼物。"
      ]
  },
  "龙头节": { 
      "suitable": ["传统食品", "节庆装饰品", "家居用品", "滋补保健食品"], 
      "unsuitable": ["高端奢侈品", "与节庆文化无关的现代电子产品", "功能性较强的工具或大宗商品"], 
      "suggestions": [
        "龙抬头是农历二月初二，是春季的节气之一，适合推广传统食品，如龙头饼、春卷等，结合节日文化推出限量版美食，增加节日氛围。",
        "节庆装饰品在这个节日中有着重要的地位，可以推出具有‘龙’元素的家居装饰品、工艺品等，结合节气文化吸引消费者。",
        "滋补保健食品是龙抬头节气的热门品类，可以推广针对春季养生的保健产品，如枸杞、蜂蜜、花草茶等，帮助消费者在春季保持健康。",
        "在家居领域，推出以‘龙’为主题的家居用品或装饰品，如龙纹床上用品、春季家居清洁套装等，增强节日的庆祝气氛。"
      ]
  },
  "妇女节": { 
    "suitable": ["女性护理产品", "美容护肤", "时尚配饰", "健康产品"], 
    "unsuitable": ["男性用品", "过于功能性或硬性的日常工具", "大宗商品"], 
    "suggestions": [
      "妇女节是专注女性的节日，适合推广女性护理产品，如面膜、护肤品、身体护理套装等，帮助女性朋友在节日中感受宠爱和关怀。",
      "美容护肤产品在妇女节期间需求较高，特别是高端品牌的护肤品、彩妆类产品，推出节日限定礼盒，以提高节日购买欲。",
      "时尚配饰，如项链、耳环、手链等，常常成为女性消费者的节日选择。推出限量版设计或者个性化定制服务，提升节日礼品的独特性。",
      "健康产品，如瑜伽垫、健康监测设备、营养补充品等，帮助女性关注身体健康，传递节日的关爱和自我保健的理念。"
    ]
  },
  "植树节": { 
    "suitable": ["园艺产品", "环保产品", "植物类商品", "户外用品"], 
    "unsuitable": ["过于奢华的高端商品", "与环保无关的科技产品", "时效性强的季节性商品"], 
    "suggestions": [
      "植树节关注环保和绿化，适合推出园艺产品，如花卉、种子、土壤、花盆等，鼓励消费者参与绿化活动，打造绿色家园。",
      "环保产品在植树节期间尤为受欢迎，推出环保袋、可降解餐具、节能灯具等，传递绿色环保的生活理念。",
      "植树节正值春季，植物类商品如绿植、盆栽、春季花卉等非常适合推广，可以配合活动推出植物种植教程等，增加消费者的参与感。",
      "户外用品如登山包、露营设备、户外运动鞋等也适合在植树节期间推出，鼓励消费者在春季参与户外活动，关注环境保护。"
    ]
  },
  "愚人节": { 
    "suitable": ["幽默礼品", "搞笑道具", "创意玩具", "趣味装饰品"], 
    "unsuitable": ["严肃的商品", "没有幽默元素的高端商品", "过于功能性强的商品"], 
    "suggestions": [
      "愚人节的主题是幽默和玩笑，适合推出幽默礼品，如搞笑T恤、恶搞玩具、趣味化妆品等，满足消费者轻松娱乐的需求。",
      "搞笑道具如假蛇、假蜘蛛等，适合愚人节期间的恶搞游戏，吸引喜欢恶作剧的年轻消费者。",
      "创意玩具是愚人节的热门品类，推出具有趣味性和创意设计的玩具，如拼图、桌游等，增加节日的互动性和娱乐感。",
      "愚人节还可以推出趣味装饰品，如愚人节专用饰品、搞笑小物件等，用于装饰办公室或家庭，增加节日氛围。"
    ]
  },
  "劳动节": { 
      "suitable": ["旅游产品", "家庭用品", "健康产品", "工艺品"], 
      "unsuitable": ["奢侈品", "高端电子产品", "大宗工业商品"], 
      "suggestions": [
        "劳动节是全民休息、出行的好时机，适合推广旅游产品，如短途旅游、机票、酒店预订等，满足消费者假期出游的需求。",
        "家庭用品如家居清洁产品、厨房用品等也适合在劳动节期间推广，帮助消费者进行家务劳动的同时，提升家居生活质量。",
        "劳动节也强调休息和健康，可以推出针对健康的产品，如运动器材、健身套餐、按摩仪等，帮助消费者缓解工作压力。",
        "可以推广具有劳动节纪念意义的工艺品、定制礼品等，作为节日纪念品或赠送礼物，增加节日的文化氛围。"
      ]
  },
  "青年节": { 
      "suitable": ["潮流服饰", "创意礼品", "运动和健身产品", "教育培训产品"], 
      "unsuitable": ["过于严肃的商务用品", "价格过高的奢侈品", "功能性强的大宗商品"], 
      "suggestions": [
        "青年节是庆祝青年人的节日，适合推广潮流服饰，如时尚T恤、运动鞋、背包等，吸引年轻消费者的关注。",
        "创意礼品，如定制礼物、创意文具、电子配件等，能够与年轻人的个性化需求相匹配，吸引他们为自己或朋友庆祝节日。",
        "运动和健身产品是青年节期间的热门品类，推出跑步机、瑜伽垫、运动装备等，鼓励年轻人关注健康生活。",
        "结合节日气氛，可以推出教育培训类产品，如线上学习课程、职业技能培训等，满足年轻人在自我提升方面的需求。"
      ]
  },
  "母亲节": { 
      "suitable": ["母婴用品", "美容护肤品", "健康保健产品", "个性化定制礼品"], 
      "unsuitable": ["男性用品", "过于普通的快消品", "与节日氛围不符的高科技电子产品"], 
      "suggestions": [
        "母亲节是表达对母亲的爱与感恩的时刻，适合推出母婴用品，如宝宝护理用品、孕妇装、哺乳期产品等，满足妈妈们的需求。",
        "美容护肤品在母亲节期间尤其受欢迎，推出针对不同年龄段母亲的护肤产品，如抗衰老系列、舒缓护理等，体现对母亲的关爱。",
        "健康保健产品也是母亲节的热门选择，可以推出适合妈妈群体的保健食品，如补钙、保肝、减压的保健品等，关爱妈妈的健康。",
        "个性化定制礼品，如定制珠宝、纪念册、定制照片书等，提升节日礼物的独特性，给母亲带来温馨的惊喜。"
      ]
  },
  "端午节": { 
      "suitable": ["粽子", "传统文化礼品", "健康食品", "运动用品"], 
      "unsuitable": ["无节日特色的商品", "季节性较强的产品", "奢侈品"], 
      "suggestions": [
        "端午节与粽子紧密相关，粽子是端午节的传统食品。可以推出各种口味的粽子礼盒、定制粽子等，吸引消费者购买作为节日食品。",
        "传统文化礼品如五毒饰品、龙舟模型、香包等，是端午节期间的特色商品，能够吸引喜欢节日文化的消费者。",
        "健康食品如薏米、粽子中的低糖或低脂健康版本，具有养生效果的食材也适合推广，符合端午节期间对健康的关注。",
        "端午节期间，举办龙舟比赛等活动时，可以推出运动用品，如运动鞋、运动包、户外用品等，提升消费者的节日参与感。"
      ]
  },
  "儿童节": { 
      "suitable": ["儿童玩具", "学习用品", "儿童服饰", "亲子活动产品"], 
      "unsuitable": ["成人产品", "不具备教育意义的产品", "过于高端的奢侈品"], 
      "suggestions": [
        "儿童节是庆祝孩子们的节日，适合推出各类儿童玩具，如益智玩具、积木、拼图等，帮助孩子们在节日中收获快乐与成长。",
        "学习用品是儿童节的热门选择，推出创新的学习工具，如儿童早教书籍、写字板、学习机等，满足家长的教育需求。",
        "儿童服饰是另一大热门品类，推出适合节日穿着的时尚儿童服饰，如T恤、裙子、运动鞋等，吸引家长为孩子购置节日礼物。",
        "亲子活动产品如家庭游戏、亲子装、亲子游乐场优惠券等，也是儿童节的不错选择，促进亲子关系和互动。"
      ]
  },
  "父亲节": { 
      "suitable": ["男性护理产品", "运动器材", "健康保健品", "个性化定制礼品"], 
      "unsuitable": ["女性用品", "过于单一的功能性商品", "奢侈品"], 
      "suggestions": [
        "父亲节是表达对父亲感恩和爱的时刻，适合推出男性护理产品，如剃须刀、护肤套装、男士香水等，满足男性消费者的日常护理需求。",
        "运动器材如跑步机、健身器材、运动鞋等，在父亲节期间推广非常合适，鼓励父亲们保持健康、活力。",
        "健康保健品也是父亲节的热门选择，特别是针对中老年男性的保健产品，如高血压、糖尿病等常见健康问题的保健品。",
        "个性化定制礼品如定制皮革钱包、刻字礼物、定制手表等，能够为父亲带来独特的节日惊喜，增强节日的情感价值。"
      ]
  },
  "建党节": { 
      "suitable": ["红色文化商品", "纪念品", "爱国主义教育产品", "书籍", "电影票"], 
      "unsuitable": ["与红色文化无关的产品", "不具备教育意义的商品", "过于奢华的奢侈品"], 
      "suggestions": [
        "建党节是具有重大历史意义的节日，适合推出红色文化商品，如党旗、党徽、纪念品等，帮助消费者纪念这一历史时刻。",
        "推出关于党的历史、革命精神等的书籍、纪念册等，也能够迎合消费者的教育和文化需求。",
        "爱国主义教育产品如红色电影票、历史教育类的课程也可以在这一节日期间进行推广，鼓励消费者了解党史和革命历史。",
        "纪念品系列，如定制的红色文化商品、雕塑、画作等，也可以吸引一些爱国者或收藏者。"
      ]
  },
  "建军节": { 
      "suitable": ["军事纪念品", "红色文化商品", "爱国主义教育产品", "服装", "户外用品"], 
      "unsuitable": ["奢侈品", "非节日相关商品", "不具备教育意义的商品"], 
      "suggestions": [
        "建军节作为纪念中国人民解放军的节日，适合推广军事纪念品，如军装、军徽、纪念币等。",
        "红色文化商品和爱国主义教育产品也是非常适合的推广方向，可以推出关于中国军史的书籍、教育资料、红色电影票等。",
        "服装方面，军事风格服饰、制服类商品也是一个不错的选择，吸引对军旅文化有兴趣的消费者。",
        "户外用品，如战术背包、军用装备等，也适合在建军节期间推出，特别是对于军迷或户外运动爱好者。"
      ]
  },
  "七夕节": { 
      "suitable": ["情侣礼品", "珠宝首饰", "鲜花", "巧克力", "定制化产品", "浪漫体验类产品"], 
      "unsuitable": ["与七夕不相关的单一实用品", "过于贵重的奢侈品", "女性单一产品"], 
      "suggestions": [
        "七夕节是中国的情人节，适合推出情侣礼品，如定制化饰品、情侣手表、定制情书等，吸引情侣消费者购买。",
        "珠宝首饰、鲜花和巧克力等传统七夕礼物非常受欢迎，营销时可以突出浪漫和独特性，打造浪漫氛围。",
        "可以推出定制化产品，如定制情侣项链、情侣照片书等，强化情人节的个性化、纪念性，让消费者在节日中表达心意。",
        "浪漫体验类产品如情侣套餐、浪漫晚餐、温泉度假等，可以吸引消费者购买，并与品牌的情感营销结合，增强节日氛围。"
      ]
  },
  "教师节": { 
      "suitable": ["办公文具", "教育书籍", "定制礼品", "学生用品", "感谢类商品"], 
      "unsuitable": ["奢侈品", "过于私人化的非教师相关产品", "过于通用的日常用品"], 
      "suggestions": [
        "教师节是表达对老师的敬意和感谢的时刻，适合推出办公文具，如高端钢笔、个性化笔记本等，迎合教师日常工作需要。",
        "教育书籍、教辅书籍以及与教学相关的学习资料是教师节的重要品类，可以为教师提供更多的教学资源。",
        "定制礼品如刻字的奖杯、个性化的礼物、定制文具等非常受欢迎，可以作为教师节送给老师的特殊礼物，表达感激之情。",
        "推出学生用品，如精美的文具套装、学习机等，也是教师节期间的热门商品，满足家长为老师的孩子选择优质产品的需求。"
      ]
  },
  "国庆节": { 
      "suitable": ["旅游产品", "节日礼品", "家居装饰", "家电产品", "奢侈品", "红色文化产品"], 
      "unsuitable": ["过于普通的日常生活用品", "与节日氛围不符的产品", "不具备家庭或节庆感的商品"], 
      "suggestions": [
        "国庆节是全民长假，适合推广旅游产品，如国内外旅游套餐、度假酒店、旅行箱包等，吸引假期出游的消费者。",
        "节日礼品类产品如送礼套装、定制化礼品、纪念品等非常适合国庆期间营销，特别是送给家人和朋友的礼物。",
        "家居装饰也是国庆节的热门商品，尤其是针对节庆主题的家居用品，如国旗饰品、红色家居小物件等，能够增添节日气氛。",
        "家电产品如电视、音响、厨房电器等也适合在国庆节期间推出，假期消费会带动家电更新换代的需求。",
        "奢侈品，如手表、珠宝、名牌包等，也适合在国庆节进行促销或推出限量款，吸引有购买力的消费者。",
        "红色文化产品和爱国主义商品也非常适合在国庆节期间推广，如纪念品、红色书籍等，强化节日的爱国氛围。"
      ]
  },
  "重阳节": { 
      "suitable": ["健康食品", "保健品", "老年人护理产品", "登山用品", "节日礼品"], 
      "unsuitable": ["与重阳节文化无关的产品", "过于年轻化的时尚商品", "不具备健康意义的商品"], 
      "suggestions": [
        "重阳节有登高、祈福的传统，适合推出登山用品、户外登山包、登山鞋等，吸引喜爱登山活动的消费者。",
        "健康食品如重阳糕、保健茶等，符合重阳节饮食传统，可以作为节日特色食品进行推广。",
        "保健品如高血压、糖尿病患者适用的保健类产品，适合这一节日推出，尤其是针对老年消费者的产品。",
        "老年人护理产品如老花镜、健康检测仪器等，适合为老年人群体提供健康关怀，迎合消费者的节日需求。",
        "节日礼品如祝福卡片、健康礼盒等也是重阳节期间的热销商品，特别适合年轻一代向长辈表达孝心的需求。"
      ]
  },
  "万圣节前夜": { 
      "suitable": ["万圣节装饰品", "化妆品", "特色糖果", "服装", "派对用品"], 
      "unsuitable": ["过于正式的产品", "与万圣节气氛不符的商品", "非节日相关的奢侈品"], 
      "suggestions": [
        "万圣节前夜是狂欢派对的时刻，适合推出万圣节主题的装饰品，如南瓜灯、骷髅装饰等，为消费者营造节日氛围。",
        "化妆品，特别是彩妆、面具、特殊效果化妆品等，能够帮助消费者打造万圣节的独特造型，吸引年轻群体。",
        "特色糖果，如巧克力、糖果包、万圣节主题糖果等，适合在这一时节推出，满足消费者派对需求。",
        "万圣节主题服装如鬼怪服装、吸血鬼服装等，满足消费者的节日装扮需求，是万圣节前夜必不可少的消费品。",
        "派对用品如气球、彩带、纸杯盘等可以让万圣节前夜的聚会更具特色，吸引年轻人举办主题派对。"
      ]
  },
  "万圣节": { 
      "suitable": ["万圣节装饰品", "糖果", "特色饮品", "主题服饰", "娱乐体验", "面包甜点"], 
      "unsuitable": ["非节日相关的日常消费品", "高端奢侈品", "过于严肃或正式的商品"], 
      "suggestions": [
        "万圣节是一个充满惊悚和欢乐的节日，适合推广万圣节主题装饰品，如南瓜灯、骷髅装饰、恐怖标志等。",
        "糖果和巧克力是万圣节的经典消费品，可以推出万圣节特别版糖果或节日限定礼盒，吸引消费者购买。",
        "推出万圣节主题的饮品，如南瓜味奶茶、特调鸡尾酒等，满足消费者节日期间对特殊饮品的需求。",
        "万圣节主题服饰如吸血鬼、巫婆、幽灵等角色服装，是节日必备商品，可以通过电商平台进行大力推广。",
        "面包和甜点类产品可以推出万圣节特别版，如南瓜味面包、恐怖主题的甜点等，吸引消费者的购买欲望。"
      ]
  },
  "感恩节": { 
      "suitable": ["节日礼品", "家庭聚餐食品", "装饰品", "健康食品", "休闲娱乐产品"], 
      "unsuitable": ["不符合感恩节氛围的单一商品", "过于高端奢侈的礼品", "过于简单且没有创意的产品"], 
      "suggestions": [
        "感恩节是家庭团聚的时刻，适合推出节日礼品如定制化礼物、家庭套装、感恩卡片等，传递感恩之情。",
        "家庭聚餐食品如火鸡、派、南瓜馅饼等是感恩节的传统食品，可以推出节日套餐，满足消费者的节日餐饮需求。",
        "推出感恩节主题的家居装饰品，如感恩节主题餐具、桌布、烛台等，提升节日氛围。",
        "健康食品如保健茶、坚果礼盒、营养补充品等，也非常适合在感恩节期间推出，帮助消费者维持健康。",
        "休闲娱乐产品如家庭游戏、桌游、亲子活动用品等可以吸引家庭消费者，增强节日聚会的趣味性。"
      ]
  },
  "平安夜": { 
      "suitable": ["节日礼品", "装饰品", "圣诞主题食品", "家庭聚会用品", "小家电"], 
      "unsuitable": ["不符合节日氛围的商品", "过于奢华的礼品", "与平安夜气氛不符的单品"], 
      "suggestions": [
        "平安夜是圣诞节的前夜，适合推出节日礼品，如圣诞主题的礼盒、定制化小礼物等，传递温馨与祝福。",
        "装饰品如圣诞树、彩灯、雪人玩偶等，可以让家庭装饰增添节日气氛，是平安夜的热销商品。",
        "圣诞主题食品如圣诞饼干、圣诞蛋糕、热巧克力等，能够吸引家庭聚会、派对消费者的兴趣。",
        "家庭聚会用品如餐具、餐桌布、圣诞节主题的纸杯盘等，可以增强节日气氛，适合平安夜家庭聚餐。",
        "小家电如咖啡机、烤箱等，帮助家庭在节日聚会时准备美食，是非常符合节日氛围的产品。"
      ]
  },
  "圣诞节": { 
      "suitable": ["节日礼品", "家庭聚餐食品", "圣诞主题产品", "家居装饰", "玩具", "电子产品"], 
      "unsuitable": ["不符合节日氛围的单品", "过于高端且无实际需求的奢侈品", "无节庆文化的产品"], 
      "suggestions": [
        "圣诞节是全球庆祝的节日，适合推出节日礼品如定制化礼盒、圣诞主题的手工艺品、香氛蜡烛等，传递温馨的祝福。",
        "家庭聚餐食品如烤火鸡、圣诞布丁、南瓜派等传统食品可以帮助消费者体验圣诞节的传统味道。",
        "圣诞主题产品如圣诞树装饰、彩灯、节日挂件等，可以让消费者的家庭装饰充满节日气氛。",
        "家居装饰类产品，如圣诞主题的床单、毛毯、餐巾等，帮助消费者打造节日氛围，增加节庆感。",
        "玩具是圣诞节的热门商品，尤其是适合送给孩子的玩具，如毛绒玩具、益智玩具、遥控车等，能够吸引父母购买。",
        "电子产品如智能手表、耳机、平板电脑等，适合圣诞节期间推出，迎合消费者在节日购物的需求。"
      ]
  },

  //特殊节日
  "消费者权益日": { 
    "suitable": ["维权产品", "消费者保护产品", "服务类商品", "法律咨询服务"], 
    "unsuitable": ["过于普通的快消品", "非消费者权益相关的商品", "与节日意义不符的奢侈品"], 
    "suggestions": [
      "消费者权益日强调消费者的权益保障，适合推出维权产品和消费者保护产品，如保修卡、保障服务、质量认证等，帮助消费者更好地了解自己的权益。",
      "可以结合节日推出一些服务类商品，如质保延长服务、售后保障服务等，强化消费者在购买商品时的权益保护。",
      "结合节日主题，推出与法律相关的咨询服务，如消费者维权课程、法律援助服务等，提升消费者的维权意识。",
      "通过开展促销活动，如‘正品保障’、‘权益保障’等，提升消费者对品牌的信任度，并增强品牌与消费者权益的绑定。"
    ]
  },
  "全国中小学生安全教育日": { 
    "suitable": ["安全教育产品", "防护类商品", "儿童书籍", "教育类课程"], 
    "unsuitable": ["过于单一的娱乐性商品", "成人用品", "没有教育意义的电子产品"], 
    "suggestions": [
      "中小学生安全教育日注重青少年安全教育，适合推出安全教育相关的产品，如安全警示标志、急救包、儿童安全座椅等。",
      "防护类商品如防撞头盔、安全护膝、儿童背包等非常适合推出，可以通过儿童安全防护套件来强化品牌的教育属性。",
      "推出与安全教育相关的儿童书籍、手册等，帮助家长和孩子了解日常生活中的安全注意事项，提升教育意义。",
      "可以推出教育类课程或线上活动，如安全教育讲座、安全技能训练等，提升家长和学校对安全教育的重视。"
    ]
  },
  "全国助残日": { 
      "suitable": ["助残用品", "无障碍生活产品", "健康保健品", "定制服务"], 
      "unsuitable": ["奢侈品", "高科技产品", "与助残无关的消费品"], 
      "suggestions": [
        "全国助残日关注残疾群体的平等与帮助，可以推出无障碍生活产品，如电动轮椅、盲文教材、无障碍家庭用品等，提供残障人士便利的生活选择。",
        "健康保健品也适合在此时推出，尤其是针对残障群体的康复、辅助护理类产品，如关节护理、肌肉康复设备等。",
        "定制服务也是一种可以引起关注的营销手段，如为残障人士定制的个性化家居或生活服务，强调对群体的关爱。",
        "可以在全国助残日期间推出支持残疾人公益活动的商品，每购买一件商品，捐赠一部分款项，提升品牌的社会责任感。"
      ]
  },
  "618": { 
      "suitable": ["电商平台商品", "家电产品", "手机数码", "消费电子", "时尚服饰", "日常生活用品"], 
      "unsuitable": ["高端奢侈品", "小众艺术品", "季节性不符的产品"], 
      "suggestions": [
        "618是中国的年中购物狂欢节，适合各类电商平台商品的推广。尤其是家电产品、手机数码、消费电子等，通常会有较大促销活动。",
        "时尚服饰和日常生活用品也适合在618进行折扣促销，吸引消费者购买更新换代的商品或补充生活日常所需。",
        "在618期间，品牌可以借助大规模促销活动吸引消费者，例如限时折扣、满减、秒杀等促销手段，刺激购物欲望。",
        "提供定向广告和精准推荐，利用消费者的购买历史和兴趣数据，推荐符合需求的商品，提升转化率和用户体验。"
      ]
  },
  "世界住房日": { 
      "suitable": ["家居产品", "装修建材", "智能家居", "家装设计服务", "家居软装", "房产相关服务"], 
      "unsuitable": ["与住房无关的商品", "过于奢华且无实际需求的产品", "过季商品"], 
      "suggestions": [
        "世界住房日关注住房问题，适合推广家居产品，如家具、家居装饰品、床上用品等，提升消费者家居生活的质量。",
        "装修建材如地板、墙纸、油漆、灯具等非常适合在这一节日推出，满足消费者家装或改造的需求。",
        "智能家居产品，如智能灯光、智能音响、智能家电等，迎合现代家庭对智能化生活的需求，提升家庭居住体验。",
        "家装设计服务如室内设计、家居搭配、空间规划等，能够满足消费者对舒适、实用家居环境的追求。",
        "房产相关服务如购房贷款、购房咨询等，也适合在世界住房日推出，帮助有购房需求的消费者获取相关支持。"
      ]
  },
  "双十一": { 
      "suitable": ["全品类商品", "打折促销产品", "限量版商品", "高性价比商品", "大宗商品"], 
      "unsuitable": ["不适合大规模促销的奢侈品", "季节性过期商品", "非打折产品"], 
      "suggestions": [
        "双十一是全年最盛大的购物节，适合推出全品类商品，特别是电子产品、家电、服饰、化妆品等各大类消费品。",
        "打折促销产品，如大幅降价的电子产品、品牌特卖、限时抢购等，吸引消费者的购物热情。",
        "限量版商品可以通过限时发售的形式吸引消费者，创造稀缺感和购买欲。",
        "推出高性价比商品，吸引注重实惠的消费者，特别是可以通过搭配购买、套餐折扣等方式提高销售额。",
        "大宗商品如家电、家具、数码产品等，通过大幅促销吸引消费者进行购买，增强节日气氛。"
      ]
  },
  "全民国防教育日": { 
      "suitable": ["军事纪念品", "爱国主义教育书籍", "军事模型", "户外装备", "防护产品"], 
      "unsuitable": ["不具备爱国主义或军事主题的商品", "单纯娱乐性产品", "奢侈品"], 
      "suggestions": [
        "全民国防教育日是一个弘扬爱国主义和军事文化的节日，适合推出军事纪念品，如军装、军徽、军事模型等。",
        "爱国主义教育书籍、红色历史文化类图书非常适合此时推广，吸引有爱国情怀的消费者。",
        "户外装备、军旅风格的装备也是国防教育日的热销商品，如战术背包、军用工具、战地装备等。",
        "防护类产品如防护面罩、应急生存工具等也能吸引关注全民国防的消费者，特别是有户外活动需求的群体。"
      ]
  },
};

export function getMarketingAdvice(name: string, type: string): MarketingAdvice {
  return holidayAdviceMap[name] || {
    suitable: [],
    unsuitable: [],
    suggestions: [
      '结合节日特点策划活动',
      '设计节日主题产品',
      '开展社交媒体互动'
    ]
  };
}