(function($) {
  
  window.Application = Backbone.Model.extend({
    defaults: {
      apdex: "-",
      throughput: "-",
      errors: "-",
      responseTime: "-"
    },
    
    url: function() {
      return "https://rpm.newrelic.com/accounts/" + this.get("accountId") + "/applications/" + this.get("appId") + "/threshold_values.xml";
    },
    
    refresh: function() {
      this.fetch({ headers: { "x-api-key": this.get("apiKey") }});
    }
  });
  
})(jQuery);

app = new Application({ accountId: "", appId: "", apiKey: "" });