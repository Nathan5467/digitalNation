import RSSFeed from "@/components/RSSFeed"

export default async function Home() {
  return (
    <main>
      <section
        className="hero-section bg-cover bg-center py-20"
        aria-labelledby="hero-heading"
        role="region"
      >
        <div className="container mx-auto px-6 text-center">
          <h1
            id="hero-heading"
            className="text-4xl font-bold mb-4 tracking-tight"
          >
            Building trust in the digital era: achieving Scotland&apos;s
            aspirations as an ethical digital nation
          </h1>
          <p
            className="text-md mb-8 mx-auto max-w-[50%]"
            aria-describedby="hero-description"
          >
            Explore Scotland&apos;s vision for an ethical digital future, and
            discover how we are building trust through technological innovation.
          </p>
          <a
            target="_blank"
            href="https://www.gov.scot/publications/building-trust-digital-era-achieving-scotlands-aspirations-ethical-digital-nation/pages/2/"
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-full mt-3"
            aria-label="Read the full report on building trust in the digital era"
          >
            Read the Report
          </a>
        </div>
      </section>
      <RSSFeed />
    </main>
  )
}
