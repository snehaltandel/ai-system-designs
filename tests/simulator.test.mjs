import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evaluateScenario} from '../site/simulator-engine.mjs';
test('baseline requires review and verifies discount arithmetic',()=>{
  const state=evaluateScenario();
  assert.equal(state.status,'Awaiting human review');assert.equal(state.recorded,false);
  assert.equal(state.discount,12000);assert.equal(state.offerValue,108000);
  assert.equal(evaluateScenario({},'approved').recorded,true);
  assert.equal(evaluateScenario({},'rejected').recorded,false);
});
test('all combinations block approval when evidence or permission fails',()=>{
  for(let mask=0;mask<16;mask++){
    const flags=Object.fromEntries(['stale','outage','conflict','unauthorized'].map((key,i)=>[key,Boolean(mask & (1<<i))]));
    const state=evaluateScenario(flags,'approved');
    assert.equal(state.evidenceReady,!(flags.stale||flags.outage||flags.conflict));
    assert.equal(state.recorded,mask===0,JSON.stringify(flags));
    if(mask) assert.equal(state.review,null);
    assert.equal(state.issues.length,Number(flags.stale)+Number(flags.outage)+Number(flags.conflict));
  }
});
test('missing billing does not fall back to a remembered or zero balance',()=>{
  const state=evaluateScenario({outage:true});
  assert.equal(state.canApprove,false);
  assert.match(state.issues[0].reason,/Missing evidence is not a zero balance/);
});
