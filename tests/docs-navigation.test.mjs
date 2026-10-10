import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sections,pages,resolvePage,adjacentPages} from '../site/docs-catalog.mjs';
test('all topics and section anchors have valid destinations',()=>{
  const html=readFileSync(new URL('../site/index.html',import.meta.url),'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,'HTML IDs must be unique');
  assert.equal(new Set(pages.map(page=>page.path)).size,pages.length,'Routes must be unique');
  for(const section of sections)assert.ok(ids.includes(section.element),section.element);
  for(const page of pages){
    assert.equal(resolvePage(`#${page.path}`)?.path,page.path);
    if(page.element){assert.ok(ids.includes(page.element),page.element);assert.equal(resolvePage(`#${page.element}`)?.path,page.path);}
    if(page.index!==undefined)assert.ok(Number.isInteger(page.index)&&page.index>=0&&page.index<4);
  }
});
test('legacy section links, default routes and malformed links are handled',()=>{
  assert.equal(resolvePage('')?.home,true);assert.equal(resolvePage('#')?.home,true);
  assert.equal(resolvePage('#/')?.home,true);
  assert.equal(resolvePage('#architecture-library')?.path,'/designs');
  assert.equal(resolvePage('#decision-simulator')?.path,'/practice/renewal');
  assert.equal(resolvePage('#llm-foundations')?.path,'/learn');
  assert.equal(resolvePage('#data-foundations')?.path,'/foundations/data');
  assert.equal(resolvePage('#/learn/')?.path,'/learn');
  assert.equal(resolvePage('#/not-a-topic'),null);assert.equal(resolvePage('#%'),null);
});
test('previous and next navigation stay within each section',()=>{
  for(const section of sections){
    const siblings=pages.filter(page=>page.section.id===section.id);
    assert.equal(adjacentPages(siblings[0]).previous,undefined);
    assert.equal(adjacentPages(siblings.at(-1)).next,undefined);
    for(let i=0;i<siblings.length-1;i++)assert.equal(adjacentPages(siblings[i]).next.path,siblings[i+1].path);
  }
});
