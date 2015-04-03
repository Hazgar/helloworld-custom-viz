define(function(require, exports, module) {

    var _ = require('underscore');
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");

    var HelloWorld = SimpleSplunkView.extend({

        className: "splunk-toolkit-helloworld",

        options: {
            managerid: null,   // your MANAGER ID
            data: "preview",  // Results type
            width: "100%",
        },

        output_mode: "json_rows",

        initialize: function() {
            SimpleSplunkView.prototype.initialize.apply(this, arguments);

            this.settings.enablePush("value");
        
            // Set up resize callback. The first argument is a this
            // pointer which gets passed into the callback event
            $(window).resize(this, _.debounce(this._handleResize, 20));
        },

        _handleResize: function(e){
            
            // e.data is the this pointer passed to the callback.
            // here it refers to this object and we call render()
            e.data.render();
        },

        createView: function() { 
            this.$el.html(''); // clearing all prior junk from the view (eg. 'waiting for data...')
            return true;
        },

        // making the data look how we want it to for updateView to do its job
        formatData: function(data) {

            // Decide what fields we want
            // TODO: this should be specifialbe
            var fields = _.filter(this.resultsModel.data().fields, function(d){return d[0] !== "_" });
            // create a map obj[field] = value
            var objects = _.map(data, function(row) {
                var obj = {};
                _.each(fields, function(field, idx) {
                    if (row[idx] !== null) {
                        obj[field] = row[idx];
                    } 
                    else {
                        obj[field] = "";
                    }
                });
                
                return obj;
            });

            data = {
                'results': objects,
                'fields': fields
            }
            
            return data;
        },

        updateView: function(viz, data) {
            var that = this;
            var availableHeight = parseInt(this.settings.get("height") || this.$el.height());
            
            this.$el.html('');
            viz = $("<table id='"+this.id+"_helloword'>").appendTo(this.el)
                .css("height", availableHeight).css("width", this.settings.get("width"));
            
            $("<h4>").appendTo(viz).html("Just an image:");
            $("<img src=\"/static/app/helloworld/components/helloworld/bazinga.jpg\">").appendTo(viz);
            $("<h4>").appendTo(viz).html("Viz Options:");
            $("<div>").appendTo(viz).html("sch: "+this.settings.get("managerid")); 
            $("<div>").appendTo(viz).html("data: "+this.settings.get("data")); 
            $("<div>").appendTo(viz).html("size: "+this.settings.get("height")+"x"+this.settings.get("width")); 
            $("<h4>").appendTo(viz).html("Search Results:");

            // create table header
            thead = $("<tr>").appendTo(viz);
            data.fields.forEach(function(field) {
                td = $("<td>").appendTo(thead)
                    .html(field);
            });
            
            // create table content
            data.results.forEach(function(res) {
                var tbody = $("<tr>").appendTo(viz);
                data.fields.forEach(function(field) {
                    var td = $("<td>").appendTo(tbody)
                        .html(res[field]);
                });
            });
        }
    });
    return HelloWorld;
});
