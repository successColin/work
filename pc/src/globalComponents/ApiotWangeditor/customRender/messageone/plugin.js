import { DomEditor } from '@wangeditor/core';
import { SlateEditor, SlatePoint, SlateTransforms } from '@wangeditor/editor';

function withCodeBlock(editor) {
  const { isInline, isVoid, insertBreak, insertText, normalizeNode } = editor;
  const newEditor = editor;

  // 重写 isInline
  newEditor.isInline = (elem) => {
    const { type } = elem;

    if (type === 'messageVar') {
      return true;
    }

    return isInline(elem);
  };

  newEditor.isVoid = (elem) => {
    const { type } = elem;

    if (type === 'messageVar') {
      return true;
    }

    return isVoid(elem);
  };
  // newEditor.insertNode = (node) => {
  //   console.log('insertNode==============================');
  //   insertNode(node);
  // };
  // 重写 insertBreak - 换行时插入 p
  newEditor.insertBreak = () => {
    console.log('insertBreak======');
    const { selection } = newEditor;
    if (selection == null) return insertBreak();

    const [nodeEntry] = SlateEditor.nodes(editor, {
      match: (n) => DomEditor.checkNodeType(n, 'messageVar'),
      universal: true,
    });
    if (!nodeEntry) return insertBreak();

    const quoteElem = nodeEntry[0];
    const quotePath = DomEditor.findPath(editor, quoteElem);
    const quoteEndLocation = SlateEditor.end(editor, quotePath);

    if (SlatePoint.equals(quoteEndLocation, selection.focus)) {
      // 光标位于 blockquote 最后
      const str = Node.string(quoteElem);
      if (str && str.slice(-1) === '\n') {
        // blockquote 文本最后一个是 \n
        editor.deleteBackward('character'); // 删除最后一个 \n

        // 则插入一个 paragraph
        const p = { type: 'paragraph', children: [{ text: '' }] };
        SlateTransforms.insertNodes(newEditor, p, { mode: 'highest' });
        return;
      }
    }

    // 情况情况，插入换行符
    insertText('\n');
  };

  // 重新 normalize
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node);
    if (type !== 'messageVar') {
      // 未命中 divider ，执行默认的 normalizeNode
      return normalizeNode([node, path]);
    }
    // editor 顶级 node
    const topLevelNodes = newEditor.children || [];

    const nextNode = topLevelNodes[path[0] + 1] || {};
    const { type: nextNodeType = '' } = nextNode;
    if (
      nextNodeType !== 'paragraph' &&
      nextNodeType !== 'blockquote' &&
      !nextNodeType.startsWith('header')
    ) {
      // divider node 后面不是 p 或 header ，则插入一个空 p
      // const p = { type: 'span', children: [{ text: '' }] };
      // const insertPath = [path[0] + 1];
      // SlateTransforms.insertNodes(newEditor, p, {
      //   at: insertPath, // 在分割线后面插入
      // });
    }
  };

  // 返回 editor ，重要！
  return newEditor;
}

export default withCodeBlock;
