import Parser from "rss-parser"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"

export function RSSFeedItem({ item }: { item: any }) {
  return (
    <div className="group py-3 mb-3">
      <a
        className="group-hover:underline group-hover:text-pink-500 font-semibold text-md"
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={0}
      >
        {item.title}
      </a>
      <p className="text-sm">
        {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : ""}
      </p>
      <p
        dangerouslySetInnerHTML={{ __html: item.contentSnippet || "" }}
        className="text-xs"
      />
    </div>
  )
}

async function fetchRSSFeed() {
  const parser = new Parser()
  const feed = await parser.parseURL(
    "https://blogs.gov.scot/digital/feed/?t=${new Date().getTime()}"
  )
  return feed.items
}

export default async function RSSFeed() {
  const items = await fetchRSSFeed()
  if (!items)
    return (
      <div>
        <p>No updates available.</p>
      </div>
    )

  return (
    <>
      <div className="flex items-center gap-1 mb-3">
        {" "}
        <h2 className="text-2xl font-semibold">Latest Digital Updates</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger tabIndex={-1} aria-label="infomation-popover">
              {" "}
              <Info className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px] text-xs">
              This is an RSS feed from{" "}
              <a
                className="underline text-blue-300"
                href="https://blogs.gov.scot/digital/"
                target="_blank"
              >
                the Scottish Government Digital Directorate blog.{" "}
              </a>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ScrollArea className="w-full h-96">
        <div className=" divide-y divide-gray-300">
          {items.map((item, index) => (
            <RSSFeedItem key={index} item={item} />
          ))}
        </div>
      </ScrollArea>
    </>
  )
}
