import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/db/supabase/client';
import { CircleArrowRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Separator } from '@/components/ui/separator';
import BaseImage from '@/components/image/BaseImage';
import MarkdownProse from '@/components/MarkdownProse';

export async function generateMetadata({
  params: { locale, websiteName },
}: {
  params: { locale: string; websiteName: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.ai',
  });
  const { data } = await supabase.from('web_navigation').select().eq('name', websiteName);

  if (!data || !data[0]) {
    notFound();
  }

  return {
    title: `${data[0].title} | ${t('titleSubfix')}`,
    description: data[0].content,
  };
}

export default async function Page({ params: { websiteName } }: { params: { websiteName: string } }) {
  const supabase = createClient();
  const t = await getTranslations('Startup.detail');

  const locale = await getLocale();
  console.log(locale); // 可能输出 "en" 或 "zh-CN" 等

  const localeMap = {
    cn: 'zh-CN',
    tw: 'zh-TW',
    en: 'en', // Ensure 'en' is mapped to itself
  };

  const localeNew = locale in localeMap ? localeMap[locale as keyof typeof localeMap] : 'en';
  console.log(localeNew); // 可能输出 "en" 或 "zh-CN" 等

  let data;

  if (locale === 'en') {
    // 对于英文，使用原来的查询方式
    const { data: dataList } = await supabase
      .from('web_navigation')
      .select('title, content, url, thumbnail_url, detail')
      .eq('name', websiteName);
    if (!dataList || dataList.length === 0) {
      notFound();
    }
    [data] = dataList; // 使用数组解构来满足 ESLint 规则
  } else {
    // 对于其他语言，使用新的多语言查询方式
    const { data: dataList, error } = await supabase
      .from('web_navigation')
      .select(
        `
        url, thumbnail_url,
        translations:web_navigation_translations!inner(title, content, detail)
      `,
      )
      .eq('name', websiteName) // Ensure this matches the web_navigation table
      .eq('translations.web_navigation_name', websiteName) // Ensure this matches the translations table
      .eq('translations.locale', localeNew)
      .single();

    if (error) {
      console.error('Error fetching data:', error);
    }

    if (!dataList) {
      console.warn('No data returned for:', websiteName, 'with locale:', localeNew);
    }

    if (error || !dataList) {
      notFound();
    }

    const [translation] = dataList.translations; // 使用数组解构来获取第一个翻译

    data = {
      url: dataList.url,
      thumbnail_url: dataList.thumbnail_url,
      title: translation.title,
      content: translation.content,
      detail: translation.detail,
    };
  }

  // 去掉前后多余的空格
  const trimmedUrl = data.url.trim();

  // 生成 shareUrl
  const visitWebsiteUrl = trimmedUrl.endsWith('/')
    ? `${trimmedUrl}?utm_source=pickai-tools&utm_medium=referral`
    : `${trimmedUrl}/?utm_source=pickai-tools&utm_medium=referral`;

  return (
    <div className='w-full'>
      <div className='flex flex-col px-6 py-5 lg:h-[323px] lg:flex-row lg:justify-between lg:px-0 lg:py-10'>
        <div className='flex flex-col items-center lg:items-start'>
          <div className='space-y-1 text-balance lg:space-y-3'>
            <h1 className='text-2xl lg:text-5xl'>{data.title}</h1>
            <h2 className='text-xs lg:text-sm'>{data.content}</h2>
          </div>
          <a
            href={visitWebsiteUrl}
            target='_blank'
            rel='noreferrer'
            className='flex-center mt-5 min-h-5 w-full gap-1 rounded-[8px] bg-white p-[10px] text-sm capitalize text-black hover:opacity-80 lg:mt-auto lg:w-[288px]'
          >
            {t('visitWebsite')} <CircleArrowRight className='size-[14px]' />
          </a>
        </div>
        <a
          href={visitWebsiteUrl}
          target='_blank'
          rel='noreferrer'
          className='flex-center group relative h-[171px] w-full flex-shrink-0 lg:h-[234px] lg:w-[466px]'
        >
          <BaseImage
            title={data.title}
            alt={data.title}
            // width={466}
            // height={243}
            fill
            src={data.thumbnail_url || ''}
            className='absolute mt-3 aspect-[466/234] w-full rounded-[16px] border border-[#424242] bg-[#424242] bg-cover lg:mt-0'
          />
          <div className='absolute inset-0 z-10 hidden items-center justify-center gap-1 rounded-[16px] bg-black bg-opacity-50 text-2xl text-white transition-all duration-200 group-hover:flex'>
            {t('visitWebsite')} <CircleArrowRight className='size-5' />
          </div>
        </a>
      </div>
      <Separator className='bg-[#010101]' />
      <div className='mb-5 px-3 lg:px-0'>
        <h2 className='my-5 text-2xl text-white/40 lg:my-10'>{t('introduction')}</h2>
        <MarkdownProse markdown={data?.detail || ''} />
      </div>
    </div>
  );
}
