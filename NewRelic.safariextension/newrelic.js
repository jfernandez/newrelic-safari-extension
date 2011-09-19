(function($) {
  
  window.Application = Backbone.Model.extend({
    defaults: {
      accountId:    "",
      appId:        "",
      apiKey:       "",
      apdex:        "-",
      throughput:   "-",
      errorRate:    "-",
      responseTime: "-",
      host:         "https://rpm.newrelic.com"
    },
    
    url: function() {
      return this.get("host") + "/accounts/" + this.get("accountId") + "/applications/" + this.get("appId") + "/threshold_values.xml?api_key=" + this.get("apiKey");
    },
    
    parse: function(response) {
      metrics = {}
      $(response).find("threshold_value").each(function() {
        var formattedValue = $(this).attr('formatted_metric_value');
        switch($(this).attr('name')) {
        case "Apdex":
          metrics['apdex'] = formattedValue;
          break;
        case "Throughput":
          metrics['throughput'] = formattedValue;
          break;
        case "Error Rate":
          metrics['errorRate'] = formattedValue;
          break;
        case "Response Time":
          metrics['responseTime'] = formattedValue;
          break;
        }
      });
      return metrics;
    },
    
    hasCredentials: function() {
      return (this.get("accountId").length > 0 && this.get("appId").length > 0 && this.get("apiKey").length > 0);
    }
  });
  
  window.ApplicationView = Backbone.View.extend({
    tagName: 'ul',
    id: 'metrics',
    
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.template = _.template($('#metrics-template').html());
    },
    
    render: function() {
      var renderedContent = this.template(this.model.toJSON());
      $(this.el).html(renderedContent);
      return this;
    }
  });
  
})(jQuery);
