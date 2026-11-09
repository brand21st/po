import { useEffect } from 'react';
import { SHOW } from '@flower/shared';
import { Gallery } from '@/sections/Gallery';
import { Gardens } from '@/sections/Gardens';
import { GoldenHour } from '@/sections/GoldenHour';
import { Hero } from '@/sections/Hero';
import { Newsletter } from '@/sections/Newsletter';
import { Numbers } from '@/sections/Numbers';
import { Schedule } from '@/sections/Schedule';
import { Seasons } from '@/sections/Seasons';
import { Story } from '@/sections/Story';
import { TicketsCta } from '@/sections/TicketsCta';

export function HomePage() {
  useEffect(() => {
    document.title = `${SHOW.fullName} · ${SHOW.datesLabel}`;
  }, []);

  return (
    <>
      <Hero />
      <Story />
      <Gardens />
      <Seasons />
      <GoldenHour />
      <Numbers />
      <Schedule />
      <Gallery />
      <TicketsCta />
      <Newsletter />
    </>
  );
}
