import { accessCount } from '@/libs/api/app';

export default async ({ route }) => {
  try {
    accessCount(route.name);
  } catch (e) {
    console.warn('アクセスカウントに失敗しました。');
  }
};
