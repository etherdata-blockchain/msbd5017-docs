import { type MDXComponents } from 'mdx/types'

import * as mdxComponents from '@/components/shared/mdx'

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    ...mdxComponents,
  }
}
