import { Theme, translations } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { I18n } from 'aws-amplify/utils';
import theme from '@/theme';

// Amplify の初期化
Amplify.configure({
  auth: {
    user_pool_id: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    aws_region: 'ap-northeast-1',
    user_pool_client_id: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    mfa_methods: [],
    standard_required_attributes: ['email'],
    username_attributes: ['email'],
    user_verification_types: ['email'],
    mfa_configuration: 'NONE',
    password_policy: {
      min_length: 8,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: true,
      require_uppercase: true,
    },
    unauthenticated_identities_enabled: true,
  },
  version: '1',
});

// Amplify の日本語対応
I18n.putVocabularies(translations);
I18n.setLanguage('ja');
I18n.putVocabulariesForLanguage('ja', {
  'User does not exist.': 'ユーザーが存在しません。',
  'Password must have at least 8 characters':
    'パスワードは少なくとも8文字必要です。',
  'Password must have upper case letters': 'パスワードに大文字が必要です。',
  'Password must have numbers': 'パスワードに数字が必要です。',
  'Password must have special characters': 'パスワードに特殊文字が必要です。',
  'Your passwords must match': 'パスワードが一致しません。',
  'Invalid verification code provided, please try again.':
    '無効な検証コードが提供されました。もう一度お試しください。',
});

// Amplify のテーマ設定
// NOTE: https://ui.docs.amplify.aws/react/connected-components/authenticator/customization#styling
export const amplifyTheme: Theme = {
  name: 'myCustomTheme',

  tokens: {
    components: {
      button: {
        primary: {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          _hover: {
            backgroundColor: theme.palette.primary.dark,
          },
        },
        link: {
          color: theme.palette.primary.main,
          _hover: {
            color: theme.palette.primary.dark,
            backgroundColor: 'transparent',
          },
        },
        _hover: {
          backgroundColor: 'transparent',
          borderColor: theme.palette.primary.main,
        },
        _active: {
          backgroundColor: 'translations',
        },
      },
      tabs: {
        item: {
          _active: {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
          },
          _hover: {
            color: theme.palette.primary.dark,
          },
        },
      },
    },
  },
};
