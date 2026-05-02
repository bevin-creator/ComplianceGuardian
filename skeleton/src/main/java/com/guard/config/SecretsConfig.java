package com.guard.config;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;
import io.smallrye.config.WithName;

@ConfigMapping(prefix = "compliance")
public interface SecretsConfig {

    @WithName("ai.api-key")
    @WithDefault("MOCK")
    String aiApiKey();

    @WithName("ai.endpoint")
    @WithDefault("https://mock.ai.endpoint/v1/explain")
    String aiEndpoint();

    @WithName("high-risk-countries")
    @WithDefault("IR,KP,SY,CU,SD,MM,LY,SO,YE,AF")
    String highRiskCountries();

    @WithName("orchestrate.api-key")
    @WithDefault("MOCK_KEY")
    String orchestrateApiKey();
}
