import Link from 'next/link';
import AdUnit from '../components/AdUnit';
import ClientGameWrapper from '../components/ClientGameWrapper';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 overflow-x-hidden">

      {/* Header */}
      <h1 className="text-3xl md:text-5xl font-extrabold my-4 text-green-700 tracking-tight text-center">
        🪰 Are you bored? SWAT Flies!
      </h1>
      <div style={{
        background: "#349a68",
        padding: "20px",
        borderRadius: "8px",
        color: "white",
        textAlign: "center",
        margin: "20px 0"
      }}>
        <h2 style={{ margin: 0 }}>Quick Break From Building Shopdibz 🚀</h2>
        <p style={{ marginTop: "10px", fontSize: "16px" }}>
          Check out our marketplace:{" "}
          <a
            href="https://www.shopdibz.com?utm_source=fly-swatter&utm_medium=organic"
            target="_blank"
            style={{ color: "white", fontWeight: "bold", textDecoration: "underline" }}
          >
            High-Quality Indian Brands
          </a>
        </p>
      </div>
      {/* Top Banner Ad */}
      {/* <div className="w-full max-w-4xl px-2">
        <AdUnit slotId="5417239946" />
      </div> */}

      <Link href={"https://www.shopdibz.com/download-app?utm_source=fly-swatter&utm_medium=organic"} target='_blank'>
        <img src="/Download_Shopdibz_App.webp" width={600} style={{ marginBottom: "0px" }} />
      </Link>

      {/* Main Content Row */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mt-2 justify-center px-2 md:px-4">

        {/* Left Ad (Desktop Only) */}
        {/* <div className="hidden lg:block w-[160px] flex-shrink-0">
          <AdUnit slotId="1499720824" format="auto" layout="display" />
        </div> */}

        {/* Game Area (Flexible Width) */}
        <div className="flex-1 w-full flex flex-col items-center">
          <ClientGameWrapper />
        </div>

        {/* Right Ad (Desktop Only) */}
        {/* <div className="hidden lg:block w-[160px] flex-shrink-0">
          <AdUnit slotId="2020920413" format="auto" layout="display" />
        </div> */}
      </div>

      <Link href={"https://www.shopdibz.com/download-app?utm_source=fly-swatter&utm_medium=organic"} target='_blank'>
        <img src="/SwipeBuzz Banner.webp" width={400} style={{ marginBottom: "15px" }} />
      </Link>


      {/* Bottom Banner Ad */}
      {/* <div className="w-full max-w-4xl mt-8 px-2">
        <AdUnit slotId="1477994933" />
      </div> */}
    </main>
  );
}
