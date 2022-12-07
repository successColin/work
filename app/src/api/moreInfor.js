/*
 * @Author: ytx
 * @Date: 2021-06-17 18:40:09
 * @Last Modified by: ytx
 * @Last Modified time: 2022-11-21 11:08:26
 * 更多资讯
 */
import FetchData from './axiosConfig';

// 查询__文章分组
export function listGroup(params) {
  return FetchData.request({
    url: '/system/article/listGroup',
    method: 'get',
    params,
  });
}

// 查询__文章列表
export function getPageArticle(params) {
  return FetchData.request({
    url: '/system/article/pageArticle',
    method: 'get',
    params,
  });
}

// 查询__首页文章列表
export function getListArticle(params) {
  return FetchData.request({
    url: '/system/article/listArticle',
    method: 'get',
    params,
  });
}

// 查询__根据id查询文章
export function getArticle(params) {
  return FetchData.request({
    url: '/system/article/getArticle',
    method: 'get',
    params,
  });
}

// 新增---评论
export function insertComment(data) {
  return FetchData.request({
    url: '/system/article/insertComment',
    method: 'post',
    data,
  });
}

// 删除---评论
export function deleteComment(params) {
  return FetchData.request({
    url: '/system/article/deleteComment',
    method: 'delete',
    params,
  });
}

// 根据id查询文章(分享)
export function getArticleByShare(params) {
  return FetchData.request({
    url: '/system/article/getArticleByShare',
    method: 'get',
    params,
  });
}

// 点赞
export function applaud(data) {
  return FetchData.request({
    url: '/system/article/applaud',
    method: 'post',
    data,
  });
}

// 取消点赞
export function cancelApplaud(data) {
  return FetchData.request({
    url: '/system/article/cancelApplaud',
    method: 'post',
    data,
  });
}
