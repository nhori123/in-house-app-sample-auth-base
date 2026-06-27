// 規定値
export const SITE_NAME: string = 'In house app test';
export const SITE_DESCRIPTION: string = 'これは、In house app testのデスクリプションです。';
export const SITE_TITLE: string = 'In house app test';

// お知らせ
export type Announcement = {
	publishedOn: string;
	content: string;
	expiresOn: string;
};

export const ANNOUNCEMENTS: Announcement[] = [
	{
		// expiresOnは、公開終了日です。expiresOnを含む日付け以降から表示されなくなります。
    publishedOn: '2026-06-20',
		content: 'お知らせ1件目の本文をここに入れます。',
		expiresOn: '2026-06-26',
	},
	{
		publishedOn: '2026-06-21',
		content: 'お知らせ2件目の本文をここに入れます。',
		expiresOn: '2026-06-27',
	},
	{
		publishedOn: '2026-06-22',
		content: 'お知らせ3件目の本文をここに入れます。',
		expiresOn: '2026-06-28',
	},
];