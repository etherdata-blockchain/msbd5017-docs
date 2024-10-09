import { mdxAnnotations } from 'mdx-annotations'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'

export const remarkPlugins = [
  mdxAnnotations.remark,
  remarkGfm,
  [remarkFrontmatter, ['yaml']],
]
