$(function() {

  var CopyWriting = {
    init: function(){
      this.loadData();

      console.log(navManager.h.state)

      $("body")
        .on("change", "[name=situations]", {scope: this}, function(_e){
          _e.data.scope.onSelectSituation(_e);
        })
        .on("change", "[name=emotions]", {scope: this}, function(_e){
          _e.data.scope.onSelectEmotion(_e);
        })
    },

    setData: function(_data){
      this.data = _data;
    },

    setCurrentSituations: function(_data){
      this.currentSituations = _data;
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

        if(navManager.h.state.hash){
          var state = navManager.h.state;
          navManager.h.pushState(state, "", state.dest+"/"+state.hash);
          var elmts = state.hash.split("/");
          this.selectSituation(elmts[0]);
        }
      }, this))
    },

    selectSituation: function(_situation){
      console.log("selectSituation(" + _situation + ")")
    },

    selectEmotion: function(_emotion){
      console.log("selectEmotion(" + _emotion + ")")
    },

    onSelectSituation: function(_e){
      this.currentSituations = situations[_e.target.value];
      $(".content").html("");
      $("[name=emotions]").remove();
      var emotionsSelect = "<select name='emotions'>";
          emotionsSelect += "<option>Select an emotion</option>"

      _.each(this.currentSituations, $.proxy(function(_key){
        if(this.data[_key]["Conseil 1"].length > 1){
          emotionsSelect += "<option value='"+this.data[_key].Emotion+"'>"+this.data[_key].Emotion+"</option>";
        }
        else{
          emotionsSelect += "<option value='"+this.data[_key].Emotion+"' disabled>"+this.data[_key].Emotion+"</option>";
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
    },

    onSelectEmotion: function(_e) {
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
    },

    createContent: function(_data){
      var d = {
        advice1: _data["Conseil 1"],
        advice2: _data["Conseil 2"],
        advice3: _data["Conseil 3"],
        advice4: _data["Conseil 4"],
        situation: _data["Exemple de situation"],
        role: _data["Qui"],
        example: _data["Exemple de rédactionnel"]
      }

      $.get("templates/copy-example.html", $.proxy(function(_template){
        var compiled = _.template(_template);
        var t = compiled(d);
        $(".content").html(t);
      }, this));
    }
  }

  CopyWriting.init();
})
