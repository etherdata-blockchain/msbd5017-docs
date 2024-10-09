import { mdxAnnotations } from 'mdx-annotations'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import callouts from 'remark-callouts'

export const remarkPlugins = [
  mdxAnnotations.remark,
  callouts,
  remarkGfm,
  [remarkFrontmatter, ['yaml']],
]
