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
  
  describe("url()", function() {
    it("generates the correct url", function() {
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
  
  describe("hasCredentials()", function() {
    it("returns true when accountId, appId, and apiKey are present", function() {
      expect(this.application.hasCredentials()).toBeTruthy();
    });
    
    it("returns false when accountId is blank", function() {
      this.application.set({ accountId: "" });
      expect(this.application.hasCredentials()).toBeFalsy();
    });
    
    it("returns false when appId is blank", function() {
      this.application.set({ appId: "" });
      expect(this.application.hasCredentials()).toBeFalsy();
    });
    
    it("returns false when apiKey is blank", function() {
      this.application.set({ apiKey: "" });
      expect(this.application.hasCredentials()).toBeFalsy();
    });
  });
});