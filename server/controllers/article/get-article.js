/**
 * 根据文章ID获取指定文章以及文章评论
 */
const mysql = require('../../database/mysql')
const config = require('../../config/config')
const debug = require('debug')('blog-server:get-article')

/**
 * articleId 文章id
 * p 页码
 * pc 每页显示条数
 */
module.exports = async (ctx) => {
  let { articleId, p, pc, direction } = ctx.request.query
  p = p !== null && p !== undefined ? parseInt(p) : 1
  pc = pc !== null && pc !== undefined ? parseInt(pc) : config.PAGE_COUNT + 2
  try {
    const res = await mysql.getArticle(articleId, p, pc, direction)
    ctx.state.data = {
      data: {
        article: res[0][0],
        comment: res[1]
      },
      totalCount: res[2][0]['COUNT(`article_id`)'],
      currentPage: p,
      pageCount: pc
    }
  } catch (e) {
    ctx.state = {
      code: -1,
      data: {
        msg: '数据库连接错误, 获取文章失败'
      }
    }
    debug(`获取文章失败: ${e.toString()}`)
  }
}
