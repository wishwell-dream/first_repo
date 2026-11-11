
const BRANCH_ASCII = {
  '자': 'ja', '축': 'chuk', '인': 'in', '묘': 'myo', '진': 'jin', '사': 'sa',
  '오': 'o', '미': 'mi', '신': 'shin', '유': 'yu', '술': 'sul', '해': 'hae'
};
// Master Cheon Authentic Korean Saju Manse력 (萬歲曆) & 240-Combination Engine

const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEM_ELEM = {'갑': '목', '을': '목', '병': '화', '정': '화', '무': '토', '기': '토', '경': '금', '신': '금', '임': '수', '계': '수'};
const STEM_POL = {'갑': 1, '을': -1, '병': 1, '정': -1, '무': 1, '기': -1, '경': 1, '신': -1, '임': 1, '계': -1};

const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const BRANCH_ELEM = {'자': '수', '축': '토', '인': '목', '묘': '목', '진': '토', '사': '화', '오': '화', '미': '토', '신': '금', '유': '금', '술': '토', '해': '수'};
const BRANCH_POL = {'자': 1, '축': -1, '인': 1, '묘': -1, '진': 1, '사': -1, '오': 1, '미': -1, '신': 1, '유': -1, '술': 1, '해': -1};
const BRANCH_ANIMALS = {'자': '쥐', '축': '소', '인': '호랑이', '묘': '토끼', '진': '용', '사': '뱀', '오': '말', '미': '양', '신': '원숭이', '유': '닭', '술': '개', '해': '돼지'};

const ELEM_ORDER = ['목', '화', '토', '금', '수'];

const JIJANGAN = {
  '자': '壬 癸 (본기: 癸)',
  '축': '癸 辛 己 (본기: 己)',
  '인': '戊 丙 甲 (본기: 甲)',
  '묘': '甲 乙 (본기: 乙)',
  '진': '乙 癸 戊 (본기: 戊)',
  '사': '戊 庚 丙 (본기: 丙)',
  '오': '丙 己 丁 (본기: 丁)',
  '미': '丁 乙 己 (본기: 己)',
  '신': '戊 壬 庚 (본기: 庚)',
  '유': '庚 辛 (본기: 辛)',
  '술': '辛 丁 戊 (본기: 戊)',
  '해': '戊 甲 壬 (본기: 壬)'
};

const BRANCH_MAIN_STEM = {
  '자': '계', '축': '기', '인': '갑', '묘': '을', '진': '무', '사': '병',
  '오': '정', '미': '기', '신': '경', '유': '신', '술': '무', '해': '임'
};

const TWELVE_FORTUNE = {
  '갑': {'해': '장생', '자': '목욕', '축': '관대', '인': '건록', '묘': '제왕', '진': '쇠', '사': '병', '오': '사', '미': '묘', '신': '절', '유': '태', '술': '양'},
  '을': {'오': '장생', '사': '목욕', '진': '관대', '묘': '건록', '인': '제왕', '축': '쇠', '자': '병', '해': '사', '술': '묘', '유': '절', '신': '태', '미': '양'},
  '병': {'인': '장생', '묘': '목욕', '진': '관대', '사': '건록', '오': '제왕', '미': '쇠', '신': '병', '유': '사', '술': '묘', '해': '절', '자': '태', '축': '양'},
  '정': {'유': '장생', '신': '목욕', '미': '관대', '오': '건록', '사': '제왕', '진': '쇠', '묘': '병', '인': '사', '축': '묘', '자': '절', '해': '태', '술': '양'},
  '무': {'인': '장생', '묘': '목욕', '진': '관대', '사': '건록', '오': '제왕', '미': '쇠', '신': '병', '유': '사', '술': '묘', '해': '절', '자': '태', '축': '양'},
  '기': {'유': '장생', '신': '목욕', '미': '관대', '오': '건록', '사': '제왕', '진': '쇠', '묘': '병', '인': '사', '축': '묘', '자': '절', '해': '태', '술': '양'},
  '경': {'사': '장생', '오': '목욕', '미': '관대', '신': '건록', '유': '제왕', '술': '쇠', '해': '병', '자': '사', '축': '묘', '인': '절', '묘': '태', '진': '양'},
  '신': {'자': '장생', '해': '목욕', '술': '관대', '유': '건록', '신': '제왕', '미': '쇠', '오': '병', '사': '사', '진': '묘', '묘': '절', '인': '태', '축': '양'},
  '임': {'신': '장생', '유': '목욕', '술': '관대', '해': '건록', '자': '제왕', '축': '쇠', '인': '병', '묘': '사', '진': '묘', '사': '절', '오': '태', '미': '양'},
  '계': {'묘': '장생', '인': '목욕', '축': '관대', '자': '건록', '해': '제왕', '술': '쇠', '유': '병', '신': '사', '미': '묘', '오': '절', '사': '태', '진': '양'}
};

function getShipshin(dayStem, targetElem, targetPol) {
  const dE = STEM_ELEM[dayStem];
  const dP = STEM_POL[dayStem];
  const samePol = (dP === targetPol);

  if (dE === targetElem) return samePol ? "비견" : "겁재";
  if ((ELEM_ORDER.indexOf(targetElem) - ELEM_ORDER.indexOf(dE) + 5) % 5 === 1) return samePol ? "식신" : "상관";
  if ((ELEM_ORDER.indexOf(targetElem) - ELEM_ORDER.indexOf(dE) + 5) % 5 === 2) return samePol ? "편재" : "정재";
  if ((ELEM_ORDER.indexOf(dE) - ELEM_ORDER.indexOf(targetElem) + 5) % 5 === 2) return samePol ? "편관" : "정관";
  if ((ELEM_ORDER.indexOf(dE) - ELEM_ORDER.indexOf(targetElem) + 5) % 5 === 1) return samePol ? "편인" : "정인";
  return "정관";
}

function getShinsal(branch, dayBranch, yearBranch, dayStem) {
  const list = [];
  if (['무', '기', '갑', '경'].includes(dayStem)) {
    if (branch === '축' || branch === '미') list.push('천을귀인(天乙)');
  } else if (['을', '기'].includes(dayStem)) {
    if (branch === '자' || branch === '신') list.push('천을귀인(天乙)');
  } else if (['병', '정'].includes(dayStem)) {
    if (branch === '해' || branch === '유') list.push('천을귀인(天乙)');
  } else if (['임', '계'].includes(dayStem)) {
    if (branch === '사' || branch === '묘') list.push('천을귀인(天乙)');
  }

  const munchangMap = {'갑': '사', '을': '오', '병': '신', '정': '유', '무': '신', '기': '유', '경': '해', '신': '자', '임': '인', '계': '묘'};
  if (munchangMap[dayStem] === branch) list.push('문창귀인(文昌)');

  const cheonjuMap = {'갑': '사', '을': '오', '병': '사', '정': '오', '무': '신', '기': '유', '경': '해', '신': '자', '임': '인', '계': '묘'};
  if (cheonjuMap[dayStem] === branch) list.push('천주귀인(天廚)');

  if (['자', '오', '묘', '유'].includes(branch)) list.push('도화살(桃花)');
  if (['인', '신', '사', '해'].includes(branch)) list.push('역마살(驛馬)');
  if (['진', '술', '축', '미'].includes(branch)) list.push('화개살(華蓋)');
  if (branch === '진' || branch === '술') list.push('괴강살(魁罡)');

  if (list.length === 0) list.push('장성살(將星)');
  return list.slice(0, 2).join(' · ');
}

function getElemBadge(elem, hanja, name) {
  const colorMap = {
    '목': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    '화': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    '토': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    '금': 'text-slate-100 bg-white/10 border-white/30',
    '수': 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  };
  return `
    <div class="inline-flex flex-col items-center justify-center p-2 rounded-xl border ${colorMap[elem] || ''} min-w-[52px] shadow-sm">
      <span class="text-xl sm:text-2xl font-black font-serif">${hanja}</span>
      <span class="text-[10px] opacity-80 mt-0.5">${name} (${elem})</span>
    </div>
  `;
}

function getClimate(month) {
  if (month === 12 || month === 1 || month === 2) return "겨울";
  if (month >= 3 && month <= 5) return "봄";
  if (month >= 6 && month <= 8) return "여름";
  return "가을";
}

// 60 Day Pillar Calculation
function getPillars(dateStr, timeVal) {
  const parts = dateStr.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  // Reference: 1998-01-01 is Wu-Shen (무신) -> stem 4 ('무'), branch 8 ('신')
  const refDate = new Date(Date.UTC(1998, 0, 1));
  const targetDate = new Date(Date.UTC(y, m - 1, d));
  const diffDays = Math.round((targetDate - refDate) / (1000 * 60 * 60 * 24));

  const dayStemIdx = ((4 + diffDays) % 10 + 10) % 10;
  const dayBranchIdx = ((8 + diffDays) % 12 + 12) % 12;

  // Year Pillar (Approx by solar year, 입춘 2/4)
  let yearStemIdx = ((y - 4) % 10 + 10) % 10;
  let yearBranchIdx = ((y - 4) % 12 + 12) % 12;
  if (m === 1 || (m === 2 && d < 4)) {
    yearStemIdx = ((y - 5) % 10 + 10) % 10;
    yearBranchIdx = ((y - 5) % 12 + 12) % 12;
  }

  // Month Pillar (By seasonal branch)
  // 인(1월), 묘(2월), 진(3월), 사(4월), 오(5월), 미(6월), 신(7월), 유(8월), 술(9월), 해(10월), 자(11월), 축(12월)
  const monthBranchMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
  const monthBranchIdx = monthBranchMap[(m - 1 + 12) % 12];
  // 연간에 따른 월간 시두법
  const monthStemBase = (yearStemIdx % 5) * 2 + 2;
  const monthStemIdx = (monthStemBase + m - 1) % 10;

  // Hour Pillar
  let hourBranchIdx = 4; // default 진시 (07:30~09:30)
  if (timeVal === 'early_morning') hourBranchIdx = 2; // 인시
  else if (timeVal === 'morning') hourBranchIdx = 4; // 진시
  else if (timeVal === 'afternoon') hourBranchIdx = 6; // 오시
  else if (timeVal === 'evening') hourBranchIdx = 8; // 신시
  else if (timeVal === 'night') hourBranchIdx = 10; // 술시
  else if (timeVal === 'late_night') hourBranchIdx = 0; // 자시

  const hourStemBase = (dayStemIdx % 5) * 2;
  const hourStemIdx = (hourStemBase + hourBranchIdx) % 10;

  return {
    year: { stem: STEMS[yearStemIdx], branch: BRANCHES[yearBranchIdx], stemHanja: STEMS_HANJA[yearStemIdx], branchHanja: BRANCHES_HANJA[yearBranchIdx] },
    month: { stem: STEMS[monthStemIdx], branch: BRANCHES[monthBranchIdx], stemHanja: STEMS_HANJA[monthStemIdx], branchHanja: BRANCHES_HANJA[monthBranchIdx] },
    day: { stem: STEMS[dayStemIdx], branch: BRANCHES[dayBranchIdx], stemHanja: STEMS_HANJA[dayStemIdx], branchHanja: BRANCHES_HANJA[dayBranchIdx] },
    hour: { stem: STEMS[hourStemIdx], branch: BRANCHES[hourBranchIdx], stemHanja: STEMS_HANJA[hourStemIdx], branchHanja: BRANCHES_HANJA[hourBranchIdx] },
    climate: getClimate(m)
  };
}

// 10대 천간별 데이터
const STEM_DATA = {
  '갑': {
    name: '갑목 (甲木) · 우뚝 솟은 거목',
    savage: '“너는 남 밑에서 지시받거나 굽신거리는 꼴을 태생적으로 못 참지? 차라리 내가 맨땅에 헤딩해서 내 판을 짤지언정, 남의 그늘에 들어가 부품이 되는 건 질색하는 팔자다.”',
    talents: [
      { title: '0.1초 개척자 본능', desc: '남들이 망설이고 눈치 볼 때, 먼저 깃발 꽂고 판을 짜버리는 압도적인 스타터(Starter) 기질.' },
      { title: '수직적 결단력', desc: '군더더기 붙은 잔가지를 단칼에 쳐내고 핵심 본질만 밀어붙이는 리더십.' },
      { title: '독자적 시스템 구축', desc: '남이 만든 룰을 따르기보다 나만의 공식과 왕국을 스스로 설계해 내는 추진력.' }
    ],
    careers: ['스타트업 창업가 / 대표', '신사업 총괄 PM / 디렉터', '독립 라이선스 전문직', '선구적 브랜드 기획자']
  },
  '을': {
    name: '을목 (乙木) · 끈질긴 생명력의 담쟁이',
    savage: '“너는 겉으로는 유순해 보여도 속에는 잡초 같은 독기가 꽉 차 있지? 밟히면 밟힐수록 더 무섭게 살아남아 기어이 판을 장악하는 무서운 현실주의자다.”',
    talents: [
      { title: '뱀 같은 네트워크 적응력', desc: '어떤 척박한 환경에 던져져도 사람과 자원을 휘감아 내 편으로 만드는 생존력.' },
      { title: '상황 판단의 유연함', desc: '부러지지 않고 휘어지며 결국 내가 원하는 실리를 100% 챙겨 나오는 영민함.' },
      { title: '바이럴 트렌드 캐칭', desc: '대중의 가려운 곳을 기가 막히게 긁어주는 콘텐츠와 마케팅 후킹 감각.' }
    ],
    careers: ['SNS 바이럴 마케터 / 그로스해커', '플랫폼 MD / 바이어', '미디어 크리에이터', '전략적 커뮤니케이터']
  },
  '병': {
    name: '병화 (丙火) · 타오르는 태양',
    savage: '“너는 숨겨도 아우라가 뿜어져 나오는 사주라, 골방에 처박혀 있으면 우울증 온다. 사람들 시선을 한몸에 받고 판의 중심에 서야 돈과 운이 쏟아져 들어온다.”',
    talents: [
      { title: '무대 장악력 & 흡입력', desc: '말 한마디, 표정 하나로 분위기를 반전시키고 사람들의 이목을 사로잡는 존재감.' },
      { title: '스파크 튀는 기획력', desc: '1초 만에 죽어있는 아이디어에 생명을 불어넣고 비전을 제시하는 불꽃.' },
      { title: '속도감 있는 실행 드라이브', desc: '결정이 내려지면 망설임 없이 태양처럼 밀어붙여 결과를 뽑아내는 힘.' }
    ],
    careers: ['브랜드 파운더 / 쇼호스트', '대외 협력 / PR 총괄', '엔터테인먼트 / 영상 디렉터', '글로벌 세일즈 리더']
  },
  '정': {
    name: '정화 (丁火) · 어둠을 밝히는 등불 & 용광로',
    savage: '“너는 겉으로는 온화하고 조용해 보여도, 네 선을 넘는 순간 상대를 뼈까지 태워버리는 불꽃이 숨겨져 있지. 장인정신과 디테일 집착이 미친 수준이다.”',
    talents: [
      { title: '현미경 디테일 감수성', desc: '남들은 전혀 눈치채지 못하는 0.1%의 미세한 오차와 결함을 귀신같이 짚어내는 눈.' },
      { title: '영혼을 갈아 넣는 몰입력', desc: '한 번 꽂힌 분야는 밤을 새워서라도 장인의 경지까지 끌어올리는 집요함.' },
      { title: '사람의 마음을 꿰뚫는 통찰', desc: '상대의 숨겨진 결핍과 욕망을 짚어내어 맞춤형 솔루션을 쥐여주는 심리전.' }
    ],
    careers: ['UI/UX 프로덕트 디자이너', '정밀 기술 스페셜리스트 / 개발자', '심리 / 브랜딩 컨설턴트', '하이엔드 서비스 기획자']
  },
  '무': {
    name: '무토 (戊土) · 태산과 드넓은 대지',
    savage: '“너는 본인 머리가 비상하고 동물적 촉이 살아있다는 걸 알면서도 ‘내가 게을러서’라며 자책하지? 네가 게으른 게 아니라 재미없고 영혼 없는 일에 뇌가 거부 반응을 일으키는 거다.”',
    talents: [
      { title: '0.1초 동물적 기획 직관', desc: '데이터를 분석하기도 전에 ‘이거 무조건 터진다’는 촉이 0.1초 만에 뇌를 스치는 천재적 육감.' },
      { title: '태산 같은 신뢰와 무게감', desc: '사람들이 무의식중에 의지하고 고민을 털어놓게 만드는 묵직한 포용력과 그릇.' },
      { title: '골방 1인 크리에이티브 파워', desc: '혼자 방에 박혀 맥북 하나로 세상과 싸워 이기는 독립적 생산성.' }
    ],
    careers: ['1인 인디 메이커 / 바이브 코더', 'IP / 콘텐츠 비즈니스 파운더', '자산 운용 / 실물 투자 전략가', '시스템 아키텍트']
  },
  '기': {
    name: '기토 (己土) · 비옥한 정원과 텃밭',
    savage: '“너는 주변 사람들 챙겨주고 판 깔아주느라 네 몫을 뒤로 미루는 경향이 있지? 너는 남 좋은 일 그만하고 네 정원에 비싼 씨앗을 뿌려 독식해야 하는 팔자다.”',
    talents: [
      { title: '만물을 키워내는 실전 육성력', desc: '작은 아이디어나 미완성 프로젝트를 가져와 실제로 돌아가는 현실로 구현하는 힘.' },
      { title: '치밀한 자산 관리와 방어선', desc: '새는 돈을 철저히 막고, 실속 있는 현금 흐름을 차곡차곡 쌓아 올리는 실리감각.' },
      { title: '맞춤형 솔루션 제공력', desc: '사람마다 상황에 맞게 찰떡같이 필요한 조언과 실행법을 조율해 주는 능력.' }
    ],
    careers: ['운영 총괄 COO / 오퍼레이터', '자산 관리 / 재무 전략 디렉터', '에듀테크 / 교육 비즈니스 리더', '전문 플랫폼 큐레이터']
  },
  '경': {
    name: '경금 (庚金) · 거대한 원석과 강철',
    savage: '“너는 애매모호한 소리나 빙빙 돌려 말하는 사람 보면 속이 뒤집어지지? 호불호가 칼 같고 맺고 끊음이 확실해서 너를 좋아하는 사람은 미치게 따르고, 적은 확실히 만드는 사주다.”',
    talents: [
      { title: '도끼 같은 문제 해결력', desc: '복잡하게 꼬여있는 갈등이나 적폐를 단 한 방의 결단으로 잘라내 정리하는 통솔력.' },
      { title: '압도적인 맷집과 뚝심', desc: '주변에서 아무리 흔들어도 내가 옳다고 믿는 길은 피투성이가 되어도 끝까지 밀고 가는 강단.' },
      { title: '구조화와 프레임워크 설계', desc: '무질서한 혼돈 속에서 명확한 규율과 뼈대를 세워 질서를 만들어내는 능력.' }
    ],
    careers: ['구조조정 / 턴어라운드 컨설턴트', '하드코어 개발 / 인프라 엔지니어', '법률 / 감사 / 리스크 매니저', '제조·하드웨어 사업가']
  },
  '신': {
    name: '신금 (辛金) · 세공된 다이아몬드 & 서늘한 칼날',
    savage: '“너는 완벽하지 않을 바엔 아예 시작도 안 하려는 완벽주의 결벽증이 있지? 남들은 ‘그 정도면 됐다’고 해도 네 기준에 안 차면 잠을 못 자는 하이엔드 팔자다.”',
    talents: [
      { title: '1%의 차이를 가르는 심미안', desc: '평범한 것을 명품으로 둔갑시키는 극도의 퀄리티 집착과 하이엔드 미적 감각.' },
      { title: '송곳 같은 팩트 폭격', desc: '상대의 허점과 문제점을 가장 우아하고 날카로운 단어로 급소 타격하는 언어 능력.' },
      { title: '독보적 브랜드 아이덴티티', desc: '흔한 양산형을 거부하고, 세상에 단 하나뿐인 고유한 가치와 프리미엄을 만들어내는 힘.' }
    ],
    careers: ['럭셔리 / 뷰티 / 패션 디렉터', '하이엔드 에디터 / 카피라이터', '브랜드 크리에이티브 디렉터', '고난도 정밀 분석가']
  },
  '임': {
    name: '임수 (壬水) · 끝없는 밤바다와 지혜의 물결',
    savage: '“너는 머릿속에 지구 세 바퀴 돌릴 전략이 다 들어있지? 겉으로는 웃으면서 상대방의 패를 이미 10수 앞까지 다 읽고 있는 무서운 지략가 사주다.”',
    talents: [
      { title: '심해 같은 빅픽처 통찰', desc: '단편적인 사건에 휘둘리지 않고 거대한 흐름과 트렌드의 판도를 미리 내다보는 혜안.' },
      { title: '유연한 우회 전략', desc: '벽에 부딪히면 정면충돌하지 않고 물처럼 스며들어 결국 목적지에 도달하는 지혜.' },
      { title: '글로벌 무대 확장성', desc: '국내라는 좁은 우물에 갇히지 않고 국경과 언어를 넘어 판을 키우는 대담한 스케일.' }
    ],
    careers: ['글로벌 비즈니스 전략가', '빅데이터 / AI 아키텍트', '해외 무역 / 투자 펀드 매니저', '미디어 플랫폼 설립자']
  },
  '계': {
    name: '계수 (癸水) · 촉촉한 단비와 안개',
    savage: '“너는 상대방 눈빛만 봐도 기분이 어떤지 0.1초 만에 감지하지? 남들 기분 다 맞춰주느라 기 빨리지 말고, 그 신들린 심리 파악 능력을 비즈니스에 써야 부자 된다.”',
    talents: [
      { title: '공기 흐름을 읽는 심리 투시', desc: '말하지 않아도 타인의 결핍과 원하는 것을 본능적으로 감지해 마음을 여는 센스.' },
      { title: '스며드는 설득력', desc: '강요하지 않고 상대방 스스로 선택했다고 느끼게 만드는 우아한 심리 유도.' },
      { title: '감성 콘텐츠 기획력', desc: '사람들의 눈물샘과 감성을 자극해 지갑을 열게 만드는 스토리텔링 마술사.' }
    ],
    careers: ['콘텐츠 스토리텔러 / 작가', '소비자 심리 분석가 / UX 리서처', '커뮤니티 빌더 / 퍼스널 브랜더', '라이프스타일 큐레이터']
  }
};

// 12 동물상 및 지지별 배우자 상세 데이터 (240 조합 매핑의 핵심 지지 데이터)
const BRANCH_SPOUSE_DETAILS = {
  '자': { animal: '쥐', style: '서늘한 뇌섹남/뇌섹녀 · 쿨톤 지성미', age: '1~3세 연하 혹은 동갑', jobs: '테크 스타트업 파운더, 데이터 엔지니어, 금융 퀀트', scenario: '스터디, IT 컨퍼런스, 심야 와인바, 프로젝트 협업', conflict: '감정적인 떼쓰기 금지! 논리와 팩트로 담백하게 대화하면 10초 만에 풀림.' },
  '축': { animal: '소', style: '듬직하고 단정한 클래식 수트핏 · 신뢰감 100%', age: '2~5세 연상', jobs: '전문직(세무/회계/법률), 대기업 핵심 연구원, 자산가', scenario: '지인 신뢰 기반 소개팅, 클래식한 모임, 비즈니스 미팅', conflict: '자존심 건드리지 말고 든든하게 밥 한 끼 먹여주며 인정해 주면 사르르 녹음.' },
  '인': { animal: '호랑이', style: '압도적 피지컬과 야성미 · 당당한 리더', age: '3~6세 연상 혹은 연하', jobs: '독립 사업가, 브랜드 CEO, 스포츠/피트니스 디렉터', scenario: '운동/피트니스 클럽, 야외 액티비티, 대규모 비즈니스 포럼', conflict: '기싸움하면 폭발함. 일단 치켜세워주고 체면 살려주면 알아서 기어들어옴.' },
  '묘': { animal: '토끼', style: '뽀얗고 사랑스러운 과즙미 · 아이돌상', age: '2~4세 연하', jobs: '패션/뷰티 크리에이터, 인플루언서, 비주얼 디자이너', scenario: '핫플레이스 카페, 팝업스토어, 인스타그램 DM, 전시회', conflict: '귀여운 애교와 맛있는 디저트 선물 하나면 뒤끝 없이 방긋 웃음.' },
  '진': { animal: '용', style: '귀티 넘치는 카리스마 · 재벌가 황태자/여왕님상', age: '동갑 혹은 2~4세 연상', jobs: '투자사 대표, 글로벌 디렉터, 대형 프로젝트 총괄', scenario: '고급 라운지, 프라이빗 파티, 해외 출장/공항, VIP 네트워킹', conflict: '공공장소에서 망신 주면 끝장. 둘만의 공간에서 진솔하게 존중을 표할 것.' },
  '사': { animal: '뱀', style: '치명적이고 날카로운 도회적 섹시미 · 뱀/고양이상', age: '1~3세 연하 혹은 동갑', jobs: '전략 기획가, 크리에이티브 디렉터, M&A 전문가, 전문 모델', scenario: '세련된 루프탑 바, 갤러리 오프닝, 밤늦은 도심 드라이브', conflict: '질투심 자극 금지! 오직 너밖에 없다는 확신과 스킨십을 주면 바로 무장해제.' },
  '오': { animal: '말', style: '햇살처럼 밝고 건강미 넘치는 스포티 훈남/훈녀', age: '1~2세 연상 혹은 연하', jobs: '글로벌 마케터, 방송/미디어 PD, 아웃도어 비즈니스 파운더', scenario: '러닝 크루, 페스티벌, 서핑/여행지, 활기찬 네트워킹', conflict: '구속하려 들면 도망감. 자유를 주고 함께 신나게 놀아주면 충성함.' },
  '미': { animal: '양', style: '포근하고 자상한 멍뭉이상 온미남/온미녀 · 힐링 천사', age: '동갑 혹은 1~3세 연상', jobs: 'F&B 오너 셰프, 건축/인테리어 디자이너, 라이프스타일 기획자', scenario: '단골 심야식당, 조용한 동네 책방, 도자기/베이킹 공방', conflict: '혼자 속으로 삭히다 동굴로 들어감. 따뜻하게 안아주고 손잡아 주면 눈물 흘리며 풀림.' },
  '신': { animal: '원숭이', style: '재주 많고 트렌디한 테크 브레인 · 센스 만점', age: '1~3세 연하 혹은 동갑', jobs: 'AI 엔지니어, IT 프로덕트 오너, 유니콘 스타트업 리더', scenario: '해커톤, IT 세미나, 트렌디한 복합문화공간, 온라인 커뮤니티', conflict: '말싸움으로 이기려 하지 말 것. 유머러스하게 한 방 먹이며 웃어넘기면 게임 끝.' },
  '유': { animal: '닭', style: '결점 없는 도자기 피부와 날카로운 콧대 · 조각 냉미남/냉미녀', age: '2~4세 연상', jobs: '의료/바이오 전문의, 하이엔드 보석/패션 디자이너, 정밀 분석가', scenario: '정갈한 오마카세, 하이엔드 플래그십 스토어, 학술 포럼', conflict: '어설픈 핑계 대지 말 것. 솔직하게 잘못 인정하고 깔끔하게 사과하면 쿨하게 용서함.' },
  '술': { animal: '개', style: '우직하고 든든한 대형견 멍뭉이상 · 일편단심 수호자', age: '동갑 혹은 2~3세 연상', jobs: '엔지니어링 총괄, 보안/인프라 전문가, 뚝심 있는 제조업 대표', scenario: '반려견 산책로, 오랜 지인 모임, 캠핑/차박, 동네 편안한 호프', conflict: '의심하지 말 것. 든든한 믿음과 진심 어린 감사 표현 한마디면 평생 충성함.' },
  '해': { animal: '돼지', style: '순둥순둥 귀엽고 웃는 모습이 복스러운 베이글 호감형', age: '1~3세 연하', jobs: '콘텐츠 크리에이터, 외식업 프랜차이즈 대표, 엔터테인먼트 기획자', scenario: '전국 맛집 투어, 힐링 여행지, 쿠킹 클래스, 편안한 술자리', conflict: '맛있는 음식 배부르게 먹이고 따뜻한 이불 덮어주면 세상 행복해하며 풀림.' }
};

// 10대 격국 데이터
const GYEOKGUK_DATA = {
  '정재': { name: '정재격 (正財格)', desc: '치밀하고 현실적인 감각과 빈틈없는 실리주의로 자산을 차곡차곡 불려 나가는 대기만성형 부자 격국.' },
  '편재': { name: '편재격 (偏財格)', desc: '큰돈의 흐름을 냄새 맡고 판을 키워 한 방에 스케일을 확장하는 거상(巨商)의 사업가 격국.' },
  '식신': { name: '식신격 (食神格)', desc: '타고난 기획력, 생산력, 언변으로 무에서 유를 창조해 평생 먹고사는 복덩이 아티스트 격국.' },
  '상관': { name: '상관격 (傷官格)', desc: '기존의 낡은 틀과 권위를 부수고 새로운 트렌드를 창조하는 천재적 혁명가 격국.' },
  '정관': { name: '정관격 (正官格)', desc: '원칙과 품격, 신뢰를 바탕으로 사회적 명예와 확고한 타이틀을 쥐는 정통 리더 격국.' },
  '편관': { name: '편관격 (偏官格)', desc: '난세에 칼을 뽑아 위기를 기회로 바꾸고 거친 바다를 정복하는 야전사령관 격국.' },
  '정인': { name: '정인격 (正印格)', desc: '깊은 학문과 자비, 인정을 바탕으로 사람들을 가르치고 이끄는 지성인·멘토 격국.' },
  '편인': { name: '편인격 (偏印格)', desc: '독창적인 철학, 영감, 비주류의 틈새를 찔러 독점적 지위를 구축하는 스페셜리스트 격국.' },
  '비견': { name: '건록격 (建祿格)', desc: '남에게 의지하지 않고 오직 내 두 발과 실력으로 자수성가하여 우뚝 서는 독립투사 격국.' },
  '겁재': { name: '양인격 (陽刃格)', desc: '강력한 카리스마와 승부사 기질로 경쟁자들을 압도하고 판을 집어삼키는 승부사 격국.' }
};

// 오행 결핍 팩폭 데이터
const DEFICIENCY_DATA = {
  '목': '나무(木) 0개: 사주에 관성/시작하는 끈기가 부족해 남 밑에서 통제받거나 꼰대 잔소리 듣는 걸 알레르기처럼 싫어한다. 무조건 내 독립적인 판을 짜야만 직성이 풀린다.',
  '화': '불(火) 0개: 사주가 다소 차갑고 침착하여 폭발적인 에너지 분출이 부족할 수 있다. 미디어, 콘텐츠, 비주얼 등 화려한 불의 기운을 흡수해야 운이 활짝 핀다.',
  '토': '흙(土) 0개: 사주에 단단한 대지가 부족하여 변화무쌍하나 안착하는 힘이 약할 수 있다. 번 돈을 부동산이나 실물 자산으로 묶어두는 시스템이 필수다.',
  '금': '쇠(金) 0개: 결단력과 칼 같은 냉정함이 부족해 인간관계에서 우유부단하게 끌려다닐 위험이 있다. 공과 사를 명확히 가르는 맺고 끊음 연습이 필요하다.',
  '수': '물(水) 0개: 유연성과 쉬어가는 여유가 부족해 브레이크 없이 질주하다 번아웃이 올 수 있다. 깊은 생각과 멘탈 휴식, 물과 가까운 환경이 보약이다.'
};

// 오행 과다 팩폭 데이터
const EXCESS_DATA = {
  '목': '나무(木) 과다: 추진력과 아이디어는 넘쳐나나 마무리를 짓지 않고 벌여놓기만 할 수 있으니 끝장을 보는 끈기를 챙겨라.',
  '화': '불(火) 과다: 열정과 표현력이 폭발적이나 성격이 급해 답답한 꼴을 못 참는다. 한 템포 쉬어가는 냉정함을 무기로 삼아라.',
  '토': '흙(土) 과다: 태산처럼 묵직하고 신뢰감이 깊으나, 고집이 세고 한 번 마음을 닫으면 절대 안 연다. 유연한 소통을 연습하라.',
  '금': '쇠(金) 과다: 칼같이 정확하고 결단력이 있으나 상대방에게 서늘한 상처를 줄 수 있다. 따뜻한 포용력을 겉에 둘러라.',
  '수': '물(水) 과다: 생각이 바다처럼 깊고 지혜로우나, 생각이 꼬리를 물면 실행이 늦어진다. 생각하기 전에 행동을 먼저 저질러라.'
};

function executeFullAnalysis(dateStr, timeVal, gender, partner) {
  const p = getPillars(dateStr, timeVal);
  const dayStem = p.day.stem;
  const dayBranch = p.day.branch;

  // 1. Calculate Shipshin for each
  const stemShipshinY = getShipshin(dayStem, STEM_ELEM[p.year.stem], STEM_POL[p.year.stem]);
  const stemShipshinM = getShipshin(dayStem, STEM_ELEM[p.month.stem], STEM_POL[p.month.stem]);
  const stemShipshinH = getShipshin(dayStem, STEM_ELEM[p.hour.stem], STEM_POL[p.hour.stem]);

  const branchShipshinY = getShipshin(dayStem, BRANCH_ELEM[p.year.branch], BRANCH_POL[p.year.branch]);
  const branchShipshinM = getShipshin(dayStem, BRANCH_ELEM[p.month.branch], BRANCH_POL[p.month.branch]);
  const branchShipshinD = getShipshin(dayStem, BRANCH_ELEM[p.day.branch], BRANCH_POL[p.day.branch]);
  const branchShipshinH = getShipshin(dayStem, BRANCH_ELEM[p.hour.branch], BRANCH_POL[p.hour.branch]);

  // 2. Fortunes & Shinsals
  const fortY = TWELVE_FORTUNE[dayStem][p.year.branch];
  const fortM = TWELVE_FORTUNE[dayStem][p.month.branch];
  const fortD = TWELVE_FORTUNE[dayStem][p.day.branch];
  const fortH = TWELVE_FORTUNE[dayStem][p.hour.branch];

  const shinY = getShinsal(p.year.branch, dayBranch, p.year.branch, dayStem);
  const shinM = getShinsal(p.month.branch, dayBranch, p.year.branch, dayStem);
  const shinD = getShinsal(p.day.branch, dayBranch, p.year.branch, dayStem);
  const shinH = getShinsal(p.hour.branch, dayBranch, p.year.branch, dayStem);

  // 3. Elements count
  const counts = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
  counts[STEM_ELEM[p.year.stem]]++;
  counts[STEM_ELEM[p.month.stem]]++;
  counts[STEM_ELEM[p.day.stem]]++;
  counts[STEM_ELEM[p.hour.stem]]++;

  counts[BRANCH_ELEM[p.year.branch]]++;
  counts[BRANCH_ELEM[p.month.branch]]++;
  counts[BRANCH_ELEM[p.day.branch]]++;
  counts[BRANCH_ELEM[p.hour.branch]]++;

  const deficiency = Object.keys(counts).filter(k => counts[k] === 0);
  const excess = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

  // 4. Gyeokguk
  const monthMainStem = BRANCH_MAIN_STEM[p.month.branch];
  const gyeokShipshin = getShipshin(dayStem, STEM_ELEM[monthMainStem], STEM_POL[monthMainStem]);
  const gyeokData = GYEOKGUK_DATA[gyeokShipshin] || { name: `${gyeokShipshin}격`, desc: '사주 원국의 중심을 이루는 고유한 그릇과 방향성.' };

  // 5. Shingang Score
  let score = 0;
  const isHelper = (elem) => (elem === STEM_ELEM[dayStem] || (ELEM_ORDER.indexOf(STEM_ELEM[dayStem]) - ELEM_ORDER.indexOf(elem) + 5) % 5 === 1);
  if (isHelper(BRANCH_ELEM[p.month.branch])) score += 35; // 득령
  if (isHelper(BRANCH_ELEM[p.day.branch])) score += 15;   // 득지
  if (isHelper(STEM_ELEM[p.year.stem])) score += 10;
  if (isHelper(STEM_ELEM[p.month.stem])) score += 10;
  if (isHelper(STEM_ELEM[p.hour.stem])) score += 10;
  if (isHelper(BRANCH_ELEM[p.year.branch])) score += 10;
  if (isHelper(BRANCH_ELEM[p.hour.branch])) score += 10;

  let shingangText = `신강 사주 (${score}점 / 100)`;
  let shingangDesc = `신강(身强) 사주: 내 내면의 뚝심과 에너지가 태산처럼 단단한 체질. 남의 눈치를 볼 필요 없이 내가 주도하는 독립적인 프로젝트나 사업을 펼칠 때 가장 큰 성공을 거둡니다.`;
  if (score < 45) {
    shingangText = `신약 사주 (${score}점 / 100)`;
    shingangDesc = `신약(身弱) 사주: 에너지를 밖으로 왕성하게 쓰는 구조라 혼자 모든 짐을 지면 금방 지칩니다. 나를 지지해 주는 파트너와 든든한 시스템의 힘을 빌릴 때 잠재력이 폭발합니다.`;
  } else if (score <= 55) {
    shingangText = `중화 사주 (${score}점 / 100)`;
    shingangDesc = `중화(中和) 사주: 음양오행의 균형이 치우침 없이 조화로운 황금 체질. 극단적인 위기에 잘 빠지지 않고 어떤 환경에서도 안정적인 성과를 일궈냅니다.`;
  }

  // 6. Yongshin
  let yongshinText = '화(火) 용신';
  let yongshinDesc = '화(火) 용신: 차가운 겨울 흙을 따뜻하게 데워주는 불의 기운(열정, 미디어, 브랜딩, 조명)을 흡수해야 대운이 열립니다!';
  if (p.climate === '여름') {
    yongshinText = '수(水) 용신';
    yongshinDesc = '수(水) 용신: 뜨겁게 달아오른 사주를 차분하게 식혀주는 물의 기운(지혜, 유연함, 데이터, 심야의 여유)이 인생의 치트키입니다.';
  } else if (p.climate === '봄') {
    yongshinText = '금(金) 용신';
    yongshinDesc = '금(金) 용신: 가지를 치고 결단을 내리는 쇠의 기운(규율, 계약, 결단력, 깔끔한 정리)이 들어와야 결실을 맺습니다.';
  } else if (p.climate === '가을') {
    yongshinText = '목(木) 용신';
    yongshinDesc = '목(木) 용신: 메마른 대지를 뚫고 솟아나는 생명력의 기운(시작하는 용기, 크리에이티브, 기획)이 최고의 무기입니다.';
  }

  // 7. Spouse (240 combinations)
  const spDetail = BRANCH_SPOUSE_DETAILS[dayBranch];
  const branchKey = BRANCH_ASCII[dayBranch] || 'shin'; const spouseImgPath = partner === 'female' ? `spouse_f_${branchKey}.png` : `spouse_m_${branchKey}.png`;

  return {
    pillars: p,
    shipshin: {
      stemY: stemShipshinY, stemM: stemShipshinM, stemH: stemShipshinH,
      branchY: branchShipshinY, branchM: branchShipshinM, branchD: branchShipshinD, branchH: branchShipshinH
    },
    fortunes: { y: fortY, m: fortM, d: fortD, h: fortH },
    shinsals: { y: shinY, m: shinM, d: shinD, h: shinH },
    counts,
    deficiencyText: deficiency.length > 0 ? deficiency.map(e => DEFICIENCY_DATA[e]).join('<br>') : '오행이 골고루 갖추어져 치명적인 결핍 없이 원만한 흐름을 가지고 있습니다.',
    excessText: EXCESS_DATA[excess],
    gyeokguk: gyeokData,
    shingang: { title: shingangText, desc: shingangDesc },
    yongshin: { title: yongshinText, desc: yongshinDesc },
    stemData: STEM_DATA[dayStem],
    spouse: {
      detail: spDetail,
      img: spouseImgPath,
      season: p.climate,
      dayPillarName: `${p.day.stem}${p.day.branch}일주`,
      hanjaPillarName: `${p.day.stemHanja}${p.day.branchHanja} (日柱)`
    }
  };
}
