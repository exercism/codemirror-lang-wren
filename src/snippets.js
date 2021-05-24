import {snippetCompletion as snip} from "@codemirror/autocomplete"

/// A collection of Wren-related snippets
export const snippets = [
  snip("Fn.new { |${args}| ${} }\n", {
    label: "Fn.new",
    detail: "definition",
    type: "keyword"
  }),
  snip("for (${name} in ${collection}) {\n\t${}\n}", {
    label: "for",
    detail: "in loop",
    type: "keyword"
  }),
  snip("class ${name} {\n\tconstruct new(${params}) {\n\t\t${}\n\t}\n}", {
    label: "class",
    detail: "definition",
    type: "keyword"
  }),
  snip("class ${name} is ${inherited} {\n\tconstruct new(${params}) {\n\t\tsuper()\n\t\t${}\n\t}\n}", {
    label: "class",
    detail: "definition (inherited)",
    type: "keyword"
  }),
  snip("import \"${name}\" for ${class}\n", {
    label: "import",
    detail: "for",
    type: "keyword"
  }),
  snip("import \"${name}\" for ${class} as ${rename}\n", {
    label: "import",
    detail: "as",
    type: "keyword"
  }),
]
