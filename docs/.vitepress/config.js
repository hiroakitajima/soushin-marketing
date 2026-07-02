export default {
  title: '創新ラボ マーケティング',
  description: 'マーケティング戦略ダッシュボード',
  lang: 'ja-JP',

  themeConfig: {
    nav: [
      { text: 'ホーム', link: '/' },
      { text: '戦略', link: '/marketing-strategy' },
      { text: 'TODO', link: '/todo' },
    ],

    sidebar: [
      {
        text: '🏠 ホーム',
        link: '/',
        collapsed: true,
        items: [
          { text: 'ダッシュボード', link: '/' },
        ]
      },
      {
        text: '✅ 進捗管理',
        link: '/todo',
        collapsed: true,
        items: [
          { text: 'TODO', link: '/todo' },
          { text: 'コーポレートサイト改善', link: '/corporate-site-improvements' },
        ]
      },
      {
        text: '📈 分析',
        link: '/analytics',
        collapsed: true,
        items: [
          { text: '分析', link: '/analytics' },
        ]
      },
      {
        text: '📝 ミーティング',
        link: '/meetings/2026-07-02',
        collapsed: true,
        items: [
          { text: '2026-07-02', link: '/meetings/2026-07-02' },
          { text: '2026-06-25', link: '/meetings/2026-06-25' },
        ]
      },
      {
        text: '📊 戦略・方針',
        link: '/marketing-strategy',
        collapsed: true,
        items: [
          { text: 'マーケティング戦略', link: '/marketing-strategy' },
          { text: '創新ラボ概要', link: '/soushin-lab' },
          { text: 'KASOU', link: '/kasou' },
        ]
      },
      {
        text: '🏆 実績',
        link: '/achievements',
        collapsed: true,
        items: [
          { text: '開発実績', link: '/achievements' },
        ]
      },
      {
        text: '📁 資料',
        link: '/resources',
        collapsed: true,
        items: [
          { text: '資料一覧', link: '/resources' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],

    footer: {
      message: '株式会社創新ラボ — 社内限定'
    }
  }
}
