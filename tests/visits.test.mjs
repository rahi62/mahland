import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const code=fs.readFileSync('app/api/visits/route.ts','utf8').replace("import {saveVisit} from '@/db/visits';",'const saveVisit=(v)=>globalThis.__testSaveVisit(v);');
const js=ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {POST}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const request=(data)=>new Request('https://test.invalid/api/visits',{method:'POST',body:typeof data==='string'?data:JSON.stringify(data)});
const valid={name:'بازدید آزمایشی',phone:'۰۹۱۲ ۳۴۵ ۶۷۸۹',villa:'villa-02',preferred:'پنجشنبه',message:'آزمون اعتبارسنجی'};
test('valid request normalizes Persian phone and saves selected villa',async()=>{let stored;globalThis.__testSaveVisit=async v=>{stored=v};const r=await POST(request(valid));assert.equal(r.status,201);assert.equal(stored.phone,'09123456789');assert.equal(stored.villa,'villa-02');assert.equal((await r.json()).id,stored.id)});
test('malformed JSON is rejected before storage',async()=>{globalThis.__testSaveVisit=()=>assert.fail('must not save');assert.equal((await POST(request('{bad'))).status,400)});
test('invalid phone and unknown villa are rejected',async()=>{globalThis.__testSaveVisit=()=>assert.fail('must not save');for(const change of [{phone:'abc'},{villa:'unknown'},{name:'x'},{message:'x'.repeat(2001)}])assert.equal((await POST(request({...valid,...change}))).status,400)});

test('honeypot submissions are ignored without storage',async()=>{let saved=false;globalThis.__testSaveVisit=async()=>{saved=true};const r=await POST(request({...valid,website:'spam.example'}));assert.equal(r.status,201);assert.equal(saved,false)});
test('oversized payload is rejected',async()=>{globalThis.__testSaveVisit=()=>assert.fail('must not save');assert.equal((await POST(request('x'.repeat(7100)))).status,413)});
test('storage failure never returns false success',async()=>{globalThis.__testSaveVisit=async()=>{throw new Error('simulated database outage')};const old=console.error;console.error=()=>{};try{const r=await POST(request(valid));assert.equal(r.status,503);assert.match((await r.json()).error,/ذخیره نشد/)}finally{console.error=old}});
