// Mock Data for CareBrief

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  flagLevel: 'red' | 'yellow' | 'none';
  flagReason: string | null;
  lastUpdate: string;
  caregiver: string;
}

export interface Action {
  text: string;
}

export interface Goal {
  id: number;
  category: string;
  goal: string;
  completed: boolean;
  completedDate: string | null;
  level: 'red' | 'yellow' | 'none';
  actions: Action[];
}

export interface GoalsData {
  summary: string;
  goals: Goal[];
  notes: string;
}

export interface Log {
  id: number;
  date: string;
  time: string;
  author: string;
  content: string;
}

export const patients: Patient[] = [
  {
    id: '1',
    name: '山田 花子',
    age: 82,
    gender: '女性',
    flagLevel: 'red',
    flagReason: '服薬漏れが2日連続',
    lastUpdate: '2024年12月13日',
    caregiver: '田中 美咲',
  },
  {
    id: '2',
    name: '佐藤 太郎',
    age: 78,
    gender: '男性',
    flagLevel: 'yellow',
    flagReason: '夜間トイレ回数増加',
    lastUpdate: '2024年12月13日',
    caregiver: '山本 由美',
  },
  {
    id: '3',
    name: '鈴木 和子',
    age: 85,
    gender: '女性',
    flagLevel: 'none',
    flagReason: null,
    lastUpdate: '2024年12月12日',
    caregiver: '佐藤 健一',
  },
  {
    id: '4',
    name: '田中 一郎',
    age: 76,
    gender: '男性',
    flagLevel: 'yellow',
    flagReason: '食事量が3日連続で5割以下',
    lastUpdate: '2024年12月13日',
    caregiver: '田中 美咲',
  },
];

export const goalsData: Record<string, GoalsData> = {
  '1': {
    summary: '山田花子様は現在、服薬管理と夜間の安全確保が最優先課題です。食事量の低下と精神面のケアにも注意が必要です。',
    goals: [
      {
        id: 1,
        category: '服薬管理',
        goal: '服薬漏れをゼロにし、自立した服薬習慣を確立する',
        completed: false,
        completedDate: null,
        level: 'red',
        actions: [
          { text: '服薬時間にアラームを設定' },
          { text: '服薬チェックシートの導入' },
          { text: 'ヘルパー訪問時の服薬確認を必須化' },
        ],
      },
      {
        id: 2,
        category: '転倒予防',
        goal: '夜間の転倒事故をゼロにし、安全な夜間移動を習慣化する',
        completed: false,
        completedDate: null,
        level: 'red',
        actions: [
          { text: 'ベッドサイドにセンサーライト設置' },
          { text: 'トイレまでの動線に手すり増設を検討' },
          { text: '夜間のポータブルトイレ導入を検討' },
          { text: '夜間トイレ回数の記録と分析' },
        ],
      },
      {
        id: 3,
        category: '栄養管理',
        goal: '食事摂取量を7割以上に維持し、適切な栄養状態を保つ',
        completed: false,
        completedDate: null,
        level: 'yellow',
        actions: [
          { text: '好みの食材・調理法の把握と反映' },
          { text: '少量多品目の食事提供' },
          { text: '水分摂取の声かけ強化' },
        ],
      },
      {
        id: 4,
        category: '精神面のケア',
        goal: '孤独感を軽減し、社会的つながりを維持する',
        completed: false,
        completedDate: null,
        level: 'yellow',
        actions: [
          { text: '家族との定期的な電話・面会の調整' },
          { text: 'デイサービスでの交流促進' },
          { text: '傾聴の時間を意識的に設ける' },
        ],
      },
      {
        id: 100,
        category: '環境整備',
        goal: 'バリアフリー化を完了し、安全な居住環境を維持する',
        completed: true,
        completedDate: '2024年11月15日',
        level: 'none',
        actions: [
          { text: '玄関の段差解消' },
          { text: '浴室に手すり設置' },
          { text: '滑り止めマット導入' },
        ],
      },
    ],
    notes: 'ご家族との連携を密にし、状態の変化があれば速やかに共有することが重要です。',
  },
  '2': {
    summary: '佐藤太郎様は夜間の排尿管理に注意が必要です。日中の活動量維持と水分調整がポイントです。',
    goals: [
      {
        id: 1,
        category: '排泄管理',
        goal: '夜間トイレ回数を2回以下に抑え、睡眠の質を向上させる',
        completed: false,
        completedDate: null,
        level: 'yellow',
        actions: [
          { text: '夕方以降の水分摂取量を調整' },
          { text: '就寝前のトイレ誘導' },
          { text: '泌尿器科への相談検討' },
        ],
      },
      {
        id: 2,
        category: '活動維持',
        goal: '日中の適度な運動習慣を維持する',
        completed: false,
        completedDate: null,
        level: 'none',
        actions: [
          { text: '朝の散歩を継続' },
          { text: 'デイサービスでの体操参加' },
        ],
      },
    ],
    notes: '血圧管理も並行して確認が必要です。',
  },
  '3': {
    summary: '鈴木和子様は現在安定した状態です。現状維持を目標に、定期的な観察を継続します。',
    goals: [
      {
        id: 1,
        category: '健康維持',
        goal: '現在の良好な状態を維持する',
        completed: false,
        completedDate: null,
        level: 'none',
        actions: [
          { text: '定期的なバイタルチェック' },
          { text: '適度な運動の継続' },
        ],
      },
    ],
    notes: '特に大きな懸念事項はありません。',
  },
  '4': {
    summary: '田中一郎様は食事摂取量の低下が続いています。原因の特定と対策が必要です。',
    goals: [
      {
        id: 1,
        category: '栄養改善',
        goal: '食事摂取量を7割以上に回復させる',
        completed: false,
        completedDate: null,
        level: 'yellow',
        actions: [
          { text: '食事の好みを再確認' },
          { text: '口腔状態のチェック' },
          { text: '少量多回の食事提供' },
        ],
      },
    ],
    notes: '体重の変化にも注意が必要です。',
  },
};

export const logsData: Record<string, Log[]> = {
  '1': [
    {
      id: 1,
      date: '2024年12月13日',
      time: '18:30',
      author: '田中 美咲',
      content: '夕食は8割ほど摂取。お粥と煮物を好んで食べていた。食後の服薬は本人が忘れていたため声かけで対応。19時頃「足が痛い」との訴えあり、様子観察中。',
    },
    {
      id: 2,
      date: '2024年12月13日',
      time: '12:00',
      author: '佐藤 健一',
      content: '昼食は半分程度。食欲があまりない様子。水分摂取を促し、お茶を2杯飲んでもらった。午前中はリビングでテレビを見て過ごされた。',
    },
    {
      id: 3,
      date: '2024年12月12日',
      time: '20:00',
      author: '田中 美咲',
      content: '夜間トイレ3回。2回目の際にふらつきがあったため付き添い。朝の服薬を忘れていたことが判明。明日以降、服薬確認を強化する。',
    },
    {
      id: 4,
      date: '2024年12月12日',
      time: '08:30',
      author: '山本 由美',
      content: '朝食は完食。機嫌よく過ごされている。血圧120/78で安定。デイサービスへ送り出し。',
    },
    {
      id: 5,
      date: '2024年12月11日',
      time: '19:00',
      author: '田中 美咲',
      content: '夕食後に「娘に会いたい」と寂しそうな様子。しばらく傾聴し、落ち着かれた。就寝前の服薬は自分で行えた。',
    },
  ],
  '2': [
    {
      id: 1,
      date: '2024年12月13日',
      time: '07:30',
      author: '山本 由美',
      content: '夜間のトイレは4回。朝の血圧は正常範囲。朝食は完食。',
    },
  ],
  '3': [
    {
      id: 1,
      date: '2024年12月12日',
      time: '17:00',
      author: '佐藤 健一',
      content: '終日穏やかに過ごされた。食事も問題なく摂取。',
    },
  ],
  '4': [
    {
      id: 1,
      date: '2024年12月13日',
      time: '12:30',
      author: '田中 美咲',
      content: '昼食は4割程度の摂取。好物のうどんを提供したが食欲がない様子。',
    },
  ],
};
