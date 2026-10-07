// Fictional policy and evidence; deterministic, with no model or system calls.
export function evaluateScenario(flags = {}, review = null) {
  const issues = [];
  if (flags.stale) issues.push({source:'CRM', owner:'CRM data steward', reason:'45-day-old snapshot exceeds the 7-day freshness limit.'});
  if (flags.outage) issues.push({source:'Billing', owner:'Billing service owner', reason:'Invoice service unavailable. Missing evidence is not a zero balance.'});
  if (flags.conflict) issues.push({source:'Policy', owner:'Finance policy owner', reason:'Two applicable, approved policies allow 5% and 10%. Authority must be resolved.'});
  const evidenceReady = issues.length === 0;
  const canApprove = evidenceReady && !flags.unauthorized;
  const appliedReview = canApprove && ['approved','rejected'].includes(review) ? review : null;
  return {issues,evidenceReady,canApprove,review:appliedReview,
    annualValue:120000,discount:12000,offerValue:108000,
    status: !evidenceReady ? 'Evidence blocked' : flags.unauthorized ? 'Action denied' : appliedReview === 'approved' ? 'Proposal recorded' : appliedReview === 'rejected' ? 'Reviewer declined' : 'Awaiting human review',
    recorded:canApprove && appliedReview === 'approved'};
}
