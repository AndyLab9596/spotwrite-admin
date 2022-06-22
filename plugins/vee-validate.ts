import { extend, localize } from 'vee-validate';
import {
  alpha_spaces,
  required,
  confirmed,
  length,
  max,
  min,
  email,
  numeric,
} from 'vee-validate/dist/rules';
import ja from 'vee-validate/dist/locale/ja.json';

extend('confirmed', confirmed);
extend('email', email);
extend('length', length);
extend('max', max);
extend('min', min);
extend('numeric', numeric);
extend('required', {
  ...required,
  message: (field: any) => `${field}が未入力です。`,
});
extend('alpha_spaces', alpha_spaces);

// ひらがなバリデーション
const hiragana = /^[\u3040-\u309F\u0020\u00A0\u3000\u30FB\u30FC]+$/;
const isHiragana = {
  message: 'ひらがなで入力してください。',
  validate(value: string) {
    return hiragana.test(value);
  },
};
extend('isHiragana', isHiragana);

// 電話番号バリデーション
const phone = /^[0-9]{3,5}[-\s.]?[0-9]{3,5}[-\s.]?[0-9]{3,5}$/;
const phonePattern = {
  message: '電話番号を正しい形式で入力してください。（例）090-0000-0000）',
  validate(value: string) {
    return phone.test(value);
  },
};
extend('phone', phonePattern);

// 郵便番号
const postalCode = /^[0-9]{3}-[0-9]{4}$/;
const postalPattern = {
  message: '郵便番号を正しい形式で入力してください。（例）000-0000）',
  validate(value: string) {
    return postalCode.test(value);
  },
};
extend('postalCode', postalPattern);

localize('ja', ja);

// ひらがなとASCIIバリデーション
const hiraganaAscii = /^[\u3040-\u309F\u0020\u00A0\u3000\u30FB\u30FC\x20-\x7E\uFF10-\uFF19]+$/;
const isHiraganaAscii = {
  message: 'ひらがなで入力してください。',
  validate(value: string) {
    return hiraganaAscii.test(value);
  },
};
extend('isHiraganaAscii', isHiraganaAscii);
