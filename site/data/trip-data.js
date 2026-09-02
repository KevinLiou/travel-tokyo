/**
 * Public-safe trip data. This is curated from the local source notes in ./src.
 * It intentionally contains no booking codes, QR codes, login details, or private URLs.
 */
const maps = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const node = (id, time, start, end, title, location, transport, note, status, mapQuery, sourceUrl = "") => ({
  id,
  time,
  start,
  end,
  title,
  location,
  transport,
  note,
  status,
  mapUrl: maps(mapQuery),
  sourceUrl
});

export const tripData = {
  version: 3,
  meta: {
    title: "東京 5 天 4 夜",
    shortTitle: "東京旅誌",
    dateLabel: "2026/9/10（四）— 9/14（一）",
    startDate: "2026-09-10",
    endDate: "2026-09-14",
    travelerLabel: "兩人同行",
    base: "Hotel Sardonyx Ueno",
    baseArea: "上野／御徒町",
    sourceLabel: "公開安全版",
    sourceUpdated: "2026/9/1",
    publicNote: "行程資料、待辦與介面可離線使用；地圖與官方網站另開時需要網路。",
    flights: [
      {
        direction: "去程",
        date: "9/10（四）",
        flight: "Scoot TR866",
        time: "06:45 → 11:15",
        route: "桃園 T1 → 成田 T1"
      },
      {
        direction: "回程",
        date: "9/14（一）",
        flight: "Scoot TR875",
        time: "21:15 → 23:55",
        route: "成田 T1 → 桃園 T1"
      }
    ],
    transit: [
      {
        title: "京成 Skyliner｜成田 ⇄ 京成上野",
        detail: "D1 抵達與 D5 回機場使用；全車指定席，當天依票券規則兌換／劃位。",
        guide: "官方 e-ticket",
        url: "https://www.keisei.co.jp/keisei/tetudou/skyliner/e-ticket/en/ticket/skyliner-ticket/index.php"
      },
      {
        title: "新宿～富士五湖高速巴士｜D2 正選",
        detail: "07:15 Busta 新宿 → 河口湖；16:40 忍野八海 → 新宿。河口湖→忍野八海當天看現場班次。",
        guide: "官方訂票",
        url: "https://fuji.highwaybus.com/"
      },
      {
        title: "東海道新幹線｜東京 ⇄ 熱海",
        detail: "D4 正選 14:57 東京 → 15:42 熱海；22:02 熱海 → 22:48 東京，皆為指定席。",
        guide: "SmartEX 官方",
        url: "https://smart-ex.jp/en/"
      }
    ],
    references: [
      {
        title: "景點與餐飲官網",
        items: [
          { label: "淺草寺", url: "https://www.senso-ji.jp/" },
          { label: "TOKYO mizumachi／SUMIDA RIVER WALK", url: "https://www.tokyo-mizumachi.jp/" },
          { label: "東京 Solamachi", url: "https://www.tokyo-solamachi.jp/" },
          { label: "墨田水族館", url: "https://www.sumida-aquarium.com/" },
          { label: "東京晴空塔", url: "https://www.tokyo-skytree.jp/" },
          { label: "熱海市官方觀光資訊", url: "https://www.ataminews.gr.jp/" }
        ]
      },
      {
        title: "票券與現場確認",
        items: [
          { label: "墨田水族館 Web 票", url: "https://www.sumida-aquarium.com/about/ticket/" },
          { label: "富士急巴士時刻與路線", url: "https://bus.fujikyu.co.jp/highway/detail/id/1" },
          { label: "富士山能見度預測", url: "https://fuji-san.info/zh-tw/index.html" },
          { label: "熱海花火大會資訊", url: "https://www.ataminews.gr.jp/event/" }
        ]
      },
      {
        title: "D5 採買地點",
        items: [
          { label: "MOKUBA Kuramae Showroom", url: maps("MOKUBA Showroom Kuramae") },
          { label: "貴和製作所 淺草橋本店", url: maps("貴和製作所 浅草橋本店") },
          { label: "PARTS CLUB 淺草橋", url: maps("PARTS CLUB 浅草橋") },
          { label: "KURAMAE CANNELE ecute 上野", url: maps("KURAMAE CANNELE ecute 上野") }
        ]
      }
    ],
    packingNotes: [
      "車票、行動電源、雨具、薄外套與方便走路的鞋。",
      "D2 前一晚確認河口湖天氣與交通，早餐先買好。",
      "D4 出發前確認熱海花火是否照常舉辦。",
      "D5 回程先回飯店領行李，再前往京成上野。"
    ]
  },
  days: [
    {
      id: "d1",
      day: "Day 1",
      shortDay: "D1",
      date: "9/10（四）",
      isoDate: "2026-09-10",
      title: "抵達東京＋淺草＋Solamachi",
      route: "成田 → 上野 → 淺草 → Solamachi → 晴空塔",
      summary: "抵達後先到上野寄放行李並吃午餐，再走淺草寺與隅田川動線；17:00 墨田水族館、18:45 利久，20:30 晴空塔。",
      priority: "20:30 晴空塔 ＞ 17:00 墨田水族館 ＞ 利久晚餐",
      mapUrl: maps("成田國際空港 上野寶石飯店 雷門 淺草寺 墨田水族館 東京晴空塔"),
      highlights: ["17:00 墨田水族館", "18:45 利久", "20:30 東京晴空塔"],
      food: "午餐：月島もんじゃ もへじ上野｜晚餐：牛たん炭焼 利久",
      timeline: [
        node("arrival", "11:00–12:00", "11:00", "12:00", "抵達成田機場＋入境／領行李", "成田機場 T1", "依 Railways／鉄道 指標前往 B1 成田機場站", "先處理網路、IC 卡與現金。", "提醒", "成田國際空港"),
        node("skyliner", "12:00–13:00", "12:00", "13:00", "成田 → 京成上野", "京成上野站", "京成 Skyliner 直達；大行李多可改搭計程車到飯店", "抵達市區後先寄放行李。", "已安排", "京成上野駅"),
        node("lunch", "13:00–14:30", "13:00", "14:30", "寄放行李＋午餐", "月島もんじゃ もへじ 上野", "從飯店步行；Walk-in，不綁固定訂位時間", "候位明顯過長時，優先保住 17:00 水族館。", "Walk-in", "月島もんじゃ もへじ 上野"),
        node("ueno-asakusa", "14:30–15:00", "14:30", "15:00", "上野 → 淺草", "淺草站", "銀座線往淺草方向", "午餐後再正式開始淺草行程。", "交通", "淺草駅"),
        node("sensoji", "15:00–16:00", "15:00", "16:00", "雷門 → 仲見世通 → 淺草寺", "淺草寺", "由雷門進入仲見世通，經寶藏門抵達本堂", "保留拍照、逛店與參拜時間，不必每家店都停留。", "現場", "淺草寺"),
        node("river-walk", "16:00–16:30", "16:00", "16:30", "隅田公園 → SUMIDA RIVER WALK → TOKYO mizumachi", "隅田川沿岸", "晴天／小雨步行；持續大雨改搭東武線或計程車", "這段只順路經過；時間不足直接縮短，不壓縮後續票券。", "彈性", "SUMIDA RIVER WALK"),
        node("aquarium-entry", "16:30–17:00", "16:30", "17:00", "前往墨田水族館並找入口", "東京 Solamachi 5F West Yard", "由 4F West Yard 前往戶外專用電梯／手扶梯", "目標 17:00 準時入館；票券出發前再確認。", "票券待確認", "墨田水族館", "https://www.sumida-aquarium.com/about/ticket/"),
        node("aquarium", "17:00–18:30", "17:00", "18:30", "墨田水族館", "東京 Solamachi 5F", "館內步行參觀，出口接回 Solamachi 動線", "預留約 90 分鐘。", "已排定", "墨田水族館", "https://www.sumida-aquarium.com/"),
        node("rikyu", "18:30–19:30", "18:30", "19:30", "晚餐：牛たん炭焼 利久", "東京 Solamachi", "水族館離館後直接在館內前往", "Walk-in；以不影響 20:30 晴空塔為準。", "Walk-in", "牛たん炭焼 利久 東京ソラマチ店"),
        node("solamachi", "19:30–20:00", "19:30", "20:00", "Solamachi 精華逛街＋吉卜力商店", "東京 Solamachi", "館內步行；PENNY LANE 有餘裕再買 D2 早餐", "20:00 收尾；排隊長或時間不足就跳過。", "彈性", "東京 Solamachi"),
        node("skytree-entry", "20:00–20:30", "20:00", "20:30", "前往東京晴空塔 4F 入口", "東京晴空塔 4F 正面入口", "依天望デッキ／展望台指標前進", "整段當作找入口、上廁所與票券確認緩衝。", "已預約", "東京晴空塔", "https://www.tokyo-skytree.jp/"),
        node("skytree", "20:30–22:00", "20:30", "22:00", "東京晴空塔", "天望甲板 350m／天望迴廊 450m", "通過 4F 票券櫃檯後搭專用電梯", "20:30 入場時間已排定。", "已預約", "東京晴空塔", "https://www.tokyo-skytree.jp/"),
        node("return-d1", "22:00–23:00", "22:00", "23:00", "押上 → 上野寶石飯店", "Hotel Sardonyx Ueno", "半藏門線至三越前轉銀座線；上野廣小路 G15 A8 出口", "回飯店休息，準備 D2 早起。", "交通", "Hotel Sardonyx Ueno")
      ],
      anchors: [
        { label: "墨田水族館", time: "17:00–18:30", kind: "票券待確認" },
        { label: "牛たん炭焼 利久 東京ソラマチ店", time: "約 18:45", kind: "Walk-in" },
        { label: "東京晴空塔", time: "20:30", kind: "已完成預約" }
      ]
    },
    {
      id: "d2",
      day: "Day 2",
      shortDay: "D2",
      date: "9/11（五）",
      isoDate: "2026-09-11",
      title: "河口湖＋忍野八海",
      route: "上野 → Busta 新宿 → 河口湖 → 忍野八海 → 新宿",
      summary: "05:30 起床，07:15 高速巴士到河口湖；纜車、ほうとう不動、忍野八海後，16:40 回新宿，20:00 壽喜燒。天氣不適合時切換 Plan B。",
      priority: "07:15 去程巴士 ＞ 富士山能見度 ＞ 16:40 回程巴士 ＞ 20:00 晚餐",
      mapUrl: maps("河口湖駅"),
      highlights: ["07:15 高速巴士", "富士山能見度", "16:40 回程巴士", "20:00 GOKU"],
      food: "午餐：ほうとう不動 河口湖駅前店｜晚餐：WAGYU SUKIYAKI GOKU",
      timeline: [
        node("wake", "05:30–06:00", "05:30", "06:00", "起床、確認天氣", "Hotel Sardonyx Ueno", "前一晚先買早餐，帶著出發", "陰天／小雨照常；大雨、強風或交通不穩就切換 Plan B。", "出發前確認", "Hotel Sardonyx Ueno"),
        node("to-busta", "06:00–07:00", "06:00", "07:00", "飯店 → Busta 新宿", "Busta 新宿 4F", "御徒町搭山手線至新宿；依新南改札指標前往", "07:00 前到站，保留找月台與候車時間。", "交通", "Busta Shinjuku"),
        node("bus-out", "07:15–09:00", "07:15", "09:00", "高速巴士：新宿 → 河口湖站", "河口湖站", "新宿～富士五湖線，全車指定席", "早餐在發車後吃；至少提前 15 分鐘到月台。", "已預約", "河口湖駅"),
        node("ropeway-transfer", "09:00–09:30", "09:00", "09:30", "河口湖站 → 富士山全景纜車", "遊覧船・ロープウェイ入口", "周遊巴士 Red Line；候車太久可步行 15～20 分鐘", "以現場班次與天氣調整。", "現場決定", "河口湖 富士山パノラマロープウェイ"),
        node("ropeway", "09:30–11:00", "09:30", "11:00", "富士山全景纜車", "富士山全景纜車", "搭纜車上下山；停駛或排隊超過 30 分鐘就改湖畔散步", "富士山能見度優先。", "現場決定", "富士山パノラマロープウェイ"),
        node("lunch-d2", "11:00–13:00", "11:00", "13:00", "午餐：ほうとう不動＋河口湖甜點", "河口湖站前", "餐廳 Walk-in；飯後步行買富士山布丁與伴手禮", "時間不足時改車站內輕食，不為午餐走遠。", "Walk-in", "ほうとう不動 河口湖駅前店"),
        node("to-oshino", "13:00–14:30", "13:00", "14:30", "河口湖 → 忍野八海", "忍野八海巴士站", "回河口湖站看電子看板，選最近一班有停忍野八海的巴士", "不預先鎖死班次，保留上午彈性。", "現場看班次", "忍野八海"),
        node("oshino", "14:30–16:00", "14:30", "16:00", "忍野八海散步", "忍野八海", "湧池、鏡池、菖蒲池與村落全程步行", "16:00 準時離開，留時間走回站牌與上廁所。", "現場", "忍野八海"),
        node("bus-stop", "16:00–16:40", "16:00", "16:40", "前往高速巴士站並候車", "忍野八海高速巴士站", "依車票站名與現場站牌確認，不要走到一般路線巴士站", "16:40 是需要準時銜接的回程。", "提醒", "忍野八海 高速バス"),
        node("bus-back", "16:40–18:55", "16:40", "18:55", "高速巴士：忍野八海 → 新宿", "Busta 新宿 3F", "直達新宿高速巴士", "錯過時下一班直達為 18:40 → 20:55。", "已預約", "Busta Shinjuku"),
        node("merry-jenny", "19:00–20:00", "19:00", "20:00", "LUMINE EST 2F｜merry jenny → GOKU", "新宿 LUMINE EST", "依抵達時間決定；19:30 後到就直接去晚餐", "新宿購物第一優先，但不壓縮 20:00 訂位。", "彈性", "LUMINE EST Shinjuku"),
        node("dinner-d2", "20:00–21:00", "20:00", "21:00", "WAGYU SUKIYAKI GOKU Shinjuku", "新宿 3-35-17", "由 Busta 新宿步行約 5～10 分鐘", "2 人，20:00 已預約；尖峰時段可能限時 45 分鐘。", "已預約", "WAGYU SUKIYAKI GOKU Shinjuku"),
        node("return-d2", "21:00–22:00", "21:00", "22:00", "新宿 → Hotel Sardonyx Ueno", "Hotel Sardonyx Ueno", "JR 山手線外回り至御徒町，北口步行回飯店", "回飯店休息。", "交通", "Hotel Sardonyx Ueno")
      ],
      anchors: [
        { label: "高速巴士：新宿 → 河口湖", time: "07:15", kind: "已完成預約" },
        { label: "富士山全景纜車", time: "上午", kind: "現場依天氣決定" },
        { label: "忍野八海", time: "約 14:30–16:00", kind: "現場看巴士班次" },
        { label: "高速巴士：忍野八海 → 新宿", time: "16:40", kind: "已完成預約" },
        { label: "WAGYU SUKIYAKI GOKU Shinjuku", time: "20:00", kind: "已完成預約" }
      ]
    },
    {
      id: "d3",
      day: "Day 3",
      shortDay: "D3",
      date: "9/12（六）",
      isoDate: "2026-09-12",
      title: "吉祥寺完整日",
      route: "上野 → 中道通 → 井之頭自然文化園 → 吉祥寺北口商圈",
      summary: "睡晚一點、不吃早餐；11:00 まめ蔵，接著逛中道通、HARBS、南北兩側商圈，20:00 焼肉いのうえ。",
      priority: "11:00 まめ蔵 ＞ HARBS ＞ 北口服飾採買 ＞ 20:00 晚餐",
      mapUrl: maps("吉祥寺駅"),
      highlights: ["11:00 まめ蔵", "14:00 HARBS", "18:00 Coppice", "20:00 焼肉いのうえ"],
      food: "午餐：まめ蔵｜下午茶：HARBS｜晚餐：焼肉いのうえ",
      timeline: [
        node("get-ready-d3", "09:00–09:30", "09:00", "09:30", "起床準備", "Hotel Sardonyx Ueno", "不吃飯店早餐，整理隨身包", "D3 刻意睡晚一點。", "準備", "Hotel Sardonyx Ueno"),
        node("to-kichijoji", "09:30–10:30", "09:30", "10:30", "上野／御徒町 → 吉祥寺", "吉祥寺站", "山手線或京濱東北線轉中央線快速", "抵達後由北口進入中道通方向。", "交通", "吉祥寺駅"),
        node("wait-mamezo", "10:30–11:00", "10:30", "11:00", "前往まめ蔵候位", "吉祥寺本町", "由北口步行進入中道通", "第一輪 Walk-in。", "Walk-in", "まめ蔵 吉祥寺"),
        node("mamezo", "11:00–12:00", "11:00", "12:00", "午餐：まめ蔵", "まめ蔵", "店內用餐", "用餐後留在中道通一帶。", "Walk-in", "まめ蔵 吉祥寺"),
        node("free-design", "12:00–12:30", "12:00", "12:30", "free design 吉祥寺店", "吉祥寺本町", "沿中道通步行", "北歐餐具、生活雜貨與室內選物。", "現場", "free design 吉祥寺店"),
        node("capoon", "12:30–13:00", "12:30", "13:00", "CAPOON＋ricca mocca／Petit Mura", "吉祥寺本町 2-33-2", "兩店合併成同一站", "抹茶與小店一起看，不另外繞路。", "現場", "CAPOON 抹茶製造所 吉祥寺"),
        node("paper-message", "13:00–13:30", "13:00", "13:30", "Paper Message 吉祥寺店", "吉祥寺本町 4-1-3", "中道通西側步行串聯", "紙品採買。", "現場", "Paper Message 吉祥寺店"),
        node("ships", "13:30–14:00", "13:30", "14:00", "中道通回程＋SHIPS 順路看", "吉祥寺北口", "沿中道通往車站方向回走", "視體力快速看。", "彈性", "SHIPS 吉祥寺店"),
        node("harbs", "14:00–15:30", "14:00", "15:30", "下午茶：HARBS atre 吉祥寺店", "atre 吉祥寺 B1F", "回到車站後直接進 atre", "現場候位。", "現場候位", "HARBS atre 吉祥寺店"),
        node("natural-kitchen", "15:30–16:00", "15:30", "16:00", "NATURAL KITCHEN &", "atre 吉祥寺 B1F", "館內直接接著逛", "小物採買。", "現場", "NATURAL KITCHEN & atre 吉祥寺店"),
        node("kirarina", "16:00–17:00", "16:00", "17:00", "Kirarina／BEAMS／吉祥寺 PARCO", "吉祥寺北口商圈", "館間步行", "BEAMS 約 30 分鐘，之後跨到 PARCO。", "現場", "Kirarina 京王吉祥寺"),
        node("sunroad", "17:00–18:00", "17:00", "18:00", "Daiya 街＋Sunroad", "吉祥寺北口", "由 PARCO 往北口商圈銜接", "完整逛 1 小時。", "現場", "吉祥寺サンロード商店街"),
        node("coppice", "18:00–19:30", "18:00", "19:30", "Coppice 吉祥寺服飾採買", "Coppice 吉祥寺", "優先 green label relaxing → GLOBAL WORK → LEPSIM", "服飾採買主力，保留 1.5 小時。", "現場", "コピス吉祥寺"),
        node("to-inoue", "19:30–20:00", "19:30", "20:00", "Coppice → 焼肉いのうえ", "吉祥寺 ex ビル 3F", "由 Coppice 旁步行前往", "19:40 左右開始移動。", "已預約", "焼肉いのうえ 吉祥寺店"),
        node("inoue", "20:00–21:30", "20:00", "21:30", "晚餐：焼肉いのうえ 吉祥寺店", "吉祥寺", "店內用餐", "20:00，2 人已預約。", "已預約", "焼肉いのうえ 吉祥寺店"),
        node("donki", "21:30–22:30", "21:30", "22:30", "唐吉軻德 吉祥寺站前店", "吉祥寺站前", "晚餐後步行前往", "依體力決定採買深度。", "現場", "ドン・キホーテ 吉祥寺駅前店"),
        node("return-d3", "22:30–23:30", "22:30", "23:30", "吉祥寺 → Hotel Sardonyx Ueno", "Hotel Sardonyx Ueno", "中央線快速往東京方向，回到御徒町", "回飯店休息。", "交通", "Hotel Sardonyx Ueno")
      ],
      anchors: [
        { label: "まめ蔵", time: "11:00", kind: "第一輪 Walk-in" },
        { label: "中道通特色小店", time: "12:00–14:00", kind: "步行串聯" },
        { label: "HARBS atre 吉祥寺店", time: "約 14:00–15:30", kind: "現場候位" },
        { label: "Coppice 吉祥寺", time: "18:00–19:30", kind: "服飾採買主力" },
        { label: "焼肉いのうえ 吉祥寺店", time: "20:00", kind: "已完成預約" }
      ]
    },
    {
      id: "d4",
      day: "Day 4",
      shortDay: "D4",
      date: "9/13（日）",
      isoDate: "2026-09-13",
      title: "東京站＋ADA Lab＋熱海花火",
      route: "上野 → 東京站 → 熱海 → Sun Beach → 東京",
      summary: "上午完成 ADA Lab、東京站伴手禮、免稅與寄物；13:05 極味や，14:57 新幹線到熱海，20:20–20:40 看花火，22:02 回東京。",
      priority: "東京站採買與寄物 ＞ 14:57 新幹線 ＞ 20:20 熱海花火",
      mapUrl: maps("熱海駅"),
      highlights: ["10:00 ADA Lab", "13:05 極味や", "14:57 新幹線", "20:20 熱海花火"],
      food: "午餐：極味や東京站店｜晚餐：伊豆中 ばんばん食堂",
      timeline: [
        node("breakfast-d4", "08:00–09:00", "08:00", "09:00", "飯店早餐、準備出門", "Hotel Sardonyx Ueno", "飯店內用餐", "帶上護照，準備免稅與寄物。", "準備", "Hotel Sardonyx Ueno"),
        node("to-tokyo", "09:00–09:30", "09:00", "09:30", "上野／御徒町 → 大丸東京店", "東京站八重洲側", "御徒町搭山手線或京濱東北線", "以八重洲側為主要採買動線。", "交通", "大丸東京店"),
        node("nycsand", "09:30–10:00", "09:30", "10:00", "N.Y.C.SAND 視排隊狀況決定", "大丸東京店 1F", "隊伍短才買最小盒，排太久直接跳過", "不讓單一伴手禮壓縮 ADA Lab。", "彈性", "N.Y.C.SAND 大丸東京店"),
        node("ada", "10:00–10:30", "10:00", "10:30", "ADA Lab Tokyo", "大丸東京店 10F", "館內移動", "一般參觀不用預約。", "現場", "ADA Lab Tokyo"),
        node("gift-palette", "10:30–11:00", "10:30", "11:00", "東京禮物調色盤採買", "東京駅一番街／東京ギフトパレット", "由大丸往八重洲北口方向走", "熱門且容易售罄品項先買。", "現場", "東京ギフトパレット"),
        node("taxfree-1", "11:00–11:30", "11:00", "11:30", "東京駅一番街統一免稅櫃檯", "東京駅一番街 1F", "帶商品、收據與護照到統一櫃檯", "不是在各店內退稅。", "提醒", "東京駅一番街"),
        node("gransta", "11:30–12:30", "11:30", "12:30", "GRANSTA 東京改札內採買", "GRANSTA 東京", "由 1F JR 八重洲北口改札刷 Suica 進站", "以常溫伴手禮與短清單為主。", "現場", "GRANSTA 東京"),
        node("taxfree-locker", "12:30–13:00", "12:30", "13:00", "免稅＋Multi-eCube 寄放", "八重洲北口改札外", "辦完免稅後一次寄放伴手禮，再前往午餐", "寄物完成後才去排隊。", "已安排", "東京駅 八重洲北口 Multi-eCube"),
        node("kiwamiya", "13:00–14:30", "13:00", "14:30", "排隊＋午餐：極味や東京站店", "GRANSTA 八重北 1F 八重北食堂", "Walk-in，預計 13:00 開始排隊", "保留前往新幹線月台的緩衝。", "Walk-in", "極味や 東京駅店"),
        node("shinkansen-out", "14:30–14:57", "14:30", "14:57", "前往東海道新幹線月台", "東京站新幹線月台", "依東海道・山陽新幹線指標前進", "14:57 發車，這段不可壓縮。", "已預約", "東京駅 東海道新幹線"),
        node("shinkansen-to-atami", "14:57–15:42", "14:57", "15:42", "東京 → 熱海｜こだま 835", "熱海站", "東海道新幹線普通車指定席", "SmartEX 去程已完成。", "已預約", "熱海駅"),
        node("milk-cheese", "15:42–16:30", "15:42", "16:30", "熱海ミルチーズ", "熱海站前", "出站後步行約 3 分鐘", "甜點採買。", "現場", "熱海ミルチーズ"),
        node("atami-streets", "16:30–17:30", "16:30", "17:30", "平和通＋仲見世商店街", "熱海商店街", "由熱海ミルチーズ接著逛", "保留晚餐與花火移動時間。", "現場", "熱海 平和通り名店街"),
        node("banban", "17:30–19:30", "17:30", "19:30", "晚餐：伊豆中 ばんばん食堂", "LUSCA 熱海 3F", "回熱海站內 Walk-in", "約 18:00 到店；飯後先上廁所、補飲料。", "Walk-in", "伊豆中 ばんばん食堂 熱海"),
        node("sun-beach", "19:30–20:20", "19:30", "20:20", "LUSCA → Sun Beach 找位置", "Sun Beach", "步行前往，提早找觀看位置", "花火前完成移動。", "提醒", "熱海サンビーチ"),
        node("fireworks", "20:20–20:40", "20:20", "20:40", "熱海海上花火大會", "Sun Beach", "原地觀賞", "出發前再次確認官方是否照常舉辦。", "活動待確認", "熱海海上花火大会", "https://www.ataminews.gr.jp/event/"),
        node("to-atami-station", "20:40–22:02", "20:40", "22:02", "觀賞區 → 熱海站＋候車", "熱海站", "散場後以步行回站為主", "回程指定席，預留人潮緩衝。", "已預約", "熱海駅"),
        node("shinkansen-back", "22:02–22:48", "22:02", "22:48", "熱海 → 東京", "東京站", "東海道新幹線指定席", "SmartEX 回程已完成。", "已預約", "東京駅"),
        node("return-d4", "22:48–23:30", "22:48", "23:30", "東京站領伴手禮 → 上野飯店", "Hotel Sardonyx Ueno", "領取寄物後返回上野", "隔天退房與回程，回飯店後簡單整理。", "交通", "Hotel Sardonyx Ueno")
      ],
      anchors: [
        { label: "ADA Lab Tokyo", time: "10:00 左右", kind: "一般參觀" },
        { label: "極味や東京站店", time: "約 13:05", kind: "Walk-in 排隊" },
        { label: "東京 → 熱海｜こだま 835", time: "14:57–15:42", kind: "已完成預約" },
        { label: "熱海海上花火大會", time: "20:20–20:40", kind: "出發前確認是否照常" },
        { label: "熱海 → 東京", time: "22:02–22:48", kind: "已完成預約" }
      ]
    },
    {
      id: "d5",
      day: "Day 5",
      shortDay: "D5",
      date: "9/14（一）",
      isoDate: "2026-09-14",
      title: "淺草橋素材採買＋秋葉原分流＋回程",
      route: "上野 → 淺草橋／蔵前 → 秋葉原分流 → 京成上野 → 成田 T1",
      summary: "不吃早餐、10:00 退房寄放行李；早餐／早午餐二選一目前以 10:30 ねぎし為主，MIYUKI Factory 本次取消，接著保留至少 3 小時採買 MOKUBA、貴和與 PARTS CLUB，21:15 回台。",
      priority: "MOKUBA 第一＋第二 Showroom ＞ 貴和製作所 ＞ PARTS CLUB ＞ 16:00 進京成上野站",
      mapUrl: maps("JR浅草橋駅"),
      highlights: ["10:30 ねぎし", "MOKUBA 兩間 Showroom", "貴和＋PARTS CLUB", "16:00 後進京成上野站"],
      food: "早午餐：ねぎし上野駅前店（なか卯為備選）｜機場：一風堂優先",
      timeline: [
        node("pack-d5", "08:30–10:00", "08:30", "10:00", "整理行李、退房準備", "Hotel Sardonyx Ueno", "行李分成托運、隨身、最後補買用小袋", "把回程票券與登機資訊放在隨身包。", "準備", "Hotel Sardonyx Ueno"),
        node("checkout", "10:00–10:15", "10:00", "10:15", "退房、寄放行李", "Hotel Sardonyx Ueno", "到櫃檯完成退房並確認取件方式", "回程前先完成寄物。", "提醒", "Hotel Sardonyx Ueno"),
        node("brunch-d5", "10:00–11:30", "10:00", "11:30", "早餐／早午餐二選一", "ねぎし上野駅前店／なか卯", "目前結論以 10:30 ねぎし為主；なか卯為動線備選", "不讓早餐壓縮淺草橋至少 3 小時採買。", "二選一", "ねぎし 上野駅前店"),
        node("cannele", "11:30–12:00", "11:30", "12:00", "KURAMAE CANNELE（依早餐方案調整）", "ecute 上野", "若排隊過長直接跳過，先保住採買主線", "可買就買，不為甜點改動整天節奏。", "彈性", "KURAMAE CANNELE ecute 上野"),
        node("materials", "12:00–15:00", "12:00", "15:00", "淺草橋／蔵前素材採買＋秋葉原分流", "淺草橋／蔵前", "貴和製作所、PARTS CLUB、MOKUBA；男友可自由逛秋葉原", "MIYUKI Factory 本次取消；12:00–13:00 先逛材料店，13:00 後排 MOKUBA。", "採買主力", "JR浅草橋駅"),
        node("mokuba", "13:00–14:00", "13:00", "14:00", "MOKUBA 第一＋第二 Showroom", "蔵前", "兩間只隔約兩個店面，視為同一站", "避開 12:00–13:00 午休；第一間看絲帶，第二間看蕾絲與織帶。", "採買主力", "MOKUBA 第二ショールーム 蔵前"),
        node("kiwa-parts", "12:00–15:00", "12:00", "15:00", "貴和製作所＋PARTS CLUB", "淺草橋", "JR 淺草橋站東口步行串聯", "金具、鏈條、珠材與流行配件；MIYUKI 珠材優先在貴和補。", "採買主力", "貴和製作所 浅草橋本店"),
        node("meet", "15:00–15:30", "15:00", "15:30", "回飯店會合", "御徒町／Hotel Sardonyx Ueno", "淺草橋 → 秋葉原 → 御徒町；兩人會合", "確認行李與機場要帶的最後物品。", "提醒", "Hotel Sardonyx Ueno"),
        node("to-keisei", "15:30–16:00", "15:30", "16:00", "飯店 → 京成上野站", "京成上野站", "大型行李搭計程車或 Uber Premier Van", "16:00 起處理回程車票與座位。", "提醒", "京成上野駅"),
        node("skyliner-back", "16:00–17:30", "16:00", "17:30", "京成上野 → 成田機場 T1", "成田機場 T1", "Skyliner；依回程票券規則劃位", "預留一班容錯，抵達後直接報到。", "已安排", "成田國際空港"),
        node("airport", "17:30–20:30", "17:30", "20:30", "成田 T1 報到＋安檢＋晚餐", "成田機場 T1", "依 Scoot 看板前往報到區", "晚餐一風堂優先，依登機口與排隊狀況調整。", "提醒", "成田國際空港 第1ターミナル"),
        node("boarding", "20:30–21:15", "20:30", "21:15", "前往登機口＋候機", "成田機場 T1", "完成安檢後不再安排購物或正餐", "留在登機口附近。", "提醒", "成田國際空港 第1ターミナル"),
        node("flight-home", "21:15–23:55", "21:15", "23:55", "Scoot TR875｜成田 T1 → 桃園 T1", "桃園 T1", "依登機口廣播登機", "旅程收尾。", "已排定", "成田國際空港")
      ],
      anchors: [
        { label: "早餐／早午餐", time: "10:00–11:30", kind: "ねぎし為主、なか卯備選" },
        { label: "MOKUBA 第一＋第二 Showroom", time: "13:00 後", kind: "避開 12:00–13:00 午休" },
        { label: "貴和製作所＋PARTS CLUB", time: "12:00–15:00", kind: "採買主力" },
        { label: "Skyliner：京成上野 → 成田 T1", time: "16:00 起處理", kind: "預留一班容錯" },
        { label: "Scoot TR875", time: "21:15–23:55", kind: "成田 T1 → 桃園 T1" }
      ]
    }
  ],
  alternatives: [
    {
      id: "d2-plan-b",
      dayId: "d2",
      label: "D2 Plan B",
      title: "上野公園＋上野動物園＋東京車站",
      summary: "若富士山天氣或交通不適合，改走半天上野、半天東京站與丸之內；20:00 壽喜燒保留。",
      timeline: [
        node("plan-b-start", "08:30–09:00", "08:30", "09:00", "飯店 → 上野公園", "上野公園", "從 Hotel Sardonyx Ueno 步行", "可在附近簡單吃早餐。", "備案", "上野公園"),
        node("zoo", "09:30–12:30", "09:30", "12:30", "上野動物園", "上野動物園", "開園後直接入園，預留約 3 小時", "不用勉強走完整個園區，依展示狀況取捨。", "現場", "上野動物園"),
        node("ueno-park", "12:30–13:00", "12:30", "13:00", "上野公園散步、前往車站", "上野公園", "由動物園出口往車站方向", "不另外安排阿美橫町，避免與住宿區域重複。", "彈性", "上野公園"),
        node("jr-tokyo", "13:00–13:15", "13:00", "13:15", "上野 → 東京車站", "東京站", "搭 JR 前往東京站", "短程移動。", "交通", "東京駅"),
        node("plan-b-lunch", "13:30–14:30", "13:30", "14:30", "東京站／丸之內午餐", "東京站／丸之內", "站內或附近用餐", "午餐不安排壽喜燒，保留晚餐。", "現場", "東京駅 丸の内"),
        node("plan-b-gifts", "14:30–17:30", "14:30", "17:30", "東京站伴手禮採買", "東京站", "優先熱門與容易售罄品項；完成後寄放", "BRÛLÉE MERIZE、MAISON CACAO、N.Y.C.SAND、FRANÇAIS。", "採買主力", "東京駅一番街"),
        node("marunouchi", "17:30–18:30", "17:30", "18:30", "丸之內散步", "東京站紅磚站舍／丸之內廣場", "站區步行；KITTE 屋頂庭園視體力安排", "準時收尾，不壓縮晚餐訂位。", "彈性", "丸の内広場"),
        node("plan-b-shinjuku", "18:30–19:50", "18:30", "19:50", "東京站 → 新宿", "新宿", "JR 中央線快速；預留取物與找路時間", "到站後直接前往 GOKU。", "交通", "新宿駅"),
        node("plan-b-dinner", "20:00–21:00", "20:00", "21:00", "前往新宿吃 20:00 壽喜燒", "WAGYU SUKIYAKI GOKU Shinjuku", "由新宿站步行", "已完成的晚餐保留，不因備案改動。", "已預約", "WAGYU SUKIYAKI GOKU Shinjuku"),
        node("plan-b-return", "21:00–22:00", "21:00", "22:00", "新宿 → Hotel Sardonyx Ueno", "Hotel Sardonyx Ueno", "JR 山手線回御徒町", "回飯店休息。", "交通", "Hotel Sardonyx Ueno")
      ],
      steps: [
        { time: "08:30–09:00", title: "飯店 → 上野公園", note: "可在附近簡單吃早餐。" },
        { time: "09:30–12:30", title: "上野動物園", note: "開園後入園，預留約 3 小時。" },
        { time: "13:00–13:15", title: "上野 → 東京車站", note: "搭 JR 前往東京站。" },
        { time: "13:30–14:30", title: "東京站／丸之內午餐", note: "不安排壽喜燒，保留晚餐。" },
        { time: "14:30–17:30", title: "東京站伴手禮採買", note: "完成後寄放，優先熱門與容易售罄品項。" },
        { time: "17:30–18:30", title: "丸之內散步", note: "紅磚站舍、丸之內廣場；KITTE 視體力安排。" },
        { time: "20:00", title: "新宿壽喜燒", note: "保留已安排的晚餐，不壓縮訂位。" }
      ],
      correctionNote: "此備案以目前採用的 D4 14:57 新幹線版本為準；不使用舊的 13:57 時間。"
    }
  ],
  checklist: [
    { id: "passport", group: "packing", dayId: null, label: "護照", description: "兩人的護照與必要影本／照片。", done: false },
    { id: "wallet", group: "packing", dayId: null, label: "現金、信用卡與交通 IC 卡", description: "確認付款卡可海外使用，現金與交通卡放在容易拿的位置。", done: false },
    { id: "phone-network", group: "packing", dayId: null, label: "手機與網路／eSIM", description: "確認漫遊或 eSIM 已開通，重要資料可離線查看。", done: false },
    { id: "charger", group: "packing", dayId: null, label: "充電器與充電線", description: "手機、耳機與其他設備的充電配件。", done: false },
    { id: "power-bank", group: "packing", dayId: null, label: "行動電源", description: "放在隨身行李，搭機規定依航空公司要求。", done: false },
    { id: "trip-screenshots", group: "packing", dayId: null, label: "票券、QR Code 與重要截圖", description: "車票、門票、住宿與航班資料先存到手機，必要時準備紙本。", done: false },
    { id: "rain-gear", group: "packing", dayId: null, label: "雨具", description: "折傘或輕便雨衣，D2 與 D4 出發前依天氣調整。", done: false },
    { id: "walking-shoes", group: "packing", dayId: null, label: "好走的鞋", description: "五日行程步行量高，出發前確認鞋子已穿習慣。", done: false },
    { id: "toiletries", group: "packing", dayId: null, label: "盥洗用品", description: "依住宿提供內容補齊牙刷、保養品與其他個人用品。", done: false },
    { id: "clothes", group: "packing", dayId: null, label: "貼身衣物、換洗衣物", description: "依五日行程與回程行李安排分裝。", done: false },
    { id: "hair-dryer", group: "packing", dayId: null, label: "吹風機", description: "確認住宿是否提供；需要時再放入行李。", done: false },
    { id: "mask", group: "packing", dayId: null, label: "口罩", description: "依個人需求準備隨身與備用數量。", done: false },
    { id: "shopping-bag", group: "packing", dayId: null, label: "可折疊購物袋", description: "D4、D5 採買時使用，減少臨時找袋子的時間。", done: false },
    { id: "personal-medicine", group: "medicine", dayId: null, label: "個人藥品", description: "依兩人平常需求準備，處方藥保留原包裝並放在隨身行李。", done: false },
    { id: "d2-dinner", group: "restaurants", dayId: "d2", label: "WAGYU SUKIYAKI GOKU｜20:00", description: "2 人已預約；出發前確認訂位資訊與餐廳位置。", done: true },
    { id: "d3-dinner", group: "restaurants", dayId: "d3", label: "焼肉いのうえ 吉祥寺店｜20:00", description: "2 人已預約；出發前確認訂位資訊與餐廳位置。", done: true },
    { id: "visit-japan-web", group: "before", dayId: null, label: "Visit Japan Web 申請", description: "出發前完成入境資料，兩人確認 QR Code／登入資訊可正常開啟。", done: false },
    { id: "insurance-application", group: "before", dayId: null, label: "旅遊保險申請", description: "完成投保／申請，保存保單與理賠聯絡資訊。", done: false },
    { id: "d2-weather", group: "before", dayId: "d2", label: "D2 前一晚確認天氣與交通", description: "大雨、強風或交通不穩就切換 Plan B；早餐先買好。", done: false },
    { id: "d2-bus-schedule", group: "before", dayId: "d2", label: "截圖河口湖 → 忍野八海當日班表", description: "這一段不鎖死班次，出發前存一份現場查詢依據。", done: false },
    { id: "d4-fireworks", group: "before", dayId: "d4", label: "確認熱海花火是否照常", description: "D4 出發前看官方公告；活動取消時保留熱海站周邊行程。", done: false },
    { id: "d5-return", group: "before", dayId: "d5", label: "確認 Skyliner 回程與 Scoot 報到", description: "D5 先回飯店領行李，再到京成上野；機場依看板報到。", done: false },
    { id: "d1-aquarium-ticket", group: "tickets", dayId: "d1", label: "墨田水族館 Web 票", description: "9/10 目標 17:00 入館，出發前確認 Web 票與入場時間。", done: false },
    { id: "skyliner-roundtrip", group: "tickets", dayId: "d1", label: "京成 Skyliner 兩人來回票", description: "D1 成田 T1 → 京成上野；D5 依回程時間確認班次與座位。", done: true },
    { id: "d1-skytree", group: "tickets", dayId: "d1", label: "東京晴空塔｜20:30", description: "成人 2 人，天望甲板＋天望迴廊。", done: true },
    { id: "d2-bus-out", group: "tickets", dayId: "d2", label: "高速巴士去程｜07:15", description: "Busta 新宿 → 09:00 河口湖站，2 人。", done: true },
    { id: "d2-bus-back", group: "tickets", dayId: "d2", label: "高速巴士回程｜16:40", description: "忍野八海 → 18:55 Busta 新宿，2 人。", done: true },
    { id: "d4-shinkansen-out", group: "tickets", dayId: "d4", label: "SmartEX 去程｜14:57", description: "東京 → 熱海，指定席 2 人。", done: true },
    { id: "d4-shinkansen-back", group: "tickets", dayId: "d4", label: "SmartEX 回程｜22:02", description: "熱海 → 東京，指定席 2 人。", done: true },
    { id: "d4-locker", group: "tickets", dayId: "d4", label: "Multi-eCube 寄物", description: "東京站八重洲北口改札外，M × 1；購物與免稅後寄放。", done: true },
    { id: "d4-souvenirs", group: "shopping", dayId: "d4", label: "東京站伴手禮短清單", description: "N.Y.C.SAND、FRANÇAIS、BRÛLÉE MERIZE、PISTA & TOKYO 等，隊伍長就跳過。", done: false },
    { id: "d5-mokuba", group: "shopping", dayId: "d5", label: "MOKUBA 第一＋第二 Showroom", description: "13:00 後前往；兩間視為同一站，第一間看絲帶、第二間看蕾絲。", done: false },
    { id: "d5-kiwa", group: "shopping", dayId: "d5", label: "貴和製作所 淺草橋本店", description: "金具、鏈條、珠材與吊飾；MIYUKI 珠材優先在此補。", done: false },
    { id: "d5-parts", group: "shopping", dayId: "d5", label: "PARTS CLUB", description: "保留與貴和不同風格的流行配件與金具。", done: false },
    { id: "d5-cancel-miyuki", group: "shopping", dayId: "d5", label: "MIYUKI Factory 不排入", description: "本次取消，時間留給 MOKUBA、貴和與 PARTS CLUB。", done: true }
  ],
  checklistGroups: [
    { id: "packing", label: "攜帶物品", title: "出門前先裝進行李" },
    { id: "medicine", label: "藥品", title: "只列一項，依兩人平常需求準備" },
    { id: "restaurants", label: "餐廳訂位", title: "只列已安排的訂位" },
    { id: "tickets", label: "門票與交通票", title: "門票、車票與寄物憑證" },
    { id: "before", label: "出發前", title: "先把會影響行程的事處理掉" },
    { id: "shopping", label: "採買清單", title: "想買的東西，照優先順序走" }
  ]
};
