import fs from 'fs'

import { resolve } from 'path'

import parser from '@babel/parser'

import traverse from "@babel/traverse";

// 通过babel将esModule转化为cjs
import babel from '@babel/core'

import ejs from 'ejs'

let id = 0

// 获取模块资源
function createAssets (path) {
  // 获取模块内容
  const source = fs.readFileSync(path, {
    encoding: 'utf-8'
  })

  // 将模块内容转化为ast 
  const ast = parser.parse(source, {
    sourceType: 'module'
  })

  // 根据ast使用babel 将代码中的esmodule转化为cjs
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env']
  })

  // 根据ast获取模块中的依赖关系
  let deps = []
  traverse.default(ast, {
    ImportDeclaration ({ node }) {
      deps.push(node.source.value)
    }
  })

  return {
    id: id++,
    path,
    code,
    deps,
    mapping: {}
  }
}

// 从入口文件开始构建一个图
function createGrapgh (path) {
  const mainAssets = createAssets(path)
  const result = [mainAssets]
  // 递归调用每个模块中的依赖
  const getDepsSource = (deps, mapping) => {
    deps.forEach(relativePath => {
      const child = createAssets(resolve('./example', relativePath))

      // 重复的模块不需要加入
      if (!result.some(r => r.path === child.path)) {
        result.push(child)
      } else {
        let index = result.map(r => r.path).indexOf(child.path)
        child.id = result[index]['id']
      }

      // 向mapping中添加当前模块依赖映射关系
      mapping[relativePath] = child.id

      getDepsSource(child.deps, child.mapping)
    })
  }

  getDepsSource(mainAssets.deps, mainAssets.mapping)

  return result
}

const grapgh = createGrapgh('./example/main.js')

console.log('grapgh', grapgh);


// 根据得到的图构建打包后的js文件
const build = (grapgh) => {
  // 读取模板文件
  const template = fs.readFileSync(resolve('./bundle.ejs'), {
    encoding: 'utf-8'
  })
  // ejs渲染模板
  const result = ejs.render(template, { grapgh })
  // 将渲染后的模板写入 bundle.js
  fs.writeFileSync(resolve('./dist/bundle.js'), result)
}

build(grapgh)