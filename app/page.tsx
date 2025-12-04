import Link from 'next/link';
import AdUnit from '../components/AdUnit';
import ClientGameWrapper from '../components/ClientGameWrapper';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 overflow-x-hidden">

      {/* Header */}
      <h1 className="text-3xl md:text-5xl font-extrabold my-4 text-green-700 tracking-tight text-center">
        🪰 Fly SWAT!
      </h1>
      <p style={{ textAlign: "center" }}>Took a break while developing <strong>Shopdibz </strong> marketplace. <br />
        Check us out: <a href='https://www.shopdibz.com' target='_blank' style={{ textDecoration: "none" }}>Shop High Quality Indian brands</a></p>

      {/* Top Banner Ad */}
      <div className="w-full max-w-4xl px-2">
        <AdUnit slotId="5417239946" />
      </div>

      {/* Main Content Row */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mt-2 justify-center px-2 md:px-4">

        {/* Left Ad (Desktop Only) */}
        <div className="hidden lg:block w-[160px] flex-shrink-0">
          <AdUnit slotId="1499720824" format="auto" layout="display" />
        </div>

        {/* Game Area (Flexible Width) */}
        <div className="flex-1 w-full flex flex-col items-center">
          <ClientGameWrapper />
        </div>

        {/* Right Ad (Desktop Only) */}
        <div className="hidden lg:block w-[160px] flex-shrink-0">
          <AdUnit slotId="2020920413" format="auto" layout="display" />
        </div>
      </div>

      <Link href={"https://www.shopdibz.com/download-app"} target='_blank'>
        <img src="/SwipeBuzz Banner.webp" width={400} style={{ marginBottom: "15px" }} />
      </Link>


      {/* Bottom Banner Ad */}
      <div className="w-full max-w-4xl mt-8 px-2">
        <AdUnit slotId="1477994933" />
      </div>
    </main>
  );
}
