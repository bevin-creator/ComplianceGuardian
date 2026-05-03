package com.guard.engine;

import com.guard.model.ComplianceEvent;
import com.guard.model.ScanResult;

public interface RuleEngine {

    ScanResult evaluate(ComplianceEvent event);
}
