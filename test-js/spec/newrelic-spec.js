var xml = $('#xml-response').html();

describe("Application", function() {
  beforeEach(function () {
    this.application = new Application({
      accountId: "123",
      appId: "456",
      apiKey: "key123456890"
    });
  });
  
  it("sets '-' as the metric defaults", function() {
    expect(this.application.get("apdex")).toEqual("-");
    expect(this.application.get("throughput")).toEqual("-");
    expect(this.application.get("errorRate")).toEqual("-");
    expect(this.application.get("responseTime")).toEqual("-");
  });
  
  describe("rootUrl()", function() {
    it("generates the correct root url", function() {
      expect(this.application.rootUrl()).toEqual("https://rpm.newrelic.com/accounts/123/applications/456");
    });
    
    it("uses a custom host", function() {
      this.application.set({ host: "http://localhost:3000" });
      expect(this.application.rootUrl()).toEqual("http://localhost:3000/accounts/123/applications/456");
    });
  });
  
  describe("url()", function() {
    it("generates the correct metrics url", function() {
      expect(this.application.url()).toEqual("https://rpm.newrelic.com/accounts/123/applications/456/threshold_values.xml?api_key=key123456890");
    });
    
    it("uses a custom host", function() {
      this.application.set({ host: "http://localhost:3000" });
      expect(this.application.url()).toEqual("http://localhost:3000/accounts/123/applications/456/threshold_values.xml?api_key=key123456890");
    });
  });
  
  describe("parse() with a metrics XML", function() {
    it("returns an object with the apdex value", function() {
      var object = this.application.parse(xml);
      expect(object["apdex"]).toEqual("0.96 [1.0]*");
    });
    
    it("returns an object with the errorRate value", function() {
      var object = this.application.parse(xml);
      expect(object["errorRate"]).toEqual("0.05%");
    });
    
    it("returns an object with the throughput value", function() {
      var object = this.application.parse(xml);
      expect(object["throughput"]).toEqual("345 rpm");
    });
    
    it("returns an object with the responseTime value", function() {
      var object = this.application.parse(xml);
      expect(object["responseTime"]).toEqual("150 ms");
    });
  });
  
  describe("metrics()", function() {
    it("returns an object with all the current metrics and their values", function() {
      this.application.set(this.application.parse(xml));
      expect(this.application.metrics()).toEqual({
        throughput: "345 rpm",
        apdex: "0.96 [1.0]*",
        errorRate: "0.05%",
        responseTime: "150 ms"
      });
    });
  });
  
  describe("resetMetrics()", function() {
    it("resets the metrics to their defualt values", function() {
      this.application.set({
        throughput: "345 rpm",
        apdex: "0.96 [1.0]*",
        errorRate: "0.05%",
        responseTime: "150 ms"
      });
      this.application.resetMetrics();
      expect(this.application.metrics()).toEqual({
        throughput: "-",
        apdex: "-",
        errorRate: "-",
        responseTime: "-"
      });
    });
  });
  
  describe("missingAuth()", function() {
    it("returns false when accountId, appId, and apiKey are present", function() {
      expect(this.application.missingAuth()).toBeFalsy();
    });
    
    it("returns true when accountId is blank", function() {
      this.application.set({ accountId: "" });
      expect(this.application.missingAuth()).toBeTruthy();
    });
    
    it("returns true when appId is blank", function() {
      this.application.set({ appId: "" });
      expect(this.application.missingAuth()).toBeTruthy();
    });
    
    it("returns true when apiKey is blank", function() {
      this.application.set({ apiKey: "" });
      expect(this.application.missingAuth()).toBeTruthy();
    });
  });
});