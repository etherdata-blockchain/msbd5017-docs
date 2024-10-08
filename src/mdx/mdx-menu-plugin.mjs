import * as fs from 'fs'
import * as path from 'path'
import * as matter from 'gray-matter'

class MDXMenuPlugin {
  apply(compiler) {
    compiler.hooks.beforeRun.tapAsync(
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

        fs.mkdirSync(path.dirname(outputPath), { recursive: true })
        fs.writeFileSync(outputPath, tsContent)

        console.log('MDX menu structure generated at:', outputPath)

        callback()
      },
    )
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
            links: subMenu[0].links,
          })
        }
      } else if (path.extname(file) === '.mdx') {
        const content = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter.default(content)
        const title = data.title || path.basename(file, '.mdx')
        const href = path.join(baseHref, path.basename(file, '.mdx'))

        if (
          menu.length === 0 ||
          menu[menu.length - 1].title !== path.basename(dir)
        ) {
          menu.push({
            title: path.basename(dir),
            links: [],
          })
        }

        menu[menu.length - 1].links.push({ title, href })
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
  links: NavLink[];
}

export const navigation: NavGroup[] = ${JSON.stringify(menu, null, 2)};
`
    return content
  }
}

export default MDXMenuPlugin
