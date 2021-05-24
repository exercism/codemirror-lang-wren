#!/usr/bin/env node
import { parser } from "#parser"
import fs from "fs";
import "colors";
import path from "path";
import { walkTree } from "./lib.mjs"

let file = process.argv[2]
let data = fs.readFileSync(file).toString()
let tree = parser.parse(data)

const visitNode = (node) => {
  if (node.name=="Script") return;
  let name = node.name == "⚠" ? node.name.repeat(10).red.bold : node.name.grey
  console.log(`${" ".repeat(node.depth)}${name} ${node.leaf ? node.code : ""}`);
}

let filename = path.basename(file)
console.log(filename.cyan);
console.log("-".repeat(filename.length).grey);
walkTree(tree, data, visitNode);
