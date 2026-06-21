'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { ChangeEvent, useTransition } from 'react';

export const LanguageSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      // Replace the current locale with the next one
      const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);
      router.replace(newPathname);
    });
  };

  return (
    <div className="relative">
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
        className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="zh">ZH</option>
        <option value="ar">AR</option>
      </select>
    </div>
  );
};
