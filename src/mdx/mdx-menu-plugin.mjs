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
        const tsContent = this.generateTypeScriptContent(menu)
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
    const menu = []
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        const subMenu = this.buildMenu(filePath, path.join(baseHref, file))
        if (subMenu.length > 0) {
          menu.push({
            title: file,
            links: subMenu,
          })
        }
      } else if (file === 'page.mdx') {
        const content = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(content)
        const title = data.title || path.basename(dir)
        const href = '/' + baseHref.replace(/\\/g, '/')

        if (title === 'app') {
          continue
        }

        menu.push({ title, href })
      }
    }

    return menu
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
