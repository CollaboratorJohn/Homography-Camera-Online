import { parser as parser$cpp } from '@lezer/cpp';

import { LRLanguage, indentNodeProp, continuedIndent, flatIndent, delimitedIndent, foldNodeProp, foldInside, LanguageSupport } from '@codemirror/language';

const cppLanguage = /*@__PURE__*/LRLanguage.define({
    parser: /*@__PURE__*/parser$cpp.configure({
        props: [
            /*@__PURE__*/indentNodeProp.add({
                Element(context) {
                    let closed = /^\s*<\//.test(context.textAfter);
                    return context.lineIndent(context.node.from) + (closed ? 0 : context.unit);
                },
                "OpenTag CloseTag SelfClosingTag"(context) {
                    return context.column(context.node.from) + context.unit;
                },
                IfStatement: /*@__PURE__*/continuedIndent({ except: /^\s*({|else\b)/ }),
                TryStatement: /*@__PURE__*/continuedIndent({ except: /^\s*({|catch)\b/ }),
                LabeledStatement: flatIndent,
                CaseStatement: context => context.baseIndent + context.unit,
                BlockComment: () => -1,
                CompoundStatement: /*@__PURE__*/delimitedIndent({ closing: "}" }),
                Statement: /*@__PURE__*/continuedIndent({ except: /^{/ })
            }),
            /*@__PURE__*/foldNodeProp.add({
                "DeclarationList CompoundStatement EnumeratorList FieldDeclarationList InitializerList": foldInside,
                BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 }; },
                Element(subtree) {
                    let first = subtree.firstChild, last = subtree.lastChild;
                    if (!first || first.name !== "OpenTag")
                        return null;
                    return { from: first.to, to: last.name === "CloseTag" ? last.from : subtree.to };
                }
            })
        ]
    }),
    languageData: {
        commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
        indentOnInput: /^\s*(?:case |default:|\{|\})$/,
        wordChars: '$',
        closeBrackets: { brackets: ["<","(", "[", "{", "'", '"', "`"] }
    }
});

function langConfig() {
    return new LanguageSupport(cppLanguage);
}

export default langConfig;
