import { UserUserResponse } from '@/lib/generatedApi';

export const aiResponse = {
  message:
    'こんにちは！\nお手伝いできることがありましたら、お気軽にお尋ねください。\n\nどのようなことでも構いません。\nご質問、アドバイス、情報提供など、できる限りサポートさせていただきます。\n\n参照したサイトはこちらです。 https://example.com',
};

export const postSummarizeResponse = {
  summarizedText:
    'ユーザーは、Amazon の会員登録方法について困っており、AI にサポートを求めました。AI は、Amazon の公式サイトにアクセスして「新規登録」ボタンをクリックし、必要な情報を入力する手順を説明しました。しかし、ユーザーはメールアドレスの認証でエラーが発生し、手順を進めることができませんでした。AI はいくつかのトラブルシューティング手順を提案しましたが、問題が解決せず、AI では対応が難しいと判断しました。そのため、AI はユーザーの問い合わせをサポート担当者にエスカレーションし、担当者が直接問題を解決することになりました。',
};

export const getSessionResponse = {
  sessions: [
    {
      sessionId: '1',
      sessionTitle: 'スマホのバッテリーがすぐに減る原因は？',
      isEscalated: false,
      createdAt: '2024-08-01T08:06:43.753Z',
      updatedAt: '2024-08-02T08:06:43.753Z',
    },
    {
      sessionId: '2',
      sessionTitle: 'Instagramで写真を投稿する方法',
      isEscalated: false,
      createdAt: '2024-09-01T08:06:43.753Z',
      updatedAt: '2024-08-15T08:06:43.753Z',
    },
    {
      sessionId: '3',
      sessionTitle: 'Zoomで会議に参加する方法',
      isEscalated: false,
      createdAt: '2024-09-01T08:06:43.753Z',
      updatedAt: '2024-08-20T08:06:43.753Z',
    },
    {
      sessionId: '4',
      sessionTitle: 'パスワードを忘れた場合の対処法',
      isEscalated: false,
      createdAt: '2024-09-01T08:06:43.753Z',
      updatedAt: '2024-08-25T08:06:43.753Z',
    },
    {
      sessionId: '5',
      sessionTitle: 'YouTubeの動画を保存するには？',
      isEscalated: true,
      createdAt: '2024-09-01T08:06:43.753Z',
      updatedAt: '2024-09-01T08:06:43.753Z',
    },
  ],
  escalatedSessions: [
    {
      sessionId: '6',
      sessionTitle: 'パソコンが遅いと感じたときの対処法',
      isEscalated: true,
      createdAt: '2024-09-01T08:06:43.753Z',
      updatedAt: '2024-08-01T08:06:43.753Z',
    },
    {
      sessionId: '7',
      sessionTitle: '新しいスマホでLINEを引き継ぐ方法',
      isEscalated: true,
      createdAt: '2024-09-01T08:06:43.753Z',
      updatedAt: '2024-09-01T08:06:43.753Z',
    },
    {
      sessionId: '8',
      sessionTitle: 'Wi-Fiに接続できない場合の対処方法',
      isEscalated: true,
      createdAt: '2024-09-01T08:06:43.753Z',
      updatedAt: '2024-09-15T08:06:43.753Z',
    },
    {
      sessionId: '9',
      sessionTitle: 'Amazonにログインする方法',
      isEscalated: true,
      createdAt: '2024-09-01T08:06:43.753Z',
      updatedAt: '2024-09-20T08:06:43.753Z',
    },
    {
      sessionId: '10',
      sessionTitle: 'Gmailで新しいアカウントを作成するには？',
      isEscalated: true,
      createdAt: '2024-09-01T08:06:43.753Z',
      updatedAt: '2024-09-30T08:06:43.753Z',
    },
  ],
};

export const getSessionSessionResponse = {
  sessionId: '01J70J8CGJHR60R8Y88KBKG6A3',
  sessionTitle: 'iPhoneの電源が入らない',
  sessionHistory: [
    {
      role: 'human',
      message:
        '# 質問者の情報\n- OS: iOS\n- ブラウザ: Mobile Safari\n- デバイス: iPhone\niphoneの電源が入らない',
    },

    {
      role: 'ai',
      message:
        '\n\niPhoneの電源が入らない問題は、多くの人が経験する悩みの一つです。この問題には様々な原因があり、簡単な対処法から専門的な修理が必要なケースまであります。まずは、以下のような簡単な対処法を試してみましょう。\n\n1. 充電を確認する：\n   - iPhoneをしばらく充電器につないでみてください。バッテリーが完全に空になっていると、すぐに電源が入らないことがあります。\n\n2. 強制再起動を試す：\n   - iPhoneの機種によって方法が異なりますが、一般的には電源ボタンとホームボタン（または音量ボタン）を同時に長押しします。\n\n3. 充電ケーブルと電源アダプタを確認する：\n   - 別の充電器で試してみてください。ケーブルや電源アダプタの不具合が原因の可能性があります。\n\n4. 物理的な損傷がないか確認する：\n   - iPhoneを落としたり、水に濡らしたりしていないか思い出してください。\n\nこれらの方法で解決しない場合は、Apple Storeや認定修理店に相談することをおすすめします。また、日頃からiPhoneのデータをバックアップしておくことで、万が一の際にも安心です。\n\n最後に、iPhoneの電池の寿命を延ばすために、適切な充電習慣を身につけることも大切です。例えば、極端な高温や低温の環境を避けたり、純正の充電器を使用したりすることが挙げられます。\n\n## 参考になるサイト\n- https://www.apple.com/jp/support/iphone/\n- https://support.apple.com/ja-jp/HT201412',
    },
    {
      role: 'human',
      message: '強制再起動ってどうやるの？',
    },
    {
      role: 'ai',
      message:
        'iPhoneの強制再起動の方法は、お使いのiPhoneの機種によって少し異なります。ですが、心配しないでください。基本的な考え方は同じで、特定のボタンを同時に押すことで行います。\n\n一般的な方法をご紹介しますね：\n\n1. 新しいiPhone（iPhone 8以降、iPhoneXシリーズ、iPhone 11シリーズなど）の場合：\n   - まず、音量を上げるボタンを短く押します。\n   - 次に、音量を下げるボタンを短く押します。\n   - そして、横にある電源ボタン（スリープ/スリープ解除ボタン）を長押しします。\n   - Appleのロゴが表示されるまで、そのまま押し続けてください。\n\n2. 古いiPhone（iPhone 7以前）の場合：\n   - ホームボタン（画面の下にある丸いボタン）と電源ボタンを同時に長押しします。\n   - Appleのロゴが表示されるまで、そのまま押し続けてください。\n\nこの操作を行うと、iPhoneが一度完全に電源が切れてから、再び起動します。これにより、小さな不具合や動作の遅さなどが解消されることがあります。\n\nただし、強制再起動をしても問題が解決しない場合は、他の対処法を試すか、専門店に相談することをおすすめします。\n\nまた、強制再起動を頻繁に行う必要がある場合は、iPhoneに何か問題がある可能性があります。その場合は、専門家に相談することをおすすめします。\n\n## 参考になるサイト\n- https://support.apple.com/ja-jp/HT201412\n- https://www.apple.com/jp/support/iphone/',
    },
    {
      role: 'human',
      message: '上手くいかない ',
    },
    {
      role: 'ai',
      message:
        'iPhoneの強制再起動がうまくいかない場合、焦らずに以下の手順を試してみてください。\n\n1. 正しい操作方法の確認：\nお使いのiPhoneの機種に合った正しい強制再起動の方法を再確認しましょう。例えば、iPhone 8以降の場合は次の手順です。\n- 音量を上げるボタンを押してすぐ離す\n- 音量を下げるボタンを押してすぐ離す\n- 横のボタン（電源ボタン）を長押しし、Appleのマークが出るまで待つ\n\n2. 充電を確認：\nバッテリーが空っぽになっている可能性があります。充電器につないで30分ほど待ってから、再度試してみてください。\n\n3. ボタンの確認：\n使用するボタンが壊れていないか確認しましょう。ボタンが押しにくい場合は、専門店での修理が必要かもしれません。\n\n4. 画面操作での再起動：\nもし画面が反応する場合は、設定から「AssistiveTouch」という機能をオンにして、画面上のボタンで再起動を試みることができます。\n\n5. パソコンを使った復旧：\nパソコンにiTunesをインストールし、iPhoneを特別なモード（リカバリーモード）で接続すると、問題が解決できる場合があります。\n\n6. セーフモードからの脱出：\nもしiPhoneがセーフモード（特別な状態）に入っている場合は、強制再起動で通常の状態に戻れることがあります。\n\n7. 専門店に相談：\n上記の方法で解決しない場合は、Apple Storeや認定修理店に相談しましょう。専門的な診断や修理が必要な可能性があります。\n\nこれらの方法を順番に試してみてください。iPhoneの調子が悪いときは、焦らずゆっくりと対処することが大切です。また、普段からデータのバックアップを取っておくと安心です。\n\n## 参考になるサイト\n- https://support.apple.com/ja-jp/HT201412\n- https://www.apple.com/jp/support/iphone/',
    },
  ],
  isEscalated: false,
  createdAt: '2024-08-31T00:00:00.000Z',
  updatedAt: '2024-09-01T08:06:43.753Z',
};

export const getGetUserUserIdResponse: UserUserResponse = {
  userId: '12345678-1234-1234-1234-123456789012',
  displayName: 'けんた',
  email: 'kenta.nakamura@serverworks.co.jp',
  sessionIds: ['01FJZHDEYJW7RAPZBYHXJ64EFA'],
  escalatedSessionIds: ['01FJZHDEYJW7RAPZBYHXJ64EFA'],
  inviter: '23456789-2345-2345-2345-234567890123',
};
