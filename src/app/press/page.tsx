'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FileDown, Newspaper } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { mockPressAssets, mockPressCoverage } from '@/data/mock-data'

export default function PressPage() {
  const { toast } = useToast()
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null)
  const activeAsset = mockPressAssets.find((asset) => asset.id === activeAssetId)

  return (
    <PageShell
      title="Press"
      description="Logos, product imagery, and coverage—everything media partners need to reference Alef Coach accurately and on-brand."
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-[var(--kp-forest)]/12 bg-white shadow-[0_20px_50px_rgba(15,61,44,0.06)]">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 text-[var(--kp-forest)]">
              <FileDown className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Press kit</span>
            </div>
            <h2 className="text-xl font-semibold text-[var(--kp-forest-deep)]">Brand assets & guidelines</h2>
            <p className="text-sm leading-relaxed text-[var(--kp-forest)]/75">
              Use these files for articles, conference slides, and partner decks. When in doubt, preserve clear space around the
              mark and stick to our forest-and-mint palette on light backgrounds.
            </p>
            <div className="grid gap-3">
              {mockPressAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-[var(--kp-forest)]/12 bg-[var(--kp-mint)]/50 px-4 py-4 transition-colors hover:bg-[var(--kp-mint)]/80"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--kp-forest-deep)]">{asset.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--kp-forest)]/70">{asset.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="border-[var(--kp-forest)]/15 bg-white text-[var(--kp-forest-deep)]">{asset.fileType}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-[var(--kp-forest)]/25"
                        onClick={() => setActiveAssetId(asset.id)}
                      >
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-full bg-[var(--kp-forest)] text-white hover:bg-[var(--kp-forest-deep)]"
                        onClick={() =>
                          toast({
                            title: 'Download started',
                            description: `${asset.title} is downloading.`,
                          })
                        }
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="mb-4 flex items-center gap-2 text-[var(--kp-forest)]">
            <Newspaper className="h-5 w-5" />
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--kp-forest-deep)]">
              In the news
            </h2>
          </div>
          <div className="space-y-4">
            {mockPressCoverage.map((item) => (
              <Card
                key={item.id}
                className="border-[var(--kp-forest)]/12 bg-white shadow-[0_12px_40px_rgba(15,61,44,0.05)] transition-transform hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--kp-forest)]/55">
                    {item.outlet}
                  </div>
                  <p className="mt-2 text-sm font-medium leading-snug text-[var(--kp-forest-deep)]">{item.headline}</p>
                  <p className="mt-3 text-xs text-[var(--kp-forest)]/55">{item.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={Boolean(activeAsset)} onOpenChange={() => setActiveAssetId(null)}>
        <DialogContent className="max-w-3xl border-[var(--kp-forest)]/12 bg-white">
          <DialogHeader>
            <DialogTitle className="text-[var(--kp-forest-deep)]">{activeAsset?.title}</DialogTitle>
          </DialogHeader>
          {activeAsset?.previewUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-[var(--kp-forest)]/12 bg-[var(--kp-mint)]/40">
              <Image src={activeAsset.previewUrl} alt={activeAsset.title} fill className="object-cover" />
            </div>
          )}
          <p className="text-sm leading-relaxed text-[var(--kp-forest)]/75">{activeAsset?.description}</p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-full border-[var(--kp-forest)]/25" onClick={() => setActiveAssetId(null)}>
              Close
            </Button>
            <Button
              className="rounded-full bg-[var(--kp-forest)] text-white hover:bg-[var(--kp-forest-deep)]"
              onClick={() =>
                toast({
                  title: 'Download started',
                  description: `${activeAsset?.title} is downloading.`,
                })
              }
            >
              Download {activeAsset?.fileType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
