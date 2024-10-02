'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border-b border-gray-200'>
      <button
        type='button'
        className='flex w-full items-center justify-between py-4 text-left text-lg font-medium focus:outline-none'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDown className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className='pb-4 text-gray-600'>{children}</div>
      </div>
    </div>
  );
}

export default function Faq() {
  const t = useTranslations('Faq');

  return (
    <div className='mx-auto max-w-3xl space-y-8 px-4 pb-5'>
      <h1 className='mb-8 text-center text-3xl font-bold'>{t('title')}</h1>
      <div className='space-y-2'>
        <FaqItem question={t('1.question')}>{t('1.answer')}</FaqItem>
        <FaqItem question={t('2.question')}>
          <p>{t('2.answer-1')}</p>
          <p className='mt-2'>{t('2.answer-2')}</p>
          <p className='mt-2'>{t('2.answer-3')}</p>
        </FaqItem>
        <FaqItem question={t('3.question')}>
          <p>{t('3.answer-1')}</p>
          <p className='mt-2'>{t('3.answer-2')}</p>
        </FaqItem>
        <FaqItem question={t('4.question')}>{t('4.answer')}</FaqItem>
        <FaqItem question={t('5.question')}>{t('5.answer')}</FaqItem>
        <FaqItem question={t('6.question')}>{t('6.answer')}</FaqItem>
        <FaqItem question={t('7.question')}>{t('7.answer')}</FaqItem>
        <FaqItem question={t('8.question')}>{t('8.answer')}</FaqItem>
      </div>
    </div>
  );
}
