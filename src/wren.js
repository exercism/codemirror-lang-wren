// import {parser} from "lezer-javascript"
import {parser} from "./lezer/parser.js"
import {LezerLanguage, LanguageSupport,
        delimitedIndent, flatIndent, continuedIndent, indentNodeProp,
        foldNodeProp, foldInside} from "@codemirror/language"
import {styleTags, tags as t} from "@codemirror/highlight"
import {completeFromList, ifNotIn} from "@codemirror/autocomplete"
import {snippets} from "./snippets"

/// A language provider based on the [Lezer JavaScript
/// parser](https://github.com/lezer-parser/javascript), extended with
/// highlighting and indentation information.
export const wrenLanguage = LezerLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        IfStatement: continuedIndent({except: /^\s*({|else\b)/}),
        TryStatement: continuedIndent({except: /^\s*({|catch|finally)\b/}),
        LabeledStatement: flatIndent,
        SwitchBody: context => {
          let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after)
          return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit
        },
        Block: delimitedIndent({closing: "}"}),
        ArrowFunction: cx => cx.baseIndent + cx.unit,
        "TemplateString BlockComment": () => -1,
        "Statement Property": continuedIndent({except: /^{/}),
        JSXElement(context) {
          let closed = /^\s*<\//.test(context.textAfter)
          return context.lineIndent(context.state.doc.lineAt(context.node.from)) + (closed ? 0 : context.unit)
        },
        JSXEscape(context) {
          let closed = /\s*\}/.test(context.textAfter)
          return context.lineIndent(context.state.doc.lineAt(context.node.from)) + (closed ? 0 : context.unit)
        },
        "JSXOpenTag JSXSelfClosingTag"(context) {
          return context.column(context.node.from) + context.unit
        }
      }),
      foldNodeProp.add({
        "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression": foldInside,
        BlockComment(tree) { return {from: tree.from + 2, to: tree.to - 2} }
      }),
      styleTags({
        "get set async static construct foreign": t.modifier,
        "for while do if else switch try catch finally return throw break continue default case": t.controlKeyword,
        "in of await yield void typeof delete instanceof": t.operatorKeyword,
        "export import let var const function class extends": t.definitionKeyword,
        "with debugger from as new": t.keyword,
        TemplateString: t.special(t.string),
        Super: t.atom,
        BooleanLiteral: t.bool,
        this: t.self,
        null: t.null,
        Star: t.modifier,
        "Blah": t.modifier,
        "ClassName": t.className,
        "VariableName FieldName": t.variableName,
        "CallExpression/VariableName": t.function(t.variableName),
        VariableDefinition: t.definition(t.variableName),
        Label: t.labelName,
        PropertyName: t.propertyName,
        "CallExpression/MemberExpression/PropertyName": t.function(t.propertyName),
        "FunctionDeclaration/VariableDefinition": t.function(t.definition(t.variableName)),
        "ClassDeclaration/ClassName": t.definition(t.className),
        "PropertyNameDefinition ClassMethodName": t.definition(t.propertyName),
        UpdateOp: t.updateOperator,
        LineComment: t.lineComment,
        BlockComment: t.blockComment,
        Number: t.number,
        String: t.string,
        ArithOp: t.arithmeticOperator,
        LogicOp: t.logicOperator,
        BitOp: t.bitwiseOperator,
        CompareOp: t.compareOperator,
        RegExp: t.regexp,
        Equals: t.definitionOperator,
        "Arrow : Spread": t.punctuation,
        "( )": t.paren,
        "[ ]": t.squareBracket,
        "{ }": t.brace,
        ".": t.derefOperator,
        ", ;": t.separator,

      })
    ]
  }),
  languageData: {
    closeBrackets: {brackets: ["(", "[", "{", "'", '"', "`"]},
    commentTokens: {line: "//", block: {open: "/*", close: "*/"}},
    indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
    wordChars: "$"
  }
})


/// Wren support. Includes [snippet](#lang-javascript.snippets)
/// completion.
export function wren(config = {}) {
  let lang = wrenLanguage
  return new LanguageSupport(lang, wrenLanguage.data.of({
    autocomplete: ifNotIn(["LineComment", "BlockComment", "String"], completeFromList(snippets))
  }))
}
