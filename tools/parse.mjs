#!/usr/bin/env node
import { parser } from "#parser"
import fs from "fs";
import "colors";


let file = process.argv[2]
let data = fs.readFileSync(file).toString()
// console.log(data)
let tree = parser.parse(data)
// console.log(tree)

var inserts = {
  "var": [null, " "],
  "class": ["\n", " "],
  "static": [null, " "],
  "construct": [null, " "],
  "foreign": [null, " "],
  "return": [null, " "],
  "|": [null, " "],
  "{": [null,"\n"],
  "}": [" ","\n"]
}

const printTree = (tree) => {
  // console.log(tree)
  tree.iterate(
    {
      enter: (type, from, to) => {
        if (type.name=="Script") return;

        // console.log(type)
        let tag = "[" + type.name.padEnd(20, " ") + "]"
        if (type.name=="⚠") {
          tag = tag.red
        } else {
          tag = tag.grey
        }
        let code = data.slice(from,to)
        if (!code.includes("\n")) {
          console.log(tag, code)
        } else {
          console.log(tag)
        }

      },
      leave: (type, from, to) => {

      }
    }
)
}


const startTree = (tree, visitFn) => {
  var c = tree.topNode.cursor;
  var out = "";
  var tabs = 0;
  var vars = {};
  var i = 0;
  // c.next();
  recurTree(c, -1, visitFn);
  return out;

  function replacementFor(varname) {
    if (vars[varname]) return vars[varname];
    vars[varname] = `@VAR${i}@`
    i+=1
    return vars[varname]
  }

  function rewrite(code, nodeName) {
    if (nodeName=="ClassMethodName" && code=="new") { return code }
    if (["VariableName","ClassMethodName","ClassName","VariableDefinition"].includes(nodeName)) {
      let name = replacementFor(code);
      return name
    } else {
      return code
    }
  }

  function recurTree(c, depth = 0, visitFn) {
    var node = {
      type: c.type,
      name: c.name,
      children: [],
      depth: depth,
      from: c.from,
      to: c.to,
      get code() {
        return data.slice(c.from, c.to)
      }
    }
    var code = data.slice(c.from, c.to);
    var leaf = (c.firstChild()==false);
    node.leaf = leaf
    if (leaf) {
      // console.log(" ".repeat(depth), nodeName, code);
      // console.log(code)
      var action = inserts[code];
      if (action && action[0]) { out += action[0] }
      out += rewrite(code, c.name);
      if (code=="{") tabs += 2;
      if (code=="}") tabs -= 2;
      if (action && action[1]) {
        out += action[1]
        if (action[1]=="\n") {
          out += " ".repeat(tabs)
        }
      }
      // return;
    } else {
      // console.log(" ".repeat(depth), nodeName);
    }
    visitFn(node);
    while (!leaf && true) {
      // console.log(" ".repeat(depth) + nodeName);
      node.children.push(recurTree(c, depth + 1, visitFn));
      if (!c.nextSibling()) break;
    }
    if (c.name.includes("Statement")) {
      out += "\n" + " ".repeat(tabs)
    }
    if (!leaf) c.parent()

    // node.children.forEach(x => visitFn(x))
    return node;
  }
}

const visitNode = (node) => {
  if (node.name=="Script") return;
  if (node.leaf) {
    console.log(`${" ".repeat(node.depth)}${node.name.grey} ${node.code}`);
  } else {
    console.log(`${" ".repeat(node.depth)}${node.name.grey}`);
  }
}

// printTree(tree);
var out = startTree(tree, visitNode);
console.log("")
// console.log(out)
