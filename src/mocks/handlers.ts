import { HttpResponse, http } from 'msw';
import {
  getGetSessionMockHandler,
  getGetSessionSessionIdMockHandler,
  getGetUserUserIdMockHandler,
  getMakeItRESTAPIMock,
  getPostSummarizeMockHandler,
} from '@/lib/generatedApi';
import {
  getGetUserUserIdResponse,
  getSessionResponse,
  getSessionSessionResponse,
  postSummarizeResponse,
} from '@/mocks/customResponse';

export const handlers = [
  http.post(
    // staging の lambda function url
    'https://staging.angel-make-it.com/generate-response',
    async () => {
      const encoder = new TextEncoder();
      const words = [
        'こんに',
        'ちは',
        '！お手',
        '伝いで',
        'きるこ',
        'とがあ',
        'りま',
        'したら',
        '、お気',
        '軽に',
        'お尋',
        'ねくだ',
        'さい',
        '。ど',
        'のよう',
        'なこと',
        'でも',
        '構い',
        'ません',
        '。ご',
        '質問',
        '、ア',
        'ドバ',
        'イス',
        '、情',
        '報提',
        '供な',
        'ど、',
        'できる',
        '限り',
        'サポ',
        'ートさ',
        'せてい',
        'ただ',
        'きます',
        '。参',
        '照した',
        'サイト',
        'はこ',
        'ちら',
        'です',
        '。ht',
        'tp',
        's:',
        '//e',
        'xam',
        'pl',
        'e.',
        'com',
      ];

      const stream = new ReadableStream({
        async start(controller) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          for (const word of words) {
            controller.enqueue(encoder.encode(word));
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          controller.close();
        },
      });

      // Send the mocked response immediately.
      return new HttpResponse(stream, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    },
  ),
  getPostSummarizeMockHandler(postSummarizeResponse),
  getGetSessionMockHandler(getSessionResponse),
  getGetSessionSessionIdMockHandler(getSessionSessionResponse),
  getGetUserUserIdMockHandler(getGetUserUserIdResponse),
  // Response を override する場合はスプレッド構文の前に記述する
  ...getMakeItRESTAPIMock(),
];
