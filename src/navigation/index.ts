import { navigation } from './menu'

interface NavGroup {
  title: string
  links: Array<{
    title: string
    href: string
  }>
}

export { navigation }
export type { NavGroup }
