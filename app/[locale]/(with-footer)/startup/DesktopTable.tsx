import { SquareArrowOutUpRight } from 'lucide-react';
// import TagItem from './TagItem';
import { useTranslations } from 'next-intl';

import { STARTUP_LIST } from '@/lib/constants';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import PriceItem from './PriceItem';

export default function DesktopTable() {
  const t = useTranslations('Startup.table');

  return (
    <div className='mx-auto mb-10 hidden w-full max-w-7xl px-4 sm:px-6 lg:block lg:px-8'>
      <Table className='border-separate border-spacing-y-4'>
        <TableHeader>
          <TableRow className='tr-rounded h-16 rounded-lg border-none bg-[#353746] hover:bg-[#353746]'>
            <TableHead className='w-[100px] text-lg font-semibold  text-white'>{t('da')}</TableHead>
            <TableHead className='w-[200px] text-lg font-semibold  text-white'>{t('website')}</TableHead>
            <TableHead className='w-[200px] text-lg font-semibold  text-white'>{t('price')}</TableHead>
            <TableHead className='w-[200px] text-lg font-semibold  text-white'>{t('content')}</TableHead>
            <TableHead className='w-16 text-lg font-semibold  text-white'>{t('submission')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='space-y-4'>
          {STARTUP_LIST.map((item) => (
            <TableRow
              key={item.DA}
              className='tr-rounded h-16 rounded-lg border-none bg-[#2C2D36] shadow-sm transition-all duration-200 hover:bg-[#353746]'
            >
              <TableCell className='text-sm font-medium'>{item.DA}</TableCell>
              <TableCell className='text-base'>{item.Website}</TableCell>
              <TableCell>
                <PriceItem title={item.Price} isFree={item.Price.toLowerCase() === 'free'} />
              </TableCell>
              <TableCell className='text-sm'>{item.Content}</TableCell>
              <TableCell>
                <a
                  href={item.URL}
                  target='_blank'
                  rel='noreferrer'
                  className='flex-center h-10 w-full rounded-md border border-[#686B84] transition-colors duration-200 hover:opacity-80'
                >
                  <SquareArrowOutUpRight className='text-[#686B84]' />
                  <span className='sr-only'>{item.Website}</span>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
