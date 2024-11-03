import Image from 'next/image';
import Link from 'next/link';
import { WebNavigation } from '@/db/supabase/types';
import { CircleArrowRight, SquareArrowOutUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatNumber } from '@/lib/utils/formatNumber';

export default function WebNavCard({ name, thumbnail_url, title, url, content, monthly_visits }: WebNavigation) {
  const t = useTranslations('Home');
  const formattedVisits = formatNumber(monthly_visits);

  const trimmedUrl = url.trim();
  const shareUrl = trimmedUrl.endsWith('/')
    ? `${trimmedUrl}?utm_source=pickai-tools&utm_medium=referral`
    : `${trimmedUrl}/?utm_source=pickai-tools&utm_medium=referral`;

  return (
    <div className='relative flex h-full min-h-[210px] flex-col gap-3 rounded-xl bg-[#5A5A5A] p-3'>
      <Link href={`/ai/${name}`} title={title} className='group relative'>
        <div className='aspect-[16/9] w-full overflow-hidden rounded-xl'>
          <Image
            src={thumbnail_url || ''}
            alt={title}
            title={title}
            width={620}
            height={348}
            className='h-full w-full object-cover object-center transition-opacity hover:opacity-70'
          />
        </div>
        <div className='absolute inset-0 z-10 hidden items-center justify-center gap-1 rounded-xl bg-black bg-opacity-50 text-xl text-white transition-all duration-200 group-hover:flex'>
          {t('checkDetail')} <CircleArrowRight className='size-4' />
        </div>
      </Link>
      <div className='flex flex-1 flex-col'>
        <div className='mb-2 flex items-start justify-between gap-2'>
          <a href={shareUrl} title={title} target='_blank' rel='nofollow noreferrer' className='hover:opacity-70'>
            <h3 className='line-clamp-1 flex-1 text-sm font-bold lg:text-base'>{title}</h3>
          </a>
          <a
            href={shareUrl}
            title={title}
            target='_blank'
            rel='nofollow noreferrer'
            className='flex-shrink-0 hover:opacity-70'
          >
            <SquareArrowOutUpRight className='size-5' />
            <span className='sr-only'>{title}</span>
          </a>
        </div>
        <p className='mb-auto line-clamp-2 text-xs text-white/70 lg:line-clamp-3 lg:text-sm'>{content}</p>
      </div>
      <div className='mt-2 flex items-center rounded-lg bg-[#5A5A5A] py-1'>
        <Image
          src='/images/SimilarWebLogo.svg'
          alt='Similarweb'
          width={20}
          height={20}
          className='mr-2'
          style={{ backgroundColor: 'transparent', border: 'none' }}
        />
        <span className='text-xs text-white/70'>{formattedVisits === 'N/A' ? '--' : formattedVisits}</span>
      </div>
    </div>
  );
}
