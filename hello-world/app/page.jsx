import React from "react";
import { GradientText } from './components/gradientText';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { SocialIcons } from './components/social-icons';

const page = () => {
  return (
    <div>
      <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/40'>
        <div className='container px-4 md:px-6 flex flex-row items-center'>
          <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
            <div className='space-y-4 flex'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                <GradientText className='text-center'>
                  Discover and Share Crypto Ideas and strategies on starknet
                </GradientText>
              </h1>
              <p className='max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Hello-World is a decentralized platform for sharing crypto
                insights, analysis, and predictions built on StarkNet.
              </p>
            </div>
            <div className='mx-auto lg:mx-0 f w-full max-w-[500px]'>
              <div className='aspect-video flex rounded-xl bg-muted/60 overflow-hidden'>
                <Image
                  src='/logo.jpg'
                  alt='Platform preview'
                  width={100}
                  height={100}
                  className='object-cover w-full h-full'
                />
              </div>
              <div className='flex flex-row gap-4 justify-center mb-6 mt-2 min-[400px]:flex-row'>
                <Link href='/ideas'>
                  <Button size='lg'>Explore Ideas</Button>
                </Link>
                <Link href='/ideas/new'>
                  <Button variant='outline' size='lg'>
                    Share Your Idea
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Hello-World Logo"
              width={24}
              height={24}
              className="rounded-sm"
            />
            <p className="text-xs sm:text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Hello-World. All rights
              reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SocialIcons />
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-xs sm:text-sm text-muted-foreground hover:underline underline-offset-4"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs sm:text-sm text-muted-foreground hover:underline underline-offset-4"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default page;
