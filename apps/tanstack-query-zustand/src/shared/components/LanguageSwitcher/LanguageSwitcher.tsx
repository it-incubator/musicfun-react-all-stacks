import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components'
import { LanguageIcon } from '@/shared/icons/LanguageIcon'
import { setLocale } from '@/shared/utils/set-locale'

export const LanguageSwitcher = () => {
  const languageDisplayNames: Record<string, string> = {
    en: 'English',
    ru: 'Русский',
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <LanguageIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setLocale('en')
          }}>
          {languageDisplayNames['en']}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setLocale('ru')
          }}>
          {languageDisplayNames['ru']}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
