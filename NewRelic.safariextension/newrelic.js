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

app = new Application({ accountId: "11042", appId: "106245", apiKey: "0c3244d7f2494f511bd4f25a42e4ddfe6e2195293886c75" });