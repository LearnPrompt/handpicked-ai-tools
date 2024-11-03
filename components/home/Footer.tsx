import { HTMLAttributeAnchorTarget } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { CONTACT_US_EMAIL } from '@/lib/env';

function InfoLink({
  href,
  title,
  target,
  type,
}: {
  href: string;
  title: string;
  target?: HTMLAttributeAnchorTarget;
  type?: string;
}) {
  return (
    <Link
      href={href}
      title={title}
      className='whitespace-nowrap text-xs hover:opacity-70 lg:text-sm'
      target={target}
      type={type}
    >
      {title}
    </Link>
  );
}

export default function Footer() {
  const t = useTranslations('Footer');

  const SupportLinks = [
    {
      title: t('tap4'),
      href: 'https://www.learnprompt.pro/',
    },
    {
      title: t('tattoo'),
      href: 'https://tap4.ai/',
    },
  ];

  const INFO_LIST = [
    {
      title: t('privacy'),
      href: '/privacy-policy',
    },
    {
      title: t('termsConditions'),
      href: '/terms-of-service',
    },
  ];

  return (
    <footer className='w-full bg-[#15141A]'>
      <div className='mx-auto flex min-h-[251px] max-w-pc flex-col items-center justify-between p-10 pb-5 lg:min-h-[180px] lg:flex-row lg:px-20'>
        {/* 在大屏幕下左侧logo区域 */}
        <div className='flex flex-col items-center lg:items-start'>
          <h1 className='text-xl font-bold text-white lg:text-2xl'>{t('title')}</h1>
          <h2 className='text-xs lg:text-sm'>{t('subTitle')}</h2>
        </div>
        {/* 在大屏幕下右侧链接区域 */}
        <div className='mt-8 flex flex-col items-center gap-y-8 lg:mt-0 lg:flex-row lg:items-start lg:gap-x-20'>
          <div className='flex flex-col items-center gap-2 lg:items-start'>
            <h2 className='font-bold'>{t('support')}</h2>
            {SupportLinks.map((item) => (
              <a
                href={item.href}
                key={item.href}
                target='_blank'
                rel='noreferrer'
                className='text-xs hover:opacity-70 lg:text-sm'
                title={item.title}
              >
                {item.title}
              </a>
            ))}
          </div>
          <div className='flex flex-col items-center gap-2 lg:items-start'>
            {INFO_LIST.map((item) => (
              <InfoLink key={item.href} href={item.href} title={item.title} />
            ))}
            <a
              href={`mailto:${CONTACT_US_EMAIL}`}
              className='text-xs hover:opacity-70 lg:text-sm'
              title={t('contactUs')}
              type='email'
            >
              {t('contactUs')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
