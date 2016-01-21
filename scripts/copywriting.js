$(function() {

  var CopyWriting = {
    init: function(){
      this.loadData();

      console.log(navManager.h.state)

      $("body")
        .on("change", "select", {scope: this}, function(_e){
          _e.data.scope.onSelect(_e);
        })
    },

    setData: function(_data){
      this.data = _data;
    },

    setCurrentSituations: function(_data){
      this.currentSituations = _data;
    },

    onSelect: function(_e){
      if(_e.target.name == "situations"){
        this.currentSituations = situations[_e.target.value];
        $(".content").html("");
        $("[name=emotions]").remove();
        var emotionsSelect = "<select name='emotions'>";
            emotionsSelect += "<option>Select an emotion</option>"

        _.each(this.currentSituations, $.proxy(function(_key){
          if(this.data[_key]["Conseil 1"].length > 1){
            emotionsSelect += "<option value='"+this.data[_key].Emotion+"'>"+this.data[_key].Emotion+"</option>";
          }
        }, this))

        emotionsSelect += "</select>";
        $(".selects").append(emotionsSelect);

        navManager.h.pushState({
            dest: "copywriting",
            situation: _e.target.value
          },
          "CopyWriting",
          "#copywriting/" + _e.target.value);
      }
      else if (_e.target.name == "emotions") {
        _.each(this.currentSituations, $.proxy(function(_key){
          if(this.data[_key].Emotion == _e.target.value){
            this.createContent(this.data[_key])
          }
        }, this))
        navManager.h.pushState({
            dest: "copywriting",
            situation: navManager.h.state.situation,
            emotion: _e.target.value
          },
          "CopyWriting",
          "#copywriting/" + navManager.h.state.situation + "/" + _e.target.value);
      }
    },

    loadData: function(){
      //$.getJSON("https://sheetsu.com/apis/ec6cd14f", function(_data){
      $.getJSON("data/copywriting.json", $.proxy(function(_data){
        this.setData(_data.result);
        links = {};
        situations = {};
        emotions = {};

        var situationsSelect = "<select name='situations'>";
            situationsSelect += "<option>Select a situation</option>"

        var data = $.map(_data.result, function(_val, _i){
          var s = [];
          if(situations[_val.Situation]){
            s = situations[_val.Situation].slice(0);
          }
          else{
            situationsSelect += "<option value='"+_val.Situation+"'>"+_val.Situation+"</option>";
          }

          s.push(_i)
          situations[_val.Situation] = s;
        })

        situationsSelect += "</select>";

        $(".selects").append(situationsSelect);

        console.log("hash : " + navManager.h.state.hash)
        if(navManager.h.state.hash){

        }
      }, this))
    },

    createContent: function(_data){
      console.log(_data);
      var html = "";
      html += "<h3>Conseil 1</h3>" + _data["Conseil 1"];
      html += "<h3>Conseil 2</h3>" + _data["Conseil 2"];
      html += "<h3>Conseil 3</h3>" + _data["Conseil 3"];
      html += "<h3>Conseil 4</h3>" + _data["Conseil 4"];
      html += "<h3>Exemple de situation</h3>" + _data["Exemple de situation"];
      html += "<h3>Qui</h3>" + _data["Qui"];
      html += "<h3>Exemple de rédactionnel</h3>" + _data["Exemple de rédactionnel"];
      $(".content").html(html);
    }
  }

  CopyWriting.init();
})
