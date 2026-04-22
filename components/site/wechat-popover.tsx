'use client'

import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTranslations } from 'next-intl'

export function WeChatPopover() {
  const t = useTranslations('common')
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="WeChat">
          <MessageCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 text-center">
        <p className="mb-2 text-sm font-medium">{t('wechatTitle')}</p>
        <div className="relative mx-auto h-40 w-40 bg-muted">
          <Image
            src="/brand/wechat-qr.svg"
            alt="WeChat QR"
            fill
            className="object-contain"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{t('wechatHint')}</p>
      </PopoverContent>
    </Popover>
  )
}
