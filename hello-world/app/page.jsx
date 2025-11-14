import React from "react";
import { GradientText } from '@/components/gradient-text';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { SocialIcons } from '@/components/social-icons';
import { Zap, BarChart2, Users, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const page = () => {
  return (
    <div>
      <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/40'>
        <div className='container px-4 md:px-6 flex flex-row items-center'>
          <div className='grid gap-6 lg:grid-cols-2 lg:gap-12 items-center'>
            <div className='space-y-4 flex'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                <GradientText className='text-center'>
                  Discover and Share Crypto Ideas and strategies on Stellar
                </GradientText>
              </h1>
              <p className='max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Hello-World is a decentralized platform for sharing crypto
                insights, analysis, and predictions built on Stellar.
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
      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <GradientText>Platform Features</GradientText>
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to discover, share, and discuss crypto ideas
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 md:mt-12">
              <Card className="bg-background h-full flex flex-col">
                <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
                  <div className="flex flex-col items-center space-y-2 text-center h-full">
                    <div className="p-2 rounded-full bg-primary/10 mb-2">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">Share Ideas</h3>
                    <p className="text-sm sm:text-base text-muted-foreground flex-grow">
                      Contribute your crypto insights and analysis to the community
                    </p>
                    <Link
                      href="/ideas/new"
                      className="text-primary hover:underline inline-flex items-center text-sm sm:text-base mt-auto"
                    >
                      Share Now <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background h-full flex flex-col">
                <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
                  <div className="flex flex-col items-center space-y-2 text-center h-full">
                    <div className="p-2 rounded-full bg-primary/10 mb-2">
                      <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">Market Data</h3>
                    <p className="text-sm sm:text-base text-muted-foreground flex-grow">
                      Access real-time market data and analysis tools
                    </p>
                    <Link
                      href="/market"
                      className="text-primary hover:underline inline-flex items-center text-sm sm:text-base mt-auto"
                    >
                      View Markets <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background h-full flex flex-col">
                <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
                  <div className="flex flex-col items-center space-y-2 text-center h-full">
                    <div className="p-2 rounded-full bg-primary/10 mb-2">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">Community</h3>
                    <p className="text-sm sm:text-base text-muted-foreground flex-grow">
                      Connect with like-minded crypto enthusiasts
                    </p>
                    <Link
                      href="/community"
                      className="text-primary hover:underline inline-flex items-center text-sm sm:text-base mt-auto"
                    >
                      Join Community <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
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
