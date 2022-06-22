import FormData from 'form-data';
import { getS3PresignedPostData, uploadFileToS3 } from '@/libs/api/app';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

type ChatMessageIdentifier = {
  timestamp: number;
  user_uuid: string;
};

export const splitChatMessageIdentifier = (
  id: string
): ChatMessageIdentifier => {
  const chunk = id.split('_');

  return {
    timestamp: parseInt(chunk[0], 10),
    user_uuid: chunk[1],
  };
};

export const uploadToS3 = async (
  file: File,
  data: AppApiResponse.PresignedPost
) => {
  const formData = new FormData();
  formData.append('Content-Type', file.type);
  Object.entries(data.form_inputs).forEach(([key, value]: string[]) => {
    formData.append(key, value);
  });
  formData.append('file', file);
  const headers = {
    'content-type': data.form_attributes.enctype,
  };
  await uploadFileToS3(data.form_attributes.action, formData, headers);
  const key = data.form_inputs.key.replace(/^uploads\//g, 'public/');
  return `${data.form_attributes.action}/${key}`;
};

export const presignedPost = async (file: File, withFileName: Boolean) => {
  const { data } = withFileName
    ? await getS3PresignedPostData(file.name)
    : await getS3PresignedPostData();
  const fileUrl = await uploadToS3(file, data);
  return fileUrl;
};

export const getResizedImage = (url: string) => {
  return new Promise(
    (resolve: (value?: void) => void, reject: (reason?: any) => void) => {
      let c = 0;
      const id = setInterval(() => {
        // Run 60times, 3s each, total 3mins to check result
        // Increase exec time for convert Videos
        if (c > 60) {
          clearInterval(id);
          reject(new Error('upload error'));
        }
        axios
          .head(url)
          .then(() => {
            clearInterval(id);
            resolve();
          })
          .catch(() => {
            c += 1;
          });
      }, 3000);
    }
  );
};

const isDisplayRoomNameUsers = (room: AppApiResponse.MessageRoom) => {
  return room.room_uuid && room.users && !room.is_dm;
};

const isDisplayRoomNameDM = (room: AppApiResponse.MessageRoom) => {
  return room.room_uuid && room.users && room.is_dm;
};

export const getRoomName = (
  room: AppApiResponse.MessageRoom,
  loginUser: AppApiResponse.User
) => {
  let name = '';
  if (!room) return name;
  if (room.name) {
    name = room.name;
  } else if (isDisplayRoomNameUsers(room)) {
    const { users } = room;
    name = users
      .map((user: { name: string; uuid: string }) => user.name)
      .sort((x: string, y: string) => x.localeCompare(y, 'ja'))
      .join(',');
  } else if (isDisplayRoomNameDM(room)) {
    const { users } = room;
    name =
      users.length === 1
        ? users[0].name
        : users
            .filter(
              (user: { name: string; uuid: string }) =>
                user.uuid !== loginUser.uuid
            )
            .map((user: { name: string; uuid: string }) => user.name)
            .sort((x: string, y: string) => x.localeCompare(y, 'ja'))
            .join(',');
  }
  return name;
};

export default {
  splitChatMessageIdentifier,
};
