import type { Patient, Activity, CareLog, CarePlan } from '../types';

export const patients: Patient[] = [
  {
    id: '1',
    name: '山田 花子',
    age: 82,
    gender: '女性',
    flagLevel: 'red',
    flagReason: '服薬漏れが2日連続',
    flagDetails: ['12/11 朝の服薬なし', '12/12 朝の服薬なし'],
    lastUpdate: '2時間前',
    caregiver: '田中 美咲',
    phone: '090-1234-5678',
    address: '東京都世田谷区',
    recentLogs: 12,
  },
  {
    id: '2',
    name: '鈴木 太郎',
    age: 78,
    gender: '男性',
    flagLevel: 'yellow',
    flagReason: '夜間トイレ回数が増加傾向',
    flagDetails: ['平均2回→4回/夜'],
    lastUpdate: '4時間前',
    caregiver: '佐藤 健一',
    phone: '090-2345-6789',
    address: '東京都杉並区',
    recentLogs: 8,
  },
  {
    id: '3',
    name: '佐藤 美智子',
    age: 85,
    gender: '女性',
    flagLevel: 'none',
    flagReason: null,
    flagDetails: [],
    lastUpdate: '1日前',
    caregiver: '山本 由美',
    phone: '090-3456-7890',
    address: '東京都目黒区',
    recentLogs: 15,
  },
  {
    id: '4',
    name: '高橋 一郎',
    age: 79,
    gender: '男性',
    flagLevel: 'none',
    flagReason: null,
    flagDetails: [],
    lastUpdate: '3時間前',
    caregiver: '田中 美咲',
    phone: '090-4567-8901',
    address: '東京都渋谷区',
    recentLogs: 10,
  },
  {
    id: '5',
    name: '伊藤 節子',
    age: 88,
    gender: '女性',
    flagLevel: 'yellow',
    flagReason: '食事量が減少傾向',
    flagDetails: ['昼食を半分残すことが増加'],
    lastUpdate: '6時間前',
    caregiver: '佐藤 健一',
    phone: '090-5678-9012',
    address: '東京都新宿区',
    recentLogs: 7,
  },
];

export const recentActivities: Activity[] = [
  { id: 1, patient: '山田 花子', action: '日報が追加されました', time: '2時間前', type: 'log' },
  { id: 2, patient: '鈴木 太郎', action: 'アラートが発生しました', time: '4時間前', type: 'alert' },
  { id: 3, patient: '高橋 一郎', action: 'ルーティンが更新されました', time: '5時間前', type: 'routine' },
  { id: 4, patient: '伊藤 節子', action: '日報が追加されました', time: '6時間前', type: 'log' },
];

export const patientDetail: Patient = {
  id: '1',
  name: '山田 花子',
  age: 82,
  gender: '女性',
  phone: '090-1234-5678',
  address: '東京都世田谷区成城1-2-3',
  caregiver: '田中 美咲',
  careLevel: '要介護2',
  startDate: '2024年4月1日',
  flagLevel: 'red',
  flagReason: '服薬漏れが2日連続',
  flagDetails: ['12/11 朝の服薬なし', '12/12 朝の服薬なし'],
  lastUpdate: '2時間前',
  recentLogs: 12,
};

export const careLogs: CareLog[] = [
  { id: 1, date: '2024年12月13日', time: '18:30', author: '田中 美咲', content: '夕食は8割ほど摂取。お粥と煮物を好んで食べていた。食後の服薬は本人が忘れていたため声かけで対応。19時頃「足が痛い」との訴えあり、様子観察中。' },
  { id: 2, date: '2024年12月13日', time: '12:00', author: '佐藤 健一', content: '昼食は半分程度。食欲があまりない様子。水分摂取を促し、お茶を2杯飲んでもらった。午前中はリビングでテレビを見て過ごされた。' },
  { id: 3, date: '2024年12月12日', time: '20:00', author: '田中 美咲', content: '夜間トイレ3回。2回目の際にふらつきがあったため付き添い。朝の服薬を忘れていたことが判明。明日以降、服薬確認を強化する。' },
  { id: 4, date: '2024年12月12日', time: '08:30', author: '山本 由美', content: '朝食は完食。機嫌よく過ごされている。血圧120/78で安定。デイサービスへ送り出し。' },
  { id: 5, date: '2024年12月11日', time: '19:00', author: '田中 美咲', content: '夕食後に「娘に会いたい」と寂しそうな様子。しばらく傾聴し、落ち着かれた。就寝前の服薬は自分で行えた。' },
];

export const initialCarePlan: CarePlan = {
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
        { text: 'ヘルパー訪問時の服薬確認を必須化' }
      ]
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
        { text: '夜間トイレ回数の記録と分析' }
      ]
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
        { text: '水分摂取の声かけ強化' }
      ]
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
        { text: '傾聴の時間を意識的に設ける' }
      ]
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
        { text: '滑り止めマット導入' }
      ]
    },
  ],
  notes: 'ご家族との連携を密にし、状態の変化があれば速やかに共有することが重要です。',
};
