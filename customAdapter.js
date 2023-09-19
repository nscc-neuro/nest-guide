// 如果需要返回带有front-matter的md字符串，则需要安装并引入此库
// const { matterMarkdownAdapter } = require("@elog/plugin-adapter");

/**
 * 自定义文档处理器
 * @param {DocDetail} doc doc的类型定义为 DocDetail
 * @return {string} 返回处理后的文档内容字符串
 */
const format = (doc) => {
    let body = doc.body;
    let date = doc.properties.date;
    let title = doc.title;

    // weight 用时间戳
    console.log(date);
    let weight = new Date(date).getTime();

    // 修改date为2022-10-10T02:21:15+00:00格式
    date = new Date(date).toISOString();

    // 拼接front-matter
    let frontMatter = `---
    weight: ${weight}
    date: ${date}
    draft: false
    author: nscc-neuro
    title: ${title}
    icon: menu_book
    toc: true
    description: ""
    publishdate: ${date}
    tags: ["Beginners"]
    categories: [""]
---`;

    return frontMatter + "\n\n" + body;
};

module.exports = {
    format,
};
