import Image from 'next/image';
import Link from 'next/link';
import { WebNavigation } from '@/db/supabase/types';
import { CircleArrowRight, SquareArrowOutUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatNumber } from '@/lib/utils/formatNumber';

export default function WebNavCard({ name, thumbnail_url, title, url, content, monthly_visits }: WebNavigation) {
  const t = useTranslations('Home');
  const formattedVisits = formatNumber(monthly_visits);

  // 去掉前后多余的空格
  const trimmedUrl = url.trim();

  // 生成 shareUrl
  const shareUrl = trimmedUrl.endsWith('/')
    ? `${trimmedUrl}?utm_source=pickai-tools&utm_medium=referral`
    : `${trimmedUrl}/?utm_source=pickai-tools&utm_medium=referral`;

  return (
    <div className='flex h-[210px] flex-col gap-3 rounded-xl bg-[#5A5A5A] p-1 lg:h-[343px]'>
      <Link href={`/ai/${name}`} title={title} className='group relative'>
        <img
          src={thumbnail_url || ''}
          alt={title}
          title={title}
          width={310}
          height={174}
          className='aspect-[310/174] w-full rounded-xl bg-white/40 hover:opacity-70'
        />
        <div className='absolute inset-0 z-10 hidden items-center justify-center gap-1 rounded-xl bg-black bg-opacity-50 text-xl text-white transition-all duration-200 group-hover:flex'>
          {t('checkDetail')} <CircleArrowRight className='size-4' />
        </div>
      </Link>
      <div className='flex items-center justify-between px-[6px]'>
        <a href={shareUrl} title={title} target='_blank' rel='nofollow noreferrer' className='hover:opacity-70'>
          <h3 className='line-clamp-1 flex-1 text-sm font-bold lg:text-base'>{title}</h3>
        </a>
        <a href={shareUrl} title={title} target='_blank' rel='nofollow noreferrer' className='hover:opacity-70'>
          <SquareArrowOutUpRight className='size-5' />
          <span className='sr-only'>{title}</span>
        </a>
      </div>
      <p className='line-clamp-3 px-[6px] text-xs text-white/70 lg:line-clamp-5 lg:text-sm'>{content}</p>
      <div className='mt-auto flex items-center px-[6px]'>
        <Image
          src='/images/SimilarWebLogo.svg'
          alt='Similarweb'
          width={20}
          height={20}
          className='mr-2'
          style={{ backgroundColor: 'transparent', border: 'none' }} // 确保没有背景和边框
        />
        <span className='text-xs text-white/70'>{formattedVisits === 'N/A' ? '--' : `${formattedVisits}`}</span>
      </div>
    </div>
  );
}
