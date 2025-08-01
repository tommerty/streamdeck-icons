import { IconFileText, IconIcons, IconLetterCase, IconPalette, IconTextPlus } from "@tabler/icons-react"
import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from "lucide-react"

import { Badge } from "~/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

interface Props {
    icons?: React.ReactNode
    text?: React.ReactNode
    colors?: React.ReactNode
}

export default function TabPicker({ icons, text, colors }: Props) {
  return (
    <Tabs defaultValue="tab-1" className="items-center w-full">
      <TabsList className="w-full justify-start sticky top-0 h-fit z-50 rounded-t-none">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <TabsTrigger value="tab-1" className="h-full aspect-square p-3">
                  <IconIcons size={16} aria-hidden="true" />
                </TabsTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              Icons
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <TabsTrigger value="tab-2" className="h-full aspect-square p-3">
                    <IconLetterCase size={16} aria-hidden="true" />
                </TabsTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              Text
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <TabsTrigger value="tab-3" className="h-full aspect-square p-3">
                  <IconPalette size={16} aria-hidden="true" />
                </TabsTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs">
              Colors
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TabsList>
      <TabsContent value="tab-1" className="w-full p-3">
        {icons}
      </TabsContent>
      <TabsContent value="tab-2" className="w-full p-3">
        {text}
      </TabsContent>
      <TabsContent value="tab-3" className="w-full p-3">
        {colors}
      </TabsContent>
    </Tabs>
  )
}
