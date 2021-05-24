#!/usr/bin/env node
import { parser } from "#parser"
import fs from "fs";
import "colors";

let file = process.argv[2]
let data = fs.readFileSync(file).toString()
let tree = parser.parse(data)

const wrap = (tag) => {
  let error = (tag == "⚠")
  if (error) { tag = tag.repeat(20) }
  var padded = tag.padEnd(20, " ")

  return error ? `[ ${padded} ]`.red.bold : `[ ${padded} ]`.grey
}

const catParseTree = (tree) => {
  var last = null
  tree.iterate(
    {
      enter: (type, from, to) => {
        if (type.name=="Script") return;
        if (type.name=="⚠") {
          console.log(wrap(type.name));
          process.stdout.write("  ");
        }
        last = type.name
      },
      leave: (type, from, to) => {
        if (last!=type.name) return;

        let code = data.slice(from,to)
        let tag = wrap(type.name)
        console.log(tag, code)
      }
    }
)
}

catParseTree(tree);
