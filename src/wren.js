import {parser} from "./lezer/parser.js"
import {LezerLanguage, LanguageSupport,
        delimitedIndent, flatIndent, continuedIndent, indentNodeProp,
        foldNodeProp, foldInside} from "@codemirror/language"
import {styleTags, tags as t} from "@codemirror/highlight"
import {completeFromList, ifNotIn} from "@codemirror/autocomplete"
import {snippets} from "./snippets"

export const wrenLanguage = LezerLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        IfStatement: continuedIndent({except: /^\s*({|else\b)/}),
        Block: delimitedIndent({closing: "}"}),
        BlockComment: () => -1,
        "Statement Property": continuedIndent({except: /^{/}),
      }),
      foldNodeProp.add({
        "Block ClassBody ObjectExpression ArrayExpression": foldInside,
        BlockComment(tree) { return {from: tree.from + 2, to: tree.to - 2} }
      }),
      // as break class construct continue else false for foreign if import
      // in is null return static super this true var while
      styleTags({
        "static construct foreign": t.modifier,
        "for while do if else return break continue": t.controlKeyword,
        "in": t.operatorKeyword,
        "import var class is": t.definitionKeyword,
        "as": t.keyword,
        // TODO: """ strings
        TemplateString: t.special(t.string),
        super: t.atom,
        BooleanLiteral: t.bool,
        this: t.self,
        null: t.null,
        // TODO: what are we doing with this
        "Blah": t.modifier,
        "ClassName": t.className,
        "VariableName FieldName": t.variableName,
        "CallExpression/VariableName": t.function(t.variableName),
        VariableDefinition: t.definition(t.variableName),
        PropertyName: t.propertyName,
        "CallExpression/MemberExpression/PropertyName": t.function(t.propertyName),
        "FunctionDeclaration/VariableDefinition": t.function(t.definition(t.variableName)),
        "ClassDeclaration/ClassName": t.definition(t.className),
        "PropertyNameDefinition ClassMethodName": t.definition(t.propertyName),
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
        ".. ...": t.punctuation,
        ":": t.punctuation,
        "( )": t.paren,
        "[ ]": t.squareBracket,
        "{ }": t.brace,
        ".": t.derefOperator,
        ",": t.separator
      })
    ]
  }),
  languageData: {
    closeBrackets: {brackets: ["(", "[", "{", '"']},
    commentTokens: {line: "//", block: {open: "/*", close: "*/"}},
    indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
    // wordChars: "$"
  }
})


/// Wren support. Includes snippets.
export function wren(config = {}) {
  let lang = wrenLanguage
  return new LanguageSupport(lang, wrenLanguage.data.of({
    autocomplete: ifNotIn(["LineComment", "BlockComment", "String"], completeFromList(snippets))
  }))
}
