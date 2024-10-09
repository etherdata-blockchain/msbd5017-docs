import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import * as crypto from 'crypto'

class MDXMenuPlugin {
  lastContentHash = ''

  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync(
      'MDXMenuPlugin',
      (compilation, callback) => {
        const appDir = path.join(compiler.context, 'src', 'app')
        const menu = this.buildMenu(appDir)
        // Filter out the 'app' entry and only keep its links
        const filteredMenu = menu && menu.title === 'app' ? menu.links : menu
        const tsContent = this.generateTypeScriptContent(filteredMenu)
        const outputPath = path.join(
          compiler.context,
          'src',
          'navigation',
          'navigation.ts',
        )

        const contentHash = this.hashContent(tsContent)

        if (contentHash !== this.lastContentHash) {
          console.log('Writing navigation.ts')
          fs.writeFileSync(outputPath, tsContent)
          console.log('Wrote navigation.ts')
          this.lastContentHash = contentHash
        }
        callback()
      },
    )
  }

  hashContent(content) {
    return crypto.createHash('md5').update(content).digest('hex')
  }

  buildMenu(dir, baseHref = '') {
    const files = fs.readdirSync(dir)
    const pageFile = files.find((file) => file === 'page.mdx')

    if (pageFile) {
      const filePath = path.join(dir, pageFile)
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(content)
      const title = data.title || path.basename(dir)
      const href = '/' + baseHref.replace(/\\/g, '/')

      if (title !== 'app') {
        return { title, href }
      }
    }

    const subItems = []
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        const subItem = this.buildMenu(filePath, path.join(baseHref, file))
        if (subItem) {
          subItems.push(subItem)
        }
      }
    }

    if (subItems.length > 0) {
      return {
        title: path.basename(dir),
        links: subItems,
      }
    }

    return null
  }

  generateTypeScriptContent(menu) {
    const content = `
// This file is auto-generated. Do not edit manually.

export interface NavLink {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: (NavLink | NavGroup)[]
}

export const navigation: NavGroup[] = ${JSON.stringify(menu, null, 2)};
`
    return content
  }
}

export default MDXMenuPlugin
