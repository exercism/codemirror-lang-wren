import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import {wren} from "../src/index.js"
import {HighlightStyle, classHighlightStyle, tags as t} from "@codemirror/highlight"


// classHighlightStyle.match = ((tag, scope) => {
//   console.log(tag,scope);
//   return scope.name;
// }).bind(classHighlightStyle);

const highlightStyle = HighlightStyle.define([
  {tag: t.link, class: "cmt-link"},
  {tag: t.heading, class: "cmt-heading"},
  {tag: t.emphasis, class: "cmt-emphasis"},
  {tag: t.strong, class: "cmt-strong"},
  {tag: t.keyword, class: "cmt-keyword"},
  {tag: t.atom, class: "cmt-atom"},
  {tag: t.bool, class: "cmt-bool"},
  {tag: t.url, class: "cmt-url"},
  {tag: t.labelName, class: "cmt-labelName"},
  {tag: t.className, class: "cmt-className"},
  {tag: t.inserted, class: "cmt-inserted"},
  {tag: t.deleted, class: "cmt-deleted"},
  {tag: t.literal, class: "cmt-literal"},
  {tag: t.string, class: "cmt-string"},
  {tag: t.number, class: "cmt-number"},
  {tag: [t.regexp, t.escape, t.special(t.string)], class: "cmt-string2"},
  {tag: t.variableName, class: "cmt-variableName"},
  {tag: t.local(t.variableName), class: "cmt-variableName cmt-local"},
  {tag: t.definition(t.variableName), class: "cmt-variableName cmt-definition"},
  {tag: t.special(t.variableName), class: "cmt-variableName2"},
  {tag: t.typeName, class: "cmt-typeName"},
  {tag: t.namespace, class: "cmt-namespace"},
  {tag: t.macroName, class: "cmt-macroName"},
  {tag: t.propertyName, class: "cmt-propertyName"},
  {tag: t.operator, class: "cmt-operator"},
  {tag: t.comment, class: "cmt-comment"},
  {tag: t.meta, class: "cmt-meta"},
  {tag: t.invalid, class: "cmt-invalid"},
  {tag: t.punctuation, class: "cmt-punctuation"}
])


let editor = new EditorView({
  state: EditorState.create({
    extensions: [
      basicSetup,
      wren({}),
      highlightStyle
    ],
    // theme: "tomorrow-night-eighties",
    doc: `// This file provides examples of syntactic constructs in wren, which is mainly
// interesting for testing syntax highlighters.

// This is a comment.
/* This is /* a nested */ comment. */

// Class definition with a toplevel name.
class SyntaxExample {
  // Constructor
  construct new() {
    // Top-level name IO
    System.print("I am a constructor!")

    // Method calls
    variables
    fields()

    var x = """wow really"""

    var fn = Fn.new() {
      System.print("hey hey")
    }

    // Block arguments
    fields { block }
    fields {|a, b| block }
    fields(argument) { block }
    fields(argument) {|a, b| block }

    // Static method call
    SyntaxExample.fields(1)
  }

  // Constructor with arguments
  construct constructor(a, b) {
    print(a, b)
    field = a
  }

  // Method without arguments
  variables {
    // Valid local variable names.
    var hi
    var camelCase
    var PascalCase
    var abc123
    var ALL_CAPS
  }

  // Method with empty argument list
  fields() {
    // Fields
    _under_score = 1
    _field = 2
  }

  // Static method with single argument
  static fields(a) {
    // Static field
    __a = a
  }

  // Setter
  field=(value) { _field = value }

  // Method with arguments
  print(a, b) { System.print(a + b) }

  // Operators
  +(other) { "infix + %(other)" }
  -(other) { "infix - %(other)" }
  *(other) { "infix * %(other)" }
  /(other) { "infix / %(other)" }
  %(other) { "infix \\% %(other)" }
  <(other) { "infix < %(other)" }
  >(other) { "infix > %(other)" }
  <=(other) { "infix <= %(other)" }
  >=(other) { "infix >= %(other)" }
  ==(other) { "infix == %(other)" }
  !=(other) { "infix != %(other)" }
  &(other) { "infix & %(other)" }
  |(other) { "infix | %(other)" }

  ! { "prefix !" }
  ~ { "prefix ~" }
  - { "prefix -" }
}

// 'class', 'is'
class ReservedWords is SyntaxExample {
  reserved {
    // 'super', 'true', 'false'
    super(true, false)
    // 'this'
    this.foo
  }

  foo {
    // 'var'
    var n = 27
    // 'while', 'if', 'else'
    while (n != 1) if (n % 2 == 0) n = n / 2 else n = 3 * n + 1

    // 'for', 'in'
    for (beatle in ["george", "john", "paul", "ringo"]) {
      System.print(beatle)
      // 'break'
      break
    }

    // 'return', 'null'
    return null
  }

  imports {
    // 'import'
    import "hello"
    // 'import', 'for'
    import "set" for Set
  }

  // 'foreign', 'static'
  // foreign static bar
  // foreign baz(string)
  // (Remove lines above to make this file compile)
}

class Literals is SyntaxExample {
  booleans { true || false }

  numbers {
    0
    1234
    -5678
    3.14159
    1.0
    -12.34
    0x1000000
    0xdeadbeef
    0x1234567890ABCDEF
  }

  strings {
    "hi there"
    // Escapes:
    "\\0" // The NUL byte: 0.
    "\\"" // A double quote character.
    "\\\\" // A backslash.
    "\\a" // Alarm beep. (Who uses this?)
    "\\b" // Backspace.
    "\\f" // Formfeed.
    "\\n" // Newline.
    "\\r" // Carriage return.
    "\\t" // Tab.
    "\\v" // Vertical tab.
    // Unicode code points
    System.print("\\u0041fgdg\\u0b83\\u00DE") // "AஃÞ"
    // Unencoded bytes
    System.print("\\x48\\x69\\x2e") // "Hi."
  }

  ranges {
    3..8  // inclusive
    4...6 // half-inclusive
  }

  nothing { null }

  lists {
    var list = [1, "banana", true]
    list[0] = 5
    list[1..2]
  }

  maps {
    var stringMap = {
      "George": "Harrison",
      "John": "Lennon",
      "Paul": "McCartney",
      "Ringo": "Starr"
    }
    var a = 1
    var weirdMap = {
      true: 1,
      false: 0,
      null: -1,
      "str": "abc",
      (1..5): 10,
      a: 2,
      _a: 3,
      __a: 4
    }
  }
}`
  }),
  parent: document.body
})
