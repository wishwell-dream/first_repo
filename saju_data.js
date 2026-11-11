// Master Cheon Authentic Korean Saju Manse력 (萬歲曆) & 240-Combination Dynamic Engine

const BRANCH_ASCII = {
  '자': 'ja', '축': 'chuk', '인': 'in', '묘': 'myo', '진': 'jin', '사': 'sa',
  '오': 'o', '미': 'mi', '신': 'shin', '유': 'yu', '술': 'sul', '해': 'hae'
};

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
    if (branch === '축' || branch === '미') list.push('천을귀인');
  } else if (['을', '기'].includes(dayStem)) {
    if (branch === '자' || branch === '신') list.push('천을귀인');
  } else if (['병', '정'].includes(dayStem)) {
    if (branch === '해' || branch === '유') list.push('천을귀인');
  } else if (['임', '계'].includes(dayStem)) {
    if (branch === '사' || branch === '묘') list.push('천을귀인');
  }

  const munchangMap = {'갑': '사', '을': '오', '병': '신', '정': '유', '무': '신', '기': '유', '경': '해', '신': '자', '임': '인', '계': '묘'};
  if (munchangMap[dayStem] === branch) list.push('문창귀인');

  if (['자', '오', '묘', '유'].includes(branch)) list.push('도화살');
  if (['인', '신', '사', '해'].includes(branch)) list.push('역마살');
  if (['진', '술', '축', '미'].includes(branch)) list.push('화개살');
  if (branch === '진' || branch === '술') list.push('괴강살');

  if (list.length === 0) list.push('장성살');
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

function getPillars(dateStr, timeVal) {
  const parts = dateStr.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  const refDate = new Date(Date.UTC(1998, 0, 1));
  const targetDate = new Date(Date.UTC(y, m - 1, d));
  const diffDays = Math.round((targetDate - refDate) / (1000 * 60 * 60 * 24));

  const dayStemIdx = ((4 + diffDays) % 10 + 10) % 10;
  const dayBranchIdx = ((8 + diffDays) % 12 + 12) % 12;

  let yearStemIdx = ((y - 4) % 10 + 10) % 10;
  let yearBranchIdx = ((y - 4) % 12 + 12) % 12;
  if (m === 1 || (m === 2 && d < 4)) {
    yearStemIdx = ((y - 5) % 10 + 10) % 10;
    yearBranchIdx = ((y - 5) % 12 + 12) % 12;
  }

  const monthBranchMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
  const monthBranchIdx = monthBranchMap[(m - 1 + 12) % 12];
  const monthStemBase = (yearStemIdx % 5) * 2 + 2;
  const monthStemIdx = (monthStemBase + m - 1) % 10;

  let hourBranchIdx = 4;
  if (timeVal === 'early_morning') hourBranchIdx = 2;
  else if (timeVal === 'morning') hourBranchIdx = 4;
  else if (timeVal === 'afternoon') hourBranchIdx = 6;
  else if (timeVal === 'evening') hourBranchIdx = 8;
  else if (timeVal === 'night') hourBranchIdx = 10;
  else if (timeVal === 'late_night') hourBranchIdx = 0;

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

// 10대 천간별 고유 심층 데이터 (재능, 직장팩폭, 환경, 대박직업, 인생총평)
const STEM_DATA = {
  '갑': {
    name: '갑목 (甲木) · 우뚝 솟은 거목 & 선구자',
    savage: '“너는 남 밑에서 지시받거나 굽신거리는 꼴을 태생적으로 못 참지? 차라리 내가 맨땅에 헤딩해서 내 판을 짤지언정, 남의 그늘에 들어가 부품이 되는 건 질색하는 팔자다.”',
    talents: [
      { title: '0.1초 개척자 본능', desc: '남들이 망설이고 눈치 볼 때, 먼저 깃발 꽂고 판을 짜버리는 압도적인 스타터(Starter) 기질.' },
      { title: '수직적 결단력', desc: '군더더기 붙은 잔가지를 단칼에 쳐내고 핵심 본질만 밀어붙이는 돌파 리더십.' },
      { title: '독자적 시스템 구축', desc: '남이 만든 룰을 따르기보다 나만의 공식과 왕국을 스스로 설계해 내는 추진력.' }
    ],
    careerSavage: '“너는 남 밑에서 네네 하고 있으면 홧병 나서 단명할 팔자다. 위에서 꼰대가 찍어누르는 꼴을 못 보고 내가 대장이 되어야만 직성이 풀린다. 수직 관료제에 있으면 칼부림 난다.”',
    badEnvs: [
      '결정권 1도 없이 상사 수발들고 결재만 5단계 올리는 수직 관료제',
      '새로운 아이디어를 내면 ‘전례가 없다’며 퇴짜 놓는 꽉 막힌 공기업/대기업',
      '내 성과를 팀장이나 윗선이 홀라당 가로채는 정치판 조직',
      '단순 반복으로 영혼 없이 시키는 일만 복사 붙여넣기 해야 하는 환경'
    ],
    goodEnvs: [
      '내가 전권을 쥐고 사업 방향과 예산을 결정하는 독립 창업 / 스타트업 대표',
      '초기 세팅부터 결과 도출까지 혼자 주도하는 1인 비즈니스 & 신사업 TF',
      '실력과 숫자로만 깔끔하게 평가받는 고연봉 전문직 / 디렉터',
      '조직의 간섭 없이 내 왕국을 넓혀가는 프랜차이즈 / 플랫폼 파운더'
    ],
    careers: ['스타트업 창업가 / 대표이사(CEO)', '신규 비즈니스 총괄 디렉터', '독립 라이선스 전문직(로펌/변리사)', '선구적 브랜드 기획 총괄'],
    oracle: '“기억해라. 너는 작은 화분에 갇혀 분재가 될 사주가 아니다. 거센 비바람이 몰아쳐도 깊게 뿌리내려 숲의 주인이 될 거목이다. 잔가지 같은 비난에 흔들리지 말고 하늘을 향해 우뚝 솟아라.”'
  },
  '을': {
    name: '을목 (乙木) · 끈질긴 생명력의 담쟁이 & 적응의 귀재',
    savage: '“너는 겉으로는 유순하고 착해 보여도 속에는 잡초 같은 독기가 꽉 차 있지? 밟히면 밟힐수록 더 무섭게 살아남아 기어이 판을 장악하는 현실주의 승부사다.”',
    talents: [
      { title: '뱀 같은 네트워크 적응력', desc: '어떤 척박한 환경에 던져져도 사람과 자원을 휘감아 내 편으로 만드는 생존력.' },
      { title: '유연한 우회 실리 추구', desc: '정면충돌하지 않고 부드럽게 돌아가며 결국 내가 원하는 실속을 100% 챙겨 나오는 영민함.' },
      { title: '대중 심리 바이럴 캐칭', desc: '대중의 가려운 곳을 기가 막히게 긁어주는 콘텐츠와 마케팅 후킹 감각.' }
    ],
    careerSavage: '“너는 수직적인 대기업 조직에 들어가면 속으로는 ‘저 꼰대 언제 퇴직하나’ 계산기 두들기면서도 겉으론 비위 맞추다 속병 난다. 내 몫을 내가 직접 챙길 수 있는 판이어야 산다.”',
    badEnvs: [
      '융통성 없이 원리원칙만 따지며 꽉 막힌 규정만 강요하는 환경',
      '사람 상대하는 맛 없이 차가운 기계 부품처럼 고립되어 일하는 곳',
      '열심히 영업하고 연결해 줬더니 고정 월급만 쥐여주고 인센티브 없는 직장',
      '동료들끼리 피 튀기게 감정 싸움하며 사내정치에 휘말리는 진흙탕'
    ],
    goodEnvs: [
      '사람과 사람, 상품과 고객을 연결하여 중간 수수료와 마진을 독점하는 비즈니스',
      '트렌드가 초 단위로 바뀌며 내 순발력과 센스를 폭발시킬 수 있는 이커머스/콘텐츠',
      '재택근무나 유연근무로 내 컨디션에 맞춰 유연하게 치고 빠질 수 있는 환경',
      '인맥과 평판이 곧바로 거대한 현금 자산으로 치환되는 에이전시 / 인플루언서'
    ],
    careers: ['이커머스 브랜드 파운더 / 플랫폼 MD', '바이럴 마케팅 디렉터 / 그로스해커', '콘텐츠 크리에이터 / 인플루언서', '비즈니스 에이전트 / 전략적 파트너'],
    oracle: '“기억해라. 바위를 뚫고 올라가는 건 날카로운 도끼가 아니라 질긴 덩굴이다. 사람들은 네가 유순한 줄 알겠지만 네 끈기와 적응력은 아무도 못 이긴다. 부러지지 말고 부드럽게 감싸 쥐어 네 세상을 만들어라.”'
  },
  '병': {
    name: '병화 (丙火) · 만물을 비추는 태양 & 스포트라이트',
    savage: '“너는 숨겨도 아우라가 뿜어져 나오는 사주라, 골방에 처박혀 있으면 우울증 온다. 사람들 시선을 한몸에 받고 판의 중심에 서야 돈과 운이 쏟아져 들어온다.”',
    talents: [
      { title: '무대 장악력 & 대중 흡입력', desc: '말 한마디, 표정 하나로 분위기를 반전시키고 사람들의 이목을 사로잡는 독보적 존재감.' },
      { title: '스파크 튀는 비전 기획력', desc: '죽어있는 아이디어에 1초 만에 생명을 불어넣고 거대한 비전을 제시하는 불꽃.' },
      { title: '폭발적인 실행 드라이브', desc: '결정이 내려지면 망설임 없이 태양처럼 내달려 단숨에 가시적 결과를 뽑아내는 힘.' }
    ],
    careerSavage: '“너를 좁은 파티션 사무실에 가둬놓고 엑셀 숫자 입력이나 서류 정리만 시키면 빛을 잃고 시든다. 네가 주인공이 되어 사람들을 휘어잡아야 에너지가 돈으로 바뀐다.”',
    badEnvs: [
      '뒤에서 묵묵히 지원만 해야 하고 이름 석 자가 세상에 드러나지 않는 그림자 업무',
      '상사가 내 기를 죽이고 매사에 잔소리와 감점식 평가로 옥죄는 보수적 직장',
      '어둡고 삭막한 지하 사무실에서 하루 종일 말 한마디 없이 모니터만 보는 환경',
      '변화 없이 매일 똑같은 루틴이 반복되는 관공서형 단순 행정'
    ],
    goodEnvs: [
      '카메라 앞, 무대 위, 대중의 시선이 집중되는 미디어 / 엔터 / 방송 무대',
      '내 얼굴과 브랜드가 전면에 걸려 사람들의 팬덤을 결집시키는 퍼스널 비즈니스',
      '대규모 발표, IR 피칭, 세일즈 프레젠테이션으로 단번에 투자와 계약을 따내는 현장',
      '화려한 조명과 에너지가 넘치는 글로벌 이벤트 / 패션 / 대형 페스티벌 기획'
    ],
    careers: ['브랜드 파운더 / 미디어 쇼호스트', '대외 협력(PR) 총괄 / 브랜드 앰버서더', '엔터테인먼트 총괄 프로듀서 / 영상 디렉터', '글로벌 탑티어 세일즈 리더'],
    oracle: '“기억해라. 태양은 구름 뒤에 가려져 있어도 여전히 태양이다. 지금 당장 어둠 속에 있다고 주눅 들지 마라. 네가 고개를 들고 빛을 내뿜는 순간 온 세상의 꽃이 네 방향으로 돌아설 것이다.”'
  },
  '정': {
    name: '정화 (丁火) · 어둠을 밝히는 등불 & 용광로',
    savage: '“너는 겉으로는 조용하고 온화해 보여도, 네 선을 넘는 순간 상대를 뼈까지 태워버리는 불꽃이 숨겨져 있지. 장인정신과 디테일 집착이 미친 수준이다.”',
    talents: [
      { title: '현미경 디테일 감수성', desc: '남들은 전혀 눈치채지 못하는 0.1%의 미세한 오차와 결함을 귀신같이 짚어내는 눈.' },
      { title: '영혼을 갈아 넣는 집요함', desc: '한 번 꽂힌 프로젝트는 밤을 새워서라도 장인의 경지까지 끌어올리는 몰입력.' },
      { title: '상대의 심장을 찌르는 통찰', desc: '상대의 숨겨진 결핍과 욕망을 정확히 꿰뚫어 맞춤형 심리 솔루션을 주는 능력.' }
    ],
    careerSavage: '“너는 대충대충 얼버무리고 넘어가는 동료나 상사 보면 속에서 천불이 나지? 한 땀 한 땀 장인처럼 디테일을 깎아야 직성이 풀리는데 양치기 야근만 시키면 미친다.”',
    badEnvs: [
      '퀄리티는 개나 주고 ‘그냥 대충 빨리 찍어내라’고 닥달하는 공장식 환경',
      '내 전문성과 섬세함을 몰라보고 무식하게 소리부터 지르는 무례한 상사 밑',
      '정신없이 소음이 심하고 내 작업에 온전히 집중할 수 없는 오픈형 오피스',
      '디테일 하나하나 트집 잡으면서 정작 본인은 대안을 제시 못 하는 무능한 팀'
    ],
    goodEnvs: [
      '나만의 독립된 작업실에서 하이엔드 퀄리티의 결과물을 빚어내는 크리에이티브 스튜디오',
      '정밀한 기술력, 감각적인 UX/UI, 코드 한 줄로 완벽함을 증명하는 IT 개발 / 디자인',
      '소수 정예 VIP 고객을 대상으로 깊이 있는 가치를 제공하는 프리미엄 컨설팅',
      '내가 만든 고유의 작품이나 지식 재산권(IP)으로 지속적인 인세를 거두는 구조'
    ],
    careers: ['UI/UX 프로덕트 디자이너 / 아트 디렉터', '정밀 소프트웨어 아키텍트 / 코어 개발자', '하이엔드 브랜딩 / 심리 컨설턴트', '장인정신 기반 1인 브랜드 메이커'],
    oracle: '“기억해라. 쇠를 녹여 명검을 만드는 것은 요란한 모닥불이 아니라 은근하고 지독한 용광로다. 너의 집요함과 장인정신은 반드시 세상을 뒤흔들 걸작을 낳는다. 네 기준을 세상에 맞춰 낮추지 마라.”'
  },
  '무': {
    name: '무토 (戊土) · 태산과 드넓은 대지 & 묵직한 거인',
    savage: '“너는 본인 머리가 비상하고 동물적 촉이 살아있다는 걸 알면서도 ‘내가 게을러서’라며 자책하지? 네가 게으른 게 아니라 재미없고 영혼 없는 일에 뇌가 거부 반응을 일으키는 거다.”',
    talents: [
      { title: '0.1초 동물적 기획 직관', desc: '데이터를 분석하기도 전에 ‘이거 무조건 터진다’는 촉이 0.1초 만에 뇌를 스치는 천재적 육감.' },
      { title: '태산 같은 신뢰와 무게감', desc: '사람들이 무의식중에 의지하고 비밀을 털어놓게 만드는 묵직한 포용력과 그릇.' },
      { title: '골방 1인 크리에이티브 파워', desc: '혼자 방에 틀어박혀 노트북 하나로 세상과 싸워 이기는 독립적 생산성.' }
    ],
    careerSavage: '“너는 상사가 비효율적인 방식으로 간섭하거나, 능력도 없는 꼰대가 사내정치질 하는 꼴을 보면 속에서 천불이 나지? 입으로는 ‘네’ 하면서 눈빛으로는 이미 그 상사 세 번 담근 사주다. 그래서 꽉 막힌 수직 조직에 있으면 병난다.”',
    badEnvs: [
      '시키는 대로만 해야 하는 단순 반복 노가다 및 1시간 단위 보고 압박',
      '융통성 1도 없이 사소한 절차로 발목 잡는 꽉 막힌 관료제 조직',
      '상사 기분 맞춰줘야 하는 비위 맞추기 회식과 사내정치판',
      '내 동물적 감각과 통찰을 무시하고 낡은 매뉴얼만 들이미는 보수적 직장'
    ],
    goodEnvs: [
      '나만의 재량권과 자율성이 보장되어 내 리듬대로 판을 짜는 독립 프로젝트',
      '1인 창업, 바이브 코딩, 디지털 인디 서비스, 나만의 온라인 플랫폼 비즈니스',
      '감각과 기획이 그대로 매출로 직결되는 크리에이티브 콘텐츠 분야',
      '결과물과 숫자로만 깔끔하게 승부 보고 남의 간섭을 받지 않는 전문직'
    ],
    careers: ['1인 인디 메이커 / 바이브 코더', 'IP 콘텐츠 비즈니스 파운더 / 기획자', '자산 운용 / 실물 가치 투자 전략가', '시스템 아키텍트 / 독립 프로덕트 오너'],
    oracle: '“기억해라. 태산은 계절이 바뀌고 바람이 거세게 불어도 자리를 옮기지 않는다. 너의 묵직함과 침묵은 게으름이 아니라 거대한 판을 품는 그릇이다. 남들의 가벼운 속도에 휘둘리지 말고 네 무게로 세상을 눌러라.”'
  },
  '기': {
    name: '기토 (己土) · 비옥한 정원 & 만물을 길러내는 실속파',
    savage: '“너는 주변 사람들 챙겨주고 남의 판 깔아주느라 네 몫을 뒤로 미루는 경향이 있지? 너는 남 좋은 일 그만하고 네 정원에 비싼 씨앗을 뿌려 독식해야 하는 팔자다.”',
    talents: [
      { title: '만물을 길러내는 실전 육성력', desc: '작은 아이디어나 미완성 프로젝트를 가져와 실제로 돌아가는 비즈니스로 구현하는 힘.' },
      { title: '치밀한 자산 관리와 방어선', desc: '새는 돈을 철저히 막고, 실속 있는 현금 흐름을 차곡차곡 쌓아 올리는 실리감각.' },
      { title: '맞춤형 솔루션 조율력', desc: '사람마다 상황에 맞게 찰떡같이 필요한 조언과 실행법을 조율해 주는 능력.' }
    ],
    careerSavage: '“너는 남들 뒤치다꺼리하고 구멍 메꿔주느라 정작 네 성과는 얌체 같은 동료나 상사가 쏙 빼먹지 않았냐? 남 챙겨주는 오지랖 버리고 네 주머니부터 채워야 한다.”',
    badEnvs: [
      '내가 일 다 해놓으면 엉뚱한 사람이 열매만 훔쳐 가는 무임승차 조직',
      '리스크만 잔뜩 크고 현실적 현금 흐름이 없는 뜬구름 잡는 사업판',
      '체계 없이 주먹구구식으로 돌아가 매일 남의 뒤치다꺼리만 해야 하는 곳',
      '내 헌신과 노고를 당연하게 여기고 고마워할 줄 모르는 갑질 클라이언트 밑'
    ],
    goodEnvs: [
      '내가 시스템의 안방마님이 되어 자금과 운영을 총괄 통제하는 핵심 운영 라인(COO)',
      '실물 자산, 부동산, 배당, 알짜 현금 흐름이 매달 또박또박 꽂히는 안정적 사업',
      '교육, 컨설팅, 멘토링을 통해 사람들의 잠재력을 끌어올려 수익화하는 교육 플랫폼',
      '신뢰할 수 있는 소수 정예 파트너와 함께 지분을 나누며 탄탄하게 키우는 알짜 법인'
    ],
    careers: ['운영 총괄(COO) / 비즈니스 오퍼레이터', '자산 관리 / 프라이빗 뱅커 / 재무 디렉터', '에듀테크 파운더 / 전문 커리큘럼 디렉터', '실물 알짜 자산 기반 비즈니스 대표'],
    oracle: '“기억해라. 메마른 사막을 푸른 옥토로 바꾸는 비옥한 대지가 바로 너다. 남의 밭에 물 주며 에너지 낭비하지 말고, 네 땅에 희귀한 씨앗을 심어라. 네 손을 거치는 모든 것이 곧 황금이 된다.”'
  },
  '경': {
    name: '경금 (庚金) · 거대한 원석 & 결단의 칼날',
    savage: '“너는 애매모호한 소리나 빙빙 돌려 말하는 사람 보면 속이 뒤집어지지? 호불호가 칼 같고 맺고 끊음이 확실해서 너를 좋아하는 사람은 맹목적으로 따르고, 적은 확실히 만드는 사주다.”',
    talents: [
      { title: '도끼 같은 문제 해결력', desc: '복잡하게 꼬여있는 갈등이나 적폐를 단 한 방의 결단으로 잘라내 정리하는 통솔력.' },
      { title: '압도적인 맷집과 뚝심', desc: '주변에서 아무리 흔들어도 내가 옳다고 믿는 길은 피투성이가 되어도 끝까지 밀고 가는 강단.' },
      { title: '무질서를 정돈하는 뼈대 구축', desc: '혼돈 속에서 명확한 규율과 프레임워크를 세워 일사불란한 질서를 만들어내는 능력.' }
    ],
    careerSavage: '“너는 돌려 말하거나 책임 회피하는 상사 보면 죽빵 날리고 싶지? 맺고 끊음이 칼 같아야 직성이 풀리는데 질질 끌고 책임 떠넘기는 조직에 있으면 칼을 엉뚱한 데 휘두른다.”',
    badEnvs: [
      '책임자는 아무도 없고 서로 눈치 보며 결정을 미루는 우유부단한 모래알 조직',
      '규율과 원칙 없이 감정적으로 이랬다저랬다 번복하는 변덕스러운 리더 밑',
      '말만 번지르르하고 실제 실행은 하나도 안 되는 탁상공론 회의실',
      '내 단호한 결단을 ‘공격적이다’라며 억누르고 온화한 척만 강요하는 위선적 집단'
    ],
    goodEnvs: [
      '부실한 프로젝트나 위기의 기업을 인수하여 칼같이 정상화하는 턴어라운드 / 구조조정',
      '철저한 논리와 법적 근거, 규격으로 상대를 압도하는 법률 / 감사 / 인프라 사업',
      '강력한 리더십과 카리스마로 팀원들을 일사불란하게 지휘하는 프로젝트 사령탑',
      '단단한 실물 제조, 하드웨어, 방산, 건축 등 거대한 결과물을 만들어내는 산업'
    ],
    careers: ['구조조정 / 턴어라운드 전문 컨설턴트', '하드코어 시스템 / 인프라 총괄 엔지니어', '법률 / 감사 / 리스크 매니지먼트 파트너', '하드웨어 / 제조업 독립 사업가'],
    oracle: '“기억해라. 불에 달궈지고 수만 번 두들겨 맞을수록 더 예리하고 단단해지는 명검이 바로 너다. 지금 겪는 풍파는 너를 부러뜨리는 게 아니라 날을 벼리는 담금질이다. 칼을 뽑았으면 끝장을 봐라.”'
  },
  '신': {
    name: '신금 (辛金) · 세공된 다이아몬드 & 서늘한 메스',
    savage: '“너는 완벽하지 않을 바엔 아예 시작도 안 하려는 완벽주의 결벽증이 있지? 남들은 ‘그 정도면 됐다’고 해도 네 기준에 안 차면 잠을 못 자는 하이엔드 팔자다.”',
    talents: [
      { title: '1%의 차이를 가르는 심미안', desc: '평범한 것을 명품으로 둔갑시키는 극도의 퀄리티 집착과 하이엔드 미적 감각.' },
      { title: '송곳 같은 팩트 폭격', desc: '상대의 허점과 문제점을 가장 우아하고 날카로운 단어로 급소 타격하는 언어 능력.' },
      { title: '독보적 프리미엄 아이덴티티', desc: '흔한 양산형을 거부하고 세상에 단 하나뿐인 고유한 가치와 프리미엄을 만들어내는 힘.' }
    ],
    careerSavage: '“너는 촌스러운 기획이나 퀄리티 떨어지는 결과물을 보면 눈이 썩는 기분이지? 너의 하이엔드 기준을 이해 못 하고 하향평준화 시키려는 무딘 인간들이 네 인생의 주적이다.”',
    badEnvs: [
      '가성비만 따지며 질보다 양으로 승부 보려는 저가형 박리다매 시장',
      '미적 감각 1도 없는 꼰대가 내 디자인과 글에 숟가락 얹고 촌스럽게 수정할 때',
      '비위생적이거나 미적 기준이 처참하게 무너져 있는 조잡한 근무 환경',
      '개인의 섬세한 취향을 무시하고 몰개성한 집단주의를 강요하는 군대식 문화'
    ],
    goodEnvs: [
      '가격표를 보지 않고 지갑을 여는 상위 1%를 타깃으로 한 럭셔리 / 뷰티 / 패션 브랜드',
      '글자 하나, 여백 1픽셀의 차이로 감탄을 자아내는 하이엔드 에디팅 / 브랜딩',
      '정밀한 손기술과 날카로운 직관으로 환부를 도려내는 전문 의료 / 정밀 기술 분야',
      '내 완벽주의가 곧바로 최고의 프리미엄 단가로 보상받는 1인 독점 스튜디오'
    ],
    careers: ['럭셔리 / 뷰티 / 패션 크리에이티브 디렉터', '하이엔드 에디터 / 브랜드 카피라이터', '정밀 의료 / 바이오 스페셜리스트', '독점 프리미엄 부티크 브랜드 오너'],
    oracle: '“기억해라. 진흙탕 속에 처박혀도 다이아몬드의 광채는 결코 흐려지지 않는다. 촌스러운 다수의 평범한 취향에 네 날카로운 감각을 타협하지 마라. 너의 1% 결벽증이 결국 세상에서 가장 비싼 브랜드가 된다.”'
  },
  '임': {
    name: '임수 (壬水) · 끝없는 밤바다와 심해의 지략가',
    savage: '“너는 머릿속에 지구 세 바퀴 돌릴 전략이 다 들어있지? 겉으로는 웃으면서 상대방의 패를 이미 10수 앞까지 다 읽고 있는 무서운 지략가 사주다.”',
    talents: [
      { title: '심해 같은 빅픽처 통찰', desc: '단편적인 사건에 휘둘리지 않고 거대한 글로벌 트렌드의 판도를 미리 내다보는 혜안.' },
      { title: '유연한 우회 침투 전략', desc: '벽에 부딪히면 정면충돌하지 않고 물처럼 스며들어 결국 목적지에 도달하는 지혜.' },
      { title: '글로벌 무대 확장 스케일', desc: '국내라는 좁은 우물에 갇히지 않고 국경과 언어를 넘어 판을 키우는 대담한 스케일.' }
    ],
    careerSavage: '“너는 이미 10수 앞의 거대한 판을 보고 있는데, 우물 안 개구리들이 좁은 시야로 사소한 꼬투리를 잡으면 기가 차지? 네 거대한 스케일을 담을 수 없는 좁은 조직을 탈출해라.”',
    badEnvs: [
      '한 치 앞도 내다보지 못하고 눈앞의 단기 성과에만 일희일비하는 냄비형 조직',
      '해외나 외부와 단절된 채 좁은 로컬 시장에서 자기들끼리 밥그릇 싸움하는 곳',
      '내 거대한 비전과 아이디어를 ‘너무 허황되다’며 이해조차 못 하는 보수적 집단',
      '투명성을 핑계로 내 전략적 침묵과 생각할 시간을 빼앗고 매 순간 참견하는 환경'
    ],
    goodEnvs: [
      '전 세계를 무대로 자본과 데이터가 24시간 멈추지 않고 도는 글로벌 비즈니스 / 무역',
      '거대한 자금의 흐름을 굴리고 레버리지를 일으키는 투자 펀드 / 금융 퀀트',
      '국경 없는 인터넷 세상에서 무한히 확장되는 글로벌 SaaS / 플랫폼 파운더',
      '누구에게도 얽매이지 않고 밤바다처럼 자유롭게 지적 항해를 즐기는 싱크탱크'
    ],
    careers: ['글로벌 비즈니스 전략가 / 무역 파운더', '빅데이터 / AI 시스템 아키텍트', '해외 대체투자 펀드 매니저', '국경 없는 디지털 플랫폼 설립자'],
    oracle: '“기억해라. 바다는 세상의 모든 강물을 품지만 그 어떤 강물에도 물들지 않는다. 네 거대한 생각의 스케일을 좁은 어항에 가두지 마라. 큰 파도를 일으켜 국경 없는 대양으로 거침없이 나아가라.”'
  },
  '계': {
    name: '계수 (癸水) · 촉촉한 단비 & 심리 투시의 마술사',
    savage: '“너는 상대방 눈빛만 봐도 기분이 어떤지 0.1초 만에 감지하지? 남들 기분 다 맞춰주느라 기 빨리지 말고, 그 신들린 심리 파악 능력을 비즈니스에 써야 부자 된다.”',
    talents: [
      { title: '공기 흐름을 읽는 심리 투시', desc: '말하지 않아도 타인의 결핍과 원하는 것을 본능적으로 감지해 마음을 여는 센스.' },
      { title: '스며드는 우아한 설득력', desc: '강요하지 않고 상대방 스스로 선택했다고 느끼게 만드는 우아한 심리 유도.' },
      { title: '감성 콘텐츠 기획력', desc: '사람들의 눈물샘과 지갑을 동시에 열게 만드는 마법 같은 스토리텔링 파워.' }
    ],
    careerSavage: '“너는 사무실 안의 감정 싸움, 눈치 게임, 미묘한 기류를 스펀지처럼 흡수해서 퇴근할 때쯤 영혼이 탈탈 털리지? 감정 노동 심하고 정서적으로 오염된 곳에 있으면 몸부터 망가진다.”',
    badEnvs: [
      '사람에 대한 공감이나 배려 없이 오직 실적 압박으로 쥐어짜는 피도 눈물도 없는 조직',
      '고객들의 무례한 악성 민원을 온몸으로 받아내야 하는 단순 감정 노동 현장',
      '서로를 헐뜯고 뒷담화가 난무하여 공기가 탁한 감정적 오염 구역',
      '내 직관과 유연한 발상을 무시하고 딱딱한 숫자와 기계적 매뉴얼만 강요하는 곳'
    ],
    goodEnvs: [
      '사람들의 상처를 치유하고 마음을 어루만져 주는 심리 치료 / 멘탈 코칭 / 힐링 공간',
      '감성을 자극하는 글, 영상, 음악으로 강력한 팬덤을 형성하는 스토리텔링 창작',
      '소비자의 무의식적 욕망을 데이터로 포착하여 적중시키는 UX 리서치 / 상품 기획',
      '비대면으로 감정 소모를 최소화하면서 내 고유의 지식을 전달하는 온라인 지식 비즈니스'
    ],
    careers: ['콘텐츠 스토리텔러 / 드라마·시나리오 작가', '소비자 심리 분석가 / UX 리서처', '커뮤니티 빌더 / 퍼스널 브랜딩 코치', '감성 라이프스타일 큐레이터'],
    oracle: '“기억해라. 바위를 뚫는 것은 가장 날카로운 창이 아니라 끊임없이 떨어지는 부드러운 빗방울이다. 너의 섬세한 공감과 지혜는 가장 굳게 닫힌 사람들의 마음을 여는 열쇠다. 네 부드러움이 가장 강력한 무기다.”'
  }
};

// 12 지지별 배우자 상세 데이터 (240 조합 매핑)
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

// 배우자궁 십신별 구체적 역할 데이터
const SPOUSE_ROLE_BY_SHIPSHIN = {
  '비견': '대등한 러닝메이트이자 전우. 서로의 커리어를 존중하며 같은 곳을 바라보고 세상을 정복해 나가는 든든한 동반자.',
  '겁재': '짜릿한 승부욕과 추진력을 불어넣는 자극제. 게을러질 틈 없이 서로를 채찍질하며 판을 키우는 파괴적 시너지 파트너.',
  '식신': '내 표현과 창의성을 무조건 지지해 주는 온실. 맛있는 것을 챙겨주고 따뜻한 정서적 안식처가 되어주는 사람.',
  '상관': '기존의 지루한 틀을 함께 깨부수는 공범. 파격적인 유머와 영감으로 내 삶을 매 순간 반짝이게 만들어주는 사람.',
  '편재': '내 인생의 스케일을 3배로 키워주는 거상의 짝. 통 큰 결단력과 남다른 재정적 감각으로 부의 고속도로를 깔아주는 사람.',
  '정재': '한 치의 오차도 없이 안정적인 가정을 꾸려가는 현실적 버팀목. 새는 돈을 막고 내 자산을 차곡차곡 불려주는 사람.',
  '편관': '거친 세상의 비바람을 온몸으로 대신 막아주는 카리스마 보디가드. 가끔 팽팽한 기싸움이 있지만 절대적으로 든든한 방패.',
  '정관': '사회적 명예와 단정한 품격을 갖춘 정석 파트너. 어디에 내놓아도 자랑스럽고 내 삶에 확고한 안정망을 씌워주는 사람.',
  '편인': '세상 사람들은 이해 못 하는 내 독특한 감성과 세계관을 100% 꿰뚫고 있는 신비로운 영혼의 소울메이트.',
  '정인': '지친 나를 무조건적으로 안아주고 품어주는 햇살 같은 존재. 부모처럼 조건 없는 지지와 사랑으로 내 멘탈을 회복시켜 주는 사람.'
};

// 신살별 연애 팩폭 & 똥차 패턴 데이터
const SHINSAL_LOVE_DATA = {
  '도화살': {
    title: '도화살(桃花煞) — 시선을 독점하는 치명적 매력과 자석 같은 끌림',
    savage: '“너는 왜 가만히 숨만 쉬어도 똥파리들이 꼬여서 인생이 피곤하냐? 네가 흘리지 않아도 상대는 혼자 착각하고 직진해서 집착한다. 호의를 베풀 때 선을 칼같이 긋지 않으면 결국 네가 어장관리녀/가해자 취급받는 억울한 사주다. 정 떼는 법부터 배워라.”',
    trigger: '무표정일 때의 서늘한 냉미남/냉미녀 아우라와 활짝 웃을 때 무너지는 눈웃음의 극단적 갭차이',
    redFlag: '어딘가 모성애 자극하며 결핍 있는 척 다가와 내 멘탈과 에너지를 빨아먹는 감정 흡혈귀 및 자격지심형 집착러',
    timing: '도화가 천을귀인으로 승화되는 2027년 여름~가을, 세련된 문화 공간이나 트렌디한 취향 모임에서 결정적 인연 조우'
  },
  '역마살': {
    title: '역마살(驛馬煞) — 공간과 국경을 뛰어넘는 자유로운 야생의 매력',
    savage: '“너는 한곳에 오래 묶여 있거나 상대가 ‘주말에 뭐 해?’ 사소하게 감시하는 순간 정이 뚝 떨어지지? 네 방랑벽과 야생성을 이해 못 하고 징징대는 느림보를 만나면 네가 먼저 질식사한다. 너보다 보폭이 넓거나 최소한 네 속도를 맞춰줄 수 있는 사람이어야 한다.”',
    trigger: '어디로 튈지 모르는 즉흥적 추진력, 거침없는 솔직함과 예측 불가능한 야생미',
    redFlag: '내 활동 반경을 의심하고 질투하며 방구석에 가둬두려는 불안형 통제마, 게으르고 자기 발전 없는 핑계러',
    timing: '이동수와 역마가 폭발하는 2028년 상반기, 해외 출장, 공항, 여행지, 새로운 프로젝트 네트워킹 현장에서 스파크'
  },
  '화개살': {
    title: '화개살(華蓋煞) — 아무나 범접할 수 없는 고독한 신비주의와 예술성',
    savage: '“너는 주기적으로 혼자만의 동굴에 들어가 셔터를 내려야 하는 고독한 팔자인데, 억지로 인싸 연애 흉내 내다 번아웃 왔지? 네 깊은 내면과 철학을 이해 못 하고 ‘왜 답장 늦어?’ 보채는 상대를 만나면 숨이 턱턱 막힌다. 너의 동굴을 존중해 줄 사람이어야 한다.”',
    trigger: '쉽게 곁을 내주지 않는 나른하고 고고한 분위기, 둘만의 대화에서 드러나는 깊고 묵직한 내면 세계',
    redFlag: '겉만 번지르르하고 속은 텅 빈 속물, 어설픈 지식으로 널 가르치려 들고 훈계하는 꼰대형 인물',
    timing: '화개의 봉인이 풀리는 2027년 늦가을~겨울, 조용한 심야 공간, 예술/전시, 클래식한 스터디 모임에서 자연스럽게 스며듦'
  },
  '천을귀인': {
    title: '천을귀인(天乙貴人) — 품격과 위엄으로 상대를 무장해제시키는 귀티',
    savage: '“너는 워낙 기운이 단정하고 똑 부러져서 어설픈 사람이 다가오면 기가 질려 도망가지? 그릇이 태산처럼 커서 널 든든히 품어줄 대인배를 만나야지, 어설프게 자존심 세우며 기싸움하려는 쫌생이를 만나면 네 손으로 상대를 가루로 만든다.”',
    trigger: '위기 상황에서도 당황하지 않고 판을 정리하는 침착한 카리스마와 똑 부러진 프로미',
    redFlag: '자기 자존심 세우려고 널 교묘하게 깎아내리는 가스라이팅형 자격지심 덩어리, 책임감 없이 말만 앞서는 허풍선이',
    timing: '존경할 수 있는 파트너운이 만개하는 2028년 가을, 공적 업무, 비즈니스 협업 현장, 대형 학술 세미나에서 조우'
  },
  '괴강살': {
    title: '괴강살(魁罡煞) — 난세를 평정하는 압도적 우두머리 카리스마',
    savage: '“너는 웬만한 남녀는 성에 차지도 않는 극강의 우두머리 기질이다. 유약하고 우유부단한 상대에게 기대려 했다간 네 속만 터진다. 네 기를 꺾으려 들지 않고 네 카리스마를 온전히 리스펙트해 주는 강단 있는 상대를 만나야 한다.”',
    trigger: '결정적 순간에 한 치의 망설임 없이 판을 뒤집는 압도적인 결단력과 뇌섹미',
    redFlag: '앞에서는 굽신거리다 뒤에서 호박씨 까는 비열한 인물, 내 카리스마에 열등감 느껴 사소한 걸로 딴지 거는 소인배',
    timing: '인생의 거대한 전환점이 찾아오는 2027년 하반기, 치열한 비즈니스 전장이나 리더십 포럼에서 조우'
  },
  '문창귀인': {
    title: '문창귀인(文昌貴人) — 지적 섹시미와 언어의 연금술',
    savage: '“너는 대화가 안 통하거나 무식한 소리 하는 사람을 보면 0.1초 만에 마음의 문이 쾅 닫히지? 아무리 외모가 뛰어나도 뇌가 순수하면 정떨어지는 지성파 팔자다. 티키타카가 오가는 뇌섹남/뇌섹녀를 만나야 영혼이 춤춘다.”',
    trigger: '적재적소에 꽂히는 센스 넘치는 어휘 선택, 지적인 유머와 밤새 이어지는 대화 티키타카',
    redFlag: '맞춤법 다 틀리고 무식한 억지 부리는 사람, 지적 열등감 때문에 내 말을 곡해해서 듣는 옹졸한 상대',
    timing: '지적 교류가 활발해지는 2028년 봄, 북클럽, 전문 컨퍼런스, 창작 프로젝트 협업 현장에서 만남'
  }
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

// 10대 천간 영문 데이터 (글로벌 유료 사이트 연동용)
const GLOBAL_SAJU_EN = {
  stems: {
    '갑': {
      name: 'Yang Wood (갑목 · 甲木) — The Towering Redwood',
      elementDesc: 'Yang Wood over Sovereign Earth',
      careerTitle: 'Career Vault: Why You Were Born to Rule Your Own Empire',
      careerDesc: 'You are the towering forest titan. You physically cannot bow your head or take petty orders from incompetent superiors. You must command your own ship or run your own sovereign territory.',
      weapon: 'Pioneering Starter Instinct. You claim new market territories and make the first bold moves while others are still hesitating.',
      trap: 'Stubborn isolation. Refusing to delegate because your pride cannot tolerate compromise.',
      auraTitle: 'The Imperial Crown: Regal Pioneer Saju Aura',
      auraDesc: 'Your energy radiates noble vertical growth, sovereign leadership, and the upright presence of an ancient forest sovereign.',
      promptPillar: 'Towering Redwood and Imperial Gold Saju aura, regal pioneer posture, deep unwavering eyes',
      jobs: 'Founder & CEO, Lead Architect, Venture Capitalist, Strategic Director'
    },
    '을': {
      name: 'Yin Wood (을목 · 乙木) — The Resilient Ivy & Viral Alchemist',
      elementDesc: 'Yin Wood over Mystic Currents',
      careerTitle: 'Career Vault: The Master of Adaptability & Network Leverage',
      careerDesc: 'You are the tenacious climbing ivy. Underneath your soft exterior lies an unbreakable survival instinct. You wrap around any structure to reach the sunlight and monetize human connections.',
      weapon: 'Viral Audience Resonance. You instantly sense what the public craves and wrap your brand around human desire with zero friction.',
      trap: 'People-pleasing burnout. Exhausting your life force to smooth over other people’s drama instead of claiming your direct profits.',
      auraTitle: 'The Enchanted Ivy: Mystical Adaptable Charm',
      auraDesc: 'Your aura is softly magnetic, effortlessly flexible, and dangerously charming—bending with the storm yet always surviving.',
      promptPillar: 'Enchanted Ivy and Morning Dew Saju aura, soft yet sharp observant eyes, silk botanic garments',
      jobs: 'Viral Brand Strategist, Platform Partner, Media Producer, E-commerce Founder'
    },
    '병': {
      name: 'Yang Fire (병화 · 丙火) — The Blazing Sun & Spotlight Sovereign',
      elementDesc: 'Yang Fire of Cosmic Radiance',
      careerTitle: 'Career Vault: Born for the Center Stage & High Stakes',
      careerDesc: 'You are the midday sun. Putting you in a cubicle doing spreadsheet entry is spiritual death. Your presence demands an audience, and your charismatic energy directly converts into market power.',
      weapon: 'Magnetizing Stage Presence. One smile or phrase from you electrifies a room and rallies massive followings to your vision.',
      trap: 'Impulsive exhaustion. Burning out at 200 mph and scattering your brilliance on too many flashing distractions.',
      auraTitle: 'The Solar Radiance: Golden Sunlight Saju Aura',
      auraDesc: 'Your aura radiates raw warmth, undeniable charisma, and an electric presence that naturally pulls all eyes toward you.',
      promptPillar: 'Blazing Sun and Celestial Gold Saju aura, radiant magnetic smile, luminous royal amber lighting',
      jobs: 'Media Icon, Public Figure, Creative Visionary, Global Sales Leader'
    },
    '정': {
      name: 'Yin Fire (정화 · 丁火) — The Sacred Candle & Master of Focus',
      elementDesc: 'Yin Fire of Nocturnal Illumination',
      careerTitle: 'Career Vault: The Obsessive Artisan of Unmatched Detail',
      careerDesc: 'You are the focused laser and nocturnal candle flame. You notice the subtle 0.1% flaws that everyone else misses. Your obsessive pursuit of craftsmanship creates products that border on magic.',
      weapon: 'Hyper-focused Precision. You transform raw ideas into polished high-end masterpieces through relentless deep work.',
      trap: 'Secret resentment. Burning yourself up from the inside when people fail to appreciate your meticulous standards.',
      auraTitle: 'The Nocturnal Flame: Hypnotic Candlelight Aura',
      auraDesc: 'Your aura is enigmatic, intimately magnetic, and deeply intense—illuminating the darkness with piercing insight.',
      promptPillar: 'Nocturnal Lantern and Crimson Flame Saju aura, intense piercing gaze, subtle velvet noir aesthetic',
      jobs: 'Lead Product Designer, Core Systems Architect, High-End Brand Creator, Artisan Founder'
    },
    '무': {
      name: 'Yang Earth (무토 · 戊土) — The Grand Mountain & Visionary Anchor',
      elementDesc: 'Yang Earth over Monumental Granite',
      careerTitle: 'Career Vault: The Independent Sovereign of Untouchable Scale',
      careerDesc: 'You are the unshakeable granite mountain. You possess animalistic intuition and the capacity to host entire ecosystems. You wither under micromanagement but conquer when given total autonomy.',
      weapon: 'Autonomous Creation. You build digital assets, platforms, and scalable creative systems alone in your quiet chamber.',
      trap: 'Taking on other people’s incompetence because “it’s faster if I do it myself.” Cut ties with dead weight ruthlessly.',
      auraTitle: 'The Ancient Summit: Unshakeable Mountain Aura',
      auraDesc: 'Your presence is grounding, mysterious, and monumental—radiating quiet aristocratic majesty that commands effortless respect.',
      promptPillar: 'Granite Summit and Obsidian Saju aura, quiet aristocratic elegance, deep mysterious eyes, subtle paper lantern lighting',
      jobs: 'Indie Hacker & Tech Founder, Asset Allocator, IP Studio Head, Solopreneur'
    },
    '기': {
      name: 'Yin Earth (기토 · 己土) — The Fertile Garden & Resource Mastermind',
      elementDesc: 'Yin Earth of Golden Harvest',
      careerTitle: 'Career Vault: The Wealth Multiplier & Practical Strategist',
      careerDesc: 'You are the fertile soil that nurtures everything into fruition. You possess innate financial intelligence and the ability to turn small seeds into overflowing harvests.',
      weapon: 'Cash Flow Architecture. You protect capital with iron defense while steadily growing compound assets in real reality.',
      trap: 'Selfless caretaking. Spending your best nutrients growing other people’s crops while leaving your own harvest neglected.',
      auraTitle: 'The Golden Orchard: Nurturing Earth Saju Aura',
      auraDesc: 'Your energy feels welcoming, deeply reliable, and rich with hidden treasures—a sanctuary of abundant growth.',
      promptPillar: 'Fertile Earth and Golden Amber Saju aura, warm perceptive gaze, refined earth-tone silk garments',
      jobs: 'Chief Operating Officer (COO), Wealth Manager, EdTech Founder, Platform Director'
    },
    '경': {
      name: 'Yang Metal (경금 · 庚金) — The Divine Broadsword & Reformer',
      elementDesc: 'Yang Metal of Unyielding Steel',
      careerTitle: 'Career Vault: The Uncompromising Crusader of Absolute Truth',
      careerDesc: 'You are the raw unyielding steel sword. You despise passive aggression and vague excuses. You thrive when brought in to cut through corporate decay and enforce brutal efficiency.',
      weapon: 'Decisive Execution. You execute the hard decisions that make weaker souls tremble, cutting straight to the core solution.',
      trap: 'Excessive brutality. Alienating valuable allies by swinging your sword when subtle diplomacy was required.',
      auraTitle: 'The Tempered Blade: Razor-Sharp Steel Aura',
      auraDesc: 'Your presence is electrifying, sharp, and commanding—carrying the unyielding authority of a frontline general.',
      promptPillar: 'Refined Silver Blade and Frost Saju aura, sharp piercing eyes, minimalist avant-garde armor aesthetic',
      jobs: 'Turnaround Specialist, Infrastructure Chief, Legal & Risk Partner, Hardware Innovator'
    },
    '신': {
      name: 'Yin Metal (신금 · 辛金) — The Polished Diamond & Elite Perfectionist',
      elementDesc: 'Yin Metal of Crystalline Radiance',
      careerTitle: 'Career Vault: The High-End Aesthetic Dictator',
      careerDesc: 'You are the cut diamond and surgical scalpel. You have an allergic reaction to mediocrity and cheap aesthetics. Your standards are unattainable for 99% of people, making you the ultimate luxury icon.',
      weapon: 'Sublime Aesthetic Curation. You elevate anything you touch into an elite, covetable luxury brand that commands premium prices.',
      trap: 'Crippling perfectionism. Refusing to launch or publish because your work is at 98% perfection instead of 100%.',
      auraTitle: 'The Flawless Gem: Diamond Ice Saju Aura',
      auraDesc: 'Your aura is pristine, aristocratic, and razor-sharp—an untouchable luminescence that radiates pure luxury.',
      promptPillar: 'Faceted Diamond and Platinum Saju aura, cold aristocratic allure, crystal reflections, editorial chic realism',
      jobs: 'Haute Horlogerie / Luxury Director, Master Copywriter, Aesthetic Surgeon, Boutique Founder'
    },
    '임': {
      name: 'Yang Water (임수 · 壬水) — The Infinite Ocean & Deep Strategist',
      elementDesc: 'Yang Water of Abyssal Currents',
      careerTitle: 'Career Vault: The Mastermind of Global Currents & Scale',
      careerDesc: 'You are the boundless open sea. Your brain calculates 10 moves ahead while smiling politely. You are choked by narrow local boundaries; you belong on the international stage riding macro waves.',
      weapon: 'Macro Predictive Vision. You read systemic tides and navigate around obstacles like water, arriving at vast wealth effortlessly.',
      trap: 'Over-intellectualizing paralysis. Holding massive ocean currents in your head without releasing them into concrete execution.',
      auraTitle: 'The Abyssal Deep: Deep Ocean Saju Aura',
      auraDesc: 'Your aura is calm on the surface but contains unfathomable depth—radiating the enigmatic brilliance of a cosmic philosopher.',
      promptPillar: 'Midnight Ocean and Deep Sapphire Saju aura, enigmatic knowing smile, fluid silk wave aesthetics, smoky moonlight',
      jobs: 'Global Macro Strategist, AI / Data Systems Founder, Cross-Border Fund Head, Platform Pioneer'
    },
    '계': {
      name: 'Yin Water (계수 · 癸水) — The Sacred Mist & Soul Whisperer',
      elementDesc: 'Yin Water of Healing Dew',
      careerTitle: 'Career Vault: The Psychological Alchemist & Storyteller',
      careerDesc: 'You are morning mist and nourishing rain. You read micro-expressions and unexpressed wounds in 0.1 seconds. You monetize your intuitive emotional intelligence into hypnotic storytelling and brand loyalty.',
      weapon: 'Subconscious Persuasion. You guide people’s hearts and decisions gently, making them feel as if they chose it entirely on their own.',
      trap: 'Sponging emotional toxicity. Absorbing everyone’s heavy sorrow until your own psychic reservoir is completely drained.',
      auraTitle: 'The Shimmering Rain: Ethereal Mist Aura',
      auraDesc: 'Your presence is dreamy, profoundly intuitive, and emotionally transformative—like cool rain on parched ground.',
      promptPillar: 'Luminescent Mist and Pearl Rain Saju aura, gentle intuitive eyes, translucent ethereal silk drapery',
      jobs: 'Narrative Storyteller & Screenwriter, UX & Empathy Lead, Wellness Pioneer, Transformational Coach'
    }
  },
  love: {
    '도화살': {
      title: 'Peach Blossom Star (도화살) — The Intoxicating Magnet',
      desc: 'You hold the fabled Peach Blossom Star in your chart. Unlike superficial glamour, your allure is intoxicating and involuntary. Even when sitting quietly, people construct elaborate fantasies about you and project their deepest desires onto your face.',
      trigger: 'The Chilling Aloofness vs. Sudden Warmth. When you look distant, people obsessively fight for a single crumb of your attention.',
      redFlag: 'Emotional vampires who play the fragile, wounded artist to exploit your deep empathy and feed on your psychic energy.',
      timing: 'Autumn 2027: A cosmic alignment clears toxic attachments and introduces a partner of equal aesthetic and emotional caliber.'
    },
    '역마살': {
      title: 'Sky Horse Star (역마살) — The Untamed Nomadic Siren',
      desc: 'You carry the Wild Sky Horse Star. You suffocate the moment someone asks “Where were you?” with suspicion. You need vast horizons, unexpected journeys, and a partner whose stride matches your lightning-fast wanderlust.',
      trigger: 'Unpredictable, spontaneous brilliance. You never perform on cue, and your electric independence drives suitors wild.',
      redFlag: 'Clingy, homebody controllers who try to clip your wings and guilt-trip your ambitions into domestic submission.',
      timing: 'Spring 2028: During an unexpected cross-border trip, airport transit, or high-octane project launch.'
    },
    '화개살': {
      title: 'Mystic Lotus Star (화개살) — The Aristocratic Solitary Muse',
      desc: 'You possess the royal Hwagae star of the solitary philosopher. You require your sacred private sanctuary to recharge. Those without depth find you intimidating; those with refined taste find your mystery utterly irresistible.',
      trigger: 'Quiet aristocratic dignity. You never chase, boast, or beg—and that absolute self-containment drives people crazy.',
      redFlag: 'Shallow narcissists who try to lecture you with secondhand trivia to compensate for their intellectual insecurity.',
      timing: 'Winter 2027: A quiet rendezvous in an intimate gallery, jazz bar, or late-night creative workshop.'
    },
    '천을귀인': {
      title: 'Noble Benefactor Star (천을귀인) — The Royal Protection & Sovereign Grace',
      desc: 'You carry Heaven’s supreme Noble Benefactor star. Even during catastrophic crises, unseen hands tilt the universe in your favor. Your partner must be a person of immense stature and honor who respects your royal code.',
      trigger: 'Flawless grace under immense pressure. When chaos erupts, your unflappable composure makes you look like a god.',
      redFlag: 'Petty climbers who try to demean your success to soothe their fragile, bruised egos.',
      timing: 'Autumn 2028: Formally introduced through high-level business summits, VIP circles, or esteemed mentors.'
    },
    '괴강살': {
      title: 'Iron Commander Star (괴강살) — The Fearless Sovereign Magnet',
      desc: 'You wield the Iron Commander star. You possess an aura so formidable that weak souls retreat in terror. You need a powerhouse soulmate who can stand beside you as an equal ruler, not a submissive dependent.',
      trigger: 'Decisive boldness that shatters deadlocks. When you speak, the entire room holds its breath.',
      redFlag: 'Passive-aggressive covert manipulators who resent your strength and try to undermine you behind closed doors.',
      timing: 'Late 2027: Across the battlefield of a high-stakes enterprise, negotiation table, or crisis resolution.'
    }
  }
};

function getAnalysisEN(res) {
  const dayStem = res.pillars.day.stem;
  const stemEN = GLOBAL_SAJU_EN.stems[dayStem] || GLOBAL_SAJU_EN.stems['무'];
  
  let loveKey = '도화살';
  if (res.shinsals.d.includes('역마살') || res.shinsals.m.includes('역마살')) loveKey = '역마살';
  else if (res.shinsals.d.includes('화개살') || res.shinsals.m.includes('화개살')) loveKey = '화개살';
  else if (res.shinsals.d.includes('괴강살')) loveKey = '괴강살';
  else if (res.shinsals.d.includes('천을귀인')) loveKey = '천을귀인';
  const loveEN = GLOBAL_SAJU_EN.love[loveKey] || GLOBAL_SAJU_EN.love['도화살'];

  const prompt = `A high-fashion cinematic portrait character design sheet of a person radiating ${stemEN.promptPillar}, Korean aesthetic manhwa realism, subtle luxury garments, dramatic soft lighting, 8k resolution, Masterpiece --ar 16:9`;

  return {
    stemEN,
    loveEN,
    prompt,
    starsBadges: [
      `🌸 ${loveEN.title.split('—')[0].trim()}`,
      `👑 ${res.gyeokguk.name}`,
      `⚖️ ${res.shingang.title.split(' ')[0]}`,
      `🔥 ${res.yongshin.title.split(' ')[0]}`
    ]
  };
}

// 재물 대운 변곡점 계산
function getWealthTiming(dayStem, gyeok, climate) {
  if (gyeok.includes('편재') || gyeok.includes('상관') || gyeok.includes('양인')) {
    return '20대 중반부터 30대 초반 사이에 예측 불가능한 거대한 기회와 트렌드를 타고 자산이 수직 상승하는 급발진형 대운을 맞이한다. 한 방의 폭발력이 어마어마하다.';
  } else if (gyeok.includes('정재') || gyeok.includes('정관') || gyeok.includes('건록')) {
    return '20대 후반부터 30대 중반 사이에 나만의 독자적인 파이프라인이 단단하게 굳어지며 돈 그릇이 3배 이상 커지는 대운의 변곡점을 맞이한다. 마르지 않는 샘물형 자산.';
  } else if (gyeok.includes('식신') || gyeok.includes('편인')) {
    return '30대 초반부터 30대 후반 사이에 내 고유의 지식과 창의적 기술(IP)이 시장의 독점적 인정을 받으며 가만히 있어도 인세와 로열티가 꽂히는 시스템 대운이 열린다.';
  }
  return '20대 후반의 시행착오를 거쳐 30대 중반으로 넘어가며 인생의 황금기 대운이 도래한다. 남들이 흉내 낼 수 없는 나만의 독점 영역이 구축된다.';
}

function executeFullAnalysis(dateStr, timeVal, gender, partner) {
  const p = getPillars(dateStr, timeVal);
  const dayStem = p.day.stem;
  const dayBranch = p.day.branch;

  const stemShipshinY = getShipshin(dayStem, STEM_ELEM[p.year.stem], STEM_POL[p.year.stem]);
  const stemShipshinM = getShipshin(dayStem, STEM_ELEM[p.month.stem], STEM_POL[p.month.stem]);
  const stemShipshinH = getShipshin(dayStem, STEM_ELEM[p.hour.stem], STEM_POL[p.hour.stem]);

  const branchShipshinY = getShipshin(dayStem, BRANCH_ELEM[p.year.branch], BRANCH_POL[p.year.branch]);
  const branchShipshinM = getShipshin(dayStem, BRANCH_ELEM[p.month.branch], BRANCH_POL[p.month.branch]);
  const branchShipshinD = getShipshin(dayStem, BRANCH_ELEM[p.day.branch], BRANCH_POL[p.day.branch]);
  const branchShipshinH = getShipshin(dayStem, BRANCH_ELEM[p.hour.branch], BRANCH_POL[p.hour.branch]);

  const fortY = TWELVE_FORTUNE[dayStem][p.year.branch];
  const fortM = TWELVE_FORTUNE[dayStem][p.month.branch];
  const fortD = TWELVE_FORTUNE[dayStem][p.day.branch];
  const fortH = TWELVE_FORTUNE[dayStem][p.hour.branch];

  const shinY = getShinsal(p.year.branch, dayBranch, p.year.branch, dayStem);
  const shinM = getShinsal(p.month.branch, dayBranch, p.year.branch, dayStem);
  const shinD = getShinsal(p.day.branch, dayBranch, p.year.branch, dayStem);
  const shinH = getShinsal(p.hour.branch, dayBranch, p.year.branch, dayStem);

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

  const monthMainStem = BRANCH_MAIN_STEM[p.month.branch];
  const gyeokShipshin = getShipshin(dayStem, STEM_ELEM[monthMainStem], STEM_POL[monthMainStem]);
  const gyeokData = GYEOKGUK_DATA[gyeokShipshin] || { name: `${gyeokShipshin}격`, desc: '사주 원국의 중심을 이루는 고유한 그릇과 방향성.' };

  let score = 0;
  const isHelper = (elem) => (elem === STEM_ELEM[dayStem] || (ELEM_ORDER.indexOf(STEM_ELEM[dayStem]) - ELEM_ORDER.indexOf(elem) + 5) % 5 === 1);
  if (isHelper(BRANCH_ELEM[p.month.branch])) score += 35;
  if (isHelper(BRANCH_ELEM[p.day.branch])) score += 15;
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

  const spDetail = BRANCH_SPOUSE_DETAILS[dayBranch];
  const branchKey = BRANCH_ASCII[dayBranch] || 'shin';
  const spouseImgPath = partner === 'female' ? `spouse_f_${branchKey}.png` : `spouse_m_${branchKey}.png`;
  const spouseRole = SPOUSE_ROLE_BY_SHIPSHIN[branchShipshinD] || '내 부족한 오행을 채워주고 인생의 균형을 잡아주는 최고의 조력자.';

  let loveKey = '도화살';
  if (shinD.includes('역마살') || shinM.includes('역마살')) loveKey = '역마살';
  else if (shinD.includes('화개살') || shinM.includes('화개살')) loveKey = '화개살';
  else if (shinD.includes('괴강살')) loveKey = '괴강살';
  else if (shinD.includes('문창귀인')) loveKey = '문창귀인';
  else if (shinD.includes('천을귀인') || shinY.includes('천을귀인')) loveKey = '천을귀인';
  else if (['자', '오', '묘', '유'].includes(dayBranch)) loveKey = '도화살';
  const loveData = SHINSAL_LOVE_DATA[loveKey] || SHINSAL_LOVE_DATA['도화살'];

  const wealthTiming = getWealthTiming(dayStem, gyeokData.name, p.climate);

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
    wealthTiming,
    loveData,
    spouse: {
      detail: spDetail,
      role: spouseRole,
      img: spouseImgPath,
      season: p.climate,
      dayPillarName: `${p.day.stem}${p.day.branch}일주`,
      hanjaPillarName: `${p.day.stemHanja}${p.day.branchHanja} (日柱)`
    }
  };
}

function generateOracleAnswer(question, res, lang = 'ko') {
  const q = (question || '').toLowerCase();
  const stem = res.pillars.day.stem;
  const branch = res.pillars.day.branch;
  const animal = BRANCH_ANIMALS[branch];
  const stemData = res.stemData || {};
  const spouse = res.spouse.detail || {};

  const isLove = /연애|결혼|배우자|남친|여친|인연|사랑|헤어|이별|썸|바람|짝|솔로|love|marry|marriage|spouse|dating|partner|boyfriend|girlfriend|single|ex|soulmate/.test(q);
  const isCareer = /직장|이직|퇴사|돈|재물|사업|부자|성공|취업|시험|합격|일|회사|커리어|career|job|money|rich|wealth|work|business|promotion|quit|success|hired/.test(q);

  if (lang === 'en') {
    if (isLove) {
      return `🔮 Master Cheon's Oracle on Love & Destiny:

Looking at your Day Master (${res.pillars.day.stemHanja}${res.pillars.day.branchHanja}) and marital palace, you naturally attract partners through your deep charm, but you often suffer because you give endless patience to people who fail to reciprocate.

⚡ Destined Soulmate Clues & Timing:
• Destined Animal Archetype: ${spouse.animal || 'Destined Spirit'} (${spouse.age || 'Fated Age'}, ${spouse.style || 'Charismatic'})
• Encounter Scenario: ${spouse.scenario || 'An unexpected creative or social crossroad'}
• Toxic Pattern to Cut: ${spouse.conflict || 'Inconsistent communicators and emotional drainers'}

Master Cheon's Decree: "Stop trying to heal people who enjoy being broken. When you honor your standards, your destined ${spouse.animal || 'true'} mate walks into your world."`;
    } else if (isCareer) {
      return `🔮 Master Cheon's Oracle on Career & Wealth:

Your core element is ${STEM_ELEM[stem]} (${res.pillars.day.stemHanja}). You are hardwired as a "${stemData.careerTitle || 'Visionary Leader'}". You suffocate under micromanagement and empty repetitive tasks.

⚡ Wealth Breakthrough Blueprint:
• Core Wealth Weapon: ${stemData.weapon || 'Intuitive strategic foresight'}
• Lethal Trap to Eliminate: ${stemData.trap || 'Overthinking without taking rapid decisive action'}
• Financial Timing: ${res.wealthTiming.timing || 'Approaching cyclical breakthrough'}. Your wealth pipeline peaks when you build your independent brand or proprietary asset.

Master Cheon's Decree: "Do not wait for outside approval. Your chart carries explosive upward momentum the second you build your own arena."`;
    } else {
      return `🔮 Master Cheon's Direct Oracle Transmission:

You carry the ${STEM_ELEM[stem]} star anchored by the ${animal} spirit (${res.pillars.day.stemHanja}${res.pillars.day.branchHanja}). You project calm poise on the outside, but your mind processes hundreds of possibilities every minute.

⚡ Cosmic Chart Diagnosis:
• Your Balancing Key: ${res.yongshin.title || 'Elemental Equilibrium'}
• Fated Current Phase: You are concluding a long cycle of silent endurance and stepping into a season of sovereign breakthrough.
• Immediate Action: Cut out draining connections that demand your energy without refueling you.

Master Cheon's Decree: "Your primal gut instinct is already pointing at the exact answer. Trust your inner compass and take that bold leap without looking back."`;
    }
  } else {
    if (isLove) {
      return `🔮 천도령의 연애·인연 1:1 직설 점괘:

네 일주(${res.pillars.day.stem}${res.pillars.day.branch}일주)와 배우자궁을 짚어보니, 겉으로는 쿨한 척해도 마음을 주면 끝까지 맞춰주다 혼자 앓는 타입이야.

⚡ 네 진짜 인연의 단서와 시기:
• 상대 동물상: ${spouse.animal || '찰떡 인연'}상 (${spouse.age || '운명적 나이차'}, ${spouse.style || '매력적인 인상'})
• 첫 만남 시나리오: ${spouse.scenario || '예상치 못한 모임이나 이동 중에 인연이 닿음'}
• 절대 피해야 할 똥차 패턴: ${spouse.conflict || '말만 앞서고 책임감 없는 회피형 인간'}

도령의 호통 한마디: "애매하게 구는 사람 고쳐 쓰려고 시간 낭비하지 마라. 네 소중함을 첫눈에 알아보고 직진하는 사람한테만 마음 열어줘도 충분하다!"`;
    } else if (isCareer) {
      return `🔮 천도령의 커리어·재물 1:1 직설 점괘:

네 타고난 본기(${res.pillars.day.stem} 일간)는 남 밑에서 영혼 없이 갇혀 있으면 몸과 마음부터 고장 나는 기질이야. 넌 본능적으로 "${stemData.careerTitle || '자기 판을 짜는 기획자'}"의 DNA를 타고났어.

⚡ 네 인생 재물 대박 치트키:
• 필살 무기: ${stemData.weapon || '남들이 못 보는 틈새를 찾아내는 직관'}
• 이것만 피하면 성공: ${stemData.trap || '완벽주의 때문에 실행을 자꾸 미루는 습관'}
• 대운 변곡점: ${res.wealthTiming.timing || '운의 흐름이 크게 바뀌는 전환기'}에 네 독자적인 파이프라인이나 전문성이 터지며 금전 흐름이 활짝 열린다!

도령의 호통 한마디: "지금 머릿속으로만 굴리고 있는 그 계획, 당장 작은 것부터 세상에 던져봐. 넌 네 판을 깔아야 돈이 달라붙는 팔자다!"`;
    } else {
      return `🔮 천도령의 인생 운세 1:1 직설 점괘:

네 사주 명식(${res.pillars.day.stem}${res.pillars.day.branch}일주, ${animal}의 기운)을 보니, 겉으론 덤덤해 보여도 속으로는 혼자 짊어진 고민과 책임감이 참 많았구나.

⚡ 천도령이 짚어주는 명쾌한 해답:
• 네 인생의 핵심 열쇠: ${res.yongshin.title || '나를 지켜주는 용신의 기운'}
• 지금 운세 흐름: 그동안 조용히 버텨온 인고의 시기가 끝나고, 이제 네가 주도권을 쥐고 치고 나갈 때가 왔다.
• 지금 당장 버릴 것: 내 에너지를 갉아먹는 불필요한 인간관계와 남들 눈치 보기!

도령의 호통 한마디: "네 마음속 촉이 가리키는 그 방향이 맞아. 딴 사람들 눈치 보지 말고 네 생각대로 당당하게 밀어붙여라!"`;
    }
  }
}
