'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/db/supabase/client';
import type { WebNavigation } from '@/db/supabase/types';
import { useLocale } from 'next-intl';

import WebNavCard from './WebNavCard';

export default function WebNavCardList({ dataList }: { dataList: WebNavigation[] }) {
  const supabase = createClient();
  const locale = useLocale();
  const [translatedDataList, setTranslatedDataList] = useState<WebNavigation[]>([]); // Add type annotation

  useEffect(() => {
    const fetchTranslatedData = async () => {
      const localeMap = {
        cn: 'zh-CN',
        tw: 'zh-TW',
        en: 'en',
      };

      const localeNew = locale in localeMap ? localeMap[locale as keyof typeof localeMap] : 'en';

      const translatedList = await Promise.all(
        dataList.map(async (item) => {
          if (locale !== 'en') {
            const { data: dataTrList } = await supabase
              .from('web_navigation_translations')
              .select('title, content')
              .eq('web_navigation_name', item.name)
              .eq('locale', localeNew);
            if (dataTrList && dataTrList.length > 0) {
              return { ...item, title: dataTrList[0].title, content: dataTrList[0].content };
            }
          }
          return item;
        }),
      );
      setTranslatedDataList(translatedList);
    };

    fetchTranslatedData();
  }, [locale, dataList, supabase]); // 添加 supabase 到依赖数组

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {translatedDataList.map((item) => (
        <div key={item.id}>
          <WebNavCard key={item.id} {...item} />
        </div>
      ))}
    </div>
  );
}
